import { NextResponse } from "next/server";

// 1. PARCHE SSL PARA LOCAL
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const API_BASE = "https://localhost:57679/api";
export const dynamic = "force-dynamic";

// HELPERS
const money = (n: any) => Number(n || 0).toFixed(2);
const safeName = (s: string) => s.replace(/[^a-zA-Z0-9-_]/g, "_");

// GENERADOR DE PDF MANUAL
function makeSimplePdf(title: string, lines: string[]) {
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  const contentLines: string[] = ["BT", "/F1 16 Tf", "50 780 Td", `(${esc(title)}) Tj`, "ET"];

  let y = 755;
  for (const line of lines.slice(0, 55)) {
    contentLines.push("BT", "/F1 10 Tf", `50 ${y} Td`, `(${esc(line)}) Tj`, "ET");
    y -= 14;
  }

  const contentStream = contentLines.join("\n");
  const stream = Buffer.from(contentStream, "utf-8");

  const pdfParts = [
    "%PDF-1.4\n",
    "1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj\n",
    "2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj\n",
    "3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources<< /Font<< /F1 4 0 R >> >> /Contents 5 0 R >>endobj\n",
    "4 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj\n",
    `5 0 obj<< /Length ${stream.length} >>stream\n${contentStream}\nendstream\nendobj\n`,
  ];

  let pos = 0;
  const xrefOffsets = pdfParts.map(part => {
    const currentPos = pos;
    pos += Buffer.byteLength(part, "utf-8");
    return currentPos;
  });

  const xref = `xref\n0 6\n0000000000 65535 f \n${xrefOffsets.slice(1).map(o => String(o).padStart(10, "0") + " 00000 n \n").join("")}`;
  const trailer = `trailer<< /Size 6 /Root 1 0 R >>\nstartxref\n${pos}\n%%EOF`;

  return Buffer.concat([
    Buffer.from(pdfParts.join(""), "utf-8"),
    Buffer.from(xref, "utf-8"),
    Buffer.from(trailer, "utf-8"),
  ]);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "payments";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";

  let data: any[] = [];
  let title = "Reporte Operativo";

  try {
    const query = new URLSearchParams();
    let endpoint = "";

    // CONFIGURACIÓN DE ENDPOINTS
    if (type === "payments") {
      if (from) query.append('startDate', from);
      if (to) query.append('endDate', to);
      endpoint = "payments";
      title = "Reporte de Ventas y Pagos";
    } 
    else if (type === "movements") {
      if (from) query.append('startDate', from);
      if (to) query.append('endDate', to);
      endpoint = "cash-movements"; // Revisa si es cash-register-movements en tu backend
      title = "Reporte de Movimientos de Caja";
    }
    else if (type === "reconciliations") {
      if (from) query.append('startDate', from);
      if (to) query.append('endDate', to);
      endpoint = "cash-reconciliations";
      title = "Reporte de Conciliaciones";
    }
    else if (type === "services") {
      if (from) query.append('start_date', from);
      if (to) query.append('end_date', to);
      endpoint = "appointments";
      title = "Reporte de Servicios";
    }

    const fullUrl = `${API_BASE}/${endpoint}?${query.toString()}`;
    console.log("🚀 Exportando desde:", fullUrl);

    // PETICIÓN AL BACKEND
    const res = await fetch(fullUrl, { cache: 'no-store' });
    const responseText = await res.text(); // Leemos como texto para evitar el EOF error

    if (res.ok && responseText.trim() !== "") {
      const json = JSON.parse(responseText);
      // Mapeo robusto de la lista de datos
      data = json.payments || json.movements || json.reconciliations || json.appointments || json.data || (Array.isArray(json) ? json : []);
    }

    // CONSTRUCCIÓN DE LÍNEAS DEL PDF
    const lines = [
      `Emitido: ${new Date().toLocaleString('es-BO')}`,
      `Periodo: ${from || 'Inicio'} hasta ${to || 'Hoy'}`,
      "--------------------------------------------------",
      ""
    ];

    if (data.length === 0) {
      lines.push("No se encontraron registros para este periodo.");
    } else {
      data.forEach((r: any) => {
        const fecha = (r.paymentDate || r.reconciliationDate || r.movementDate || r.createdAt || "").split('T')[0];
        const monto = r.amount || r.systemAmount || r.totalAmount || r.signedAmount || 0;
        const desc = r.customerName || r.description || (r.sessionNumber ? `Sesion ${r.sessionNumber}` : "") || r.serviceName || "Registro";
        
        lines.push(`${fecha} | ${desc.substring(0, 20).padEnd(20)} | Bs ${money(monto)}`);
      });
    }

    const total = data.reduce((acc, curr) => 
      acc + Number(curr.amount || curr.systemAmount || curr.totalAmount || curr.signedAmount || 0), 0
    );

    lines.push("", "--------------------------------------------------", `TOTAL GENERAL: Bs ${money(total)}`);

    const pdf = makeSimplePdf(title, lines);
    
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName(title)}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("❌ CRITICAL PDF ERROR:", error.message);
    return NextResponse.json({ error: "Fallo en el servidor de PDF", detail: error.message }, { status: 500 });
  }
}
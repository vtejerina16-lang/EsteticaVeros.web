'use client'; // Añadimos esto por si acaso, aunque Link no lo requiere estrictamente

import Link from "next/link";
import type { ReportType } from "../_types/report-types";

interface ExportActionsProps {
  type: ReportType;
  from: string;
  to: string;
}

export function ExportActions({ type, from, to }: ExportActionsProps) {
  // Construimos la URL de exportación
  const exportUrl = `/reportes/export?type=${type}&format=pdf${from ? `&from=${from}` : ""}${to ? `&to=${to}` : ""}`;

  return (
    <div className="flex items-center gap-3">
      <Link 
        href={exportUrl} 
        target="_blank"
        className="group relative inline-flex items-center justify-center px-6 py-3 font-bold text-white transition-all duration-200 bg-rose-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-600 hover:bg-rose-700"
      >
        <span className="flex items-center gap-2">
          {/* Un pequeño icono de descarga para que se vea mejor */}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          DESCARGAR PDF
        </span>
      </Link>
    </div>
  );
}
"use client"; // 🌟 Esto le dice a Next.js que aquí sí puede haber interactividad

export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="rounded-full bg-neutral-900 px-10 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:bg-neutral-800 active:scale-95 transition-all"
    >
      Imprimir Comprobante
    </button>
  );
}
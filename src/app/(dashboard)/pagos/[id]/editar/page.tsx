import { notFound, redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { getPaymentById, getPaymentMethods } from "../../_services/payments-service"; // 🌟 Importamos getPaymentMethods
import { PaymentForm } from "../../_components/payment-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditarPagoPage({ params }: Props) {
  const { id } = await params;
  const token = await getAccessToken();
  
  if (!token) redirect("/login");

  // 1. CARGAMOS TODO EN PARALELO (Pago y Métodos)
  const [payment, methods] = await Promise.all([
    getPaymentById(token, id),
    getPaymentMethods(token) // 🌟 Esto evita el error del .map
  ]);

  if (!payment) {
    notFound();
  }

  if (payment.status === "Void") {
    return (
      <section className="rounded-3xl border border-rose-100 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">🚫</div>
        <h1 className="text-xl font-black text-neutral-900">Pago Anulado</h1>
        <p className="mt-2 text-sm text-neutral-500">Los registros anulados no pueden ser editados.</p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-rose-100 bg-white p-6 md:p-8 shadow-sm">
      <header className="mb-8 border-b border-rose-50 pb-6">
        <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">Mantenimiento</p>
        <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
          Editar Pago <span className="text-rose-600">#{id}</span>
        </h1>
      </header>

      {/* 2. PASAMOS TODAS LAS PROPS NECESARIAS */}
      <PaymentForm 
        initialData={payment} 
        initialMethods={methods} // 🌟 Pasamos los métodos aquí
        token={token} 
        isEditing 
      />
    </section>
  );
}
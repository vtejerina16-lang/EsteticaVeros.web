// src/app/(dashboard)/pagos/nuevo/page.tsx
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { PaymentForm } from "../_components/payment-form";
import { getCurrentMainSession } from "../../caja/_services/cash-service";
import { getPaymentMethods } from "../_services/payments-service";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function NuevoPagoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const sp = await searchParams;

  // 1. Extraer parámetros pre-cargados de la URL
  const appointmentId =
    typeof sp.appointmentId === "string" ? sp.appointmentId : undefined;

  const customerId =
    typeof sp.customerId === "string" ? sp.customerId : undefined;

  const parsedAmount =
    typeof sp.amount === "string" ? Number(sp.amount) : undefined;

  const amount =
    parsedAmount !== undefined && !Number.isNaN(parsedAmount)
      ? parsedAmount
      : undefined;

  // Nuevos parámetros agregados para detalle de servicios
  const serviceId =
    typeof sp.serviceId === "string" ? sp.serviceId : undefined;

  const serviceName =
    typeof sp.serviceName === "string" ? sp.serviceName : undefined;

  const employeeId =
    typeof sp.employeeId === "string" ? sp.employeeId : undefined;

  // 2. Armar el objeto initialData ampliado para PaymentForm
  const initialData = {
    appointmentId: appointmentId ? Number(appointmentId) : undefined,
    customerId: customerId ? Number(customerId) : undefined,
    amount: amount,
    serviceId: serviceId ? Number(serviceId) : undefined,
    serviceName: serviceName,
    employeeId: employeeId ? Number(employeeId) : undefined,
  };

  // 3. Obtener sesión de caja actual y métodos de pago
  const session = await getCurrentMainSession(token);

  let methods: Awaited<ReturnType<typeof getPaymentMethods>> = [];

  try {
    methods = await getPaymentMethods(token);
  } catch (error) {
    console.error(
      "Error al obtener métodos de pago desde el servidor:",
      error
    );
  }

  return (
    <section className="rounded-3xl border border-rose-100 bg-white p-6 md:p-8 shadow-sm">
      <header className="mb-8 border-b border-rose-50 pb-6">
        <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">
          Transacción {appointmentId && `· Cita #${appointmentId}`}
        </p>

        <h1 className="text-3xl font-black tracking-tight text-neutral-900">
          Registrar Cobro
        </h1>

        <p className="mt-2 text-xs font-medium leading-relaxed text-neutral-500">
          {appointmentId
            ? "Se ha vinculado automáticamente esta cita y sus servicios. Puedes ajustar los montos o añadir ítems extras si el cliente realizó algún servicio adicional."
            : "Ingresa los detalles del pago. Si el método es Efectivo, asegúrate de tener una sesión de caja abierta para que el monto se sume automáticamente al balance."}
        </p>
      </header>

      <div className="mx-auto max-w-4xl">
        <PaymentForm
          token={token}
          currentSessionId={session?.id}
          initialMethods={methods}
          initialData={initialData}
        />
      </div>

      <footer className="mt-10 rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          Seguridad Veros · Los cobros registrados no pueden ser eliminados,
          solo anulados.
        </p>
      </footer>
    </section>
  );
}
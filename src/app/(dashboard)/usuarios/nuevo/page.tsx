import { NewUserForm } from "./new-user-form";

export default function NuevoUsuarioPage() {
  return (
    <section className="rounded-2xl border border-rose-100 bg-white p-4 md:p-5 shadow-sm">
      <div>
        <h1 className="text-xl font-extrabold text-neutral-900">Nuevo Usuario</h1>
      </div>

      <div className="mt-5">
        <NewUserForm />
      </div>
    </section>
  );
}

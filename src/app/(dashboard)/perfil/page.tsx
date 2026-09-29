import { getAccessToken } from "@/lib/auth";
import { getMyProfile } from "./_services/profile-service";
import { toProfileVM } from "./_adapters/profile-adapter";
import { ProfileForm } from "./_components/profile-form";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const dto = await getMyProfile(token);
  const vm = toProfileVM(dto);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-neutral-900">Mi Perfil</h1>
        <p className="text-sm text-neutral-500">Gestiona tu información personal.</p>
      </div>
      {/* Pasamos el VM que ya tiene los datos cargados del backend */}
      <ProfileForm vm={vm} />
    </div>
  );
}
import { notFound, redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { getCitaById } from "../_services/citas-service";
import { CitaDetailsPanel } from "../_components/_details/cita-details-panel";

export const dynamic = "force-dynamic";

export default async function CitaDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const { id } = await params;
  const cita = await getCitaById(id);

  if (!cita) notFound();

  return <CitaDetailsPanel cita={cita} />;
}
// src/app/(dashboard)/clientes/_components/client-tabs.tsx

"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Client } from "../_types.clients";
import { ClientForm } from "./client-form";
import { ClientNotes } from "./client-notes";

type TabKey = "perfil" | "historial" | "notas";

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3 py-2 text-sm font-semibold ${
        active ? "bg-rose-600 text-white" : "border border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
      }`}
    >
      {children}
    </button>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-xl border border-rose-100 bg-white p-3">
      <p className="text-xs font-semibold text-neutral-600">{label}</p>
      <p className="mt-1 text-sm font-semibold text-neutral-900">{value && value.trim() ? value : "—"}</p>
    </div>
  );
}

export function ClientTabs({ client }: { client: Client }) {
  const sp = useSearchParams();
  const edit = sp?.get("edit") === "1";

  const initialTab = useMemo<TabKey>(() => (edit ? "perfil" : "perfil"), [edit]);
  const [tab, setTab] = useState<TabKey>(initialTab);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <TabButton active={tab === "perfil"} onClick={() => setTab("perfil")}>
          Perfil
        </TabButton>
        <TabButton active={tab === "historial"} onClick={() => setTab("historial")}>
          Historial
        </TabButton>
        <TabButton active={tab === "notas"} onClick={() => setTab("notas")}>
          Notas
        </TabButton>
      </div>

      {tab === "perfil" ? (
        <div className="space-y-3">
          {edit ? <ClientForm mode="edit" clientId={client.id} initial={client} /> : null}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            <div className="md:col-span-4">
              <Row label="Cumpleaños" value={client.dateOfBirth ?? null} />
            </div>
            <div className="md:col-span-4">
              <Row label="Género" value={client.gender ?? null} />
            </div>
            <div className="md:col-span-4">
              <Row label="Ciudad" value={client.city ?? null} />
            </div>

            <div className="md:col-span-8">
              <Row label="Dirección" value={client.address ?? null} />
            </div>
            <div className="md:col-span-4">
              <Row label="Teléfono" value={client.phoneNumber} />
            </div>

            <div className="md:col-span-4">
              <Row label="Alergias" value={client.allergies} />
            </div>
            <div className="md:col-span-4">
              <Row label="Condiciones médicas" value={client.medicalConditions} />
            </div>
            <div className="md:col-span-4">
              <Row label="Medicaciones" value={client.medications} />
            </div>
          </div>
        </div>
      ) : null}

      {tab === "historial" ? (
        <div className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-rose-600">Historial</p>
          <h3 className="text-base font-extrabold text-neutral-900">Citas / Pagos</h3>
          <p className="mt-2 text-sm text-neutral-600">
            Aquí conectaremos el historial cuando el backend exponga endpoints de citas/pagos por cliente.
          </p>

          <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50/30 p-3 text-sm text-neutral-700">
            Próximamente…
          </div>
        </div>
      ) : null}

      {tab === "notas" ? <ClientNotes client={client} /> : null}
    </div>
  );
}
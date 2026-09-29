// src/app/(dashboard)/clientes/_components/client-notes.tsx

"use client";

import { useMemo, useState } from "react";
import type { Client } from "../_types.clients";

type Note = { id: string; text: string; createdAt: string };

export function ClientNotes({ client }: { client: Client }) {
  // Mock local: luego lo conectamos a backend si lo deseas.
  const initial = useMemo<Note[]>(() => {
    const base = client.notes ? [{ id: "seed", text: client.notes, createdAt: new Date().toISOString() }] : [];
    return base;
  }, [client.notes]);

  const [notes, setNotes] = useState<Note[]>(initial);
  const [text, setText] = useState("");

  function add() {
    const t = text.trim();
    if (!t) return;
    setNotes((prev) => [{ id: String(Date.now()), text: t, createdAt: new Date().toISOString() }, ...prev]);
    setText("");
  }

  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-rose-600">Notas</p>
          <h3 className="text-base font-extrabold text-neutral-900">Seguimiento</h3>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe una nota…"
          className="w-full rounded-xl border border-rose-200 px-3 py-2 text-sm outline-none focus:border-rose-400"
        />
        <button
          type="button"
          onClick={add}
          className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
        >
          Agregar
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {notes.length === 0 ? (
          <p className="text-sm text-neutral-600">Aún no hay notas.</p>
        ) : (
          notes.map((n) => (
            <div key={n.id} className="rounded-xl border border-rose-100 bg-rose-50/30 p-3">
              <p className="text-sm text-neutral-800">{n.text}</p>
              <p className="mt-1 text-xs text-neutral-500">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  pending?: boolean;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  danger = false,
  onConfirm,
  onClose,
  pending = false,
}: Props) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Cerrar con ESC
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Focus inicial
  useEffect(() => {
    if (open) setTimeout(() => panelRef.current?.focus(), 0);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* overlay */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />

      {/* panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative w-full max-w-md rounded-2xl border border-rose-100 bg-white p-4 shadow-xl outline-none"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-rose-600">Confirmación</p>
            <h3 className="mt-1 text-base font-extrabold text-neutral-900">{title}</h3>
            {description ? <p className="mt-1 text-sm text-neutral-600">{description}</p> : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-semibold hover:bg-rose-50"
            disabled={pending}
          >
            ✕
          </button>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-rose-50 disabled:opacity-60"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={`rounded-full px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${
              danger ? "bg-rose-600 hover:bg-rose-700" : "bg-neutral-900 hover:bg-neutral-800"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
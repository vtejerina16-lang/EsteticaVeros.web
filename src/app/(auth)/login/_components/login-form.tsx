"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "../../_actions/auth-actions";
import type { LoginActionState } from "../../_types";

function IconUser() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" className="text-rose-400/80">
      <path
        fill="currentColor"
        d="M12 12a4 4 0 1 0-4-4a4 4 0 0 0 4 4m0 2c-4.42 0-8 2-8 4.5V21h16v-2.5C20 16 16.42 14 12 14"
      />
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" className="text-rose-400/80">
      <path
        fill="currentColor"
        d="M17 9V7a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-8 0V7a3 3 0 0 1 6 0v2Z"
      />
    </svg>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="relative w-full overflow-hidden rounded-full bg-rose-600 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-rose-700 hover:shadow-[0_10px_30px_rgba(225,29,72,0.35)] active:scale-[0.97] disabled:opacity-70"
    >
      <span className={`flex items-center justify-center gap-2 transition-opacity duration-200 ${pending ? "opacity-0" : "opacity-100"}`}>
        Iniciar sesión
      </span>

      {pending && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        </div>
      )}
    </button>
  );
}

const initialState: LoginActionState = { ok: false, message: "" };

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <div className="w-full max-w-[440px] rounded-[40px] bg-white/80 p-10 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border border-white/50">

      <div className="text-center md:text-left mb-10">
        <div className="inline-flex mb-4 h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 md:hidden">
          <IconLock />
        </div>

        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-500/80">
          Vero&apos;s Manager
        </p>

        <h1 className="mt-2 text-3xl font-black text-neutral-900 tracking-tight">
          Bienvenido
        </h1>

        <p className="mt-2 text-sm text-neutral-500/80">
          Gestiona tu negocio de forma inteligente
        </p>
      </div>

      <form action={formAction} className="space-y-6">

        <div className="group space-y-2">
          <label className="text-[13px] font-bold text-neutral-700 ml-1 transition-colors group-focus-within:text-rose-500">
            Usuario
          </label>

          <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white/60 px-4 py-3.5 transition-all duration-200 focus-within:border-rose-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-rose-50">
            <IconUser />
            <input
              name="username"
              autoComplete="username"
              className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-300"
              placeholder="Ej: admin_vero"
              required
            />
          </div>
        </div>

        <div className="group space-y-2">
          <label className="text-[13px] font-bold text-neutral-700 ml-1 transition-colors group-focus-within:text-rose-500">
            Contraseña
          </label>

          <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white/60 px-4 py-3.5 transition-all duration-200 focus-within:border-rose-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-rose-50">
            <IconLock />
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-300"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {state && !state.ok && state.message && (
          <div className="animate-in fade-in slide-in-from-top-2 rounded-xl bg-rose-50 p-3 border border-rose-100">
            <p className="text-center text-xs font-semibold text-rose-600">
              {state.message}
            </p>
          </div>
        )}

        <div className="pt-2">
          <SubmitButton />
        </div>

        <p className="text-center text-xs text-neutral-400">
          &copy; 2026 Vero&apos;S Manager
        </p>
      </form>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";

export function Clock() {
  const [time, setTime] = useState<string | null>(null);
  const [dateStr, setDateStr] = useState<string>("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      
      // Formato de hora: 14:05:09
      setTime(
        now.toLocaleTimeString("es-BO", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );

      // Formato de fecha: lun, 27 jul
      setDateStr(
        now.toLocaleDateString("es-BO", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Evita destellos mientras carga el cliente
  if (!time) {
    return (
      <div className="h-8 w-32 animate-pulse rounded-xl bg-rose-50/80" />
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/50 px-3 py-1.5 text-neutral-700">
      <span className="text-base">🕒</span>
      <div className="flex flex-col">
        <span className="font-mono text-xs font-bold leading-none text-neutral-900">
          {time}
        </span>
        <span className="text-[10px] font-medium capitalize text-neutral-500 leading-tight">
          {dateStr}
        </span>
      </div>
    </div>
  );
}
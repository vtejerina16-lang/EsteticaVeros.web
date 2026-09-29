// src/app/(dashboard)/pagos/_components/client-selector.tsx
"use client";
import { useState, useEffect } from "react";
import { searchCustomersAction } from "../_actions/payments-actions"; 

interface ClientSelectorProps {
  initialName?: string;
  initialId?: number;
}

export function ClientSelector({ initialName = "", initialId }: ClientSelectorProps) {
  const [query, setQuery] = useState(initialName);
  const [results, setResults] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | undefined>(initialId);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // 🌟 FIX: Sincronizar si vienen datos iniciales (para editar)
  useEffect(() => {
    if (initialId) setSelectedId(initialId);
    if (initialName) setQuery(initialName);
  }, [initialId, initialName]);

  useEffect(() => {
    if (query.length < 2 || selectedId) {
      setResults([]);
      return;
    }
    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const customers = await searchCustomersAction(query);
        setResults(customers);
        setShowResults(true);
      } catch (e) { console.error(e); } finally { setIsSearching(false); }
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [query, selectedId]);

  return (
    <div className="relative space-y-1">
      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-2">Cliente</label>
      {/* 🌟 ESTE ES EL CAMPO QUE RECIBE C# */}
      <input type="hidden" name="customerId" value={selectedId || ""} required />
      
      <div className="relative">
        <input
          type="text"
          placeholder="Escribe el nombre del cliente..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (selectedId) setSelectedId(undefined); // Reset si cambia el texto
          }}
          className="w-full rounded-2xl border border-rose-100 bg-rose-50/20 px-5 py-4 text-sm outline-none transition-all focus:border-rose-400"
        />
        {/* ... spinner ... */}
      </div>

      {showResults && results.length > 0 && (
        <ul className="absolute z-50 mt-2 max-h-60 w-full overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-2xl">
          {results.map((c) => {
            const name = c.fullName || c.name || c.customerName || "Cliente";

            return (
            <li
              key={c.id}
              onClick={() => {
                setQuery(name);
                setSelectedId(Number(c.id)); // 🌟 Aquí se guarda el ID real
                setShowResults(false); 
              }}
              className="px-5 py-4 text-sm hover:bg-rose-50 cursor-pointer"
            >
              <span className="font-bold">{name}</span>
              {c.identityCard ? ` - ${c.identityCard}` : ""}
            </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

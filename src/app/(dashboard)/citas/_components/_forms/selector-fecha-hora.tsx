type Props = {
  date: string;
  setDate: (value: string) => void;
};

export function SelectorFechaHora({ date, setDate }: Props) {
  return (
    <div>
      <label className="text-xs font-semibold text-neutral-700">
        Fecha
      </label>

      <input
        type="date"
        value={date ?? ""}
        onChange={(e) => setDate(e.target.value)}
        className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-200"
      />
    </div>
  );
}
export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "rounded-[28px] border border-rose-100 bg-white/70 p-5 shadow-sm backdrop-blur",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}
type KpiCardProps = {
  label: string;
  value: string;
  icon: string;
  tone?: "neutral" | "positive" | "negative";
  subtitle?: string;
};

export default function KpiCard({
  label,
  value,
  icon,
  tone = "neutral",
  subtitle,
}: KpiCardProps) {
  const toneClasses: Record<NonNullable<KpiCardProps["tone"]>, string> = {
    neutral: "bg-primary/10 text-primary",
    positive: "bg-green-500/10 text-green-600",
    negative: "bg-red-500/10 text-red-500",
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase font-semibold tracking-wider text-text-primary/60">
            {label}
          </p>
          {subtitle && (
            <p className="text-[11px] text-text-primary/40 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div
          className={`size-10 rounded-lg flex items-center justify-center ${toneClasses[tone]}`}
        >
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
      <p className="text-2xl font-bold text-text-primary text-ellipsis overflow-hidden whitespace-nowrap">
        {value}
      </p>
    </div>
  );
}

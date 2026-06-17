import { Doughnut } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import type { DashboardCattleByGender } from "../dashboard";
import { GENDER_COLORS, GENDER_LABELS } from "./chartColors";
import ChartSkeleton from "./ChartSkeleton";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  data: DashboardCattleByGender[];
  isLoading: boolean;
};

export default function CattleByGenderDonutChart({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex items-center justify-center h-[320px]">
        <span className="inline-block size-15 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.total, 0);

  if (total === 0) {
    return (
      <ChartSkeleton
        height={320}
        message="Aún no hay ganado registrado"
      />
    );
  }

  const ordered = [...data].sort((a, b) =>
    a.gender.localeCompare(b.gender),
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Ganado por Género
      </h3>
      <div className="h-[260px] flex items-center justify-center">
        <Doughnut
          data={{
            labels: ordered.map((d) => GENDER_LABELS[d.gender]),
            datasets: [
              {
                data: ordered.map((d) => d.total),
                backgroundColor: ordered.map((d) => GENDER_COLORS[d.gender]),
                borderColor: "#fff",
                borderWidth: 2,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: "60%",
            plugins: {
              legend: { position: "bottom" as const },
              tooltip: {
                callbacks: {
                  label: (ctx) => {
                    const value = Number(ctx.parsed);
                    const pct = total
                      ? ((value / total) * 100).toFixed(1)
                      : "0";
                    return `${ctx.label}: ${value} (${pct}%)`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

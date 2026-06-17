import { Doughnut } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import type { DashboardExpenseByCategory } from "../dashboard";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "./chartColors";
import ChartSkeleton from "./ChartSkeleton";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  data: DashboardExpenseByCategory[];
  isLoading: boolean;
};

export default function ExpensesDonutChart({ data, isLoading }: Props) {
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
        message="No hay gastos en el período seleccionado"
      />
    );
  }

  const ordered = data.filter((d) => d.total > 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Gastos por Categoría
      </h3>
      <div className="h-[260px] flex items-center justify-center">
        <Doughnut
          data={{
            labels: ordered.map((d) => CATEGORY_LABELS[d.category]),
            datasets: [
              {
                data: ordered.map((d) => d.total),
                backgroundColor: ordered.map(
                  (d) => CATEGORY_COLORS[d.category],
                ),
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
                    return `${ctx.label}: ₡${value.toLocaleString("en-US")} (${pct}%)`;
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

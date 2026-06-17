import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import type { DashboardMonthlyBucket } from "../dashboard";
import { CHART_COLORS } from "./chartColors";
import ChartSkeleton from "./ChartSkeleton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

type Props = {
  data: DashboardMonthlyBucket[];
  isLoading: boolean;
};

export default function MonthlyTrendLineChart({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex items-center justify-center h-[340px]">
        <span className="inline-block size-15 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return <ChartSkeleton height={340} message="Sin datos en el período" />;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Tendencia Mensual
      </h3>
      <div className="h-[280px]">
        <Line
          data={{
            labels: data.map((d) => d.month),
            datasets: [
              {
                label: "Ingresos",
                data: data.map((d) => d.income),
                borderColor: CHART_COLORS.income,
                backgroundColor: CHART_COLORS.income + "33",
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
              },
              {
                label: "Gastos",
                data: data.map((d) => d.expense),
                borderColor: CHART_COLORS.expense,
                backgroundColor: CHART_COLORS.expense + "33",
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
              legend: { position: "bottom" as const },
              tooltip: {
                callbacks: {
                  label: (ctx) =>
                    `${ctx.dataset.label}: ₡${Number(ctx.parsed.y).toLocaleString("en-US")}`,
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (val) => `₡${Number(val).toLocaleString("en-US")}`,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

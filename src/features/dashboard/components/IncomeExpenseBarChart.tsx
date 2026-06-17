import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import type { DashboardMonthlyBucket } from "../dashboard";
import { CHART_COLORS } from "./chartColors";
import ChartSkeleton from "./ChartSkeleton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

type Props = {
  data: DashboardMonthlyBucket[];
  isLoading: boolean;
};

export default function IncomeExpenseBarChart({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex items-center justify-center h-[320px]">
        <span className="inline-block size-15 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return <ChartSkeleton height={320} />;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Ingresos vs Gastos por Mes
      </h3>
      <div className="h-[260px]">
        <Bar
          data={{
            labels: data.map((d) => d.month),
            datasets: [
              {
                label: "Ingresos",
                data: data.map((d) => d.income),
                backgroundColor: CHART_COLORS.income,
                borderRadius: 6,
                maxBarThickness: 32,
              },
              {
                label: "Gastos",
                data: data.map((d) => d.expense),
                backgroundColor: CHART_COLORS.expense,
                borderRadius: 6,
                maxBarThickness: 32,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
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

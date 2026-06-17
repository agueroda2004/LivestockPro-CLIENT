import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import type { DashboardCattleByRace } from "../dashboard";
import { CHART_COLORS } from "./chartColors";
import ChartSkeleton from "./ChartSkeleton";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = {
  data: DashboardCattleByRace[];
  isLoading: boolean;
};

export default function CattleByRaceBarChart({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex items-center justify-center h-[320px]">
        <span className="inline-block size-15 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <ChartSkeleton
        height={320}
        message="Aún no hay ganado registrado"
      />
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Ganado por Raza
      </h3>
      <div className="h-[260px]">
        <Bar
          data={{
            labels: data.map((d) => d.raceName),
            datasets: [
              {
                label: "Cantidad",
                data: data.map((d) => d.total),
                backgroundColor: CHART_COLORS.primary,
                borderRadius: 6,
                maxBarThickness: 36,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: "y" as const,
            plugins: {
              legend: { display: false },
            },
            scales: {
              x: { beginAtZero: true, ticks: { precision: 0 } },
            },
          }}
        />
      </div>
    </div>
  );
}

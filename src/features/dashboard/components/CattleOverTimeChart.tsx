import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import type { DashboardCattleOverTimePoint } from "../dashboard";
import { LAND_PALETTE } from "./chartColors";
import ChartSkeleton from "./ChartSkeleton";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = {
  data: DashboardCattleOverTimePoint[];
  isLoading: boolean;
};

type LandSeries = {
  landId: string;
  landName: string;
  byMonth: Map<string, number>;
};

export default function CattleOverTimeChart({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex items-center justify-center h-[360px]">
        <span className="inline-block size-15 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const months = Array.from(new Set(data.map((d) => d.month)));
  const total = data.reduce((sum, d) => sum + d.count, 0);

  if (data.length === 0 || total === 0) {
    return (
      <ChartSkeleton
        height={360}
        message="Aún no hay ganado registrado en el período"
      />
    );
  }

  const landOrder: string[] = [];
  const seriesByLand = new Map<string, LandSeries>();
  for (const point of data) {
    if (!seriesByLand.has(point.landId)) {
      seriesByLand.set(point.landId, {
        landId: point.landId,
        landName: point.landName,
        byMonth: new Map(),
      });
      landOrder.push(point.landId);
    }
    seriesByLand.get(point.landId)!.byMonth.set(point.month, point.count);
  }

  const series = landOrder.map(
    (id) => seriesByLand.get(id)!,
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-1">
        Cantidad de Ganado por Finca y Mes
      </h3>
      <p className="text-xs text-text-primary/50 mb-4">
        Total acumulado de ganado activo al cierre de cada mes.
      </p>
      <div className="h-[300px]">
        <Bar
          data={{
            labels: months,
            datasets: series.map((s, idx) => ({
              label: s.landName,
              data: months.map((m) => s.byMonth.get(m) ?? 0),
              backgroundColor: LAND_PALETTE[idx % LAND_PALETTE.length],
              borderRadius: 4,
              maxBarThickness: 48,
              stack: "cattle",
            })),
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
              legend: { position: "bottom" as const },
              tooltip: {
                callbacks: {
                  label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`,
                  footer: (items) => {
                    const total = items.reduce(
                      (sum, item) => sum + Number(item.parsed.y),
                      0,
                    );
                    return `Total: ${total}`;
                  },
                },
              },
            },
            scales: {
              x: { stacked: true },
              y: {
                stacked: true,
                beginAtZero: true,
                ticks: { precision: 0 },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

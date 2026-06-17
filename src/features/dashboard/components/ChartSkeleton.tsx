type ChartSkeletonProps = {
  height?: number;
  message?: string;
};

export default function ChartSkeleton({
  height = 280,
  message = "Sin datos para mostrar",
}: ChartSkeletonProps) {
  return (
    <div
      className="flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200"
      style={{ height }}
    >
      <span
        className="material-symbols-outlined text-gray-400"
        style={{ fontSize: "36px" }}
      >
        insert_chart
      </span>
      <p className="text-sm text-gray-400 mt-2">{message}</p>
    </div>
  );
}

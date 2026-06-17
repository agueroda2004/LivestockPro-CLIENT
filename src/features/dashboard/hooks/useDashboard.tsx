import { DashboardApi } from "../api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { landApi } from "@/features/land/api";
import type { LandToDropdown } from "@/features/land/land";
import type {
  DashboardFilters,
  DashboardPeriod,
  DashboardStats,
} from "../dashboard";

const QUERY_KEY = "dashboard-stats";
const LANDS_QUERY_KEY = "lands-dropdown";

const PERIOD_OPTIONS: { text: string; value: DashboardPeriod }[] = [
  { text: "Este mes", value: "THIS_MONTH" },
  { text: "Últimos 3 meses", value: "LAST_3_MONTHS" },
  { text: "Últimos 6 meses", value: "LAST_6_MONTHS" },
  { text: "Últimos 12 meses", value: "LAST_12_MONTHS" },
  { text: "Este año", value: "THIS_YEAR" },
  { text: "Personalizado", value: "CUSTOM" },
];

const ALL_LANDS_VALUE = "ALL";

function formatIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplay(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

function resolvePeriodRange(
  period: DashboardPeriod,
  customFrom?: string,
  customTo?: string,
): { dateFrom: string; dateTo: string } {
  const now = new Date();
  const today = formatIso(now);

  if (period === "CUSTOM") {
    return {
      dateFrom: customFrom || today,
      dateTo: customTo || today,
    };
  }

  if (period === "THIS_MONTH") {
    return {
      dateFrom: formatIso(new Date(now.getFullYear(), now.getMonth(), 1)),
      dateTo: today,
    };
  }

  if (period === "THIS_YEAR") {
    return {
      dateFrom: formatIso(new Date(now.getFullYear(), 0, 1)),
      dateTo: today,
    };
  }

  const monthsBack =
    period === "LAST_3_MONTHS"
      ? 2
      : period === "LAST_6_MONTHS"
        ? 5
        : 11;
  return {
    dateFrom: formatIso(new Date(now.getFullYear(), now.getMonth() - monthsBack, 1)),
    dateTo: today,
  };
}

export default function useDashboard() {
  const queryClient = useQueryClient();

  const [period, setPeriod] = useState<DashboardPeriod>("THIS_MONTH");
  const [customDateFrom, setCustomDateFrom] = useState(formatDisplay(new Date()));
  const [customDateTo, setCustomDateTo] = useState(formatDisplay(new Date()));
  const [landValue, setLandValue] = useState<string>(ALL_LANDS_VALUE);

  useEffect(() => {
    if (
      !queryClient.getQueryData<LandToDropdown[]>([LANDS_QUERY_KEY])
    ) {
      queryClient.prefetchQuery({
        queryKey: [LANDS_QUERY_KEY],
        queryFn: () => landApi.getLandsToDropdown().then((res) => res.data),
      });
    }
  }, [queryClient]);

  const landsQuery = useQuery({
    queryKey: [LANDS_QUERY_KEY],
    queryFn: () => landApi.getLandsToDropdown().then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });

  const landOptions: { text: string; value: string }[] = useMemo(() => {
    const list = landsQuery.data ?? [];
    return [
      { text: "Todas las fincas", value: ALL_LANDS_VALUE },
      ...list.map((l) => ({ text: l.name, value: l.id })),
    ];
  }, [landsQuery.data]);

  const landId = landValue === ALL_LANDS_VALUE ? undefined : landValue;

  const appliedFilters: DashboardFilters = useMemo(
    () => ({
      ...resolvePeriodRange(
        period,
        customDateFrom.replace(/\//g, "-"),
        customDateTo.replace(/\//g, "-"),
      ),
      landId,
    }),
    [period, customDateFrom, customDateTo, landId],
  );

  const query = useQuery<DashboardStats>({
    queryKey: [QUERY_KEY, appliedFilters],
    queryFn: () => DashboardApi.getStats(appliedFilters).then((res) => res.data),
  });

  return {
    PERIOD_OPTIONS,
    period,
    setPeriod,
    customDateFrom,
    setCustomDateFrom,
    customDateTo,
    setCustomDateTo,
    landOptions,
    landValue,
    setLandValue,
    ALL_LANDS_VALUE,
    appliedFilters,
    stats: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}

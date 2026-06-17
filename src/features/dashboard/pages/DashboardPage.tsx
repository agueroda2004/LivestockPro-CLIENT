import PageHeader from "@/components/ui/PageHeader";
import KpiCard from "../components/KpiCard";
import PeriodFilter from "../components/PeriodFilter";
import IncomeExpenseBarChart from "../components/IncomeExpenseBarChart";
import ExpensesDonutChart from "../components/ExpensesDonutChart";
import MonthlyTrendLineChart from "../components/MonthlyTrendLineChart";
import CattleByRaceBarChart from "../components/CattleByRaceBarChart";
import CattleByLandBarChart from "../components/CattleByLandBarChart";
import CattleByGenderDonutChart from "../components/CattleByGenderDonutChart";
import CattleOverTimeChart from "../components/CattleOverTimeChart";
import useDashboard from "../hooks/useDashboard";

function formatCurrency(value: number) {
  return `₡${value.toLocaleString("en-US")}`;
}

const PERIOD_LABELS: Record<string, string> = {
  THIS_MONTH: "este mes",
  LAST_3_MONTHS: "los últimos 3 meses",
  LAST_6_MONTHS: "los últimos 6 meses",
  LAST_12_MONTHS: "los últimos 12 meses",
  THIS_YEAR: "este año",
  CUSTOM: "el período personalizado",
};

export default function DashboardPage() {
  const {
    PERIOD_OPTIONS,
    period,
    setPeriod,
    customDateFrom,
    customDateTo,
    setCustomDateFrom,
    setCustomDateTo,
    landOptions,
    landValue,
    setLandValue,
    stats,
    isLoading,
    isFetching,
  } = useDashboard();

  const periodLabel = PERIOD_LABELS[period] ?? "el período";
  const selectedLand = landOptions.find((l) => l.value === landValue);
  const landLabel = selectedLand ? selectedLand.text : "todas las fincas";
  const isLandFiltered = landValue !== "ALL" && landValue.length > 0;

  return (
    <main className="flex-1 h-full">
      <PageHeader
        Title="Dashboard"
        Description={`Monitorea el estado general de tu ganado, fincas y finanzas para ${periodLabel}${isLandFiltered ? `, filtrado por ${landLabel}` : ""}.`}
      />

      <PeriodFilter
        options={PERIOD_OPTIONS}
        value={period}
        onChange={setPeriod}
        customDateFrom={customDateFrom}
        customDateTo={customDateTo}
        onCustomDateFromChange={setCustomDateFrom}
        onCustomDateToChange={setCustomDateTo}
        landOptions={landOptions}
        landValue={landValue}
        onLandChange={setLandValue}
      />

      {/* Begin: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        <KpiCard
          label="Ganado Activo"
          value={stats ? stats.kpis.totalCattle.toLocaleString("en-US") : "—"}
          icon="pets"
          tone="neutral"
        />
        <KpiCard
          label={isLandFiltered ? "Fincas Filtradas" : "Fincas Activas"}
          value={stats ? stats.kpis.totalLands.toLocaleString("en-US") : "—"}
          icon="house"
          tone="neutral"
        />
        <KpiCard
          label="Razas Activas"
          value={stats ? stats.kpis.totalRaces.toLocaleString("en-US") : "—"}
          icon="category"
          tone="neutral"
        />
        <KpiCard
          label="Ingresos"
          subtitle={periodLabel}
          value={stats ? formatCurrency(stats.kpis.totalIncome) : "—"}
          icon="trending_up"
          tone="positive"
        />
        <KpiCard
          label="Gastos"
          subtitle={periodLabel}
          value={stats ? formatCurrency(stats.kpis.totalExpense) : "—"}
          icon="trending_down"
          tone="negative"
        />
        <KpiCard
          label="Utilidad Neta"
          subtitle={periodLabel}
          value={stats ? formatCurrency(stats.kpis.netProfit) : "—"}
          icon="savings"
          tone={stats && stats.kpis.netProfit >= 0 ? "positive" : "negative"}
        />
      </div>
      {/* End: KPI Cards */}

      {isLandFiltered && (
        <p className="text-xs text-text-primary/50 mb-4 -mt-3">
          El filtro de finca aplica a las métricas de ganado. Las finanzas no se
          ven afectadas porque las transacciones no están asociadas a una finca
          específica.
        </p>
      )}

      {/* Begin: Cattle Over Time */}
      <div className="mb-6">
        <CattleOverTimeChart
          data={stats?.livestock.cattleOverTime ?? []}
          isLoading={isLoading}
        />
      </div>
      {/* End: Cattle Over Time */}

      {/* Begin: Financial Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <IncomeExpenseBarChart
          data={stats?.financial.monthly ?? []}
          isLoading={isLoading}
        />
        <ExpensesDonutChart
          data={stats?.financial.expensesByCategory ?? []}
          isLoading={isLoading}
        />
      </div>
      {/* End: Financial Charts */}

      {/* Begin: Monthly Trend */}
      <div className="mb-6">
        <MonthlyTrendLineChart
          data={stats?.financial.monthly ?? []}
          isLoading={isLoading}
        />
      </div>
      {/* End: Monthly Trend */}

      {/* Begin: Livestock Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <CattleByRaceBarChart
          data={stats?.livestock.cattleByRace ?? []}
          isLoading={isLoading}
        />
        <CattleByLandBarChart
          data={stats?.livestock.cattleByLand ?? []}
          isLoading={isLoading}
        />
        <CattleByGenderDonutChart
          data={stats?.livestock.cattleByGender ?? []}
          isLoading={isLoading}
        />
      </div>
      {/* End: Livestock Charts */}

      {isFetching && !isLoading && (
        <div className="text-center text-xs text-text-primary/50 py-2">
          Actualizando datos...
        </div>
      )}
    </main>
  );
}

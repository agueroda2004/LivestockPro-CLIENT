export type DashboardKpis = {
  totalCattle: number;
  totalLands: number;
  totalRaces: number;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
};

export type DashboardMonthlyBucket = {
  month: string;
  income: number;
  expense: number;
};

export type DashboardExpenseByCategory = {
  category: "SALE" | "PURCHASE" | "SALARY" | "SUPPLY";
  total: number;
};

export type DashboardCattleByGender = {
  gender: "MALE" | "FEMALE";
  total: number;
};

export type DashboardCattleByRace = {
  raceId: string;
  raceName: string;
  total: number;
};

export type DashboardCattleByLand = {
  landId: string;
  landName: string;
  total: number;
};

export type DashboardCattleOverTimePoint = {
  month: string;
  landId: string;
  landName: string;
  count: number;
};

export type DashboardFinancial = {
  monthly: DashboardMonthlyBucket[];
  expensesByCategory: DashboardExpenseByCategory[];
};

export type DashboardLivestock = {
  cattleByGender: DashboardCattleByGender[];
  cattleByRace: DashboardCattleByRace[];
  cattleByLand: DashboardCattleByLand[];
  cattleOverTime: DashboardCattleOverTimePoint[];
};

export type DashboardStats = {
  kpis: DashboardKpis;
  financial: DashboardFinancial;
  livestock: DashboardLivestock;
};

export type DashboardPeriod =
  | "THIS_MONTH"
  | "LAST_3_MONTHS"
  | "LAST_6_MONTHS"
  | "LAST_12_MONTHS"
  | "THIS_YEAR"
  | "CUSTOM";

export type DashboardFilters = {
  dateFrom?: string;
  dateTo?: string;
  landId?: string;
};

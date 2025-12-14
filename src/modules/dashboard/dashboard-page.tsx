import { DashboardHeader } from "./components/dashboard-header";
import { SummaryRow } from "./components/summary-row";
import { ChartsRow } from "./components/charts-row";
import { ListsRow } from "./components/lists-row";
import { RightRail } from "./components/right-rail";
import type { DashboardData } from "./server/actions";

interface DashboardPageProps {
  data: DashboardData;
}

export function DashboardPage({ data }: DashboardPageProps) {
  return (
    <div className="flex h-full flex-col gap-6 px-6 py-6">
      <DashboardHeader project={data.project} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.8fr)]">
        {/* Main column */}
        <div className="flex flex-col gap-6">
          <SummaryRow kpis={data.kpis} />
          <ChartsRow charts={data.charts} />
          {/* <SecondaryChartsRow charts={data.charts} /> */}
          <ListsRow lists={data.lists} />
        </div>

        {/* Right rail */}
        <RightRail project={data.project} lists={data.lists} />
      </div>
    </div>
  );
}

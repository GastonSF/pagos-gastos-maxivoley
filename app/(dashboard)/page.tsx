import { redirect } from "next/navigation"
import { TrendingUp, ArrowUpCircle, Wallet, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { KpiCard } from "@/components/kpi-card"
import { ProgressRing } from "@/components/progress-ring"
import { PaymentsBarChart } from "@/components/payments-bar-chart"
import { RecentActivityTable } from "@/components/recent-activity-table"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-5xl tracking-wide text-foreground">
          JULIO 2025
        </h1>
        <p className="text-muted-foreground mt-1">Resumen del mes actual</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <KpiCard
          title="Total Recaudado"
          value="$48.000"
          icon={TrendingUp}
          accent="teal"
          animationDelay={0}
        />
        <KpiCard
          title="Pagaron este mes"
          value="18 de 24"
          icon={Users}
          accent="teal"
          animationDelay={1}
        >
          <ProgressRing progress={75} />
        </KpiCard>
        <KpiCard
          title="Total Egresos"
          value="$12.000"
          icon={ArrowUpCircle}
          accent="amber"
          animationDelay={2}
        />
        <KpiCard
          title="Saldo del Mes"
          value="$36.000"
          icon={Wallet}
          accent="emerald"
          animationDelay={3}
        />
      </div>

      {/* Bar Chart */}
      <PaymentsBarChart />

      {/* Recent Activity Table */}
      <RecentActivityTable />
    </div>
  )
}

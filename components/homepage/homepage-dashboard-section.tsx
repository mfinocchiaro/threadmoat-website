import { loadCompaniesFromCSV, stripSensitiveFields } from "@/lib/load-companies-server"
import { HomepageDashboard } from "./homepage-dashboard"

/**
 * Async server component that loads company data and renders the dashboard.
 * Designed to be wrapped in <Suspense> so the homepage hero streams immediately
 * while this component awaits the CSV parse.
 */
export async function HomepageDashboardSection() {
  let companies: Awaited<ReturnType<typeof loadCompaniesFromCSV>> = []
  try {
    const raw = await loadCompaniesFromCSV()
    companies = stripSensitiveFields(raw)
  } catch {
    // Data load failed — render nothing
    return null
  }

  if (companies.length === 0) return null

  return <HomepageDashboard data={companies} />
}

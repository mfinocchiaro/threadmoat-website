"use client"

import Link from "next/link"
import { Database, ArrowRight } from "lucide-react"
import { usePlan } from "@/contexts/plan-context"
import { useCompanyData } from "@/contexts/company-data-context"
import { getTierLabel, TIER_COMPANY_LIMITS } from "@/lib/tiers"

export function CompanyLimitBanner() {
  const { accessTier } = usePlan()
  const { companies, totalAvailable, isLoading } = useCompanyData()

  const limit = TIER_COMPANY_LIMITS[accessTier]

  // Only show for tiers with a company limit, and only after data has loaded
  if (limit === null || isLoading || totalAvailable <= limit) return null

  return (
    <div className="mx-4 mt-4 flex items-center gap-3 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm">
      <Database className="h-4 w-4 shrink-0 text-blue-500" />
      <span className="flex-1">
        Showing <strong>top {companies.length}</strong> of <strong>{totalAvailable}+</strong> companies
        ranked by weighted score.{' '}
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1 font-medium text-blue-400 underline hover:text-blue-300"
        >
          Upgrade{accessTier === 'explorer' ? ' to Analyst or Strategist' : ' to Strategist'}
          <ArrowRight className="h-3 w-3" />
        </Link>{' '}
        to unlock the full dataset.
      </span>
    </div>
  )
}

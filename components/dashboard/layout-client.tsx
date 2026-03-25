"use client"

import { ReactNode, Suspense, useState } from "react"
import type { Session } from "next-auth"
import { ScenarioProvider, useScenario } from "@/contexts/scenario-context"
import { PlanProvider } from "@/contexts/plan-context"
import { CompanyDataProvider } from "@/contexts/company-data-context"
import { FilterProvider } from "@/contexts/filter-context"
import { SidebarShell } from "./sidebar-shell"
import { FreeUserGuard } from "./free-user-guard"
import { CheckoutToast } from "@/components/checkout/checkout-toast"
import { useIdleTimeout } from "@/hooks/use-idle-timeout"
import type { AccessTier } from "@/lib/tiers"
import { OnboardingWizard } from "./onboarding-wizard"

interface Profile {
  full_name?: string
  company?: string
  title?: string
  profile_type?: string
}

function LayoutInner({ user, profile, children, isAdmin, isFreeUser, isExpiredTrial, daysRemaining, accessTier, showOnboarding = false }: {
  user: Session["user"]
  profile?: Profile
  children: ReactNode
  isAdmin: boolean
  isFreeUser: boolean
  isExpiredTrial: boolean
  daysRemaining: number | null
  accessTier: AccessTier
  showOnboarding?: boolean
}) {
  const { scenario, setScenario } = useScenario()
  const [onboardingDismissed, setOnboardingDismissed] = useState(false)
  useIdleTimeout()
  return (
    <SidebarShell
      user={user}
      profile={profile}
      onSelectScenario={setScenario}
      activeScenario={scenario}
      isAdmin={isAdmin}
      isFreeUser={isFreeUser}
      accessTier={accessTier}
    >
      <Suspense><CheckoutToast /></Suspense>
      {accessTier !== 'admin' ? (
        <FreeUserGuard accessTier={accessTier} isExpiredTrial={isExpiredTrial} daysRemaining={daysRemaining}>
          {children}
        </FreeUserGuard>
      ) : children}
      {showOnboarding && !onboardingDismissed && (
        <OnboardingWizard
          accessTier={accessTier}
          onComplete={() => setOnboardingDismissed(true)}
        />
      )}
    </SidebarShell>
  )
}

export function DashboardLayoutClient({
  user,
  profile,
  initialScenario,
  isAdmin = false,
  isFreeUser = false,
  isExpiredTrial = false,
  daysRemaining = null,
  accessTier = 'explorer',
  showOnboarding = false,
  children,
}: {
  user: Session["user"]
  profile?: Profile
  initialScenario?: string
  isAdmin?: boolean
  isFreeUser?: boolean
  isExpiredTrial?: boolean
  daysRemaining?: number | null
  accessTier?: AccessTier
  showOnboarding?: boolean
  children: ReactNode
}) {
  return (
    <PlanProvider isFreeUser={isFreeUser} accessTier={accessTier ?? 'explorer'}>
      <ScenarioProvider initialScenario={initialScenario}>
        <CompanyDataProvider>
          <FilterProvider>
            <LayoutInner
              user={user}
              profile={profile}
              isAdmin={isAdmin}
              isFreeUser={isFreeUser}
              isExpiredTrial={isExpiredTrial}
              daysRemaining={daysRemaining}
              accessTier={accessTier}
              showOnboarding={showOnboarding}
            >
              {children}
            </LayoutInner>
          </FilterProvider>
        </CompanyDataProvider>
      </ScenarioProvider>
    </PlanProvider>
  )
}

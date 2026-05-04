"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface WizardStep {
  title: string
  description: string
  content: React.ReactNode
}

const WIZARD_STEPS: WizardStep[] = [
  {
    title: "Welcome to Filter Hierarchy",
    description: "Learn how to refine your market analysis with powerful filtering",
    content: (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4">
          <p className="text-sm text-foreground leading-relaxed">
            ThreadMoat uses a two-layer filter system to help you narrow down companies strategically:
          </p>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-primary font-bold">1.</span>
            <span><strong>Sidebar Hypothesis:</strong> Your initial market selection (scenario + high-level filters)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">2.</span>
            <span><strong>Top Refinements:</strong> Detailed filters that narrow down your hypothesis results</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: "Sidebar: Define Your Hypothesis",
    description: "Choose your starting perspective and initial filters",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-700">
          <div className="text-xs font-mono text-slate-400 mb-2">Left Navigation Sidebar</div>
          <div className="space-y-1 text-sm">
            <div className="text-slate-300">📌 Select Scenario</div>
            <div className="text-slate-400 text-xs ml-4">→ Moat Swimmer (founder view)</div>
            <div className="text-slate-400 text-xs ml-4">→ Thesis Writer (VC view)</div>
            <div className="text-slate-400 text-xs ml-4">→ White Space (OEM view)</div>
            <div className="text-slate-400 text-xs ml-4">→ Acq. Radar (ISV view)</div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Your scenario selection acts as the <strong>foundation hypothesis</strong>. All other filters are applied on top of this.
        </p>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded p-3">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            💡 <strong>Tip:</strong> Think of the sidebar as "what market am I looking at?" and the top filters as "which specific companies in that market?"
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Top Filters: Refine Your Results",
    description: "Narrow down with detailed search and category filters",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-700">
          <div className="text-xs font-mono text-slate-400 mb-2">Filter Toolbar (Below charts)</div>
          <div className="space-y-1 text-sm">
            <div className="text-slate-300">🔍 Search: Find specific companies</div>
            <div className="text-slate-300">🏷️ Industry: Narrow by vertical</div>
            <div className="text-slate-300">🌍 Country: Geographic focus</div>
            <div className="text-slate-300">💰 Funding: Target stage/range</div>
            <div className="text-slate-300">...and 10+ more filter options</div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          These filters <strong>intersect</strong> with your sidebar hypothesis. For example:
        </p>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3 text-xs text-blue-700 dark:text-blue-400">
          If sidebar shows CAD vendors, AND you filter top bar to "US" + "Series A" → you see only US-based Series A CAD vendors.
        </div>
      </div>
    ),
  },
  {
    title: "Try It Now",
    description: "Apply filters and watch the charts update in real-time",
    content: (
      <div className="space-y-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <p className="text-sm text-green-700 dark:text-green-400 font-medium mb-2">
            ✅ Ready to explore?
          </p>
          <p className="text-sm text-muted-foreground">
            Close this wizard and try these steps:
          </p>
        </div>
        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
          <li>Select an industry from the filter bar (e.g., "CAD")</li>
          <li>Add another filter like "Country" or "Funding Round"</li>
          <li>Watch the charts and KPI metrics update in real-time</li>
          <li>Notice how filters narrow down your results intelligently</li>
        </ol>
        <div className="bg-slate-500/10 rounded p-3 text-xs text-muted-foreground">
          💬 If you need help again, open Settings → "Show Filter Guide" to replay this wizard anytime.
        </div>
      </div>
    ),
  },
]

interface FilterHierarchyWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete?: () => void
}

export function FilterHierarchyWizard({ open, onOpenChange, onComplete }: FilterHierarchyWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (open) setCurrentStep(0)
  }, [open])

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      onComplete?.()
      onOpenChange(false)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const step = WIZARD_STEPS[currentStep]
  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{step.title}</DialogTitle>
          <DialogDescription>{step.description}</DialogDescription>
        </DialogHeader>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step indicator */}
        <div className="text-xs text-muted-foreground text-center">
          Step {currentStep + 1} of {WIZARD_STEPS.length}
        </div>

        {/* Content */}
        <div className="min-h-64 py-4">{step.content}</div>

        {/* Navigation */}
        <div className="flex items-center gap-2 justify-between pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-1">
            {WIZARD_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  idx === currentStep
                    ? "bg-primary"
                    : idx < currentStep
                    ? "bg-primary/60"
                    : "bg-muted"
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          <Button
            size="sm"
            onClick={handleNext}
            className="gap-2"
          >
            {currentStep === WIZARD_STEPS.length - 1 ? (
              <>
                Got It!
                <Check className="h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

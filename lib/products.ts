export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  mode: "payment" | "subscription"
  interval?: "month" | "year"
  features: string[]
}

export const PRODUCTS: Product[] = [
  {
    id: "analyst",
    name: "ThreadMoat Analyst",
    description:
      "One-time purchase — quarterly market report + 10 interactive analytics charts covering 600+ companies in Industrial AI & Engineering Software.",
    priceInCents: 499900, // $4,999
    mode: "payment",
    features: [
      "1 quarterly Market State Report",
      "10 interactive analytics charts",
      "600+ startups tracked weekly",
      "60-min analyst briefing",
    ],
  },
  {
    id: "investor_annual",
    name: "ThreadMoat Investor",
    description:
      "Annual subscription — investor-focused analytics including co-investment networks, funding trends, and deal flow pipeline.",
    priceInCents: 899900, // $8,999
    mode: "subscription",
    interval: "year",
    features: [
      "Everything in Analyst",
      "Investor network & co-investment analysis",
      "Funding trend time-series",
      "Investor comparison tools",
      "200 company profiles (vs 100 Analyst)",
      "Deal flow pipeline tracking",
    ],
  },
  {
    id: "strategist_annual",
    name: "ThreadMoat Strategist",
    description:
      "Annual subscription — 4 quarterly reports + 25+ interactive analytics charts + dedicated analyst support.",
    priceInCents: 1899900, // €18,999
    mode: "subscription",
    interval: "year",
    features: [
      "4 quarterly Market State Reports",
      "25+ interactive analytics charts",
      "Dedicated analyst support",
      "Quarterly strategy sessions",
    ],
  },
]

export function getProduct(productId: string): Product | undefined {
  return PRODUCTS.find(p => p.id === productId)
}

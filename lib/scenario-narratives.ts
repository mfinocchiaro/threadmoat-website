export interface ChartStep {
  path: string
  label: string
  annotation: string
}

export interface Chapter {
  title: string
  intro: string
  steps: ChartStep[]
}

export interface ScenarioNarrative {
  intro: string
  chapters: Chapter[]
}

export const SCENARIO_NARRATIVES: Record<string, ScenarioNarrative> = {
  startup_founder: {
    intro:
      "Your Competitive Moat Swimmer journey starts with positioning. We'll walk you through the competitive landscape — where you stand, how you compare, and where the gaps are — then drill into funding dynamics and ecosystem relationships.",
    chapters: [
      {
        title: "Competitive Positioning",
        intro: "Map where you stand relative to peers — execution, innovation, and overall market position.",
        steps: [
          {
            path: "/dashboard/quadrant",
            label: "Magic Quadrant",
            annotation:
              "Find your company (or closest comparables) in the four quadrants. Leaders have high execution and high innovation — if you're not there yet, the gap tells you what to invest in. Watch for companies clustering near quadrant boundaries; they're one pivot away from shifting categories.",
          },
          {
            path: "/dashboard/radar",
            label: "Radar Chart",
            annotation:
              "Compare multi-dimensional profiles across competitors. Look for asymmetric spikes — a company strong in tech differentiation but weak in market opportunity may be a future threat if market conditions shift. Your own profile should show clear differentiation on at least two axes.",
          },
          {
            path: "/dashboard/compare",
            label: "Compare",
            annotation:
              "Select your top 3-5 competitors for side-by-side benchmarking. Focus on where you lead and where you trail. Funding efficiency and competitive moat scores are the hardest to change — if you're behind here, consider what structural advantages your competitors have.",
          },
          {
            path: "/dashboard/heatmap",
            label: "Heatmap",
            annotation:
              "Darker cells signal higher metric concentration. Look for your category row — are the strongest scores in your lifecycle column, or elsewhere? Cold spots in your row are market gaps you could exploit. Hot spots in adjacent rows mean competitive pressure.",
          },
        ],
      },
      {
        title: "Funding & Valuation",
        intro: "Understand the capital landscape — who's funded, how efficiently, and where the money is flowing.",
        steps: [
          {
            path: "/dashboard/bubbles",
            label: "Bubble Chart",
            annotation:
              "Bubble size represents funding. Look for companies with high scores but small bubbles — they're doing more with less. Large bubbles with mediocre scores mean capital-inefficient competitors. Your positioning relative to these clusters reveals your capital efficiency story.",
          },
          {
            path: "/dashboard/bar-chart",
            label: "Bar Chart",
            annotation:
              "Funding distribution across categories shows where capital is flowing. If your category is heavily funded, you're in a validated market but face capital competition. Lightly funded categories may signal either an overlooked opportunity or a market the capital markets don't believe in yet.",
          },
          {
            path: "/dashboard/treemap",
            label: "Treemap",
            annotation:
              "The treemap shows capital concentration by segment. Large blocks are well-funded areas; small blocks are emerging. If your segment is a small block with high growth metrics, you're in an early-stage opportunity that investors haven't crowded into yet.",
          },
          {
            path: "/dashboard/timeline",
            label: "Timeline",
            annotation:
              "Funding velocity over time shows market momentum in your category. An accelerating trend means growing investor consensus — good for your next raise. Decelerating trends could signal market skepticism you'll need to address in your pitch.",
          },
        ],
      },
      {
        title: "Ecosystem & Network",
        intro: "See how companies connect — partnerships, shared investors, and ecosystem positioning tell you who your real competitors and allies are.",
        steps: [
          {
            path: "/dashboard/network",
            label: "Startup Ecosystem",
            annotation:
              "Map the ecosystem relationships around your space. Dense clusters mean mature ecosystems with established partnerships. Sparse connections around your node suggest you could become a hub — or that you're isolated. Look for bridge companies connecting different clusters.",
          },
          {
            path: "/dashboard/chord",
            label: "Chord Diagram",
            annotation:
              "Technology overlap between categories. Thick chords between your category and another indicate strong interdependence — potential partnerships or competitive encroachment. Thin chords signal emerging connections you might pioneer.",
          },
          {
            path: "/dashboard/sankey",
            label: "Sankey Flow",
            annotation:
              "Follow the flow of companies between categories, deployment models, and customer segments. Thick flows show established market paths. If your company sits on a thin flow connecting two thick ones, you may be positioned at a strategic junction.",
          },
        ],
      },
      {
        title: "Deep Dive & Reference",
        intro: "Detailed views for competitive intelligence — distribution patterns, geographic presence, and the full company reference grid.",
        steps: [
          {
            path: "/dashboard/distribution",
            label: "Distribution",
            annotation:
              "Score distributions reveal how crowded different performance tiers are. A tight cluster around the median means most competitors are similar — differentiation matters more. A wide spread means the market has clear leaders and laggards.",
          },
          {
            path: "/dashboard/map",
            label: "Geography Map",
            annotation:
              "Geographic distribution of competitors and potential partners. Clusters in specific regions may indicate talent hubs, regulatory advantages, or customer proximity. Gaps in your target geography could be your go-to-market advantage.",
          },
          {
            path: "/dashboard/periodic-table",
            label: "Periodic Table",
            annotation:
              "The complete reference grid of companies in your space, organized by function. Use this to spot companies you haven't considered as competitors. The color coding by investment list reveals which strategic category each company falls into.",
          },
          {
            path: "/dashboard/landscape",
            label: "Landscape",
            annotation:
              "The full visual landscape view. Use this to screenshot and share with your team or board — it's the most intuitive overview of the competitive field for non-analytical audiences.",
          },
        ],
      },
    ],
  },

  vc_investor: {
    intro:
      "Your Investment Thesis Writer journey starts with landscape screening. We'll guide you from broad market overview to specific deal flow analysis, then into funding patterns, investor networks, and valuation benchmarks.",
    chapters: [
      {
        title: "Market Screening",
        intro: "Start broad — understand the landscape, identify thesis-forming signals, and spot sectors worth investigating.",
        steps: [
          {
            path: "/dashboard/landscape-intro",
            label: "Investment Landscape",
            annotation:
              "Start here for the 30,000-foot view. The landscape groups companies by investment list and scores them on a composite metric. Look for clusters of high-scoring companies in underfunded segments — these are your thesis-forming signals.",
          },
          {
            path: "/dashboard/quadrant",
            label: "Magic Quadrant",
            annotation:
              "Position potential portfolio companies. Leaders are safe but expensive; Visionaries are your value plays. Niche Players with strong tech differentiation could be dark-horse bets. Challengers are execution-strong but may lack defensibility.",
          },
          {
            path: "/dashboard/sunburst",
            label: "Sunburst",
            annotation:
              "Drill into the category hierarchy. Thin outer-ring slices represent niche sub-segments — these are where specialized startups solve specific problems. Large slices with few companies per capita are markets with room for new entrants.",
          },
          {
            path: "/dashboard/heatmap",
            label: "Heatmap",
            annotation:
              "Cross-reference categories against lifecycle phases. Hot spots in early-stage rows for a given category signal emerging markets with investment-ready companies. Cold spots in growth-stage columns may indicate sectors that struggle to scale — a risk signal.",
          },
        ],
      },
      {
        title: "Funding Dynamics",
        intro: "Follow the money — where capital is flowing, at what velocity, and how efficiently startups are deploying it.",
        steps: [
          {
            path: "/dashboard/bubbles",
            label: "Bubble Chart",
            annotation:
              "Bubble size = funding. The golden zone: high-scoring companies with relatively small bubbles. These are the undervalued opportunities where your capital could make the most difference. Large bubbles in the upper-left quadrant are overvalued — avoid unless the growth trajectory justifies the premium.",
          },
          {
            path: "/dashboard/bar-chart",
            label: "Bar Chart",
            annotation:
              "Capital allocation by category reveals market conviction. Compare this against your thesis — are you investing with the crowd or against it? Contrarian positions in validated-but-underfunded categories often produce the best returns.",
          },
          {
            path: "/dashboard/treemap",
            label: "Treemap",
            annotation:
              "The treemap shows capital concentration. Large blocks are well-funded segments; small blocks are emerging. If a small block has high growth metrics, it's an early-stage opportunity. Adjacent blocks often represent complementary plays for portfolio construction.",
          },
          {
            path: "/dashboard/timeline",
            label: "Timeline",
            annotation:
              "Funding velocity over time shows market momentum. Accelerating funding in a category signals growing consensus — good for follow-on rounds, risky for new positions. Decelerating categories may be contrarian opportunities if the fundamentals still hold.",
          },
        ],
      },
      {
        title: "Investor Intelligence",
        intro: "Map the investor landscape — who invests where, co-investment patterns, and syndication opportunities.",
        steps: [
          {
            path: "/dashboard/investor-network",
            label: "Investor Network",
            annotation:
              "Co-investment patterns reveal which investors validate similar theses. Thick connections mean frequent co-investors. Look for investors who lead in your target category — they'll be your best syndication partners or your toughest competition for deal flow.",
          },
          {
            path: "/dashboard/chord",
            label: "Chord Diagram",
            annotation:
              "Cross-category investment flows. Thick chords between two categories mean investors frequently bridge these sectors — a signal that bundling plays or platform strategies spanning both segments may be viable thesis angles.",
          },
          {
            path: "/dashboard/customers",
            label: "Customer Network",
            annotation:
              "Customer relationships reveal revenue dependencies and market traction. Companies with diverse customer bases have lower concentration risk. Shared customers between portfolio companies could enable cross-sell synergies.",
          },
        ],
      },
      {
        title: "Deal Flow & Reference",
        intro: "Build your shortlist — benchmark targets, compare metrics, and use the reference grid for systematic deal sourcing.",
        steps: [
          {
            path: "/dashboard/compare",
            label: "Compare",
            annotation:
              "Side-by-side benchmarking for final-stage deal evaluation. Focus on funding efficiency (returns per dollar raised), team execution score, and competitive moat. These three predict Series B+ success better than any single metric.",
          },
          {
            path: "/dashboard/radar",
            label: "Radar Chart",
            annotation:
              "Multi-dimensional profiles for portfolio fit analysis. Look for companies whose radar shapes complement your existing portfolio — uncorrelated strengths reduce portfolio risk while maximizing sector coverage.",
          },
          {
            path: "/dashboard/distribution",
            label: "Distribution",
            annotation:
              "Score distributions help you calibrate expectations. If the median weighted score in a category is 45, a company at 70 is exceptional. Without this context, raw scores are meaningless.",
          },
          {
            path: "/dashboard/periodic-table",
            label: "Periodic Table",
            annotation:
              "The full company grid for deal flow reference. Cross-reference with your thesis filters to build a shortlist. Companies that appear across multiple investment lists may be category-defining — or struggling to find product-market fit.",
          },
        ],
      },
    ],
  },

  oem_enterprise: {
    intro:
      "Your White Space Filler journey starts with mapping the software landscape. We'll guide you through the full taxonomy of companies, then help you spot gaps, underserved areas, and potential acquisition or partnership targets.",
    chapters: [
      {
        title: "Landscape Mapping",
        intro: "Understand the full ecosystem — what exists, where it's concentrated, and how the taxonomy breaks down.",
        steps: [
          {
            path: "/dashboard/periodic-table",
            label: "Periodic Table",
            annotation:
              "Every company organized by functional category. Scan for sparse rows — these are capability gaps in the ecosystem. Dense rows represent commoditized areas where differentiation is hard. Your white space opportunities live in the sparse zones with adjacent strong categories.",
          },
          {
            path: "/dashboard/sunburst",
            label: "Sunburst",
            annotation:
              "Drill into the category hierarchy. Thin slices at the outer ring represent niche sub-segments — these are where startups create focused solutions to specific problems. If your platform lacks coverage in a thick slice, that's a high-priority gap.",
          },
          {
            path: "/dashboard/landscape",
            label: "Landscape",
            annotation:
              "The visual landscape shows category density and positioning. Empty zones on the map are literal white space. Companies positioned between two dense clusters are often trying to bridge a gap — they may be your build-vs-buy decisions.",
          },
          {
            path: "/dashboard/landscape-intro",
            label: "Investment Landscape",
            annotation:
              "The investment view adds a funding lens to the landscape. Heavily funded zones are validated markets where established players are investing. Sparsely funded zones may be too early — or too obvious for existing platforms to address with incremental features.",
          },
        ],
      },
      {
        title: "Gap Analysis",
        intro: "Identify where the ecosystem is thin, fragmented, or missing coverage — these are your build/buy/partner opportunities.",
        steps: [
          {
            path: "/dashboard/heatmap",
            label: "Heatmap",
            annotation:
              "Cold spots in the heatmap are underserved intersections. Look for rows (categories) where most columns (lifecycle phases) are cool — this means the category lacks mature companies. These are areas where a partnership or acquisition could fill a gap before competitors do.",
          },
          {
            path: "/dashboard/marimekko",
            label: "Marimekko",
            annotation:
              "Market share proportions by segment. Wide columns with many thin slivers indicate fragmented markets — prime for consolidation. Narrow columns dominated by one company suggest a monopoly or a validated market with one clear winner. Your strategy depends on which pattern you're trying to disrupt.",
          },
          {
            path: "/dashboard/treemap",
            label: "Treemap",
            annotation:
              "Capital concentration by segment. Small treemap blocks with high average scores represent undervalued niches — startups are building good products but haven't attracted major capital yet. These segments may welcome a platform partnership over VC dilution.",
          },
          {
            path: "/dashboard/distribution",
            label: "Distribution",
            annotation:
              "Score distributions by category reveal which segments have high variance (a few strong players among many weak ones) vs. uniform quality. High-variance categories suggest the strong players are differentiated acquisition targets.",
          },
        ],
      },
      {
        title: "Target Evaluation",
        intro: "Narrow the field — compare potential partners or acquisition targets across key dimensions.",
        steps: [
          {
            path: "/dashboard/compare",
            label: "Compare",
            annotation:
              "Compare potential targets or partners side by side. Focus on complementary strengths — a company strong where you're weak is a better acquisition target than one that duplicates your capabilities. Tech differentiation and ecosystem compatibility scores are key metrics here.",
          },
          {
            path: "/dashboard/radar",
            label: "Radar Chart",
            annotation:
              "The multi-axis radar helps you evaluate how a potential partner or acquisition target complements your existing capabilities. Overlay multiple companies to find the best fit — look for profiles that fill your gaps without overlapping your strengths.",
          },
          {
            path: "/dashboard/bubbles",
            label: "Bubble Chart",
            annotation:
              "Funding context for targets. Small bubbles with high scores are capital-efficient companies that may be more affordable to acquire. Large bubbles likely have VCs expecting a big exit — prepare for higher valuations.",
          },
        ],
      },
      {
        title: "Ecosystem Intelligence",
        intro: "Map relationships, flows, and geographic presence to inform partnership and integration strategy.",
        steps: [
          {
            path: "/dashboard/sankey",
            label: "Sankey Flow",
            annotation:
              "Follow the flow of companies between categories, deployment models, and customer types. Thick flows show established market paths; thin flows reveal emerging connections. If a thin flow connects to your core business, it might be the next growth vector.",
          },
          {
            path: "/dashboard/network",
            label: "Startup Ecosystem",
            annotation:
              "Ecosystem connectivity reveals integration complexity. Companies with many connections bring a richer partner network but may have competing loyalties. Isolated but high-scoring companies may be easier to integrate exclusively.",
          },
          {
            path: "/dashboard/map",
            label: "Geography Map",
            annotation:
              "Geographic distribution matters for enterprise partnerships — proximity to your R&D centers, shared customer regions, and regulatory alignment all affect integration success. Look for clusters near your existing operations.",
          },
          {
            path: "/dashboard/chord",
            label: "Chord Diagram",
            annotation:
              "Cross-category technology overlap. Strong chords between your core category and an adjacent one suggest natural extension points for your platform. This can validate or challenge your white-space hypothesis.",
          },
        ],
      },
    ],
  },

  isv_platform: {
    intro:
      "Your Targeted Acquisition Radar journey starts with screening for execution and innovation. We'll guide you from broad positioning to specific target evaluation, then into network analysis to understand ecosystem implications of each acquisition.",
    chapters: [
      {
        title: "Target Screening",
        intro: "Cast the wide net — use positioning and performance metrics to build an initial target list.",
        steps: [
          {
            path: "/dashboard/quadrant",
            label: "Magic Quadrant",
            annotation:
              "Screen by execution × innovation. Your best acquisition targets are usually in the Visionaries quadrant — strong technology, not yet fully commercialized. Leaders are expensive and may resist acquisition. Niche Players can be bargains if their tech fills a specific platform gap.",
          },
          {
            path: "/dashboard/bubbles",
            label: "Bubble Chart",
            annotation:
              "Small bubbles with high scores are undervalued — they've built great technology without raising much capital, making them more affordable targets. Cross-reference with funding round data: pre-Series B companies are typically more acquisition-friendly than those with late-stage VCs expecting a big exit.",
          },
          {
            path: "/dashboard/heatmap",
            label: "Heatmap",
            annotation:
              "Hot spots reveal where the strongest companies cluster by category and lifecycle. Early-stage companies with high scores in your target category are prime acquisition candidates — they have the tech but need your distribution and scale.",
          },
          {
            path: "/dashboard/landscape-intro",
            label: "Investment Landscape",
            annotation:
              "Use the landscape scoring to identify categories where top-performing companies are concentrated. A high-scoring cluster that aligns with your platform roadmap is an acquisition-rich zone worth deeper investigation.",
          },
        ],
      },
      {
        title: "Target Deep-Dive",
        intro: "Narrow the field with multi-dimensional analysis — compare targets, assess complementarity, and benchmark against your platform's profile.",
        steps: [
          {
            path: "/dashboard/radar",
            label: "Radar Chart",
            annotation:
              "Evaluate acquisition targets across multiple dimensions. A strong tech differentiation spike with a moderate competitive moat suggests a company that built something valuable but hasn't locked in customers yet — the ideal acquisition window. Compare against your platform's existing profile to find complementary shapes.",
          },
          {
            path: "/dashboard/compare",
            label: "Compare",
            annotation:
              "Benchmark your top 3 acquisition candidates. Focus on tech differentiation (the asset you're buying), funding efficiency (valuation expectations), and team execution (integration risk). A high-tech, high-efficiency, high-execution company is the ideal target — but also the most expensive.",
          },
          {
            path: "/dashboard/bar-chart",
            label: "Bar Chart",
            annotation:
              "Valuation and funding context for your target list. Companies below the category median funding with above-median scores are the value plays. Companies at the funding ceiling may have unrealistic valuation expectations driven by their investors.",
          },
          {
            path: "/dashboard/distribution",
            label: "Distribution",
            annotation:
              "Score distributions help calibrate what 'good' looks like in each target category. A company in the top decile of its category is genuinely exceptional. One at the median may not be worth the acquisition premium.",
          },
        ],
      },
      {
        title: "Ecosystem & Integration",
        intro: "Understand the network effects — what relationships, dependencies, and synergies come with each acquisition target.",
        steps: [
          {
            path: "/dashboard/network",
            label: "Startup Ecosystem",
            annotation:
              "Network position matters for acquisitions. A company with many ecosystem connections brings partnerships and integrations along with the technology. Isolated nodes may be easier to acquire but harder to integrate. Look for companies connected to your existing ecosystem.",
          },
          {
            path: "/dashboard/chord",
            label: "Chord Diagram",
            annotation:
              "Technology overlap between companies. Thick chords between your target and other companies in your ecosystem signal smooth integration potential. If the target shares connections with a competitor's ecosystem instead, you may be acquiring a company that pulls toward a different technology stack.",
          },
          {
            path: "/dashboard/investor-network",
            label: "Investor Network",
            annotation:
              "Check who funds your targets. Investors you've worked with before make acquisition conversations easier. Multiple late-stage investors often mean a company is planning an IPO, not an acquisition. Early-stage or angel-backed companies have more flexible exit paths.",
          },
          {
            path: "/dashboard/customers",
            label: "Customer Network",
            annotation:
              "Customer overlap between your platform and the target determines cross-sell potential. Shared customers reduce integration friction. A target with customers you've never reached opens new markets but adds go-to-market risk.",
          },
        ],
      },
      {
        title: "Market Context & Reference",
        intro: "Broader market context for your acquisition strategy — timing, geography, and the full company reference.",
        steps: [
          {
            path: "/dashboard/timeline",
            label: "Timeline",
            annotation:
              "Funding trends for your target categories. A category with decelerating funding may present a buyer's market — startups facing capital scarcity are more receptive to acquisition. Accelerating categories mean higher valuations but more validated markets.",
          },
          {
            path: "/dashboard/map",
            label: "Geography Map",
            annotation:
              "Geographic proximity affects integration complexity — shared time zones, regulatory environments, and talent markets reduce friction. Remote targets offer market expansion but add operational overhead.",
          },
          {
            path: "/dashboard/sankey",
            label: "Sankey Flow",
            annotation:
              "Flow patterns reveal how your target category connects to deployment models and customer segments. A target that bridges two thick flows could become a platform integration hub — high strategic value.",
          },
          {
            path: "/dashboard/periodic-table",
            label: "Periodic Table",
            annotation:
              "The full company reference grid. Use this as your deal book — cross-reference with shortlisted companies and mark targets that appear across multiple investment lists for further due diligence.",
          },
        ],
      },
    ],
  },
}

/** Flatten all chapters into a single reading order for a scenario */
export function getFlatReadingOrder(scenario: string | undefined): ChartStep[] {
  if (!scenario) return []
  const narrative = SCENARIO_NARRATIVES[scenario]
  if (!narrative) return []
  return narrative.chapters.flatMap(ch => ch.steps)
}

export function getScenarioNarrative(
  scenario: string | undefined
): ScenarioNarrative | null {
  if (!scenario) return null
  return SCENARIO_NARRATIVES[scenario] ?? null
}

export function getChartAnnotation(
  scenario: string | undefined,
  pathname: string
): {
  annotation: string
  chapter: { title: string; intro: string }
  nextStep: ChartStep | null
  currentIndex: number
  totalSteps: number
  chapterIndex: number
  chapterStepIndex: number
  chapterStepCount: number
} | null {
  if (!scenario) return null
  const narrative = SCENARIO_NARRATIVES[scenario]
  if (!narrative) return null

  const flat = getFlatReadingOrder(scenario)
  const flatIdx = flat.findIndex(s => s.path === pathname)
  if (flatIdx === -1) return null

  let chapterIdx = 0
  let chapterStepIdx = 0
  let accumulated = 0
  for (let c = 0; c < narrative.chapters.length; c++) {
    const chLen = narrative.chapters[c].steps.length
    if (flatIdx < accumulated + chLen) {
      chapterIdx = c
      chapterStepIdx = flatIdx - accumulated
      break
    }
    accumulated += chLen
  }

  const chapter = narrative.chapters[chapterIdx]
  const next = flatIdx < flat.length - 1 ? flat[flatIdx + 1] : null

  return {
    annotation: flat[flatIdx].annotation,
    chapter: { title: chapter.title, intro: chapter.intro },
    nextStep: next,
    currentIndex: flatIdx,
    totalSteps: flat.length,
    chapterIndex: chapterIdx,
    chapterStepIndex: chapterStepIdx,
    chapterStepCount: chapter.steps.length,
  }
}

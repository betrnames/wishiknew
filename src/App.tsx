import { useMemo, useState } from "react"
import {
  ExternalLink,
  Flame,
  Lightbulb,
  ListChecks,
  Search,
} from "lucide-react"

import { Logo } from "@/components/Logo"
import { ModeToggle } from "@/components/mode-toggle"
import { TipForm } from "@/components/TipForm"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  HEAT_RANK,
  LAUNCH_CATEGORIES,
  LAUNCHES,
  type Heat,
  type Launch,
  type LaunchCategory,
} from "@/lib/launches"
import { cn } from "@/lib/utils"

/** Fill % from bottom — editorial temperature, not live metrics */
const HEAT_FILL: Record<Heat, number> = {
  steady: 28,
  warm: 52,
  hot: 76,
  blazing: 100,
}

const HEAT_BLURB =
  "Heat is editorial judgment — how loud this missed boat feels. Not live MRR, Product Hunt upvotes, or X virality. It only sorts the feed and fills the flame."

const HEAT_LEGEND: Array<{ level: Heat; label: string }> = [
  { level: "blazing", label: "Huge cultural or revenue moment" },
  { level: "hot", label: "Strong breakout; clear pattern" },
  { level: "warm", label: "Solid lesson; less of a flashbulb" },
  { level: "steady", label: "Quieter / evergreen, still useful" },
]

function HeatLegend() {
  return (
    <div className="space-y-2 text-left">
      <p className="text-[11px] leading-4 text-muted-foreground">{HEAT_BLURB}</p>
      <ul className="space-y-1.5 border-t border-border pt-2">
        {HEAT_LEGEND.map(({ level, label }) => (
          <li key={level} className="flex gap-2 text-[11px] leading-4 text-muted-foreground">
            <span className="w-14 shrink-0 capitalize text-foreground/80">{level}</span>
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

type FeedFilter = LaunchCategory | "all"

function initials(name: string) {
  const clean = name.replace(/\.(lol|com|io|ai|app|dev)$/i, "")
  return clean.slice(0, 2).toUpperCase()
}

function LaunchRow({
  item,
  rank,
  expanded,
  heated,
  striped,
  onToggle,
  onHeat,
}: {
  item: Launch
  rank: number
  expanded: boolean
  heated: boolean
  striped: boolean
  onToggle: () => void
  onHeat: () => void
}) {
  return (
    <article
      className={cn(
        "group border-b border-border last:border-b-0 transition-colors",
        striped ? "bg-muted/25" : "bg-card",
        expanded && (striped ? "bg-muted/45" : "bg-muted/35"),
      )}
    >
      <div className="flex gap-3 px-3 py-4 sm:gap-4 sm:px-4 sm:py-5">
        <div className="flex w-8 shrink-0 flex-col items-center pt-1 text-sm font-semibold text-muted-foreground sm:w-10">
          {rank}
        </div>

        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-xl border bg-card text-sm font-bold tracking-tight text-foreground shadow-sm sm:size-14 sm:text-base"
          aria-hidden
        >
          {initials(item.name)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-base font-semibold tracking-tight text-foreground hover:text-primary sm:text-[17px]"
              >
                {item.name}
              </a>
            ) : (
              <h3 className="truncate text-base font-semibold tracking-tight sm:text-[17px]">
                {item.name}
              </h3>
            )}
            <Badge variant="outline" className="border-primary/30 bg-primary/5 text-[10px] font-medium text-primary">
              {item.pattern}
            </Badge>
          </div>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
            {item.oneLiner}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:gap-3">
            <Badge variant="secondary" className="text-[10px] capitalize">
              {item.category}
            </Badge>
            <span>{item.timing}</span>
            <button
              type="button"
              onClick={onToggle}
              className="font-medium text-primary hover:underline"
            >
              {expanded ? "Hide lesson" : "What I'd do differently"}
            </button>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-1 hover:text-foreground"
              >
                Visit <ExternalLink className="size-3" />
                {item.affiliate && (
                  <span className="text-[10px] text-muted-foreground/80">Affiliate</span>
                )}
              </a>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onHeat}
          className={cn(
            "flex h-[66px] w-14 shrink-0 items-center justify-center rounded-xl border transition-colors sm:h-[72px] sm:w-16",
            heated
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-card text-foreground hover:border-primary/50",
          )}
          aria-pressed={heated}
          aria-label={`Heat ${item.heat} — editorial, not live data`}
          title={`Heat: ${item.heat}`}
        >
          <span className="relative size-6">
            <Flame
              className="absolute inset-0 size-6 text-muted-foreground/35"
              strokeWidth={2}
            />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: `inset(${100 - (heated ? Math.min(100, HEAT_FILL[item.heat] + 12) : HEAT_FILL[item.heat])}% 0 0 0)`,
              }}
            >
              <Flame
                className="size-6 fill-primary/80 text-primary"
                strokeWidth={2}
              />
            </span>
          </span>
        </button>
      </div>

      {expanded && (
        <div className="space-y-4 border-t border-border/70 bg-background/60 px-3 py-4 sm:px-4 sm:pl-[6.5rem]">
          <div>
            <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Lightbulb className="size-3.5 text-primary" /> What worked
            </p>
            <p className="text-sm leading-6 text-foreground/90">{item.whyItWorked}</p>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 sm:p-4">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
              What I wish I knew
            </p>
            <p className="text-sm leading-6 text-foreground/90">{item.wishIKnew}</p>
          </div>
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <ListChecks className="size-3.5 text-primary" /> Ship this week
            </p>
            <ol className="list-decimal space-y-1.5 pl-4 text-sm leading-6 text-foreground/90">
              {item.shipThisWeek.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Steal the <span className="font-medium text-foreground">{item.pattern}</span> pattern —
              don’t clone the exact product.
            </p>
          </div>
        </div>
      )}
    </article>
  )
}

function App() {
  const [filter, setFilter] = useState<FeedFilter>("all")
  const [query, setQuery] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(LAUNCHES[0]?.id ?? null)
  const [heated, setHeated] = useState<Record<string, boolean>>({})

  const feed = useMemo(() => {
    let items = filter === "all" ? [...LAUNCHES] : LAUNCHES.filter((i) => i.category === filter)
    const q = query.trim().toLowerCase()
    if (q) {
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.oneLiner.toLowerCase().includes(q) ||
          i.wishIKnew.toLowerCase().includes(q) ||
          i.pattern.toLowerCase().includes(q) ||
          i.category.includes(q),
      )
    }
    return items.sort((a, b) => HEAT_RANK[b.heat] - HEAT_RANK[a.heat] || a.name.localeCompare(b.name))
  }, [filter, query])

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
          <a href="/" className="flex shrink-0 items-center gap-2">
            <Logo className="size-5" />
            <span className="hidden font-semibold tracking-tight sm:inline">Wish I Knew</span>
          </a>

          <div className="relative mx-auto hidden min-w-0 max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patterns, launches, lessons…"
              className="h-9 bg-muted/50 pl-9"
            />
          </div>

          <nav className="ml-auto flex items-center gap-1 sm:gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden text-muted-foreground sm:inline-flex">
              <a href="#feed">Feed</a>
            </Button>
            <Button asChild size="sm" className="font-semibold">
              <a href="#tip">Wish I knew…</a>
            </Button>
            <ModeToggle />
          </nav>
        </div>

        <div className="border-t md:hidden">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search lessons…"
              className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-4 max-w-3xl">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            What I wish I knew
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Build-in-public postmortems turned into stealable patterns — not clones.
          </p>
        </div>

        <div className="mb-4 flex gap-1 overflow-x-auto pb-1">
          {LAUNCH_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilter(cat.id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                filter === cat.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={filter === cat.id}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* List + sidebar share the same top edge */}
        <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start lg:gap-10">
          <div id="feed" className="min-w-0 overflow-hidden rounded-xl border bg-card shadow-sm">
            {feed.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">No lessons match that filter.</p>
            ) : (
              feed.map((item, index) => (
                <LaunchRow
                  key={item.id}
                  item={item}
                  rank={index + 1}
                  striped={index % 2 === 1}
                  expanded={expandedId === item.id}
                  heated={!!heated[item.id]}
                  onToggle={() =>
                    setExpandedId((id) => (id === item.id ? null : item.id))
                  }
                  onHeat={() =>
                    setHeated((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                  }
                />
              ))
            )}
          </div>

          <aside className="space-y-4">
            <Card id="tip" className="scroll-mt-20 border shadow-sm">
              <CardContent className="p-4">
                <h2 className="text-sm font-semibold">Wish I knew about…</h2>
                <p className="mt-1.5 mb-3 text-xs leading-5 text-muted-foreground">
                  Tip a launch or pattern you wish you&apos;d seen sooner. We curate — no
                  auto-publish spam.
                </p>
                <TipForm compact />
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardContent className="p-4">
                <h2 className="flex items-center gap-1.5 text-sm font-semibold">
                  <Flame className="size-3.5 text-primary" strokeWidth={2.5} />
                  What is heat?
                </h2>
                <div className="mt-3">
                  <HeatLegend />
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardContent className="p-4">
                <h2 className="text-sm font-semibold">Categories</h2>
                <ul className="mt-3 space-y-1">
                  {LAUNCH_CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                    <li key={cat.id}>
                      <button
                        type="button"
                        onClick={() => setFilter(cat.id)}
                        className={cn(
                          "w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                          filter === cat.id
                            ? "bg-muted font-medium text-foreground"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                        )}
                      >
                        {cat.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

          </aside>
        </div>
      </div>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Wish I Knew · wishiknew.lol</span>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <a
                href="/llms.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:text-foreground hover:underline"
              >
                llms.txt
              </a>
              <span>Built for builders · heat = editorial, not live rankings</span>
            </div>
          </div>
          <p className="max-w-3xl leading-5 text-muted-foreground/90">
            Affiliate disclosure: some Visit links are marked Affiliate because those products
            offer partner programs. Links currently go to official landers; we may earn a
            commission if you buy through a tracked link we add later, at no extra cost to you.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

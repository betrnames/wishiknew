import { useEffect, useMemo, useState } from "react"
import {
  Flame,
  Search,
} from "lucide-react"

import { LaunchRow } from "@/components/LaunchRow"
import { Logo } from "@/components/Logo"
import { ModeToggle } from "@/components/mode-toggle"
import { TipForm } from "@/components/TipForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  HEAT_RANK,
  LAUNCH_CATEGORIES,
  LAUNCHES,
  type Heat,
  type LaunchCategory,
} from "@/lib/launches"
import { cn } from "@/lib/utils"

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

function App() {
  const [filter, setFilter] = useState<FeedFilter>("all")
  const [query, setQuery] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [heated, setHeated] = useState<Record<string, boolean>>({})

  /** Deep link + search params for shareable / AEO URLs */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get("q")
    if (q) setQuery(q)
    const id = params.get("l") || window.location.hash.replace(/^#/, "")
    if (!id) return
    const match = LAUNCHES.find((x) => x.id === id)
    if (!match) return
    setExpandedId(match.id)
    setFilter("all")
    window.requestAnimationFrame(() => {
      document.getElementById(`lesson-${match.id}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }, [])

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
    <div className="min-h-svh overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-12 max-w-7xl items-center gap-2 px-3 sm:h-14 sm:gap-4 sm:px-6">
          <a href="/" className="flex shrink-0 items-center gap-2">
            <Logo className="size-5" />
            <span className="font-semibold tracking-tight">Wish I Knew</span>
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
            <Button asChild size="sm" className="h-8 px-2.5 text-xs font-semibold sm:h-9 sm:px-3 sm:text-sm">
              <a href="#tip">Wish I knew…</a>
            </Button>
            <ModeToggle />
          </nav>
        </div>

        <div className="border-t md:hidden">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-1.5">
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

      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:py-8">
        <div className="mb-3 max-w-3xl sm:mb-4">
          <h1 className="text-lg font-bold tracking-tight sm:text-2xl">
            What I wish I knew
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Build-in-public postmortems turned into stealable patterns — not clones.
          </p>
        </div>

        <div className="-mx-3 mb-3 flex gap-1 overflow-x-auto px-3 pb-1 sm:mx-0 sm:mb-4 sm:px-0">
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

        <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start lg:gap-10">
          <div id="feed" className="min-w-0 overflow-hidden rounded-xl border bg-card shadow-sm">
            {feed.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">No lessons match that filter.</p>
            ) : (
              feed.map((item, index) => (
                <div key={item.id} id={`lesson-${item.id}`} className="scroll-mt-16 sm:scroll-mt-20">
                  <LaunchRow
                    item={item}
                    rank={index + 1}
                    striped={index % 2 === 1}
                    expanded={expandedId === item.id}
                    heated={!!heated[item.id]}
                    onToggle={() => {
                      setExpandedId((id) => {
                        const next = id === item.id ? null : item.id
                        const url = new URL(window.location.href)
                        if (next) url.searchParams.set("l", next)
                        else url.searchParams.delete("l")
                        window.history.replaceState({}, "", url.toString())
                        return next
                      })
                    }}
                    onHeat={() =>
                      setHeated((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                    }
                  />
                </div>
              ))
            )}
          </div>

          <aside className="space-y-4">
            <Card id="tip" className="scroll-mt-16 border shadow-sm sm:scroll-mt-20">
              <CardContent className="p-4">
                <h2 className="text-sm font-semibold">Wish I knew about…</h2>
                <p className="mt-1.5 mb-3 text-xs leading-5 text-muted-foreground">
                  Tip a launch or pattern you wish you'd seen sooner. We curate — no
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

            <Card className="hidden border shadow-sm lg:block">
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
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-3 py-6 text-xs text-muted-foreground sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Wish I Knew · wishiknew.lol</span>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <a
                href="https://x.com/wishiknew_lol"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 underline-offset-2 hover:text-foreground hover:underline"
                aria-label="Wish I Knew on X"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="size-3.5 fill-current"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.227-8.451L1.99 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                </svg>
                @wishiknew_lol
              </a>
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

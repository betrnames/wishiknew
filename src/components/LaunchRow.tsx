import { useState } from "react"
import {
  Check,
  ExternalLink,
  Flame,
  Lightbulb,
  Link2,
  ListChecks,
  Share2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type Heat, type Launch } from "@/lib/launches"
import { copyLessonLink, lessonShareUrl, openShareOnX } from "@/lib/share"
import { cn } from "@/lib/utils"

/** Fill % from bottom — editorial temperature, not live metrics */
const HEAT_FILL: Record<Heat, number> = {
  steady: 28,
  warm: 52,
  hot: 76,
  blazing: 100,
}

function initials(name: string) {
  const clean = name.replace(/\.(lol|com|io|ai|app|dev)$/i, "")
  return clean.slice(0, 2).toUpperCase()
}

export function LaunchRow({
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
  const [copied, setCopied] = useState(false)

  async function onCopyLink() {
    await copyLessonLink(item.id)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const fill = heated
    ? Math.min(100, HEAT_FILL[item.heat] + 12)
    : HEAT_FILL[item.heat]

  return (
    <article
      className={cn(
        "group border-b border-border last:border-b-0 transition-colors",
        striped ? "bg-muted/25" : "bg-card",
        expanded && (striped ? "bg-muted/45" : "bg-muted/35"),
      )}
    >
      <div className="flex items-start gap-2 px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-5">
        <div className="flex w-4 shrink-0 flex-col items-center pt-1 text-[11px] font-semibold tabular-nums text-muted-foreground sm:w-10 sm:pt-1 sm:text-sm">
          {rank}
        </div>

        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-card text-[10px] font-bold tracking-tight text-foreground shadow-sm sm:size-14 sm:rounded-xl sm:text-base"
          aria-hidden
        >
          {initials(item.name)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1.5">
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel={
                  item.affiliate
                    ? "noopener noreferrer sponsored"
                    : "noopener noreferrer"
                }
                className="min-w-0 truncate text-sm font-semibold tracking-tight text-foreground hover:text-primary sm:text-[17px]"
              >
                {item.name}
              </a>
            ) : (
              <h3 className="min-w-0 truncate text-sm font-semibold tracking-tight sm:text-[17px]">
                {item.name}
              </h3>
            )}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel={
                  item.affiliate
                    ? "noopener noreferrer sponsored"
                    : "noopener noreferrer"
                }
                className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground sm:hidden"
                aria-label={`Visit ${item.name}${item.affiliate ? " (affiliate)" : ""}`}
              >
                <ExternalLink className="size-3.5" />
              </a>
            )}
            <Badge
              variant="outline"
              className="hidden border-primary/30 bg-primary/5 text-[10px] font-medium text-primary sm:inline-flex"
            >
              {item.pattern}
            </Badge>
          </div>
          <p className="mt-0.5 line-clamp-1 text-xs leading-4 text-muted-foreground sm:mt-1 sm:line-clamp-2 sm:text-sm sm:leading-5">
            {item.oneLiner}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground sm:mt-2 sm:flex-wrap sm:gap-3">
            <Badge
              variant="secondary"
              className="hidden text-[10px] capitalize sm:inline-flex"
            >
              {item.category}
            </Badge>
            <span className="hidden sm:inline">{item.timing}</span>
            <button
              type="button"
              onClick={onToggle}
              className="min-h-8 font-medium text-primary hover:underline sm:min-h-0"
            >
              <span className="sm:hidden">
                {expanded ? "Hide" : "Lesson"}
              </span>
              <span className="hidden sm:inline">
                {expanded ? "Hide lesson" : "What I'd do differently"}
              </span>
            </button>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel={
                  item.affiliate
                    ? "noopener noreferrer sponsored"
                    : "noopener noreferrer"
                }
                className="hidden items-center gap-1 hover:text-foreground sm:inline-flex"
              >
                Visit <ExternalLink className="size-3" />
                {item.affiliate && (
                  <span className="text-[10px] text-muted-foreground/80">
                    Affiliate
                  </span>
                )}
              </a>
            )}
            <button
              type="button"
              onClick={() => openShareOnX(item)}
              className="hidden items-center gap-1 font-medium text-muted-foreground hover:text-foreground sm:inline-flex"
              title="Share on X"
            >
              <Share2 className="size-3" /> Share on X
            </button>
            <button
              type="button"
              onClick={onCopyLink}
              className="hidden items-center gap-1 hover:text-foreground sm:inline-flex"
              title={lessonShareUrl(item.id)}
            >
              {copied ? (
                <Check className="size-3 text-primary" />
              ) : (
                <Link2 className="size-3" />
              )}
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onHeat}
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors sm:h-[72px] sm:w-16 sm:rounded-xl",
            heated
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-card text-foreground hover:border-primary/50",
          )}
          aria-pressed={heated}
          aria-label={`Heat ${item.heat} — editorial, not live data`}
          title={`Heat: ${item.heat}`}
        >
          <span className="relative size-5 sm:size-6">
            <Flame
              className="absolute inset-0 size-5 text-muted-foreground/35 sm:size-6"
              strokeWidth={2}
            />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: `inset(${100 - fill}% 0 0 0)`,
              }}
            >
              <Flame
                className="size-5 fill-primary/80 text-primary sm:size-6"
                strokeWidth={2}
              />
            </span>
          </span>
        </button>
      </div>

      {expanded && (
        <div className="space-y-4 border-t border-border/70 bg-background/60 px-3 py-4 sm:px-4 sm:pl-[6.5rem]">
          <div className="flex flex-wrap items-center gap-1.5 sm:hidden">
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/5 text-[10px] font-medium text-primary"
            >
              {item.pattern}
            </Badge>
            <Badge variant="secondary" className="text-[10px] capitalize">
              {item.category}
            </Badge>
            <span className="text-[11px] text-muted-foreground">
              {item.timing}
            </span>
          </div>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel={
                item.affiliate
                  ? "noopener noreferrer sponsored"
                  : "noopener noreferrer"
              }
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground hover:border-primary/40 sm:hidden"
            >
              Visit {item.name}
              <ExternalLink className="size-3.5" />
              {item.affiliate && (
                <span className="text-[10px] font-normal text-muted-foreground">
                  Affiliate
                </span>
              )}
            </a>
          )}
          <div>
            <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Lightbulb className="size-3.5 text-primary" /> What worked
            </p>
            <p className="text-sm leading-6 text-foreground/90">
              {item.whyItWorked}
            </p>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 sm:p-4">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
              What I wish I knew
            </p>
            <p className="text-sm leading-6 text-foreground/90">
              {item.wishIKnew}
            </p>
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
              Steal the{" "}
              <span className="font-medium text-foreground">
                {item.pattern}
              </span>{" "}
              pattern — don’t clone the exact product.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-9 gap-1.5 text-xs sm:h-8"
                onClick={() => openShareOnX(item)}
              >
                <Share2 className="size-3.5" /> Share this lesson on X
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-9 gap-1.5 text-xs text-muted-foreground sm:h-8"
                onClick={onCopyLink}
              >
                {copied ? (
                  <Check className="size-3.5 text-primary" />
                ) : (
                  <Link2 className="size-3.5" />
                )}
                {copied ? "Link copied" : "Copy shareable link"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

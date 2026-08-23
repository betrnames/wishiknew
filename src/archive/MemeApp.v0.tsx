import { useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowRight,
  Check,
  Clipboard,
  Download,
  Eraser,
  History,
  Lightbulb,
  LoaderCircle,
  RefreshCw,
  Send,
  Shield,
  Sparkles,
  WandSparkles,
} from "lucide-react"

import { Logo } from "@/components/Logo"
import { ModeToggle } from "@/components/mode-toggle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  CATEGORIES,
  FEATURED_CATEGORY_IDS,
  type CategoryId,
} from "@/lib/categories"
import { analyzeRegretSafety } from "@/lib/regret-safety"
import { cn } from "@/lib/utils"

type ThemeKey = "midnight" | "peach" | "lime" | "paper"
type Meme = {
  id: string
  regret: string
  title: string
  subtitle: string
  explanation: string
  lifeHack?: string
  lifeHackVersion?: string
  theme: ThemeKey
  createdAt: number
}

const STORAGE_KEY = "wishiknew-history"
const themes: Array<{ id: ThemeKey; label: string; swatch: string }> = [
  { id: "midnight", label: "Midnight", swatch: "bg-slate-950" },
  { id: "peach", label: "Peach fuzz", swatch: "bg-orange-300" },
  { id: "lime", label: "Loud lime", swatch: "bg-lime-300" },
  { id: "paper", label: "Paper trail", swatch: "bg-stone-100" },
]

function buildMeme(regret: string, forceLifeHack: boolean, theme: ThemeKey): Meme {
  const normalized = regret.toLowerCase()
  const practical =
    /bought|money|spent|email|work|meeting|food|cook|microwave|sleep|late|plan|planner|password|phone|order|forgot|clean|exercise|deadline|avocado|camera|zoom|reply|episode|netflix|omw|on my way/.test(
      normalized,
    )
  const lifeHack = forceLifeHack || practical
  let title = "A Bold Choice"
  let subtitle = "And somehow, past-you had the confidence."
  let hack: string | undefined
  let hackDetail: string | undefined

  if (/planner|plan|organize|productivity/.test(normalized)) {
    title = "Productivity Cosplay"
    subtitle = "Bought the tools. Skipped the transformation arc."
    hack = "Use one tool for 7 days before buying another."
    hackDetail =
      "Pick one list (Notes, Google Tasks, or paper). Add only today’s top 3. No new apps until day 8."
  } else if (/yes|plans|invite|social|people|party/.test(normalized) && !/five minutes|5 minutes|on my way|omw/.test(normalized)) {
    title = "The Social Hangover"
    subtitle = "Your calendar said yes. Your soul filed an appeal."
    hack = "Default to ‘let me check and get back to you.’"
    hackDetail =
      "Wait 10 minutes before accepting. If you still want to go, reply with a hard end time (‘I can do 7–8:30’)."
  } else if (/avocado|guac/.test(normalized)) {
    title = "Guacamole Urgency"
    subtitle = "It was perfect for one emotionally unavailable moment."
    hack = "Buy firm avocados + ripen on a schedule."
    hackDetail =
      "Leave hard ones on the counter 2–3 days, then fridge once soft. Eat within 24 hours of ‘ready,’ or mash + lemon and seal tight."
  } else if (/camera|zoom|teams|meet|unmute|video/.test(normalized)) {
    title = "Accidental Premiere"
    subtitle = "Your face debuted before your talking points did."
    hack = "Join muted + camera off by default."
    hackDetail =
      "In Zoom/Teams settings: mute mic on join, stop video on join. Turn them on only when you’re ready."
  } else if (/five minutes|5 minutes|on my way|omw/.test(normalized)) {
    title = "Estimated Time of Denial"
    subtitle = "Five minutes, spiritually. Forty, geographically."
    hack = "Only text ETA after you’re in motion."
    hackDetail =
      "Shoes on, keys in hand, door open — then send ‘leaving now, ~X min’ with a real number from Maps."
  } else if (/reply.?all|replied.?all|cc'?d everyone/.test(normalized)) {
    title = "Organizational Fame"
    subtitle = "You wanted visibility. You got archaeology."
    hack = "Check To/Cc before every send."
    hackDetail =
      "On desktop: click the recipient field and scan the list. If it’s a long thread, Reply (not Reply all) unless everyone must act."
  } else if (/episode|netflix|autoplay|binge|one more/.test(normalized)) {
    title = "Autoplay Betrayal"
    subtitle = "The ‘continue’ button had a better plan than your sleep did."
    hack = "Turn off autoplay + set a hard stop."
    hackDetail =
      "Netflix/YouTube: disable autoplay. Decide ‘one episode’ before you sit down; put the remote/phone across the room when it’s done."
  } else if (/fish|microwave/.test(normalized)) {
    title = "A Fragrant Mistake"
    subtitle = "The office will remember this longer than your name."
    hack = "Never microwave fish (or broccoli) at work."
    hackDetail =
      "Pack cold options, leftovers that reheat fine (rice bowls, soup in a thermos), or eat fragrant food outside / at home."
  } else if (/food|cook|lunch/.test(normalized)) {
    title = "A Fragrant Mistake"
    subtitle = "The office will remember this longer than your name."
    hack = "Prep two ‘no-think’ lunches on Sunday."
    hackDetail =
      "Batch a grain + protein + sauce. Reheat only low-smell foods at work; keep emergency bars in your desk."
  } else if (/money|bought|spent|order|shopping/.test(normalized)) {
    title = "Financially Unsupervised"
    subtitle = "It was only a little purchase, repeated 47 times."
    hack = "Use a 24-hour cart rule."
    hackDetail =
      "Add to cart, close the tab, revisit tomorrow. If it’s still useful and in budget, buy once — not three ‘deals.’"
  } else if (/password|login|account|hacked|2fa/.test(normalized)) {
    title = "Security Theater"
    subtitle = "Your password was ‘password123’ with confidence."
    hack = "Password manager + 2FA on email and bank first."
    hackDetail =
      "Install a manager, save new unique passwords going forward, turn on authenticator apps for email, bank, and work SSO."
  } else if (/sleep|late|alarm|morning/.test(normalized)) {
    title = "Tomorrow Will Be Different"
    subtitle = "A bedtime promise made exclusively by nighttime-you."
    hack = "Charge your phone outside the bedroom."
    hackDetail =
      "Set a wind-down alarm 45 min before bed. Phone charges in another room; use a $10 alarm clock if you need it."
  } else if (/email|work|meeting|deadline|boss/.test(normalized)) {
    title = "Per My Last Regret"
    subtitle = "The email was sent. The dignity was not attached."
    hack = "Write hot, send cool."
    hackDetail =
      "Draft the angry version in Notes (not email). Wait 30–60 minutes, then send a short, factual message with one clear ask."
  } else if (/love|ex|text|heart|feel|miss|breakup|relationship/.test(normalized)) {
    title = "Character Development"
    subtitle = "Unfortunately, the lesson arrived with a subscription fee."
    hack = "Don’t text feelings after 10pm."
    hackDetail =
      "Sleep on it. If it still matters, say it once in person or a calm daytime message — no essay threads."
  } else {
    title = "Wish I Knew Sooner"
    subtitle = "No notes. Just consequences and surprisingly good lighting."
    hack = "Name the pattern in one sentence."
    hackDetail =
      "Write: ‘Next time I’ll ___ before I ___.’ Put that line in your phone notes and read it when the urge returns."
  }

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    regret,
    title,
    subtitle,
    explanation: practical
      ? "A practical ‘wish I knew’ — the punchline is funny because the fix is boring and real."
      : "An emotional plot twist. Distance helps; a tiny rule helps more.",
    lifeHack: lifeHack ? hack ?? "Write one rule you’d tell a friend in your situation." : undefined,
    lifeHackVersion: lifeHack
      ? hackDetail ?? "Keep the rule under 15 words so you’ll actually remember it next time."
      : undefined,
    theme,
    createdAt: Date.now(),
  }
}

function App() {
  const [regret, setRegret] = useState("")
  const [forceLifeHack, setForceLifeHack] = useState(false)
  const [anonymous, setAnonymous] = useState(true)
  const [remixMode, setRemixMode] = useState<"funnier" | "darker" | "wholesome" | null>(null)
  const [theme, setTheme] = useState<ThemeKey>("midnight")
  const [meme, setMeme] = useState<Meme | null>(null)
  const [history, setHistory] = useState<Meme[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [notice, setNotice] = useState("")
  const [safetyBlock, setSafetyBlock] = useState<{ message: string; alternative: string } | null>(null)
  const [categoryId, setCategoryId] = useState<CategoryId>("food")
  const [showMoreCategories, setShowMoreCategories] = useState(false)
  const [exampleOffset, setExampleOffset] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setHistory(JSON.parse(saved) as Meme[])
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  const canGenerate = regret.trim().length > 0 && !isGenerating
  const themeLabel = useMemo(() => themes.find((item) => item.id === theme)?.label, [theme])
  const activeCategory = useMemo(
    () => CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0],
    [categoryId],
  )
  const visibleCategoryChips = useMemo(() => {
    if (showMoreCategories) return CATEGORIES
    return CATEGORIES.filter((c) => FEATURED_CATEGORY_IDS.includes(c.id))
  }, [showMoreCategories])
  const visibleExamples = useMemo(() => {
    const list = activeCategory.examples
    const len = list.length
    if (len === 0) return []
    return [0, 1, 2].map((i) => list[(exampleOffset + i) % len])
  }, [activeCategory, exampleOffset])

  function selectCategory(id: CategoryId) {
    setCategoryId(id)
    setExampleOffset(0)
    setSafetyBlock(null)
  }

  function showNotice(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice(""), 2500)
  }

  function generate() {
    if (!regret.trim()) return
    setIsGenerating(true)
    setSafetyBlock(null)

    window.setTimeout(() => {
      const safety = analyzeRegretSafety(regret)
      if (!safety.safe) {
        setMeme(null)
        setRemixMode(null)
        setSafetyBlock({
          message: safety.message,
          alternative: safety.alternative,
        })
        setIsGenerating(false)
        return
      }

      const next = buildMeme(regret.trim(), forceLifeHack, theme)
      const nextHistory = [next, ...history].slice(0, 12)
      setMeme(next)
      setHistory(nextHistory)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory))
      setIsGenerating(false)
    }, 650)
  }

  function useSafeAlternative() {
    if (!safetyBlock) return
    setRegret(safetyBlock.alternative)
    setSafetyBlock(null)
    setMeme(null)
  }

  function selectHistory(item: Meme) {
    setMeme(item)
    setRegret(item.regret)
    setTheme(item.theme)
    setRemixMode(null)
  }

  function remix(mode: "funnier" | "darker" | "wholesome") {
    if (!meme) return
    const variants = {
      funnier: { title: "Still Processing This", subtitle: "The apology tour has been postponed indefinitely." },
      darker: { title: "This Is Who We Are Now", subtitle: "A tiny decision. A surprisingly permanent documentary." },
      wholesome: { title: "We Learn, Eventually", subtitle: "Past-you did their best. Weirdly, that counts." },
    }
    setMeme({ ...meme, ...variants[mode] })
    setRemixMode(mode)
  }

  function sendToWreckSh() {
    if (!meme) return
    // No account link yet — queue only; never attaches a username
    showNotice(
      anonymous
        ? "Queued without your name (demo). Sharing elsewhere is still your choice."
        : "Queued as a public card (demo). Prefer private? Turn on ‘Keep private on this site.’",
    )
  }

  async function copyText() {
    if (!meme) return
    // Share-safe by default: punchline + site, not the raw confession
    const text = [
      meme.title,
      meme.subtitle,
      meme.lifeHack ? `Life hack: ${meme.lifeHack}` : "",
      "",
      "wishiknew.lol",
    ]
      .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
      .join("\n")
      .trim()
    await navigator.clipboard.writeText(text)
    showNotice("Share text copied — no raw confession included")
  }

  async function shareCard() {
    if (!meme) return
    const text = `${meme.title}\n${meme.subtitle}\n\nwishiknew.lol`
    const shareUrl = "https://wishiknew.lol"
    try {
      if (navigator.share) {
        await navigator.share({ title: "Wish I Knew", text, url: shareUrl })
        showNotice("Shared — your social account is separate from this site")
        return
      }
    } catch {
      /* user cancelled or share failed — fall through */
    }
    const tweet = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(tweet, "_blank", "noopener,noreferrer")
    showNotice("Opened X with the card text — not your private input")
  }

  function downloadCard() {
    if (!meme || !cardRef.current) return
    const canvas = document.createElement("canvas")
    canvas.width = 1080
    canvas.height = 1350
    const context = canvas.getContext("2d")
    if (!context) return
    const gradients: Record<ThemeKey, [string, string, string]> = {
      midnight: ["#09090b", "#18243d", "#f8fafc"],
      peach: ["#fff1e6", "#f6b88f", "#291b16"],
      lime: ["#d9f99d", "#bef264", "#132a13"],
      paper: ["#fafaf9", "#e7e5e4", "#1c1917"],
    }
    const [start, end, foreground] = gradients[meme.theme]
    const gradient = context.createLinearGradient(0, 0, 1080, 1350)
    gradient.addColorStop(0, start)
    gradient.addColorStop(1, end)
    context.fillStyle = gradient
    context.fillRect(0, 0, 1080, 1350)
    context.globalAlpha = 0.12
    context.fillStyle = foreground
    context.beginPath()
    context.arc(900, 220, 280, 0, Math.PI * 2)
    context.fill()
    context.globalAlpha = 1
    context.fillStyle = foreground
    context.font = "600 26px Arial"
    context.fillText("WISH I KNEW / wishiknew.lol", 88, 105)
    context.font = "900 92px Arial"
    wrapCanvasText(context, meme.title, 88, 600, 850, 110)
    context.globalAlpha = 0.82
    context.font = "400 34px Arial"
    wrapCanvasText(context, meme.subtitle, 88, 920, 820, 52)
    if (meme.lifeHack) {
      context.globalAlpha = 0.95
      context.font = "700 24px Arial"
      context.fillText("LIFE HACK", 88, 1130)
      context.font = "400 28px Arial"
      wrapCanvasText(context, meme.lifeHack, 88, 1180, 820, 42)
    }
    const link = document.createElement("a")
    link.download = "wish-i-knew.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
    showNotice("PNG downloaded")
  }

  function clearHistory() {
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
    showNotice("History cleared")
  }

  return (
    <main className="min-h-svh overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 opacity-60 [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2.5">
            <Logo className="size-5 text-foreground dark:text-foreground" />
            <p className="text-xs text-muted-foreground sm:text-sm">
              a support group for questionable decisions
            </p>
          </div>
          <ModeToggle />
        </header>

        <section className="grid items-start gap-10 pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:pt-16">
          <div className="max-w-xl">
            <Badge
              variant="outline"
              className="viral-badge mb-6 gap-1.5 rounded-full px-3 py-1 font-semibold"
            >
              <WandSparkles className="size-3.5 text-primary" /> go viral or go home
            </Badge>
            <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.06em] text-balance sm:text-7xl">
              Wish I knew.{" "}
              <span className="text-primary">Make it a meme.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-7 text-muted-foreground">
              Drop the thing you wish you could un-send. We’ll make it funny enough to survive —
              and maybe teach past-you a life hack.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {visibleCategoryChips.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => selectCategory(cat.id)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      categoryId === cat.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                    aria-pressed={categoryId === cat.id}
                  >
                    {cat.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowMoreCategories((v) => !v)}
                  className="rounded-full border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {showMoreCategories ? "Less" : "More"}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {visibleExamples.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => {
                      setRegret(starter)
                      setSafetyBlock(null)
                    }}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {starter}
                  </button>
                ))}
                {activeCategory.examples.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setExampleOffset((n) => n + 3)}
                    className="rounded-full border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    aria-label="Show more examples in this category"
                  >
                    More examples
                  </button>
                )}
              </div>
            </div>

            <Card className="viral-card mt-5 overflow-hidden border bg-card">
              <CardContent className="p-5 sm:p-6">
                <Textarea
                  value={regret}
                  onChange={(event) => {
                    setRegret(event.target.value)
                    if (safetyBlock) setSafetyBlock(null)
                  }}
                  onKeyDown={(event) => {
                    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") generate()
                  }}
                  placeholder="wish i knew..."
                  className="min-h-36 resize-none border-0 bg-muted/60 p-4 text-lg shadow-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  maxLength={240}
                />
                {safetyBlock && (
                  <div
                    role="alert"
                    className="mt-4 rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm leading-6"
                  >
                    <p className="font-medium text-foreground">{safetyBlock.message}</p>
                    <p className="mt-2 text-muted-foreground">
                      <span className="font-medium text-foreground">Try this instead: </span>
                      {safetyBlock.alternative}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button type="button" size="sm" variant="secondary" onClick={useSafeAlternative}>
                        Use this alternative
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSafetyBlock(null)
                          setRegret("")
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                )}
                <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setForceLifeHack((value) => !value)}
                    className={cn("flex items-center gap-2 text-sm transition-colors", forceLifeHack ? "text-primary" : "text-muted-foreground hover:text-foreground")}
                    aria-pressed={forceLifeHack}
                  >
                    <span className={cn("flex size-5 items-center justify-center rounded-md border", forceLifeHack && "border-primary bg-primary text-primary-foreground")}>
                      {forceLifeHack && <Check className="size-3" />}
                    </span>
                    Add a life hack
                  </button>
                  <Button onClick={generate} disabled={!canGenerate} className="w-full gap-2 font-semibold sm:w-auto">
                    {isGenerating ? <LoaderCircle className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                    {isGenerating ? "Cooking…" : "Make it a meme"}
                    {!isGenerating && <ArrowRight className="size-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div className="mt-3 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <span>⌘ + Enter · History stays on this device</span>
              <button
                type="button"
                onClick={() => setAnonymous((value) => !value)}
                className={cn(
                  "flex items-center gap-1.5 text-left transition-colors hover:text-foreground",
                  anonymous && "text-primary",
                )}
                aria-pressed={anonymous}
                title={
                  anonymous
                    ? "We don’t attach your name on this site. Sharing a card later is still your choice."
                    : "Public on this site means the card isn’t marked private — social posts still use your own accounts."
                }
              >
                <Shield className="size-3.5 shrink-0" />
                {anonymous ? "Keep private on this site" : "Public on this site"}
              </button>
            </div>
            <p className="mt-1.5 text-[11px] leading-4 text-muted-foreground/80">
              Private ≠ invisible forever. Download or share posts the <span className="font-medium text-muted-foreground">card</span>, not
              your identity here. Your X/social account is separate.
            </p>
          </div>

          <div className="lg:pt-2">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold"><span className="size-2 rounded-full bg-emerald-500" /> Your meme preview</div>
              {meme && <span className="text-xs text-muted-foreground">{themeLabel}</span>}
            </div>
            <div
              ref={cardRef}
              className={
                cn(
                  "relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border p-8 shadow-xl transition-all duration-500 sm:p-12",
                  meme ? "animate-in fade-in zoom-in-95" : "bg-muted/40",
                ) +
                " " +
                (meme ? `meme-${meme.theme}` : "")
              }
            >
              {meme ? (
                <>
                  <div className="absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl" />
                  <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-bold tracking-[0.18em] opacity-70"><span>WISH I KNEW</span><span>001</span></div>
                    <div>
                      <h2 className="max-w-xl text-5xl font-black leading-[0.92] tracking-[-0.06em] text-balance sm:text-6xl">{meme.title}</h2>
                      <p className="mt-6 max-w-md text-lg leading-7 opacity-80 sm:text-xl">{meme.subtitle}</p>
                    </div>
                    <div className="max-w-md border-l-2 border-current/40 pl-4"><div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-[0.18em] opacity-70"><Lightbulb className="size-3.5" /> WHY IT HITS</div><p className="text-sm leading-6 opacity-85">{meme.explanation}</p></div>
                    {meme.lifeHack ? <div className="max-w-md border-l-2 border-current/40 pl-4"><div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-[0.18em] opacity-70"><Lightbulb className="size-3.5" /> LIFE HACK VERSION</div><p className="text-sm leading-6 opacity-85">{meme.lifeHackVersion}</p></div> : <div className="text-xs font-medium uppercase tracking-[0.18em] opacity-50">No hack. Just healing.</div>}
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground"><div className="mb-5 flex size-16 items-center justify-center rounded-2xl border border-dashed border-muted-foreground/30 bg-background/50"><Sparkles className="size-7 opacity-50" /></div><p className="font-semibold">wish i knew…</p><p className="mt-2 max-w-xs text-sm">The finished card will appear with a shareable look and a suspiciously accurate punchline.</p></div>
              )}
            </div>
            {meme && (
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex gap-2">
                    {themes.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        aria-label={`Use ${item.label} theme`}
                        onClick={() => {
                          setTheme(item.id)
                          setMeme({ ...meme, theme: item.id })
                        }}
                        className={cn(
                          "size-6 rounded-full border-2 transition-transform hover:scale-110",
                          item.swatch,
                          theme === item.id
                            ? "border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
                            : "border-background",
                        )}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={copyText}>
                      <Clipboard className="size-3.5" /> Copy share text
                    </Button>
                    <Button size="sm" onClick={downloadCard}>
                      <Download className="size-3.5" /> Download PNG
                    </Button>
                    <Button variant="outline" size="sm" onClick={shareCard}>
                      <Send className="size-3.5" /> Share card
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {(["funnier", "darker", "wholesome"] as const).map((mode) => (
                    <Button
                      key={mode}
                      variant={remixMode === mode ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => remix(mode)}
                    >
                      <RefreshCw className="size-3" /> Make it {mode}
                    </Button>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto w-full justify-center gap-2 px-3 py-2 text-muted-foreground sm:w-auto"
                  onClick={sendToWreckSh}
                >
                  <Send className="size-3.5" />
                  Queue to wreck.sh (no name · demo)
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="mt-20 border-t pt-8">
          <div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-2"><History className="size-4 text-muted-foreground" /><h2 className="font-semibold">Past emotional damage</h2><Badge variant="secondary">{history.length}</Badge></div>{history.length > 0 && <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={clearHistory}><Eraser className="size-3.5" /> Clear history</Button>}</div>
          {history.length > 0 ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{history.slice(0, 8).map((item) => <button key={item.id} type="button" onClick={() => selectHistory(item)} className="group rounded-2xl border bg-card p-4 text-left transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"><div className="mb-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground"><span>{item.lifeHack ? "Hack included" : "No hack needed"}</span><ArrowRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" /></div><p className="line-clamp-2 font-bold tracking-tight">{item.title}</p><p className="mt-2 line-clamp-1 text-xs text-muted-foreground">{item.regret}</p></button>)}</div> : <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">Your greatest hits will live here. Probably.</div>}
        </section>
      </div>
      {notice && <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-xl">{notice}</div>}
    </main>
  )
}

function wrapCanvasText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ")
  let line = ""
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (context.measureText(test).width > maxWidth && line) {
      context.fillText(line, x, y)
      line = word
      y += lineHeight
    } else {
      line = test
    }
  }
  context.fillText(line, x, y)
}

export default App

import { useState, type FormEvent } from "react"
import { LoaderCircle, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const FORMSPREE = "https://formspree.io/f/mwvdpgay"

export function TipForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle")

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    setStatus("loading")
    try {
      const res = await fetch(FORMSPREE, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          tip: data.get("tip"),
          _subject: "Wish I Knew — tip",
          source: "wishiknew.lol",
        }),
      })
      if (!res.ok) throw new Error("fail")
      form.reset()
      setStatus("ok")
    } catch {
      setStatus("error")
    }
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "space-y-2" : "space-y-3"}>
      <Textarea
        name="tip"
        required
        placeholder='e.g. "Photo AI — before/after SaaS. I wish I’d shipped the vertical first."'
        className={compact ? "min-h-20 text-sm" : "min-h-24 text-sm"}
        maxLength={800}
      />
      <Input
        name="email"
        type="email"
        required
        placeholder="you@email.com"
        className="h-9 text-sm"
      />
      <Button type="submit" size="sm" className="w-full font-semibold" disabled={status === "loading"}>
        {status === "loading" ? (
          <>
            <LoaderCircle className="size-3.5 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send className="size-3.5" /> Send tip
          </>
        )}
      </Button>
      {status === "ok" && (
        <p className="text-xs text-primary">Got it — thanks for the tip.</p>
      )}
      {status === "error" && (
        <p className="text-xs text-destructive">Couldn’t send — try again in a moment.</p>
      )}
    </form>
  )
}

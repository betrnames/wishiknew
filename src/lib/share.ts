import type { Launch } from "@/lib/launches"

/** Canonical site URL for share links, OG, and AEO */
export const SITE_URL = "https://wishiknew.lol"

/** Shareable deep link that opens/expands a lesson */
export function lessonShareUrl(id: string) {
  return `${SITE_URL}/?l=${encodeURIComponent(id)}`
}

export function buildLessonShareText(item: Launch) {
  const lines = [
    `What I wish I knew: ${item.name}`,
    "",
    item.oneLiner,
    "",
    `Pattern: ${item.pattern}`,
    item.timing ? `Timing: ${item.timing}` : "",
    "",
    lessonShareUrl(item.id),
  ].filter(Boolean)
  return lines.join("\n")
}

export function xIntentUrl(text: string) {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
}

export function openShareOnX(item: Launch) {
  window.open(xIntentUrl(buildLessonShareText(item)), "_blank", "noopener,noreferrer")
}

export async function copyLessonLink(id: string) {
  const url = lessonShareUrl(id)
  await navigator.clipboard.writeText(url)
  return url
}

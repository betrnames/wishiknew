export type SafetyCategory =
  | "hate_speech"
  | "harassment"
  | "personal_attack"
  | "identifiable_person"
  | "self_harm"
  | "dangerous_medical"
  | "violent_intent"
  | "extremist"

export type SafetyResult =
  | { safe: true }
  | {
      safe: false
      categories: SafetyCategory[]
      message: string
      alternative: string
    }

const SUPPORT_MESSAGE =
  "This regret isn’t safe to turn into a meme, but here’s a supportive or neutral alternative."

/** Word-boundary helpers — keep patterns specific to reduce false positives on ordinary regrets. */
const PATTERNS: Array<{ category: SafetyCategory; re: RegExp }> = [
  // Hate / slurs / group attacks (non-exhaustive; blocks clear hostility)
  {
    category: "hate_speech",
    re: /\b(nigg(?:a|er)s?|fag(?:got)?s?|trann(?:y|ies)|kikes?|spics?|chinks?|retards?|rape\s*ape|gas\s*the|kill\s+all\s+\w+|death\s+to\s+(all\s+)?(jews|muslims|gays|blacks|whites|immigrants))\b/i,
  },
  {
    category: "hate_speech",
    re: /\b(white\s*power|heil\s*hitler|holocaust\s*denial|ethnic\s*cleansing)\b/i,
  },
  // Harassment / threats toward a person
  {
    category: "harassment",
    re: /\b(doxx?(?:ing|ed)?|swat(?:ting|ted)?|stalk(?:ing|ed|er)?|blackmail|revenge\s*porn|leak\s+(?:their|her|his)\s+(?:nudes?|address|phone))\b/i,
  },
  {
    category: "harassment",
    re: /\b(i('ll| will)\s+(ruin|destroy|expose)\s+(you|them|her|him)|go\s+kill\s+yourself|kys)\b/i,
  },
  // Personal attacks (targeted insults)
  {
    category: "personal_attack",
    re: /\b(you('re| are)\s+(a\s+)?(worthless|pathetic|piece\s+of\s+shit|idiot|stupid\s+bitch)|fuck\s+you,?\s+\w+|i\s+hate\s+(my\s+)?(boss|coworker|ex|wife|husband|girlfriend|boyfriend)\s+\w{2,}\b)/i,
  },
  // Self-harm / suicide
  {
    category: "self_harm",
    re: /\b(kill\s+myself|kms|suicid(?:e|al)|end\s+my\s+life|want\s+to\s+die|self[-\s]?harm|cut(?:ting)?\s+myself|overdose\s+on purpose|hang\s+myself)\b/i,
  },
  // Dangerous medical advice
  {
    category: "dangerous_medical",
    re: /\b(bleach\s+(?:cure|covid)|inject\s+(?:bleach|disinfectant)|drink\s+bleach|stop\s+(?:taking\s+)?(?:insulin|chemo|hiv\s+meds)|diy\s+(?:abortion|chemotherapy)|raw\s+milk\s+cures?\s+cancer)\b/i,
  },
  // Violent intent
  {
    category: "violent_intent",
    re: /\b(i('m| am)\s+going\s+to\s+(kill|shoot|stab|murder|bomb)|planning\s+(?:a\s+)?(massacre|school\s*shooting|terror\s*attack)|build\s+(?:a\s+)?bomb|make\s+(?:a\s+)?pipe\s*bomb)\b/i,
  },
  {
    category: "violent_intent",
    re: /\b(shoot\s+up\s+(?:the\s+)?(?:school|office|mall)|commit\s+(?:a\s+)?massacre)\b/i,
  },
  // Extremist
  {
    category: "extremist",
    re: /\b(join\s+(?:isis|al[-\s]?qaeda)|jihad\s+against|accelerate\s+the\s+race\s+war|great\s+replacement\s+is\s+real\s+so\s+we\s+must)\b/i,
  },
]

/** Detect likely real-person targeting: "I hate/regret [First Last]" style with capitalized names. */
function looksLikeIdentifiablePerson(text: string): boolean {
  // Explicit "named" cues
  if (/\b(my\s+(boss|coworker|teacher|professor|neighbor|landlord)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/.test(text)) {
    return true
  }
  // "@handle" or phone-ish targeting
  if (/@[a-z0-9_]{3,}/i.test(text) && /\b(expose|ruin|dox|harass|attack|hate)\b/i.test(text)) {
    return true
  }
  // Full name + hostile verb
  if (
    /\b[A-Z][a-z]{1,20}\s+[A-Z][a-z]{1,20}\b/.test(text) &&
    /\b(hate|kill|hurt|attack|ruin|expose|stupid|idiot|bitch|asshole)\b/i.test(text)
  ) {
    return true
  }
  return false
}

function generalizeRegret(original: string, categories: SafetyCategory[]): string {
  if (categories.includes("self_harm")) {
    return "I wish I knew how heavy things felt lately — and that asking for help is allowed."
  }
  if (categories.includes("violent_intent") || categories.includes("extremist")) {
    return "I wish I knew how to cool down when anger gets loud, instead of feeding it."
  }
  if (categories.includes("dangerous_medical")) {
    return "I wish I knew to check with a real clinician before trusting random health tips online."
  }
  if (
    categories.includes("hate_speech") ||
    categories.includes("harassment") ||
    categories.includes("personal_attack") ||
    categories.includes("identifiable_person")
  ) {
    return "I wish I knew how to vent without aiming it at a real person — keep the lesson, drop the target."
  }
  const trimmed = original.trim().slice(0, 120)
  if (trimmed.length > 20) {
    return "I wish I knew that some stories stay private — and that a gentler version still counts."
  }
  return "I wish I knew tomorrow could be a quieter rewrite of today."
}

/**
 * Analyze regret text before meme generation.
 * Blocks hate, harassment, attacks, real names/IDs, self-harm, dangerous medical,
 * violent intent, and extremist content.
 */
export function analyzeRegretSafety(regret: string): SafetyResult {
  const text = regret.trim()
  if (!text) return { safe: true }

  const categories = new Set<SafetyCategory>()

  for (const { category, re } of PATTERNS) {
    if (re.test(text)) categories.add(category)
  }

  if (looksLikeIdentifiablePerson(text)) {
    categories.add("identifiable_person")
  }

  if (categories.size === 0) return { safe: true }

  const list = [...categories]
  return {
    safe: false,
    categories: list,
    message: SUPPORT_MESSAGE,
    alternative: generalizeRegret(text, list),
  }
}

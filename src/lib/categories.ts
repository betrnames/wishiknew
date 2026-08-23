export type CategoryId =
  | "food"
  | "work"
  | "money"
  | "tech"
  | "time"
  | "social"
  | "health"
  | "relationships"
  | "travel"
  | "learning"

export type Category = {
  id: CategoryId
  label: string
  /** Shown in the compact chip row (first 6). Rest behind “More”. */
  featured?: boolean
  examples: string[]
}

export const CATEGORIES: Category[] = [
  {
    id: "food",
    label: "Food",
    featured: true,
    examples: [
      "I wish I knew avocado expires in 12 seconds",
      "I microwaved fish at work",
      "I bought expensive meal kits and cooked twice",
    ],
  },
  {
    id: "work",
    label: "Work",
    featured: true,
    examples: [
      "I replied-all to the whole company",
      "I said yes to a meeting that should’ve been an email",
      "I stayed late so it would look like I cared",
    ],
  },
  {
    id: "money",
    label: "Money",
    featured: true,
    examples: [
      "I bought a planner instead of changing my life",
      "I signed up for ‘one month free’ and paid for a year",
      "I trusted a limited drop I didn’t need",
    ],
  },
  {
    id: "tech",
    label: "Tech",
    featured: true,
    examples: [
      "I opened my camera by accident in a meeting",
      "I trusted the ‘one more episode’ button",
      "I used the same password on everything",
    ],
  },
  {
    id: "time",
    label: "Time",
    featured: true,
    examples: [
      "I said I was five minutes away while still in bed",
      "I stacked meetings with zero buffer",
      "I thought packing would take ten minutes",
    ],
  },
  {
    id: "social",
    label: "Social",
    featured: true,
    examples: [
      "I said yes to plans and immediately regretted it",
      "I went out when I should’ve stayed home sick",
      "I over-explained a simple no",
    ],
  },
  {
    id: "health",
    label: "Health",
    examples: [
      "I hit snooze until the morning was gone",
      "I saved ‘starting Monday’ for the 40th time",
      "I drank coffee at 4pm and wondered why I couldn’t sleep",
    ],
  },
  {
    id: "relationships",
    label: "Relationships",
    examples: [
      "I sent the late-night text I should’ve slept on",
      "I assumed instead of asking",
      "I waited too long to say the hard thing",
    ],
  },
  {
    id: "travel",
    label: "Travel",
    examples: [
      "I checked my passport the morning of the flight",
      "I underestimated airport security again",
      "I thought I could DIY the thing that needed a pro",
    ],
  },
  {
    id: "learning",
    label: "Learning",
    examples: [
      "I bought the course and never opened it",
      "I bought more gear instead of practicing",
      "I waited to feel ready before starting",
    ],
  },
]

export const FEATURED_CATEGORY_IDS = CATEGORIES.filter((c) => c.featured).map((c) => c.id)

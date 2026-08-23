export type LaunchCategory =
  | "domains"
  | "ai"
  | "saas"
  | "consumer"
  | "devtools"
  | "marketplaces"

/** Editorial heat — not live metrics. Used only for sort / UI label. */
export type Heat = "blazing" | "hot" | "warm" | "steady"

export type Launch = {
  id: string
  name: string
  /** Real product lander (swap for your affiliate URL later when affiliate is true) */
  url?: string
  /** Product has a known affiliate/partner program — Visit shows “Affiliate” tag */
  affiliate?: boolean
  oneLiner: string
  whyItWorked: string
  wishIKnew: string
  /** Named pattern — steal this, don’t clone the exact site */
  pattern: string
  /** Concrete actions if you were shipping this week */
  shipThisWeek: [string, string, string]
  category: LaunchCategory
  timing: string
  status: "exploded" | "rising" | "pattern"
  heat: Heat
}

export const HEAT_RANK: Record<Heat, number> = {
  blazing: 4,
  hot: 3,
  warm: 2,
  steady: 1,
}

export const LAUNCH_CATEGORIES: Array<{ id: LaunchCategory | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "domains", label: "Domains" },
  { id: "ai", label: "AI" },
  { id: "saas", label: "SaaS" },
  { id: "consumer", label: "Consumer" },
  { id: "devtools", label: "Devtools" },
  { id: "marketplaces", label: "Marketplaces" },
]

/**
 * Indie-scale feed — projects a solo builder could have shipped (or cloned the pattern of).
 * No Cursor / Lovable / ElevenLabs-class unicorns. Heat is editorial among peers.
 */
export const LAUNCHES: Launch[] = [
  {
    id: "outbid",
    name: "outbid.lol",
    url: "https://outbid.lol",
    oneLiner:
      "Pay-to-rank public leaderboard: bid dollars, rank is the bid — nothing else.",
    whyItWorked:
      "Jonathan Wilke (@jonathan_wilke) vibe-coded it as a fun project and went live on X Aug 19, 2026 at 11:08 PM. His own updates: ~$1.4k / 4.5k visitors in ~12h → ~$21.5k / 200k+ visitors in ~24h (plus a $100k buy offer he didn’t take) → ~$42k / 1M+ visitors at ~36h → ~$132k revenue, 867 listings, $14k #1 bid by day 3. No ads, no API keys, no rev share — FOMO leaderboard was the product. Copycats flooded .lol within hours.",
    wishIKnew:
      "I wish I knew a transparent money mechanic + a meme domain could print six figures in a weekend — not six months. Timing and the joke *were* the product.",
    pattern: "Joke domain = MVP",
    shipThisWeek: [
      "Register a one-joke .lol / .wtf that names the pain in two words.",
      "Ship a one-screen tool that matches the joke — nothing else.",
      "Post a 15-second demo on X the same day the domain resolves.",
    ],
    category: "domains",
    timing: "~$132k by day 3 (Aug 2026)",
    status: "exploded",
    heat: "blazing",
  },
  {
    id: "trustmrr",
    name: "TrustMRR",
    url: "https://trustmrr.com",
    oneLiner:
      "Verified indie revenue leaderboard — sold out sponsor spots in days.",
    whyItWorked:
      "Marc Lou (@marclou) shipped TrustMRR as a ‘show real Stripe MRR’ board so fake screenshots couldn’t win the timeline. He posted ~$0 → ~$18k MRR in 5 days from selling limited ad/sponsor spots (20/20 filled). Same family as outbid: scarce public status + builders with cards + X as the launch channel. Later grew into a verified-revenue marketplace.",
    wishIKnew:
      "I wish I knew ‘prove the number’ was a product people would pay to sit next to — sell the scarce row, not another analytics dashboard.",
    pattern: "Sell scarce status on a public board",
    shipThisWeek: [
      "Pick one number founders already screenshot (MRR, users, ARR).",
      "Ship a public board with 10–20 paid spots and a live counter.",
      "Launch on X the same day; raise the price when spots thin out.",
    ],
    category: "saas",
    timing: "$0 → ~$18k MRR in 5 days",
    status: "exploded",
    heat: "blazing",
  },
  {
    id: "fly-pieter",
    name: "fly.pieter.com",
    url: "https://fly.pieter.com",
    oneLiner:
      "AI-coded browser flight sim — monetized with in-game sponsor ads, not subscriptions.",
    whyItWorked:
      "Pieter Levels (@levelsio) vibe-coded a free multiplayer flight game and sold billboard/sponsor slots inside the world. He publicly posted $0 → $1M ARR run-rate ($87k MRR) in 17 days (Mar 2025), with hundreds of thousands of players. Attention was the inventory; brands bought the meme. Same lesson as outbid: charge for visibility where eyes already are.",
    wishIKnew:
      "I wish I knew the product could be a playground and the business could be selling the billboards — monetize the crowd, not the cockpit.",
    pattern: "Attention is the inventory",
    shipThisWeek: [
      "Ship something free people will actually play/share in public.",
      "Sell 5–10 scarce sponsor placements before you add a paywall.",
      "Post the revenue counter live — the ledger is part of the marketing.",
    ],
    category: "consumer",
    timing: "$0 → $1M ARR run-rate in 17 days",
    status: "exploded",
    heat: "blazing",
  },
  {
    id: "photoai",
    name: "Photo AI",
    url: "https://photoai.com",
    affiliate: true,
    oneLiner:
      "Upload selfies → paid AI photoshoots. Solo founder, Stripe screenshots, six-figure MRR.",
    whyItWorked:
      "Pieter Levels launched Photo AI Feb 2023 (Replicate / DreamBooth-style fine-tunes). First week ~$5.4k; bought photoai.com for $40k when MRR justified it; later public figures often cited in the ~$100k–$160k+/mo range with high margins. Before/after screenshots + build-in-public beat a polished studio product. Well-known ~30% affiliate program.",
    wishIKnew:
      "I wish I knew a before/after screenshot SaaS was a weeks-long sprint with charge-on-first-run — not a six-month vision deck.",
    pattern: "Before/after screenshot SaaS",
    shipThisWeek: [
      "Find a before→after visual people already understand.",
      "Wire Stripe + one model API; charge on first run.",
      "Post 5 transformation pairs with the checkout link in the first reply.",
    ],
    category: "ai",
    timing: "Image-gen boom (2023)",
    status: "exploded",
    heat: "blazing",
  },
  {
    id: "headshotpro",
    name: "HeadshotPro",
    url: "https://www.headshotpro.com",
    affiliate: true,
    oneLiner:
      "Professional AI headshots for LinkedIn/teams — boring job, loud revenue.",
    whyItWorked:
      "Danny Postma shipped HeadshotPro in early 2023 after novelty AI avatars proved less durable than ‘I need a LinkedIn photo.’ Public reporting often cites ~$100k ARR inside ~14 days, later ~$300k/mo class with SEO + a Rewardful affiliate program contributing meaningful revenue. Narrow paid job beat the art toy.",
    wishIKnew:
      "I wish I knew the money was in the dull professional use case — and that affiliates + SEO would outlast the launch spike.",
    pattern: "Narrow paid job > novelty",
    shipThisWeek: [
      "Pick one purchase-ready search phrase (e.g. ‘AI headshots for teams’).",
      "Price a one-time pack; ship checkout before polish.",
      "Open a simple affiliate cut so creators write the SEO for you.",
    ],
    category: "ai",
    timing: "~$100k ARR in ~14 days (2023)",
    status: "exploded",
    heat: "blazing",
  },
  {
    id: "taaft",
    name: "There's An AI For That",
    url: "https://theresanaiforthat.com",
    oneLiner:
      "Task-based AI tools directory that owned discovery while Google was still empty.",
    whyItWorked:
      "Andrei (Bucharest, indie) launched TAAFT Dec 2, 2022 after cataloging Stable Diffusion tools in Airtable. Hit ~100k visits in week one; grew into a multi-million monthly visitor directory + huge newsletter by selling launches, ads, and sponsorships. Classic ‘own the map’ while a category explodes.",
    wishIKnew:
      "I wish I knew the gold rush needed a map on day one — directories print attention when a new category has no Google page-one yet.",
    pattern: "Own the map early",
    shipThisWeek: [
      "Pick a niche with messy discovery (new protocol, tool wave, local trade).",
      "Manually list 25 honest entries with one blurb each by Friday.",
      "Post ‘I mapped X — what am I missing?’ where that niche already hangs out.",
    ],
    category: "marketplaces",
    timing: "ChatGPT / SD tool flood",
    status: "exploded",
    heat: "blazing",
  },
  {
    id: "remoteok",
    name: "Remote OK",
    url: "https://remoteok.com",
    oneLiner:
      "Remote job board built in a day — later famous as a single index.php printing serious revenue.",
    whyItWorked:
      "Pieter Levels shipped Remote OK in 2015 as a tiny follow-on to Nomad List: companies pay to post, workers browse free. Deliberately minimal (self-serve paid posts). Peak lore includes a single-month ~$101k stretch and years of bootstrapped job-board cash without a sales team. Speed + clear buyer (HR with a card) beat polish.",
    wishIKnew:
      "I wish I knew ‘I hit this need Tuesday and shipped Friday’ beats another six-month platform vision — especially when the buyer already has budget.",
    pattern: "Tuesday bug → Friday ship",
    shipThisWeek: [
      "Write down the last chore you cursed at twice.",
      "Ship a one-page or single-file fix that only does that chore.",
      "Charge from day one — even if the price feels awkwardly simple.",
    ],
    category: "marketplaces",
    timing: "Pre-remote-mainstream (2015)",
    status: "exploded",
    heat: "hot",
  },
  {
    id: "carrd",
    name: "Carrd",
    url: "https://carrd.co",
    oneLiner:
      "Dead-simple one-page sites. Freemium + ‘Made with Carrd’ as the loop.",
    whyItWorked:
      "AJ bootstrapped Carrd into a ~$1M ARR-class indie business with ruthless simplicity and cheap Pro (~$19/yr lore). Free sites carrying ‘Made with Carrd’ created distribution without a big affiliate org. One job (a single page) done faster than Webflow or custom code.",
    wishIKnew:
      "I wish I knew a constrained canvas (one page) plus a tiny paid upgrade could outgrow feature-bloated builders for the ‘I just need a link’ job.",
    pattern: "Constrain the canvas",
    shipThisWeek: [
      "Cut your product to one obvious output (one page, one file, one report).",
      "Put a tasteful ‘made with’ link on the free tier.",
      "Price the upgrade so low it feels silly to stay free.",
    ],
    category: "consumer",
    timing: "Link-in-bio / one-pager era",
    status: "exploded",
    heat: "hot",
  },
  {
    id: "stan",
    name: "Stan Store",
    url: "https://stan.store",
    affiliate: true,
    oneLiner:
      "Store-in-bio for creators — sell courses, downloads, and calls from one link.",
    whyItWorked:
      "John Hu + Vitalii Dodonov built Stan so creators could monetize TikTok/IG followings without duct-taping five tools. Bootstrapped growth; public figures later cited eight-figure ARR. Aggressive affiliate economics (often cited ~20% recurring) turned creators into a sales force. Platform policy gaps (what you can’t link on TikTok) created the job.",
    wishIKnew:
      "I wish I knew every closed social platform creates a ‘missing checkout’ product — watch the policy, then own the storefront.",
    pattern: "Platform policy gap",
    shipThisWeek: [
      "List one platform rule that blocks a clear user job (link bans, payments, discovery).",
      "Sketch the thinnest page that fixes only that job.",
      "DM 10 creators who hit that wall and ask if they’d pay $29/mo.",
    ],
    category: "consumer",
    timing: "Creator store-in-bio wave",
    status: "exploded",
    heat: "hot",
  },
  {
    id: "beehiiv",
    name: "beehiiv",
    url: "https://www.beehiiv.com",
    affiliate: true,
    oneLiner:
      "‘Morning Brew in a box’ — newsletter growth + monetization as SaaS.",
    whyItWorked:
      "Tyler Denk (Morning Brew’s second employee) + Ben Hargett & Jake Hurd productized the referral/CMS/ad stack that helped Morning Brew scale before its ~$75M Business Insider sale. Flat SaaS fee (not Substack’s cut); Ad Network + Boosts. Still the clearest ‘I lived the playbook, then sold the machine’ indie-to-scale story. Strong affiliate (~50% of subscription for 12 months).",
    wishIKnew:
      "I wish I knew the playbook I already lived inside a media company was the product — package the machine, don’t just write another newsletter.",
    pattern: "Productize the playbook you lived",
    shipThisWeek: [
      "Write down the internal system you already ran that others DM you about.",
      "Sell that as software or a paid template — not as consulting hours.",
      "Lead with ‘I scaled X with this’ proof, not feature lists.",
    ],
    category: "saas",
    timing: "Creator newsletter boom",
    status: "exploded",
    heat: "hot",
  },
  {
    id: "interiorai",
    name: "Interior AI",
    url: "https://interiorai.com",
    affiliate: true,
    oneLiner:
      "Upload a room photo → AI redesign. Same Levels playbook as Photo AI, new vertical.",
    whyItWorked:
      "Interior AI applied the Photo AI formula to home staging: obvious before/after, paid generations, build-in-public on X. Repeatedly showed up as a multi-tens-of-thousands MRR line item in Levels’ portfolio screenshots. Same ~30% affiliate rails. Proof the pattern travels farther than the brand.",
    wishIKnew:
      "I wish I knew one winning screenshot SaaS could be forked into the next vertical in days — reuse checkout, change the prompt.",
    pattern: "Clone your own winning pattern",
    shipThisWeek: [
      "List 3 verticals that share your last product’s before/after shape.",
      "Ship the thinnest clone lander for the hungriest vertical.",
      "Reuse checkout + affiliate rails — only change prompts and copy.",
    ],
    category: "ai",
    timing: "Post–Photo AI verticals",
    status: "rising",
    heat: "warm",
  },
  {
    id: "waitlist-first",
    name: "Waitlist-first landers",
    oneLiner:
      "Collect emails (and sometimes cards) before the product exists.",
    whyItWorked:
      "Indie Hackers lore is full of brutal one-pagers that out-earned half-built dashboards: proof of demand, FOMO, and a kill switch if nobody signs up. Low build cost, high signal. The pattern isn’t one brand — it’s the discipline.",
    wishIKnew:
      "I wish I knew a sharp lander + waitlist beats a half-built app for months — and that ‘fewer than 10 emails in 7 days’ is permission to kill the idea.",
    pattern: "Sell before you build",
    shipThisWeek: [
      "Write a one-sentence offer and a price on a single lander.",
      "Put email capture above the fold — no app yet.",
      "If fewer than 10 emails in 7 days, kill or rewrite — don’t code.",
    ],
    category: "saas",
    timing: "Evergreen indie playbook",
    status: "pattern",
    heat: "warm",
  },
  {
    id: "kit",
    name: "Kit (ConvertKit)",
    url: "https://kit.com",
    affiliate: true,
    oneLiner:
      "Creator email that beat ‘Mailchimp for everyone’ by obsessing over writers.",
    whyItWorked:
      "Nathan Barry’s ConvertKit (rebranded Kit) won creator email with creator-first features and a loud affiliate/partner program. Positioning against generic ESPs + creator case studies compounded. Proof that niche beachheads beat horizontal ‘email for all’ — still a core IH distribution lesson even as the company scaled.",
    wishIKnew:
      "I wish I knew picking creators (not ‘SMBs’) as the beachhead made every blog and YouTube tutorial free distribution.",
    pattern: "Niche the horizontal tool",
    shipThisWeek: [
      "Rewrite your homepage for one specific creator job.",
      "Recruit 10 creators into an affiliate tier before ads.",
      "Publish their wins as your case studies — they write the SEO.",
    ],
    category: "saas",
    timing: "Creator economy email",
    status: "rising",
    heat: "steady",
  },
]

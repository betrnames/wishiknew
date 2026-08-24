import fs from "fs"

const t = fs.readFileSync("src/lib/launches.ts", "utf8")
const block = t.slice(t.indexOf("export const LAUNCHES"))
const ids = [...block.matchAll(/^\s+id: "([^"]+)"/gm)].map((m) => m[1])
const urls = [
  "https://wishiknew.lol/",
  ...ids.map((id) => `https://wishiknew.lol/?l=${id}`),
  "https://wishiknew.lol/llms.txt",
]
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u}</loc>
    <changefreq>weekly</changefreq>
  </url>`,
  )
  .join("\n")}
</urlset>
`
fs.writeFileSync("public/sitemap.xml", xml)
console.log(`sitemap: ${ids.join(", ")}`)

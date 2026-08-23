# Draft queue (approve before publish)

Cron / manual scans drop candidate missed boats here as JSON.

**Do not auto-publish to the live feed.** Review → copy into `src/lib/launches.ts` → ship.

Example filename: `2026-08-23-candidate.json`

```json
{
  "name": "",
  "url": "",
  "oneLiner": "",
  "source": "x|reddit",
  "notes": "",
  "suggestedPattern": "",
  "heat": "warm"
}
```

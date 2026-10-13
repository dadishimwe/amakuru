# Amakuru Motorsport: practical next features

The approved homepage stays the front door. The next step should make Amakuru useful between race weekends without trying to copy Formula 1's official app or adding infrastructure that creates ongoing costs.

## What to build first

### 1. A Season Hub

Add a clearly named **Season** destination from the main navigation. Its first version can bring together the next Grand Prix, session times shown in Kigali time, the latest race result, and driver/constructor standings. A “last updated” timestamp and links to the underlying sources should be visible. The page should remain useful if its data provider is unavailable: show the last good update or a short status message rather than a blank screen.

For a personal, non-commercial site, Jolpica-F1 offers an Ergast-compatible API and schedules and standings are available from the live API. Its published terms limit API use to non-commercial use and license the data under CC BY-NC-SA 4.0; commercial use requires contacting the maintainers. The service also warns that uptime and correctness are not guaranteed. The project should cache responses, attribute the source, and avoid making the homepage depend on it. [Jolpica API docs](https://api.jolpi.ca/docs/) · [Jolpica terms](https://github.com/jolpica/jolpica-f1/blob/main/TERMS.md)

If Amakuru may carry ads, sponsorships, paid subscriptions, or otherwise serve a commercial purpose, do not ship Jolpica-derived tables until its maintainers confirm the intended use. A season page can still be built using editorial copy and links to official results instead.

### 2. An evergreen F1 guide, with a Rwanda lens

Publish short, source-linked explainers as static pages in the GitHub repo: “How a Grand Prix weekend works,” “What an undercut is,” “How championship points work,” “What the 10-year Rwanda agreement says,” and “What is still unknown about the circuit and race date.” This is a strong fit for the site: pages are fast, do not need a database or a paid feed, and can be improved through ordinary GitHub edits. Keep confirmed facts separate from analysis and rumors.

### 3. A Road to Rwanda story desk

Give original reporting and explainers a visible home under a **Stories** or **Road to Rwanda** destination. A small number of useful pieces is better than an auto-generated news feed. Every story should identify its sources and label reported plans, official confirmations, and open questions distinctly.

## What to defer

- **Live timing and telemetry:** OpenF1 says historical data from 2023 onward is free, while real-time access requires a paid subscription. Live race dashboards also need careful rate management and clear “data delayed/unofficial” labels. Start with historical session explainers only if its terms suit the site's intended use. [OpenF1 docs](https://openf1.org/docs/)
- **Accounts, private leagues, and push alerts:** These need identity, storage, notification and abuse-handling decisions. They add privacy and maintenance work that is not justified before Amakuru has a returning audience.
- **Fantasy scoring and predictions:** A lightweight prediction feature could be a later community experiment, but persistent leaderboards require a database and moderation rules. For now, link fans to official F1 Fantasy rather than recreating it.
- **Video and onboard content:** Link to authorized official material rather than copying or rehosting clips without rights.

## Keep the free setup realistic

Vercel describes Hobby as a free plan for personal projects and small-scale applications, but its terms restrict the plan to personal or non-commercial use. The plan includes up to 50,000 Web Analytics events per month and one million function invocations, with pauses after some limits are exceeded. Before adding sponsorships, ads, paid products, or a business purpose, review whether Hobby remains appropriate. [Vercel Hobby plan](https://vercel.com/docs/plans/hobby) · [Vercel terms](https://vercel.com/legal/terms)

For the first product release, prefer statically generated article pages and a single cached season-data request over frequent polling. Avoid a database until users actually need accounts, saved teams, or leagues. Google Analytics 4 loads only after the visitor opts in, and only on the Amakuru domain; local and Vercel preview traffic are excluded. The existing Vercel Web Analytics remains active and is described separately in the consent notice; Vercel says it uses no third-party cookies and reports aggregated analytics. [Vercel Analytics privacy](https://vercel.com/docs/analytics/privacy-policy)

## Easter eggs that stay out of the way

One small Easter egg is now in the redesign: type **KIGALI** anywhere outside a text field, or tap the Amakuru mark six times quickly. A brief, dismissible note appears: “Dadi's lights are on. Kigali, see you on the grid.” It does not change the layout or persist a visitor profile.

Other ideas to consider later:

- **Dadi's Pit Wall:** a tiny note about why Dadi started the site, unlocked by clicking the “AM / 001” story stamp a few times. Add only when Dadi supplies the personal detail to reveal.
- **Start-light salute:** a quick, optional red-to-green light animation when the brand mark is activated, with reduced-motion support and no sound.
- **Kigali clue trail:** a few subtle Rwanda references in editorial copy that reward careful readers, ending at a short note about Amakuru's local perspective.
- **Favorite-driver signal:** a small hidden color/detail tied to Dadi's favorite driver or team. This should wait until Dadi chooses the reference; do not guess it.

Keep Easter eggs local to the browser, keyboard-accessible where possible, short-lived, and silent. They should never gate content, start automatically, interfere with navigation, or require personal data.

## Suggested sequence

1. **Delivered in this PR:** add opt-in Google Analytics and the discreet Easter egg.
2. Confirm whether Amakuru is and will remain personal/non-commercial.
3. If yes, build a cached Season Hub using an appropriately attributed public data source. If not, use official-source links and editorial updates until data rights and hosting are settled.
4. Add the evergreen guide and Road to Rwanda stories as static pages.
5. Consider predictions or accounts only after traffic and reader feedback show a real need.

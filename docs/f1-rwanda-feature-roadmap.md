# Amakuru Motorsport: practical next features

The approved homepage remains the front door. The product now adds useful destinations for fans between race weekends without copying Formula 1's official app or adding infrastructure that creates ongoing costs.

## Delivered in the current feature phase

### Season Hub

The **Season** destination brings together the next Grand Prix, upcoming rounds, the latest classified result, and the top ten driver and constructor standings. Race times are shown in Kigali time. Data is cached for six hours, the page degrades gracefully if the provider is unavailable, and the source/license note is visible beside the data.

The owner confirmed Amakuru will remain **personal and non-commercial** for this phase. The hub uses the Jolpica-F1 Ergast-compatible API under its non-commercial terms; data is licensed CC BY-NC-SA 4.0. The API asks clients to cache data and limits unauthenticated use to four requests per second and 500 per hour. See [Jolpica API docs](https://api.jolpi.ca/docs/), [terms](https://github.com/jolpica/jolpica-f1/blob/main/TERMS.md), and [rate limits](https://github.com/jolpica/jolpica-f1/blob/main/docs/rate_limits.md).

If Amakuru later carries ads, sponsorships, paid subscriptions, or another commercial purpose, do not continue serving Jolpica-derived tables without written permission or a different source. Review Vercel Hobby eligibility at the same time.

### Rwanda F1 guide and search foundations

The static **Rwanda F1 Grand Prix** guide separates confirmed FIA details from unannounced dates and circuit milestones. Route-specific titles, descriptions, sharing previews, canonical URLs, structured data, sitemap entries, and clear internal navigation support search discovery. The apex domain redirects to `www`, so canonical links point to the final public host; Vercel preview deployments are marked noindex and blocked in `robots.txt`.

### Consent-based Google Analytics

Google Analytics remains **off until a visitor explicitly opts in**. After acceptance, Amakuru sends page views as the visitor moves between pages and retains standard campaign parameters and a sanitized referrer for acquisition context. Preview builds stay outside the production property. Vercel Analytics remains separate and is described in the privacy notice.

Google's Realtime report is the place to check whether a newly opted-in visit and its page views are arriving. Use the active-user, page-view, and Events cards for immediate checks; standard acquisition reports can take longer to populate. Google's [Realtime report guidance](https://support.google.com/analytics/answer/9271392?hl=en) describes the report's current activity window and available details.

## Good next steps

- Add a small **Road to Rwanda** story desk with original, sourced explainers. Label official announcements, reporting, and open questions clearly.
- Publish evergreen guides such as “How a Grand Prix weekend works,” “What is an undercut?” and “How championship points work.”
- Add a race-weekend explainer only if the data feed and its license support the intended use. Avoid live telemetry on the free setup.

## What to defer

- **Live timing and telemetry:** OpenF1 says historical data from 2023 onward is free, while real-time access requires a paid subscription. Live dashboards also need rate management and clear “delayed/unofficial” labels. [OpenF1 docs](https://openf1.org/docs/)
- **Accounts, private leagues, and push alerts:** These need identity, storage, notification and abuse-handling decisions. They add privacy and maintenance work before there is evidence of a returning audience.
- **Fantasy scoring and predictions:** A lightweight prediction feature could be a later community experiment, but persistent leaderboards require a database and moderation rules. For now, link fans to official F1 Fantasy.
- **Video and onboard content:** Link to authorized official material rather than copying or rehosting clips without rights.

## Keep the free setup realistic

Vercel describes Hobby as a free plan for personal, non-commercial use. It includes usage allowances for analytics and function invocations, and some limit excesses can pause projects. Before adding sponsorships, ads, paid products, or a business purpose, review whether Hobby remains appropriate. [Vercel Hobby plan](https://vercel.com/docs/plans/hobby) · [Vercel terms](https://vercel.com/legal/terms)

Avoid a database until readers need accounts, saved teams, or leagues. Prefer static article pages and cached data requests. Keep all analytics opt-in, keep Easter eggs local and silent, and never make them gate content or collect personal details.

## Easter eggs that stay out of the way

The existing egg is quiet: type **KIGALI** outside text fields, or tap the Amakuru mark six times quickly, to reveal a short dismissible note: “Dadi's lights are on. Kigali, see you on the grid.” It does not change the layout or persist a visitor profile.

Other ideas for later:

- **Dadi's Pit Wall:** a tiny personal note unlocked by clicking the “AM / 001” story stamp a few times. Add it only after Dadi supplies the detail to reveal.
- **Start-light salute:** a brief optional red-to-green animation when the brand mark is activated, with reduced-motion support and no sound.
- **Kigali clue trail:** a few small Rwanda references in editorial copy that reward careful readers, ending at a note about Amakuru's local perspective.
- **Favorite-driver signal:** a hidden color or detail tied to Dadi's chosen driver or team; do not guess the reference.

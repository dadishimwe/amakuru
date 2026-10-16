# Amakuru Motorsport: practical next features

The approved homepage remains the front door. The product adds useful destinations for fans between race weekends without copying Formula 1's official app or adding infrastructure that creates ongoing costs.

## Delivered: Season Hub and Rwanda foundations

### Season Hub

The **Season** destination brings together the next Grand Prix, the full calendar, the latest podium, and separate pages for classified results, the full driver and constructor standings, every driver, and every team. Race times are shown in Kigali time. Data is cached for six hours. If the provider is unavailable, those pages say so instead of inventing a table, and the source/license note stays visible beside the data.

The owner confirmed Amakuru will remain **personal and non-commercial** for this phase. The hub uses the Jolpica-F1 Ergast-compatible API under its non-commercial terms; data is licensed CC BY-NC-SA 4.0. The API asks clients to cache data and limits unauthenticated use to four requests per second and 500 per hour. See [Jolpica API docs](https://api.jolpi.ca/docs/), [terms](https://github.com/jolpica/jolpica-f1/blob/main/TERMS.md), and [rate limits](https://github.com/jolpica/jolpica-f1/blob/main/docs/rate_limits.md).

If Amakuru later carries ads, sponsorships, paid subscriptions, or another commercial purpose, do not continue serving Jolpica-derived tables without written permission or a different source. Review Vercel Hobby eligibility at the same time.

### Rwanda F1 guide and search foundations

The static **Rwanda F1 Grand Prix** guide separates confirmed FIA details from unannounced dates and circuit milestones. Route-specific titles, descriptions, sharing previews, canonical URLs, structured data, sitemap entries, and clear internal navigation support search discovery. The apex domain redirects to `www`, so canonical links point to the final public host; Vercel preview deployments are marked noindex and blocked in `robots.txt`.

### Consent-based Google Analytics

On the live hosts `amakuru.rw` and `www.amakuru.rw`, the first visit is counted as soon as someone arrives. Schedule, results, standings, drivers, teams, and each profile keep sending a page view even if the visitor chooses No thanks. Allowing Google Analytics covers the other pages after that. The popup stays in place for that choice. Campaign parameters and a sanitized referrer are kept for acquisition context. Preview builds stay outside the production property. Vercel Analytics remains separate and is described in the privacy notice.

Google's Realtime report is the place to check whether an arrival and its championship page views are coming in. Use the active-user, page-view, and Events cards for immediate checks; standard acquisition reports can take longer to populate. Google's [Realtime report guidance](https://support.google.com/analytics/answer/9271392?hl=en) describes the report's current activity window and available details.

## Delivered: news, visual identity, circuits and technical notes

- **F1 news desk** (`/news`) combines headline/link items from BBC Sport and Motorsport.com feeds. It does not republish article text; publisher names and direct story links stay visible. BBC thumbnails are used only when provided by its RSS feed, with BBC attribution. The homepage shows one restrained image at most, and the Rwanda desk filters relevant Rwanda/Africa headlines. RSS and page output are cached for 15 minutes.
- **Driver and team directories** use current season identities, clean licensed portrait imagery where available, quiet team-colour accents, and original Amakuru editorial crests (letterforms in team colours) rather than copied team logos. Wikimedia Commons files are shown only when their specific licence is verified; file, artist and licence credits appear on the page. Missing or unsupported images use an accessible fallback.
- **Circuit profiles** (`/circuits`) link from the calendar and results, show a credited track-layout or venue image when a reusable file is available, and avoid inventing lap length, corner count or layout details when the source does not provide them.
- **2026 technical notes** (`/technology`) cover car design, the hybrid power unit and tyres using original, unbranded transparent schematics, a few key figures, and direct Formula 1/FIA/Pirelli sources. The diagrams are explanatory, not official drawings or scale models.
- Route-specific metadata, structured data, sitemap entries and internal navigation cover these pages. Headlines and structured data point to original publishers; Amakuru does not claim to be an official F1 news source.

A possible next editorial phase is to compare selected cars or technical eras from past seasons using official regulations and appropriately licensed/reference-only imagery. Keep each comparison concise, dated and source-linked; avoid copying technical drawings or introducing a database.

## Delivered: editorial guides and Road to Rwanda

- **Road to Rwanda** (`/road-to-rwanda`) is a short desk with source-labelled context and open questions; it now also surfaces relevant Rwanda/Africa headlines from the publisher feeds.
- Evergreen guides live at `/guides`: how a Grand Prix weekend works, what an undercut is, and how championship points work. They are static pages and do not call the race feed.
- Live telemetry stays out. A weekend guide describes the shape of a round and points readers at the cached Kigali schedule.

## What to defer

- **Live timing and telemetry:** OpenF1 says historical data from 2023 onward is free, while real-time access requires a paid subscription. Live dashboards also need rate management and clear “delayed/unofficial” labels. [OpenF1 docs](https://openf1.org/docs/)
- **Accounts, private leagues, and push alerts:** These need identity, storage, notification and abuse-handling decisions. They add privacy and maintenance work before there is evidence of a returning audience.
- **Fantasy scoring and predictions:** A lightweight prediction feature could be a later community experiment, but persistent leaderboards require a database and moderation rules. For now, link fans to official F1 Fantasy.
- **Video and onboard content:** Link to authorized official material rather than copying or rehosting clips without rights.

## Keep the free setup realistic

Vercel describes Hobby as a free plan for personal, non-commercial use. It includes usage allowances for analytics and function invocations, and some limit excesses can pause projects. Before adding sponsorships, ads, paid products, or a business purpose, review whether Hobby remains appropriate. [Vercel Hobby plan](https://vercel.com/docs/plans/hobby) · [Vercel terms](https://vercel.com/legal/terms)

Avoid a database until readers need accounts, saved teams, or leagues. Prefer static article pages and cached data requests. Count the arrival and the championship pages on the live site, and keep Allow as the switch for the other pages. Keep Easter eggs local and silent, and never make them gate content or collect personal details.

## Easter eggs that stay out of the way

The existing egg is quiet: type **KIGALI** outside text fields, or tap the Amakuru mark six times quickly, to reveal a short dismissible note: “Dadi's lights are on. Kigali, see you on the grid.” It does not change the layout or persist a visitor profile.

Other ideas for later:

- **Dadi's Pit Wall:** a tiny personal note unlocked by clicking the “AM / 001” story stamp a few times. Add it only after Dadi supplies the detail to reveal.
- **Start-light salute:** a brief optional red-to-green animation when the brand mark is activated, with reduced-motion support and no sound.
- **Kigali clue trail:** a few small Rwanda references in editorial copy that reward careful readers, ending at a note about Amakuru's local perspective.
- **Favorite-driver signal:** a hidden color or detail tied to Dadi's chosen driver or team; do not guess the reference.

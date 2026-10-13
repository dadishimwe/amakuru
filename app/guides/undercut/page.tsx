import { ArticleFrame } from "@/components/article-frame"
import { breadcrumbJsonLd, seasonMetadata } from "@/lib/season-page"
import { SITE_NAME, SITE_URL } from "@/lib/site"

const PATH = "/guides/undercut"
const TITLE = "What is an undercut? | Amakuru Motorsport"
const DESCRIPTION = "A plain explanation of the Formula 1 undercut and overcut: pitting early on fresh tyres, staying out, and why the stop can still fail."

export const metadata = seasonMetadata(TITLE, DESCRIPTION, PATH)

export default function UndercutGuide() {
  return (
    <ArticleFrame
      kicker="AM / GUIDE"
      label="THE TACTIC"
      title="What is an undercut?"
      dek="A car pits before the one it is chasing, fits fresh tyres, and tries to be ahead when the other car stops."
      crumbs={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: "The undercut" }]}
      jsonLd={[
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: "What is an undercut?", path: PATH },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "What is an undercut?",
          description: DESCRIPTION,
          url: `${SITE_URL}${PATH}`,
          author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        },
      ]}
    >
      <p className="article-lede">
        Tyres lose pace as they age. A new set is usually faster for a few laps. The undercut is the decision to spend the pit stop early and use that speed before the car ahead does.
      </p>
      <section>
        <h2>How the stop is supposed to work</h2>
        <p>
          The chasing car comes in, loses the time the stop costs, then goes quicker than the leader on old tyres. If those laps are fast enough, the chaser is already ahead by the time the leader pits and pays the same stop. The places change without a pass on the track.
        </p>
      </section>
      <section>
        <h2>The overcut is the opposite bet</h2>
        <p>
          Staying out can also work. Clear air, a gentle tyre, or a car that is slow to warm a new set can let the leader pit later and come out in front. That is the overcut. Teams pick between the two from the gap, the tyre, and the traffic they would rejoin behind.
        </p>
      </section>
      <section>
        <h2>Why it fails</h2>
        <p>
          A slow stop, a new tyre that needs a lap to work, or a queue of cars in the pit window can give the time back. The undercut is a tactic, not a guarantee. Amakuru does not call a stop an undercut unless the race result shows the order change.
        </p>
      </section>
      <p className="article-source-note">
        Pair this with a classified race on the <a href="/season/results">results</a> page. The table shows the finish. It does not replay the pit wall.
      </p>
    </ArticleFrame>
  )
}

import type { Metadata } from "next"
import { ArticleFrame } from "@/components/article-frame"
import { NewsCards } from "@/components/news/news-cards"
import { getF1News } from "@/lib/f1-news"
import { breadcrumbJsonLd, seasonMetadata } from "@/lib/season-page"
import { SITE_NAME, SITE_URL } from "@/lib/site"

const PATH = "/news"
const TITLE = "Formula 1 news from BBC Sport and Motorsport.com | Amakuru"
const DESCRIPTION = "Follow fresh Formula 1 headlines from BBC Sport and Motorsport.com, linked to the original publishers with reporting context from Kigali and Rwanda."

export const revalidate = 900
export const metadata: Metadata = seasonMetadata(TITLE, DESCRIPTION, PATH)

export default async function NewsPage() {
  const stories = await getF1News(18)
  const latestDate = stories[0]?.publishedAt
  const jsonLd = [
    breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Formula 1 news", path: PATH }]),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}${PATH}`,
      ...(latestDate ? { dateModified: latestDate } : {}),
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: stories.map((story, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: story.title,
          url: story.href,
        })),
      },
    },
  ]

  return (
    <ArticleFrame
      kicker="AM / NEWS DESK"
      label="FRESH LINKS · SOURCE FIRST"
      title="The paddock, as it moves."
      dek="A light-touch index of current Formula 1 headlines, updated from publisher feeds and linked straight to the original story."
      crumbs={[{ label: "Home", href: "/" }, { label: "News" }]}
      jsonLd={jsonLd}
    >
      <p className="article-lede">
        Headlines stay with their publishers. Amakuru does not republish their article text; open a story at its source for the full report.
      </p>
      <NewsCards items={stories} />
      <p className="article-source-note">
        Feed sources: <a href="https://www.bbc.co.uk/sport/formula1" target="_blank" rel="noreferrer">BBC Sport</a> and <a href="https://www.motorsport.com/f1/" target="_blank" rel="noreferrer">Motorsport.com</a>. The feeds are cached for up to 15 minutes. BBC Sport thumbnails appear only with their linked BBC headlines; no publisher logos are used.
      </p>
      <section className="article-next">
        <p className="label">RWANDA, WITH THE FACTS IN VIEW</p>
        <h2>Keep the announcement separate from the open questions.</h2>
        <p>Amakuru’s Rwanda desk distinguishes confirmed details from reporting and speculation about a future race.</p>
        <a className="button button-acid" href="/road-to-rwanda">Open Road to Rwanda</a>
      </section>
    </ArticleFrame>
  )
}

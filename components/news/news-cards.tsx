import type { F1NewsItem } from "@/lib/f1-news"

function dateLabel(value: string): string {
  return new Intl.DateTimeFormat("en-RW", {
    timeZone: "Africa/Kigali",
    dateStyle: "medium",
  }).format(new Date(value))
}

export function NewsCards({
  items,
  variant = "feed",
}: {
  items: F1NewsItem[]
  variant?: "feed" | "compact"
}) {
  if (items.length === 0) {
    return (
      <p className="news-empty">
        The feeds are taking a pit stop. Check <a href="https://www.bbc.co.uk/sport/formula1" target="_blank" rel="noreferrer">BBC Sport F1</a> or <a href="https://www.motorsport.com/f1/" target="_blank" rel="noreferrer">Motorsport.com</a> directly.
      </p>
    )
  }

  const imageIndexes = new Set(items.flatMap((item, index) => item.imageUrl ? [index] : []).slice(0, variant === "compact" ? 1 : 3))

  return (
    <div className={`news-list news-list-${variant}`}>
      {items.map((item, index) => {
        const showImage = Boolean(item.imageUrl && imageIndexes.has(index))
        return (
          <article className={`news-card${showImage ? " news-card-image" : ""}`} key={`${item.sourceName}-${item.href}`}>
            {showImage && item.imageUrl ? (
              <a className="news-card-image-link" href={item.href} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden="true">
                <img src={item.imageUrl} alt="" loading="lazy" decoding="async" />
              </a>
            ) : null}
            <div className="news-card-copy">
              <div className="news-card-meta">
                <a className="news-source" href={item.sourceUrl} target="_blank" rel="noreferrer">{item.sourceName}</a>
                <time dateTime={item.publishedAt}>{dateLabel(item.publishedAt)}</time>
              </div>
              <h3><a href={item.href} target="_blank" rel="noreferrer">{item.title}</a></h3>
              <a className="news-read-link" href={item.href} target="_blank" rel="noreferrer" aria-label={`Read “${item.title}” at ${item.sourceName}`}>
                Read at source <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
        )
      })}
    </div>
  )
}

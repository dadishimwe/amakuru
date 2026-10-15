import type { ImageCredit } from "@/lib/f1-season"

export function ImageCredits({ items }: { items?: Array<ImageCredit | null | undefined> }) {
  const unique = new Map<string, ImageCredit>()
  for (const item of items ?? []) {
    if (item?.sourceUrl && !unique.has(item.sourceUrl)) unique.set(item.sourceUrl, item)
  }
  const credits = Array.from(unique.values())
  if (credits.length === 0) return null

  return (
    <details className="image-credits">
      <summary>Image credits · {credits.length}</summary>
      <ul>
        {credits.map((item) => (
          <li key={item.sourceUrl}>
            <a href={item.sourceUrl} target="_blank" rel="noreferrer">{item.fileName}</a>
            {item.artist ? <> · {item.artist}</> : null}
            {item.license ? <> · <a href={item.licenseUrl || item.sourceUrl} target="_blank" rel="noreferrer">{item.license}</a></> : null}
            {item.license && /CC BY-SA/i.test(item.license) ? " · ShareAlike" : ""}
          </li>
        ))}
      </ul>
    </details>
  )
}

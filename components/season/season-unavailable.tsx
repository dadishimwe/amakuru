export function SeasonUnavailable() {
  return (
    <section className="season-unavailable" aria-labelledby="season-unavailable-title">
      <p className="label">THE FEED IS QUIET</p>
      <h2 id="season-unavailable-title">The championship data is taking a pit stop.</h2>
      <p>
        The calendar, results and standings will show here again when the source is available. Nothing on this page has been replaced with a guess.
      </p>
      <p>When the feed returns, race times are shown in Kigali time.</p>
    </section>
  )
}

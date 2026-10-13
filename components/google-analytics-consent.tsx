"use client"

import Script from "next/script"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const GA_MEASUREMENT_ID = "G-X3HHG0R81C"
const CONSENT_KEY = "amakuru-google-analytics-consent-v1"
const GA_HOSTS = new Set(["amakuru.rw", "www.amakuru.rw"])

type ConsentChoice = "accepted" | "rejected" | null

type GtagCommand = [string, ...unknown[]]

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: GtagCommand) => void
    __amakuruGaConfigured?: boolean
  }
}

const deniedConsent = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
}

export function GoogleAnalyticsConsent() {
  const pathname = usePathname()
  const [choice, setChoice] = useState<ConsentChoice>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isLiveDomain, setIsLiveDomain] = useState(false)
  const [shouldLoadTag, setShouldLoadTag] = useState(false)
  const [tagReady, setTagReady] = useState(false)

  useEffect(() => {
    const host = window.location.hostname.toLowerCase()
    setIsLiveDomain(GA_HOSTS.has(host))

    const stored = window.localStorage.getItem(CONSENT_KEY)
    if (stored === "accepted" || stored === "rejected") {
      setChoice(stored)
    }

    const openSettings = () => setSettingsOpen(true)
    window.addEventListener("amakuru:open-privacy-settings", openSettings)
    return () => window.removeEventListener("amakuru:open-privacy-settings", openSettings)
  }, [])

  useEffect(() => {
    if (!isLiveDomain || choice !== "accepted") {
      if (choice === "rejected" && window.gtag) {
        window.gtag("consent", "update", deniedConsent)
      }
      setShouldLoadTag(false)
      setTagReady(false)
      return
    }

    window.dataLayer = window.dataLayer || []
    window.gtag = window.gtag || function gtag(...args: GtagCommand) {
      window.dataLayer?.push(args)
    }

    if (!window.__amakuruGaConfigured) {
      window.gtag("consent", "default", deniedConsent)
      window.gtag("consent", "update", {
        ...deniedConsent,
        analytics_storage: "granted",
      })
      window.gtag("js", new Date())
      window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false })
      window.__amakuruGaConfigured = true
    } else {
      window.gtag("consent", "update", {
        ...deniedConsent,
        analytics_storage: "granted",
      })
    }

    setShouldLoadTag(true)
  }, [choice, isLiveDomain])

  useEffect(() => {
    if (!tagReady || choice !== "accepted" || !isLiveDomain || !window.gtag) return
    window.gtag("event", "page_view", {
      page_path: pathname || "/",
      page_location: `${window.location.origin}${pathname || "/"}`,
      page_title: document.title,
    })
  }, [choice, isLiveDomain, pathname, tagReady])

  const saveChoice = useCallback((nextChoice: Exclude<ConsentChoice, null>) => {
    window.localStorage.setItem(CONSENT_KEY, nextChoice)
    setChoice(nextChoice)
    setSettingsOpen(false)
  }, [])

  const isVisible = (isLiveDomain && choice === null) || settingsOpen

  return (
    <>
      {shouldLoadTag && (
        <Script
          id="amakuru-google-analytics"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
          onReady={() => setTagReady(true)}
        />
      )}

      {isVisible && (
        <section className="analytics-consent" aria-labelledby="analytics-consent-title">
          <div className="analytics-consent-copy">
            <p className="analytics-consent-kicker">YOUR PRIVACY, YOUR CALL</p>
            <h2 id="analytics-consent-title">
              {!isLiveDomain
                ? "Analytics is off on previews"
                : settingsOpen
                  ? "Analytics preferences"
                  : "Help us improve Amakuru?"}
            </h2>
            <p>
              {!isLiveDomain
                ? "Google Analytics only runs on amakuru.rw after consent. This preview does not send visits to the live property."
                : "Optional Google Analytics helps us understand which pages fans read. It stays off unless you allow it. Vercel's cookie-free aggregate metrics remain on. You can change your Google Analytics choice here in the footer."}
            </p>
            {isLiveDomain && (
              <>
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noreferrer"
                  className="analytics-privacy-link"
                >
                  How Google handles data <span aria-hidden="true">↗</span>
                </a>
                <a
                  href="https://vercel.com/docs/analytics/privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                  className="analytics-privacy-link"
                >
                  Vercel Analytics privacy <span aria-hidden="true">↗</span>
                </a>
              </>
            )}
          </div>
          <div className="analytics-consent-actions">
            {isLiveDomain ? (
              <>
                <button type="button" className="analytics-allow" onClick={() => saveChoice("accepted")}>
                  Allow Google Analytics
                </button>
                <button type="button" className="analytics-deny" onClick={() => saveChoice("rejected")}>
                  No thanks
                </button>
              </>
            ) : (
              <button type="button" className="analytics-close" onClick={() => setSettingsOpen(false)}>
                Close
              </button>
            )}
            {settingsOpen && (
              <button type="button" className="analytics-close" onClick={() => setSettingsOpen(false)}>
                Close
              </button>
            )}
          </div>
        </section>
      )}
    </>
  )
}

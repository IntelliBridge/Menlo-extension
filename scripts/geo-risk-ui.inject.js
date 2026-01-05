(() => {
  // ------------------------------------------------------------------
  // GUARD: prevent duplicate execution
  // ------------------------------------------------------------------
  if (document.getElementById("dod-geo-risk-banner")) return;

  // ------------------------------------------------------------------
  // CONTEXT PROVIDED BY MENLO POLICY
  // ------------------------------------------------------------------
  // Expected DOM attributes injected by Menlo:
  // data-geo-risk="high"
  // data-country-code="CN"
  // data-cocom="INDOPACOM"
  // ------------------------------------------------------------------

  const root = document.documentElement;

  const geoRisk = (root.getAttribute("data-geo-risk") || "low").toLowerCase();
  if (geoRisk !== "high") return;

  const countryCode = root.getAttribute("data-country-code") || "UNKNOWN";
  const cocom = root.getAttribute("data-cocom") || "GLOBAL";

  // ------------------------------------------------------------------
  // DoD-ALIGNED WARNING LANGUAGE (CoCOM-SCOPED)
  // ------------------------------------------------------------------

  const WARNING_TEXT = {
    GLOBAL:
      "WARNING: You are accessing a website hosted in or associated with a high-risk geographic region. " +
      "Do NOT enter, upload, or process classified information, Controlled Unclassified Information (CUI), " +
      "or sensitive Department of Defense data.",

    EUCOM:
      "EUCOM WARNING: High-risk geographic region detected. Entry of CUI, operational data, " +
      "or sensitive DoD information is prohibited per theater policy.",

    INDOPACOM:
      "INDOPACOM WARNING: This site is associated with a high-risk geographic region. " +
      "Do NOT input mission data, CUI, or sensitive DoD information.",

    CENTCOM:
      "CENTCOM WARNING: Elevated data exposure risk due to geographic hosting. " +
      "Submission of sensitive or operational DoD data is prohibited."
  };

  const message = WARNING_TEXT[cocom] || WARNING_TEXT.GLOBAL;

  // ------------------------------------------------------------------
  // UI BANNER RENDERING (with Accessibility + Versioning)
  // ------------------------------------------------------------------

  const banner = document.createElement("div");
  banner.id = "dod-geo-risk-banner";

  // Accessibility improvements
  banner.setAttribute("role", "alert");
  banner.setAttribute("aria-live", "assertive");

  // Version / audit tagging
  banner.setAttribute("data-policy-version", "geo-risk-v1.1");

  banner.style.position = "sticky";
  banner.style.top = "0";
  banner.style.zIndex = "999999";
  banner.style.backgroundColor = "#8b0000";
  banner.style.color = "#ffffff";
  banner.style.padding = "12px";
  banner.style.fontSize = "14px";
  banner.style.fontWeight = "bold";
  banner.style.textAlign = "center";
  banner.style.borderBottom = "3px solid #ffcc00";

  banner.textContent = `${message} (Region Code: ${countryCode})`;

  document.body.prepend(banner);

  // ------------------------------------------------------------------
  // MUTATION OBSERVER (SPA / Dynamic DOM Resilience)
  // ------------------------------------------------------------------

  const observer = new MutationObserver(() => {
    if (!document.getElementById("dod-geo-risk-banner")) {
      document.body.prepend(banner);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: false
  });

  // ------------------------------------------------------------------
  // TELEMETRY SIGNALING (MENLO-COMPATIBLE)
  // ------------------------------------------------------------------

  // DOM marker for Menlo session analytics
  root.setAttribute("data-dod-geo-risk-warning", "displayed");

  // Console signal for policy + script correlation
  console.warn(
    `[DoD-GEO-RISK] version=geo-risk-v1.1 cocom=${cocom} country=${countryCode} host=${location.hostname}`
  );
})();

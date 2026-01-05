(() => {
  // ------------------------------------------------------------------
  // CONFIGURATION
  // ------------------------------------------------------------------

  const AI_DOMAINS = [
    "chatgpt.com", "openai.com",
    "claude.ai", "anthropic.com",
    "gemini.google.com", "ai.google.com",
    "copilot.microsoft.com", "bing.com",
    "perplexity.ai",
    "huggingface.co",
    "mistral.ai",
    "cohere.com",
    "x.ai", "grok.x.com",
    "meta.ai",
    "replit.com",
    "cursor.sh",
    "codeium.com",
    "notion.so",
    "canva.com",
    "figma.com",
    "you.com",
    "duckduckgo.com"
  ];

  const AI_INPUT_SELECTORS = [
    "textarea",
    "input[type='text']",
    "[contenteditable='true']"
  ];

  const root = document.documentElement;

  // Prevent duplicate execution (session-safe)
  if (root.getAttribute("data-dod-ai-warning") === "displayed") return;

  // ------------------------------------------------------------------
  // DETECTION
  // ------------------------------------------------------------------

  const hostname = location.hostname.toLowerCase();

  const domainMatch = AI_DOMAINS.some(d =>
    hostname === d || hostname.endsWith(`.${d}`)
  );

  const domMatch = AI_INPUT_SELECTORS.some(sel =>
    document.querySelector(sel)
  );

  if (!domainMatch && !domMatch) return;

  // ------------------------------------------------------------------
  // CoCOM CONTEXT (Policy-Injected)
  // ------------------------------------------------------------------

  const cocom = root.getAttribute("data-cocom") || "GLOBAL";

  // ------------------------------------------------------------------
  // DoD-ALIGNED WARNING LANGUAGE
  // ------------------------------------------------------------------

  const WARNING_TEXT = {
    GLOBAL:
      "WARNING: You are accessing an Artificial Intelligence / Generative System. " +
      "Do NOT enter, upload, or process classified information, Controlled Unclassified Information (CUI), " +
      "or sensitive Department of Defense data.",

    EUCOM:
      "EUCOM WARNING: Use of AI systems is restricted. Do NOT input CUI, operational data, " +
      "mission details, or sensitive DoD information into this system.",

    INDOPACOM:
      "INDOPACOM WARNING: AI system detected. Entry of CUI, mission data, or sensitive information " +
      "is prohibited per theater policy.",

    CENTCOM:
      "CENTCOM WARNING: AI tools may pose data exposure risks. Do NOT submit sensitive or operational DoD data."
  };

  const message = WARNING_TEXT[cocom] || WARNING_TEXT.GLOBAL;

  // ------------------------------------------------------------------
  // UI BANNER
  // ------------------------------------------------------------------

  const banner = document.createElement("div");
  banner.id = "dod-ai-warning-banner";
  banner.style.position = "sticky";
  banner.style.top = "0";
  banner.style.zIndex = "999999";
  banner.style.backgroundColor = "#7a0000";
  banner.style.color = "#ffffff";
  banner.style.padding = "12px";
  banner.style.fontSize = "14px";
  banner.style.fontWeight = "bold";
  banner.style.textAlign = "center";
  banner.style.borderBottom = "3px solid #ffcc00";

  banner.textContent = message;

  document.body.prepend(banner);

  // ------------------------------------------------------------------
  // TELEMETRY SIGNALING
  // ------------------------------------------------------------------

  root.setAttribute("data-dod-ai-warning", "displayed");

  console.warn(
    `[DoD-AI-WARNING] cocom=${cocom} host=${hostname}`
  );
})();

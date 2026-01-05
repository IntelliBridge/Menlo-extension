(() => {
  // ------------------------------------------------------------------
  // CONFIGURATION
  // ------------------------------------------------------------------

  const PATTERNS = /(CUI|SECRET|TOP SECRET|NOFORN|OPORD|FRAGO)/gi;

  // Escalation rule:
  // If sensitive data is detected AFTER redaction (e.g., user keeps typing),
  // we block input instead of endlessly redacting.
  const MAX_REDACTIONS_BEFORE_BLOCK = 1;

  const root = document.documentElement;
  let redactionCount = 0;
  let lastAlertTime = 0;
  const ALERT_COOLDOWN_MS = 5000;

  // ------------------------------------------------------------------
  // UTILITIES
  // ------------------------------------------------------------------

  const emitTelemetry = (type) => {
    root.setAttribute(`data-dlp-${type}`, "true");
    console.warn(`[DLP] ${type} enforced by policy`);
  };

  const showAlert = (message) => {
    const now = Date.now();
    if (now - lastAlertTime > ALERT_COOLDOWN_MS) {
      alert(message);
      lastAlertTime = now;
    }
  };

  const getText = (el) => {
    if (!el) return "";
    if (el.isContentEditable) return el.innerText || "";
    return el.value || "";
  };

  const setText = (el, text) => {
    if (!el) return;
    if (el.isContentEditable) {
      el.innerText = text;
    } else {
      el.value = text;
    }
  };

  const redactText = (text) =>
    text.replace(PATTERNS, "[REDACTED]");

  // ------------------------------------------------------------------
  // INLINE REDACTION (PRIMARY CONTROL)
  // ------------------------------------------------------------------

  document.addEventListener(
    "submit",
    (e) => {
      let redactedThisSubmit = false;

      const fields = e.target.querySelectorAll(
        "input, textarea, [contenteditable='true']"
      );

      fields.forEach((el) => {
        const original = getText(el);
        if (PATTERNS.test(original)) {
          setText(el, redactText(original));
          redactedThisSubmit = true;
        }
      });

      if (redactedThisSubmit) {
        redactionCount++;
        emitTelemetry("redaction");
      }
    },
    true
  );

  // ------------------------------------------------------------------
  // CONDITIONAL BLOCKING (ESCALATION CONTROL)
  // ------------------------------------------------------------------

  const shouldBlock = () =>
    redactionCount > MAX_REDACTIONS_BEFORE_BLOCK;

  const blockIfNeeded = (text, e) => {
    if (!PATTERNS.test(text)) return;

    if (shouldBlock()) {
      e.preventDefault();
      showAlert(
        "DLP POLICY: Repeated sensitive data entry detected. Input is blocked."
      );
      emitTelemetry("block");
    }
  };

  // Block typing after escalation
  document.addEventListener(
    "keydown",
    (e) => {
      blockIfNeeded(getText(e.target), e);
    },
    true
  );

  // Block paste after escalation
  document.addEventListener(
    "paste",
    (e) => {
      const pasted = e.clipboardData?.getData("text") || "";
      blockIfNeeded(pasted, e);
    },
    true
  );

  // Block drag & drop after escalation
  document.addEventListener(
    "drop",
    (e) => {
      const dropped = e.dataTransfer?.getData("text") || "";
      blockIfNeeded(dropped, e);
    },
    true
  );
})();

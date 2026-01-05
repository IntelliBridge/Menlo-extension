(() => {
  // ------------------------------------------------------------------
  // CONFIGURATION
  // ------------------------------------------------------------------

  const patterns = /(CUI|TOP SECRET|NOFORN|SECRET|CONFIDENTIAL)/gi;
  const root = document.documentElement;

  let lastAlertTime = 0;
  const ALERT_COOLDOWN_MS = 5000;

  // ------------------------------------------------------------------
  // UTILITY
  // ------------------------------------------------------------------

  const emitTelemetry = () => {
    root.setAttribute("data-dlp-block", "true");
    console.warn("[DLP] Sensitive data blocked by policy");
  };

  const showAlert = () => {
    const now = Date.now();
    if (now - lastAlertTime > ALERT_COOLDOWN_MS) {
      alert("DLP POLICY: Sensitive data entry is not permitted.");
      lastAlertTime = now;
    }
  };

  const getText = (el) => {
    if (!el) return "";
    if (el.isContentEditable) return el.innerText || "";
    return el.value || "";
  };

  // ------------------------------------------------------------------
  // BLOCK KEY ENTRY
  // ------------------------------------------------------------------

  document.addEventListener("keydown", e => {
    const text = getText(e.target);
    if (patterns.test(text)) {
      e.preventDefault();
      showAlert();
      emitTelemetry();
    }
  }, true);

  // ------------------------------------------------------------------
  // BLOCK PASTE
  // ------------------------------------------------------------------

  document.addEventListener("paste", e => {
    const pasted = e.clipboardData?.getData("text") || "";
    if (patterns.test(pasted)) {
      e.preventDefault();
      showAlert();
      emitTelemetry();
    }
  }, true);

  // ------------------------------------------------------------------
  // BLOCK DRAG & DROP
  // ------------------------------------------------------------------

  document.addEventListener("drop", e => {
    const text = e.dataTransfer?.getData("text") || "";
    if (patterns.test(text)) {
      e.preventDefault();
      showAlert();
      emitTelemetry();
    }
  }, true);

  // ------------------------------------------------------------------
  // BLOCK FORM SUBMIT BYPASS
  // ------------------------------------------------------------------

  document.addEventListener("submit", e => {
    const inputs = e.target.querySelectorAll("input,textarea,[contenteditable]");
    for (const el of inputs) {
      if (patterns.test(getText(el))) {
        e.preventDefault();
        showAlert();
        emitTelemetry();
        break;
      }
    }
  }, true);
})();


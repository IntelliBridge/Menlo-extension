(() => {
  // ------------------------------------------------------------------
  // CONFIGURATION
  // ------------------------------------------------------------------

  const root = document.documentElement;
  const ALERT_COOLDOWN_MS = 5000;
  let lastAlertTime = 0;

  const isDoDSite = (hostname) =>
    hostname.endsWith(".mil") || hostname.endsWith(".gov");

  // ------------------------------------------------------------------
  // UTILITIES
  // ------------------------------------------------------------------

  const emitTelemetry = () => {
    root.setAttribute("data-credential-block", "true");
    console.warn("[CREDENTIAL] DoD credential entry blocked");
  };

  const showAlert = () => {
    const now = Date.now();
    if (now - lastAlertTime > ALERT_COOLDOWN_MS) {
      alert("SECURITY POLICY: DoD credentials are not permitted on this website.");
      lastAlertTime = now;
    }
  };

  const isCredentialField = (el) => {
    if (!el) return false;

    if (["email", "password"].includes(el.type)) return true;

    // Handle custom login fields
    if (
      el.isContentEditable &&
      /(login|email|password|username)/i.test(el.getAttribute("aria-label") || "")
    ) {
      return true;
    }

    return false;
  };

  const clearField = (el) => {
    if (!el) return;
    if (el.isContentEditable) {
      el.innerText = "";
    } else {
      el.value = "";
    }
  };

  // ------------------------------------------------------------------
  // INPUT / AUTOFILL / PASTE BLOCKING
  // ------------------------------------------------------------------

  document.addEventListener("input", e => {
    const el = e.target;
    if (!isCredentialField(el)) return;

    if (!isDoDSite(location.hostname)) {
      clearField(el);
      showAlert();
      emitTelemetry();
    }
  }, true);

  document.addEventListener("paste", e => {
    const el = e.target;
    if (!isCredentialField(el)) return;

    if (!isDoDSite(location.hostname)) {
      e.preventDefault();
      showAlert();
      emitTelemetry();
    }
  }, true);

  // ------------------------------------------------------------------
  // SUBMIT BYPASS PREVENTION
  // ------------------------------------------------------------------

  document.addEventListener("submit", e => {
    if (!isDoDSite(location.hostname)) {
      const fields = e.target.querySelectorAll(
        "input[type='email'], input[type='password'], [contenteditable='true']"
      );

      for (const el of fields) {
        clearField(el);
      }

      e.preventDefault();
      showAlert();
      emitTelemetry();
    }
  }, true);
})();


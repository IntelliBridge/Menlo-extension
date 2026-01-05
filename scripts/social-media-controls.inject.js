(() => {
  // ==========================================================
  // SELECTORS THAT ENABLE POSTING
  // ==========================================================

  const selectors = [
    "textarea",
    "input[type='file']",
    "[contenteditable='true']"
  ];

  // ==========================================================
  // DISABLE POSTING ELEMENTS
  // ==========================================================

  const disablePostingElements = () => {
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (!el.disabled) {
          el.disabled = true;
          el.style.opacity = "0.5";
        }
      });
    });
  };

  // Initial execution
  disablePostingElements();

  // ==========================================================
  // BLOCK SUBMIT / PASTE / DROP / ENTER-TO-POST
  // ==========================================================

  document.addEventListener("submit", e => {
    e.preventDefault();
    console.warn("[SOCIAL] Submit blocked by policy");
  }, true);

  document.addEventListener("paste", e => {
    e.preventDefault();
    console.warn("[SOCIAL] Paste blocked by policy");
  }, true);

  document.addEventListener("drop", e => {
    e.preventDefault();
    console.warn("[SOCIAL] Drag/drop blocked by policy");
  }, true);

  document.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.warn("[SOCIAL] Enter-to-post blocked");
    }
  }, true);

  // ==========================================================
  // HANDLE DYNAMIC / SPA CONTENT
  // ==========================================================

  const observer = new MutationObserver(() => {
    disablePostingElements();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // ==========================================================
  // TELEMETRY SIGNALING
  // ==========================================================

  document.documentElement.setAttribute(
    "data-social-posting",
    "disabled"
  );

  console.warn("[SOCIAL] Posting fully disabled by policy");
})();

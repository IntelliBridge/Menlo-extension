(() => {
  const patterns = /(CUI|TOP SECRET|NOFORN)/gi;

  document.addEventListener("keydown", e => {
    const el = e.target;
    if (!el || !el.value) return;

    if (patterns.test(el.value)) {
      e.preventDefault();
      alert("DLP POLICY: Sensitive data entry blocked.");

      document.documentElement.setAttribute(
        "data-dlp-block",
        "true"
      );
      console.warn("[DLP] Blocked sensitive input");
    }
  });
})();

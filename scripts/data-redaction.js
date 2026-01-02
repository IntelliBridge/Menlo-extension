(() => {
  const patterns = /(CUI|SECRET|NOFORN|OPORD|FRAGO)/gi;
  let redacted = false;

  document.addEventListener("submit", e => {
    e.target
      .querySelectorAll("input, textarea")
      .forEach(f => {
        if (patterns.test(f.value)) {
          f.value = f.value.replace(patterns, "[REDACTED]");
          redacted = true;
        }
      });

    if (redacted) {
      document.documentElement.setAttribute(
        "data-dlp-redaction",
        "true"
      );
      console.warn("[DLP] Inline redaction applied");
    }
  });
})();

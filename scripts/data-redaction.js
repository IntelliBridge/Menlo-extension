(() => {
  const sensitivePatterns = /(CUI|SECRET|NOFORN|OPORD|FRAGO)/gi;

  document.addEventListener("submit", event => {
    const form = event.target;
    if (!form) return;

    form.querySelectorAll("input, textarea").forEach(field => {
      field.value = field.value.replace(
        sensitivePatterns,
        "[REDACTED]"
      );
    });
  });
})();

(() => {
  const selectors = [
    "textarea",
    "input[type='file']",
    "[contenteditable='true']"
  ];

  selectors.forEach(s =>
    document.querySelectorAll(s).forEach(el => {
      el.disabled = true;
      el.style.opacity = "0.5";
    })
  );

  document.documentElement.setAttribute(
    "data-social-posting",
    "disabled"
  );

  console.warn("[SOCIAL] Posting disabled by policy");
})();

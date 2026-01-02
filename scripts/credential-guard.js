(() => {
  const isDoDSite = hostname =>
    hostname.endsWith(".mil") || hostname.endsWith(".gov");

  document.addEventListener("input", event => {
    const el = event.target;
    if (!el || !["email", "password"].includes(el.type)) return;

    if (!isDoDSite(location.hostname)) {
      el.value = "";
      alert("DoD credentials are blocked on non-DoD websites.");
    }
  });
})();

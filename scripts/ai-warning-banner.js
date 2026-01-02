(() => {
  const banner = document.createElement("div");
  banner.style.backgroundColor = "#8b0000";
  banner.style.color = "#ffffff";
  banner.style.padding = "10px";
  banner.style.fontWeight = "bold";
  banner.style.textAlign = "center";
  banner.style.zIndex = "999999";
  banner.textContent =
    "⚠ AI tool detected. DoD data handling restrictions apply.";

  document.body.prepend(banner);
})();

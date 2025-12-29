function toggleFullscreen(button) {
  const container = button.closest(".image-container");
  const img = container.querySelector("img");

  if (!document.fullscreenElement) {
    img.requestFullscreen();
    button.textContent = "Exit Fullscreen";
    img.onclick = () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  } else {
    document.exitFullscreen();
    button.textContent = "View Fullscreen";
  }
  // Reset all buttons when fullscreen exits (ESC or tap)
    document.addEventListener("fullscreenchange", () => {
    document.querySelectorAll(".fullscreen-button").forEach(btn => {
    btn.textContent = "View Fullscreen";
  });
});
}

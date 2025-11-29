// registerSW.js
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("Service Worker terdaftar!"))
      .catch((err) => console.error("SW gagal:", err));
  });
}

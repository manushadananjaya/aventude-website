(function () {
  function applyScaling() {
    const width = window.innerWidth;
    if (width <= 962) {
      document.documentElement.style.zoom = 1;
      return;
    }
    const scale = width / 1920;
    document.documentElement.style.zoom = scale;
  }

  applyScaling();

  window.addEventListener("resize", applyScaling);
})();

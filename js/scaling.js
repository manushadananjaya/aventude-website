(function () {
  function applyScaling() {
    const width = window.innerWidth;
    const scale = width / 1920;
    document.documentElement.style.zoom = scale;
  }

  applyScaling();

  window.addEventListener("resize", applyScaling);
})();

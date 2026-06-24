(function () {
  const section = document.querySelector(".art-scroll-section");
  const wall = document.querySelector(".art-wall");
  const title = document.querySelector(".art-title-layer");
  const columns = Array.from(document.querySelectorAll(".art-column"));
  const images = Array.from(document.querySelectorAll(".art-column img"));

  if (!section || !wall || !columns.length) return;

  let targetY = 0;
  let currentY = 0;
  let maxTravel = window.innerHeight * 2.6;
  const baseOffsets = [-190, -330, -235, -285];
  const parallax = [0, 58, -44, 28];

  function setTransform(element, value) {
    element.style.transform = value;
  }

  function measure() {
    const tallest = columns.reduce((height, column) => Math.max(height, column.scrollHeight), 0);
    maxTravel = Math.max(window.innerHeight * 2.4, tallest + window.innerHeight * 0.35);
    section.dataset.maxTravel = String(Math.round(maxTravel));
    updateTarget();
  }

  function updateTarget() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
    targetY = progress * maxTravel;
    section.dataset.progress = progress.toFixed(3);
    section.dataset.scrollY = String(Math.round(window.scrollY));
  }

  function render() {
    updateTarget();
    currentY += (targetY - currentY) * 0.55;
    const progress = Math.max(0, Math.min(1, currentY / maxTravel));

    setTransform(wall, `translate3d(-50%, ${-currentY}px, 0)`);
    wall.style.opacity = "1";
    section.dataset.wallY = String(Math.round(-currentY));

    columns.forEach((column, index) => {
      const driftX = (index - 1.5) * Math.sin(progress * Math.PI) * 6;
      const driftY = baseOffsets[index] + parallax[index] * progress;
      setTransform(column, `translate3d(${driftX}px, ${driftY}px, 0)`);
    });

    if (title) {
      title.style.transform = `translate3d(-50%, calc(-50% + ${-10 * progress}px), 0) scale(${1 - progress * 0.012})`;
      title.style.opacity = String(1 - progress * 0.08);
    }

    window.requestAnimationFrame(render);
  }

  wall.style.opacity = "0";
  columns.forEach((column, index) => {
    setTransform(column, `translate3d(0, ${baseOffsets[index]}px, 0)`);
  });

  window.addEventListener("scroll", updateTarget, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("load", measure, { once: true });
  images.forEach((image) => image.addEventListener("load", measure, { once: true }));

  measure();
  window.requestAnimationFrame(() => {
    wall.style.transition = "opacity 700ms ease";
    wall.style.opacity = "1";
    render();
  });
})();

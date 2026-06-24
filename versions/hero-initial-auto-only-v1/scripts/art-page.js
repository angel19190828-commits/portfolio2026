(function () {
  const section = document.querySelector(".art-scroll-section");
  const wall = document.querySelector(".art-wall");
  const title = document.querySelector(".art-title-layer");
  const columns = Array.from(document.querySelectorAll(".art-column"));
  const images = Array.from(document.querySelectorAll(".art-column img"));

  if (!section || !wall || !columns.length) return;

  let target = 0;
  let current = 0;
  let maxTravel = window.innerHeight * 2.8;
  let lastScrollY = 0;
  let scrollScale = 1;
  let isRecentering = false;
  let centerScroll = 0;
  const cycleDistances = [1200, 1200, 1200, 1200];
  const baseOffsets = [-240, -760, -300, -700];
  const directions = [-1, 1, -1, 1];
  const speeds = [1, 0.92, 1.04, 0.96];

  function transform(element, value) {
    element.style.transform = value;
  }

  function duplicateColumnContent() {
    columns.forEach((column) => {
      if (column.dataset.loopReady === "true") return;
      Array.from(column.children).forEach((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        column.appendChild(clone);
      });
      column.dataset.loopReady = "true";
    });
  }

  function measure() {
    const tallest = columns.reduce((height, column) => Math.max(height, column.scrollHeight), 0);
    maxTravel = Math.max(window.innerHeight * 2.8, tallest * 0.42);
    columns.forEach((column, index) => {
      cycleDistances[index] = Math.max(window.innerHeight * 1.2, column.scrollHeight / 2);
    });
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    centerScroll = maxScroll / 2;
    scrollScale = maxTravel / maxScroll;
    section.dataset.maxTravel = String(Math.round(maxTravel));
    updateTarget();
  }

  function updateTarget() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollY = window.scrollY;
    const delta = scrollY - lastScrollY;
    if (!isRecentering) {
      target += delta * scrollScale;
    }
    lastScrollY = scrollY;
    if (scrollY < window.innerHeight || scrollY > maxScroll - window.innerHeight) {
      isRecentering = true;
      window.scrollTo(0, centerScroll);
      lastScrollY = centerScroll;
      isRecentering = false;
    }
    const progress = ((target / Math.max(1, maxTravel)) % 1 + 1) % 1;
    section.dataset.progress = progress.toFixed(3);
    section.dataset.scrollY = String(Math.round(window.scrollY));
    section.dataset.virtualY = String(Math.round(target));
  }

  function wrapTrackY(value, cycle) {
    return ((value % cycle) + cycle) % cycle - cycle;
  }

  function applyTracks(force) {
    updateTarget();
    current += (target - current) * (force ? 1 : 0.42);
    const progress = Math.max(0, Math.min(1, current / maxTravel));

    transform(wall, "translate3d(-50%, 0, 0)");
    wall.style.opacity = "1";

    columns.forEach((column, index) => {
      const signedDistance = directions[index] * current * speeds[index];
      const driftX = (index - 1.5) * Math.sin(progress * Math.PI) * 5;
      const y = wrapTrackY(baseOffsets[index] + signedDistance, cycleDistances[index]);
      transform(column, `translate3d(${driftX}px, ${y}px, 0)`);
      column.dataset.trackY = String(Math.round(y));
    });

    section.dataset.trackA = columns[0]?.dataset.trackY || "0";
    section.dataset.trackB = columns[1]?.dataset.trackY || "0";
    section.dataset.trackC = columns[2]?.dataset.trackY || "0";
    section.dataset.trackD = columns[3]?.dataset.trackY || "0";

    if (title) {
      title.style.transform = `translate3d(-50%, calc(-50% + ${-8 * progress}px), 0) scale(${1 - progress * 0.01})`;
      title.style.opacity = String(1 - progress * 0.06);
    }
  }

  function startDriver() {
    wall.style.transition = "opacity 700ms ease";
    wall.style.opacity = "1";
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    centerScroll = maxScroll / 2;
    window.scrollTo(0, centerScroll);
    lastScrollY = centerScroll;
    applyTracks(true);
    window.setInterval(() => applyTracks(false), 16);
  }

  duplicateColumnContent();
  wall.style.opacity = "0";
  columns.forEach((column, index) => {
    transform(column, `translate3d(0, ${baseOffsets[index]}px, 0)`);
  });

  window.addEventListener("scroll", () => applyTracks(false), { passive: true });
  window.addEventListener("wheel", () => applyTracks(false), { passive: true });
  window.addEventListener("touchmove", () => applyTracks(false), { passive: true });
  window.addEventListener("resize", () => {
    measure();
    applyTracks(true);
  });
  window.addEventListener("load", () => {
    measure();
    applyTracks(true);
  }, { once: true });
  images.forEach((image) => image.addEventListener("load", () => {
    measure();
    applyTracks(false);
  }, { once: true }));

  measure();
  startDriver();
})();

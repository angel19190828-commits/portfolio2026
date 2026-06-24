(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  const scrollSection = document.querySelector(".art-scroll-section");
  const stage = document.querySelector(".art-stage");
  const wall = document.querySelector(".art-wall");
  const title = document.querySelector(".art-title-layer");
  const columns = gsap.utils.toArray(".art-column");

  if (!scrollSection || !stage || !wall || !columns.length) return;

  gsap.registerPlugin(ScrollTrigger);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  let target = 0;
  let current = 0;
  let maxTravel = 1400;
  const baseOffsets = [-190, -330, -235, -285];
  const parallax = [0, 58, -44, 28];

  function measure() {
    const tallestColumn = columns.reduce((height, column) => {
      return Math.max(height, column.scrollHeight);
    }, 0);
    maxTravel = Math.max(window.innerHeight * 2.4, tallestColumn + window.innerHeight * 0.35);
    scrollSection.dataset.maxTravel = Math.round(maxTravel);
  }

  function render() {
    current += (target - current) * 0.105;
    const p = gsap.utils.clamp(0, 1, current / maxTravel);

    gsap.set(wall, {
      y: -current,
      force3D: true
    });

    columns.forEach((column, index) => {
      gsap.set(column, {
        y: baseOffsets[index] + parallax[index] * p,
        x: (index - 1.5) * Math.sin(p * Math.PI) * 6,
        force3D: true
      });
    });

    if (title) {
      gsap.set(title, {
        y: -10 * p,
        scale: 1 - p * 0.012,
        autoAlpha: 1 - p * 0.08,
        force3D: true
      });
    }
  }

  gsap.set(wall, { autoAlpha: 0, y: 18, force3D: true });
  columns.forEach((column, index) => {
    gsap.set(column, { y: baseOffsets[index], force3D: true });
  });

  gsap.to(wall, {
    autoAlpha: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out",
    delay: 0.08
  });

  measure();

  ScrollTrigger.create({
    id: "art-wall-scroll",
    trigger: scrollSection,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    invalidateOnRefresh: true,
    onRefresh: measure,
    onUpdate: (self) => {
      target = self.progress * maxTravel;
      scrollSection.dataset.progress = self.progress.toFixed(3);
    }
  });

  gsap.ticker.add(render);
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  document.querySelectorAll(".art-column img").forEach((image) => {
    image.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  });
})();

(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  const section = document.querySelector("[data-section2-collage]");
  if (!section) return;

  gsap.registerPlugin(ScrollTrigger);

  const titleWrap = section.querySelector(".glimpse-copy");
  const title = section.querySelector(".glimpse-copy h2");
  const subtitle = section.querySelector(".glimpse-copy p");
  const items = gsap.utils.toArray(".section2-collage .art-grid img");
  const viewAll = section.querySelector(".view-all");
  let section2Timeline = null;

  const collage = [
    { x: 0.28, y: 0.16, w: 0.14, r: -7, s: 0.72, dx: -0.06, dy: -0.08, z: 2 },
    { x: 0.44, y: 0.12, w: 0.13, r: 5, s: 0.66, dx: -0.02, dy: -0.13, z: 1 },
    { x: 0.58, y: 0.12, w: 0.15, r: -3, s: 0.7, dx: 0.04, dy: -0.11, z: 4 },
    { x: 0.76, y: 0.12, w: 0.16, r: 2, s: 0.72, dx: 0.11, dy: -0.08, z: 2 },
    { x: 0.18, y: 0.36, w: 0.16, r: 4, s: 0.68, dx: -0.16, dy: -0.01, z: 3 },
    { x: 0.38, y: 0.39, w: 0.18, r: -4, s: 0.74, dx: -0.04, dy: 0.01, z: 6 },
    { x: 0.58, y: 0.36, w: 0.16, r: 7, s: 0.72, dx: 0.04, dy: -0.01, z: 7 },
    { x: 0.80, y: 0.38, w: 0.17, r: -5, s: 0.7, dx: 0.16, dy: 0.02, z: 5 },
    { x: 0.12, y: 0.66, w: 0.18, r: -6, s: 0.68, dx: -0.19, dy: 0.12, z: 2 },
    { x: 0.34, y: 0.69, w: 0.16, r: 4, s: 0.72, dx: -0.07, dy: 0.14, z: 4 },
    { x: 0.58, y: 0.68, w: 0.18, r: -3, s: 0.7, dx: 0.04, dy: 0.14, z: 5 },
    { x: 0.82, y: 0.66, w: 0.19, r: 5, s: 0.66, dx: 0.18, dy: 0.13, z: 3 }
  ];

  function measureLayout() {
    const rect = section.getBoundingClientRect();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const mobile = window.matchMedia("(max-width: 809px)").matches;
    const base = mobile ? Math.min(width * 0.34, 150) : gsap.utils.clamp(128, 212, width * 0.13);

    return { width, height, base, mobile, rect };
  }

  function placeInitial(layout) {
    items.forEach((item, index) => {
      const seed = collage[index % collage.length];
      const tile = layout.base * (seed.w / 0.15);
      const finalX = seed.x * layout.width - tile / 2;
      const finalY = seed.y * layout.height - tile / 2;
      const startX = (0.5 + seed.dx * 0.28) * layout.width - tile / 2;
      const startY = (0.5 + seed.dy * 0.28) * layout.height - tile / 2;

      item.dataset.finalX = String(finalX);
      item.dataset.finalY = String(finalY);
      item.dataset.startX = String(startX);
      item.dataset.startY = String(startY);
      item.dataset.startR = String(seed.r);
      item.dataset.startS = String(seed.s);
      item.dataset.finalR = String(seed.r);
      item.dataset.tile = String(tile);

      gsap.set(item, {
        width: tile,
        height: tile,
        x: startX,
        y: startY,
        rotation: seed.r * 0.35,
        scale: seed.s,
        autoAlpha: 0,
        filter: "blur(10px) saturate(.68)",
        zIndex: seed.z
      });
    });

    gsap.set([title, subtitle], { autoAlpha: 1, y: 0, filter: "blur(0px)" });
    gsap.set(titleWrap, { scale: 1, x: 0, y: 0 });
    gsap.set(viewAll, { autoAlpha: 0, y: 24, pointerEvents: "none" });
  }

  function buildSection2() {
    if (section2Timeline) {
      section2Timeline.scrollTrigger?.kill();
      section2Timeline.kill();
    }

    const layout = measureLayout();
    placeInitial(layout);

    section2Timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${Math.max(1800, window.innerHeight * 2.35)}`,
        pin: true,
        scrub: 0.65,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          if ((self.progress || 0) < 0.01) {
            const refreshed = measureLayout();
            placeInitial(refreshed);
          }
        }
      }
    });

    section2Timeline
      .fromTo(title,
        { autoAlpha: 0, y: 18, filter: "blur(7px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.28, ease: "power3.out" },
        0
      )
      .fromTo(subtitle,
        { autoAlpha: 0, y: 8, filter: "blur(4px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.22, ease: "power2.out" },
        0.08
      );

    items.forEach((item, index) => {
      const start = 0.06 + (index % 4) * 0.018 + Math.floor(index / 4) * 0.026;
      section2Timeline
        .to(item, {
          autoAlpha: 0.92,
          filter: "blur(0px) saturate(.9)",
          duration: 0.14,
          ease: "power2.out"
        }, start)
        .to(item, {
          x: Number(item.dataset.finalX),
          y: Number(item.dataset.finalY),
          rotation: Number(item.dataset.finalR),
          scale: 1.08,
          duration: 0.54,
          ease: "power3.out"
        }, start + 0.02)
        .to(item, {
          x: Number(item.dataset.finalX) + (index % 2 ? 8 : -8),
          y: Number(item.dataset.finalY) + (index % 3 - 1) * 6,
          rotation: Number(item.dataset.finalR) * 0.72,
          scale: 1,
          filter: "blur(0px) saturate(.96)",
          duration: 0.22,
          ease: "power2.out"
        }, start + 0.54);
    });

    section2Timeline
      .to(titleWrap, {
        scale: 0.99,
        duration: 0.5,
        ease: "power2.inOut"
      }, 0.22)
      .to(title, {
        autoAlpha: 0.9,
        duration: 0.34,
        ease: "none"
      }, 0.52)
      .to(items, {
        y: (index, item) => Number(item.dataset.finalY) + (index % 3 - 1) * 4,
        duration: 0.24,
        ease: "power2.out",
        stagger: { each: 0.01, from: "center" }
      }, 0.86);
  }

  buildSection2();

  window.addEventListener("resize", () => {
    buildSection2();
    ScrollTrigger.refresh();
  }, { passive: true });
})();

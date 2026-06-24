(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  const section = document.querySelector("[data-section2-collage]");
  if (!section) return;

  gsap.registerPlugin(ScrollTrigger);

  const titleWrap = section.querySelector(".glimpse-copy");
  const title = section.querySelector(".glimpse-copy h2");
  const subtitle = section.querySelector(".glimpse-copy p");
  const grid = section.querySelector(".section2-collage .art-grid");
  const items = gsap.utils.toArray(".section2-collage .art-grid img");
  const viewAll = section.querySelector(".view-all");
  let section2Timeline = null;

  const collage = [
    { col: 0, row: 0, r: -1.2, z: 4 },
    { col: 1, row: 0, r: 0.4, z: 5 },
    { col: 2, row: 0, r: -0.3, z: 4 },
    { col: 3, row: 0, r: 0.7, z: 5 },
    { col: 0, row: 1, r: 0, z: 7 },
    { col: 1, row: 1, r: -0.2, z: 8 },
    { col: 2, row: 1, r: 0.2, z: 8 },
    { col: 3, row: 1, r: 0, z: 7 },
    { col: 0, row: 2, r: -0.6, z: 4 },
    { col: 1, row: 2, r: 0.8, z: 5 },
    { col: 2, row: 2, r: -0.4, z: 5 },
    { col: 3, row: 2, r: 0.6, z: 4 }
  ];

  function measureLayout() {
    const rect = section.getBoundingClientRect();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const mobile = window.matchMedia("(max-width: 809px)").matches;
    const tile = mobile
      ? Math.min(width * 0.31, 144)
      : gsap.utils.clamp(168, 330, Math.min(width * 0.155, height * 0.31));
    const gap = mobile ? Math.max(10, width * 0.018) : gsap.utils.clamp(18, 36, tile * 0.105);
    const gridWidth = tile * 4 + gap * 3;
    const gridHeight = tile * 3 + gap * 2;
    const left = (width - gridWidth) / 2;
    const top = mobile ? Math.max(64, height * 0.13) : gsap.utils.clamp(10, 42, height * 0.034);

    return { width, height, tile, gap, gridWidth, gridHeight, left, top, mobile, rect };
  }

  function placeInitial(layout) {
    items.forEach((item, index) => {
      const seed = collage[index % collage.length];
      const tile = layout.tile;
      const finalX = layout.left + seed.col * (tile + layout.gap);
      const finalY = layout.top + seed.row * (tile + layout.gap);

      item.dataset.finalX = String(finalX);
      item.dataset.finalY = String(finalY);
      item.dataset.finalR = String(seed.r);
      item.dataset.tile = String(tile);
      item.dataset.depth = String(Math.abs(seed.col - 1.5) + Math.abs(seed.row - 1));

      gsap.set(item, {
        width: tile,
        height: tile,
        x: finalX,
        y: finalY,
        rotation: seed.r,
        scale: 1,
        autoAlpha: 0.62,
        filter: "blur(5px) saturate(.78) contrast(.96)",
        zIndex: seed.z
      });
    });

    gsap.set(grid, {
      transformOrigin: "50% 50%",
      autoAlpha: 0,
      scale: 0.88,
      x: 0,
      y: layout.height * 0.28,
      rotation: 0,
      filter: "blur(8px)",
      force3D: true
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
        id: "section2-glimpse-collage",
        trigger: section,
        start: "top top",
        end: () => `+=${Math.max(1700, window.innerHeight * 2.2)}`,
        pin: true,
        scrub: 0.9,
        anticipatePin: 1,
        refreshPriority: 10,
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

    section2Timeline
      .to(grid, {
        autoAlpha: 0.28,
        y: layout.height * 0.16,
        scale: 0.93,
        filter: "blur(5px)",
        duration: 0.18,
        ease: "power2.out"
      }, 0.08)
      .to(grid, {
        autoAlpha: 0.98,
        scale: 1,
        y: -8,
        filter: "blur(0px)",
        duration: 0.62,
        ease: "power2.inOut"
      }, 0.22)
      .to(grid, {
        scale: 1.012,
        y: -26,
        duration: 0.42,
        ease: "power1.inOut"
      }, 0.86)
      .to(items, {
        autoAlpha: 0.92,
        filter: "blur(0px) saturate(.96) contrast(.99)",
        duration: 0.42,
        ease: "power2.out",
        stagger: { each: 0.006, from: "center" }
      }, 0.16)
      .to(titleWrap, {
        scale: 0.99,
        y: -8,
        duration: 0.72,
        ease: "power2.inOut"
      }, 0.20)
      .to(title, {
        autoAlpha: 0.9,
        duration: 0.46,
        ease: "none"
      }, 0.54);
  }

  buildSection2();

  window.addEventListener("resize", () => {
    buildSection2();
    ScrollTrigger.refresh();
  }, { passive: true });
})();

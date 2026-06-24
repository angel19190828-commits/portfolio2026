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
    { col: 0, row: 0, r: -1.2, startR: -16, dx: -0.22, dy: -0.12, z: 4 },
    { col: 1, row: 0, r: 0.6, startR: 10, dx: -0.08, dy: -0.16, z: 5 },
    { col: 2, row: 0, r: -0.4, startR: -8, dx: 0.08, dy: -0.15, z: 4 },
    { col: 3, row: 0, r: 0.8, startR: 12, dx: 0.22, dy: -0.12, z: 5 },
    { col: 0, row: 1, r: 0, startR: 0, dx: -0.24, dy: 0.02, z: 7 },
    { col: 1, row: 1, r: -0.2, startR: -5, dx: -0.08, dy: 0.02, z: 8 },
    { col: 2, row: 1, r: 0.2, startR: 6, dx: 0.08, dy: 0.02, z: 8 },
    { col: 3, row: 1, r: 0, startR: -2, dx: 0.24, dy: 0.02, z: 7 },
    { col: 0, row: 2, r: -0.7, startR: -10, dx: -0.22, dy: 0.17, z: 4 },
    { col: 1, row: 2, r: 1.0, startR: 13, dx: -0.08, dy: 0.18, z: 5 },
    { col: 2, row: 2, r: -0.5, startR: -11, dx: 0.08, dy: 0.18, z: 5 },
    { col: 3, row: 2, r: 0.7, startR: 11, dx: 0.22, dy: 0.17, z: 4 }
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
    const top = mobile ? Math.max(64, height * 0.13) : gsap.utils.clamp(-8, 38, height * 0.026);

    return { width, height, tile, gap, gridWidth, gridHeight, left, top, mobile, rect };
  }

  function placeInitial(layout) {
    items.forEach((item, index) => {
      const seed = collage[index % collage.length];
      const tile = layout.tile;
      const finalX = layout.left + seed.col * (tile + layout.gap);
      const finalY = layout.top + seed.row * (tile + layout.gap);
      const centerX = layout.width / 2 - tile / 2;
      const centerY = layout.height / 2 - tile / 2;
      const startX = centerX + seed.dx * layout.gridWidth * 0.42;
      const startY = centerY + seed.dy * layout.gridHeight * 0.42;

      item.dataset.finalX = String(finalX);
      item.dataset.finalY = String(finalY);
      item.dataset.startX = String(startX);
      item.dataset.startY = String(startY);
      item.dataset.startR = String(seed.startR);
      item.dataset.startS = "0.78";
      item.dataset.finalR = String(seed.r);
      item.dataset.tile = String(tile);
      item.dataset.depth = String(Math.abs(seed.col - 1.5) + Math.abs(seed.row - 1));

      gsap.set(item, {
        width: tile,
        height: tile,
        x: startX,
        y: startY,
        rotation: seed.startR,
        scale: 0.78,
        autoAlpha: 0,
        filter: "blur(7px) saturate(.72)",
        zIndex: seed.z
      });
    });

    gsap.set(grid, {
      transformOrigin: "50% 50%",
      scale: 1.08,
      x: 0,
      y: 26,
      rotation: 0.35,
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
        trigger: section,
        start: "top top",
        end: () => `+=${Math.max(2100, window.innerHeight * 2.65)}`,
        pin: true,
        scrub: 1.05,
        anticipatePin: 1,
        refreshPriority: 2,
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
      const row = Math.floor(index / 4);
      const col = index % 4;
      const start = 0.14 + row * 0.038 + Math.abs(col - 1.5) * 0.018;
      const settleY = Number(item.dataset.finalY) + (row - 1) * 2;
      section2Timeline
        .to(item, {
          autoAlpha: 0.9,
          filter: "blur(2px) saturate(.88)",
          duration: 0.18,
          ease: "power2.out"
        }, start)
        .to(item, {
          x: Number(item.dataset.finalX),
          y: Number(item.dataset.finalY),
          rotation: Number(item.dataset.finalR),
          scale: 1.025,
          duration: 0.66,
          ease: "power2.inOut"
        }, start + 0.02)
        .to(item, {
          x: Number(item.dataset.finalX),
          y: settleY,
          rotation: Number(item.dataset.finalR) * 0.7,
          scale: 1,
          filter: "blur(0px) saturate(.96) contrast(.99)",
          duration: 0.28,
          ease: "back.out(1.18)"
        }, start + 0.66);
    });

    section2Timeline
      .to(grid, {
        scale: 1,
        y: 0,
        rotation: 0,
        duration: 0.88,
        ease: "power2.inOut"
      }, 0.12)
      .to(grid, {
        scale: 0.992,
        y: -12,
        duration: 0.36,
        ease: "power1.inOut"
      }, 0.86)
      .to(titleWrap, {
        scale: 0.985,
        y: -4,
        duration: 0.7,
        ease: "power2.inOut"
      }, 0.20)
      .to(title, {
        autoAlpha: 0.92,
        duration: 0.44,
        ease: "none"
      }, 0.52)
      .to(items, {
        y: (index, item) => Number(item.dataset.finalY) + (Math.floor(index / 4) - 1) * 2,
        duration: 0.28,
        ease: "power1.inOut",
        stagger: { each: 0.01, from: "center" }
      }, 0.92);
  }

  buildSection2();

  window.addEventListener("resize", () => {
    buildSection2();
    ScrollTrigger.refresh();
  }, { passive: true });
})();

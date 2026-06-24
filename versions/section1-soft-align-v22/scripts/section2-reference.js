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
    { col: 0, row: 0, r: -1.1, startR: -4.0, dy: 156, s: 0.93, o: 0.12, z: 4 },
    { col: 1, row: 0, r: 0.5, startR: 3.0, dy: 118, s: 0.96, o: 0.24, z: 5 },
    { col: 2, row: 0, r: -0.4, startR: -2.8, dy: 142, s: 0.95, o: 0.18, z: 4 },
    { col: 3, row: 0, r: 0.7, startR: 3.6, dy: 104, s: 0.97, o: 0.28, z: 5 },
    { col: 0, row: 1, r: 0, startR: 1.6, dy: 90, s: 0.97, o: 0.32, z: 7 },
    { col: 1, row: 1, r: -0.2, startR: -2.2, dy: 130, s: 0.94, o: 0.2, z: 8 },
    { col: 2, row: 1, r: 0.2, startR: 2.0, dy: 108, s: 0.96, o: 0.26, z: 8 },
    { col: 3, row: 1, r: 0, startR: -1.5, dy: 148, s: 0.93, o: 0.18, z: 7 },
    { col: 0, row: 2, r: -0.6, startR: -3.2, dy: 122, s: 0.95, o: 0.2, z: 4 },
    { col: 1, row: 2, r: 0.8, startR: 3.8, dy: 166, s: 0.92, o: 0.1, z: 5 },
    { col: 2, row: 2, r: -0.4, startR: -3.0, dy: 136, s: 0.94, o: 0.18, z: 5 },
    { col: 3, row: 2, r: 0.6, startR: 2.6, dy: 108, s: 0.96, o: 0.26, z: 4 }
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
    const top = mobile ? Math.max(88, height * 0.17) : gsap.utils.clamp(76, 108, height * 0.12);

    return { width, height, tile, gap, gridWidth, gridHeight, left, top, mobile, rect };
  }

  function placeInitial(layout) {
    items.forEach((item, index) => {
      const seed = collage[index % collage.length];
      const tile = layout.tile;
      const finalX = layout.left + seed.col * (tile + layout.gap);
      const finalY = layout.top + seed.row * (tile + layout.gap);
      const startX = finalX;
      const startY = finalY + seed.dy;

      item.dataset.finalX = String(finalX);
      item.dataset.finalY = String(finalY);
      item.dataset.startX = String(startX);
      item.dataset.startY = String(startY);
      item.dataset.startR = String(seed.startR);
      item.dataset.startS = String(seed.s);
      item.dataset.startO = String(seed.o);
      item.dataset.finalR = String(seed.r);
      item.dataset.tile = String(tile);
      item.dataset.depth = String(Math.abs(seed.col - 1.5) + Math.abs(seed.row - 1));

      gsap.set(item, {
        width: tile,
        height: tile,
        x: startX,
        y: startY,
        rotation: seed.startR,
        scale: seed.s,
        autoAlpha: seed.o,
        filter: "blur(6px) saturate(.78) contrast(.96)",
        zIndex: seed.z
      });
    });

    gsap.set(grid, {
      transformOrigin: "50% 50%",
      scale: 0.99,
      x: 0,
      y: 28,
      rotation: 0,
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
        end: () => `+=${Math.max(1850, window.innerHeight * 2.45)}`,
        pin: true,
        scrub: 0.92,
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

    items.forEach((item, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const finalX = Number(item.dataset.finalX);
      const finalY = Number(item.dataset.finalY);
      const finalR = Number(item.dataset.finalR);
      const start = 0.08 + row * 0.026 + Math.abs(col - 1.5) * 0.012;
      section2Timeline
        .to(item, {
          autoAlpha: 0.7,
          filter: "blur(2px) saturate(.88) contrast(.98)",
          duration: 0.22,
          ease: "power2.out"
        }, start)
        .to(item, {
          x: finalX,
          y: finalY - 6,
          rotation: finalR,
          scale: 1.012,
          autoAlpha: 0.96,
          duration: 0.76,
          ease: "power3.out"
        }, start + 0.02)
        .to(item, {
          x: finalX,
          y: finalY,
          rotation: finalR * 0.78,
          scale: 1,
          filter: "blur(0px) saturate(.96) contrast(.99)",
          autoAlpha: 1,
          duration: 0.26,
          ease: "power2.out"
        }, start + 0.76);
    });

    section2Timeline
      .to(grid, {
        scale: 1.006,
        y: -8,
        rotation: 0,
        duration: 0.92,
        ease: "power2.out"
      }, 0.04)
      .to(grid, {
        scale: 1,
        y: -18,
        duration: 0.34,
        ease: "power1.inOut"
      }, 0.86)
      .to(titleWrap, {
        scale: 0.985,
        y: -6,
        duration: 0.7,
        ease: "power2.inOut"
      }, 0.20)
      .to(title, {
        autoAlpha: 0.92,
        duration: 0.44,
        ease: "none"
      }, 0.52)
      .to(items, {
        autoAlpha: 1,
        duration: 0.18,
        ease: "none",
        stagger: { each: 0.006, from: "center" }
      }, 0.92);
  }

  buildSection2();

  window.addEventListener("resize", () => {
    buildSection2();
    ScrollTrigger.refresh();
  }, { passive: true });
})();

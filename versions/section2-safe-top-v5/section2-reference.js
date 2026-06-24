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
  let resizeTimer = null;

  const collage = [
    { col: 0, row: 0, r: -1.1, startR: -3.4, dy: 176, s: 0.90, o: 0.10, z: 4, depth: -1 },
    { col: 1, row: 0, r: 0.5, startR: 2.6, dy: 138, s: 0.93, o: 0.20, z: 5, depth: 0 },
    { col: 2, row: 0, r: -0.4, startR: -2.4, dy: 162, s: 0.92, o: 0.16, z: 4, depth: -1 },
    { col: 3, row: 0, r: 0.7, startR: 3.0, dy: 122, s: 0.94, o: 0.24, z: 5, depth: 0 },
    { col: 0, row: 1, r: 0, startR: 1.4, dy: 106, s: 0.94, o: 0.30, z: 7, depth: 0 },
    { col: 1, row: 1, r: -0.2, startR: -1.9, dy: 150, s: 0.91, o: 0.18, z: 10, depth: 1 },
    { col: 2, row: 1, r: 0.2, startR: 1.8, dy: 128, s: 0.93, o: 0.24, z: 10, depth: 1 },
    { col: 3, row: 1, r: 0, startR: -1.3, dy: 166, s: 0.91, o: 0.16, z: 7, depth: 0 },
    { col: 0, row: 2, r: -0.6, startR: -2.8, dy: 140, s: 0.92, o: 0.18, z: 4, depth: -1 },
    { col: 1, row: 2, r: 0.8, startR: 3.2, dy: 184, s: 0.90, o: 0.10, z: 5, depth: 0 },
    { col: 2, row: 2, r: -0.4, startR: -2.6, dy: 154, s: 0.91, o: 0.16, z: 5, depth: 0 },
    { col: 3, row: 2, r: 0.6, startR: 2.2, dy: 128, s: 0.93, o: 0.24, z: 4, depth: -1 }
  ];

  function measureLayout() {
    const rect = section.getBoundingClientRect();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const mobile = window.matchMedia("(max-width: 809px)").matches;
    const tile = mobile
      ? Math.min(width * 0.36, 164)
      : gsap.utils.clamp(190, 380, Math.min(width * 0.178, height * 0.37));
    const gap = mobile ? Math.max(10, width * 0.016) : gsap.utils.clamp(16, 32, tile * 0.082);
    const gridWidth = tile * 4 + gap * 3;
    const gridHeight = tile * 3 + gap * 2;
    const left = (width - gridWidth) / 2;
    const top = mobile ? Math.max(82, height * 0.14) : gsap.utils.clamp(106, 138, height * 0.125);

    return { width, height, tile, gap, gridWidth, gridHeight, left, top, mobile, rect };
  }

  function placeInitial(layout) {
    section.classList.remove("is-section2-active");
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
      item.dataset.layer = String(seed.depth);

      gsap.set(item, {
        width: tile,
        height: tile,
        x: startX,
        y: startY,
        rotation: seed.startR,
        scale: seed.s,
        autoAlpha: seed.o,
        filter: `blur(6px) saturate(${seed.depth > 0 ? ".86" : ".76"}) contrast(.96)`,
        zIndex: seed.z
      });
    });

    gsap.set(grid, {
      autoAlpha: 0,
      transformOrigin: "50% 50%",
      scale: 0.94,
      x: 0,
      y: 58,
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
        onEnter: () => {
          section.classList.add("is-section2-active");
          gsap.set(grid, { autoAlpha: 1 });
        },
        onEnterBack: () => {
          section.classList.add("is-section2-active");
          gsap.set(grid, { autoAlpha: 1 });
        },
        onLeaveBack: () => {
          section.classList.remove("is-section2-active");
          gsap.set(grid, { autoAlpha: 0 });
        },
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

    section2Timeline.set(grid, { autoAlpha: 1 }, 0.001);

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
          scale: 1.035 + Math.max(0, Number(item.dataset.layer)) * 0.018,
          autoAlpha: 0.96,
          duration: 0.76,
          ease: "power3.out"
        }, start + 0.02)
        .to(item, {
          x: finalX,
          y: finalY,
          rotation: finalR * 0.78,
          scale: 1 + Math.max(0, Number(item.dataset.layer)) * 0.012,
          filter: `blur(0px) saturate(${Number(item.dataset.layer) > 0 ? "1.02" : ".96"}) contrast(.99)`,
          autoAlpha: Number(item.dataset.layer) > 0 ? 0.88 : 1,
          duration: 0.26,
          ease: "power2.out"
        }, start + 0.76);
    });

    section2Timeline
      .to(grid, {
        scale: 1.055,
        y: -8,
        rotation: 0,
        duration: 0.98,
        ease: "power2.out"
      }, 0.04)
      .to(grid, {
        scale: 1.022,
        y: -18,
        duration: 0.42,
        ease: "power2.inOut"
      }, 0.86)
      .to(titleWrap, {
        scale: 0.982,
        y: -10,
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
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      buildSection2();
      ScrollTrigger.refresh();
    }, 160);
  }, { passive: true });
})();

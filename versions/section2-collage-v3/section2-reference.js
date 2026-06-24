(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  const section = document.querySelector("[data-section2-collage]");
  if (!section) return;

  gsap.registerPlugin(ScrollTrigger);

  const titleWrap = section.querySelector(".glimpse-copy");
  const title = section.querySelector(".glimpse-copy h2");
  const subtitle = section.querySelector(".glimpse-copy p");
  const grid = section.querySelector(".art-grid");
  const items = gsap.utils.toArray(".section2-collage .art-grid img");
  const viewAll = section.querySelector(".view-all");
  let section2Timeline = null;

  const scatter = [
    { x: -0.06, y: 0.38, r: -8, s: 0.72 },
    { x: 0.28, y: 0.28, r: -12, s: 0.84 },
    { x: 0.47, y: 0.17, r: 10, s: 0.74 },
    { x: 0.72, y: 0.15, r: 2, s: 0.78 },
    { x: 0.89, y: 0.24, r: -4, s: 0.82 },
    { x: 0.16, y: 0.57, r: 7, s: 0.78 },
    { x: 0.35, y: 0.59, r: -6, s: 0.88 },
    { x: 0.62, y: 0.54, r: 8, s: 0.82 },
    { x: 0.83, y: 0.53, r: -7, s: 0.76 },
    { x: 0.22, y: 0.82, r: -3, s: 0.76 },
    { x: 0.48, y: 0.84, r: 9, s: 0.8 },
    { x: 0.76, y: 0.79, r: -10, s: 0.72 }
  ];

  function measureLayout() {
    const rect = section.getBoundingClientRect();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const mobile = window.matchMedia("(max-width: 809px)").matches;
    const tile = mobile
      ? Math.min(width * 0.28, 136)
      : gsap.utils.clamp(120, 178, width * 0.116);
    const gap = mobile ? 8 : 12;
    const cols = mobile ? 3 : 4;
    const rows = mobile ? 4 : 3;
    const gridW = cols * tile + (cols - 1) * gap;
    const gridH = rows * tile + (rows - 1) * gap;
    const left = mobile ? (width - gridW) / 2 : width * 0.545 - gridW * 0.08;
    const top = mobile ? height * 0.22 : height * 0.19;

    return { width, height, tile, gap, cols, rows, gridW, gridH, left, top, rect };
  }

  function placeInitial(layout) {
    items.forEach((item, index) => {
      const col = index % layout.cols;
      const row = Math.floor(index / layout.cols);
      const finalX = layout.left + col * (layout.tile + layout.gap);
      const finalY = layout.top + row * (layout.tile + layout.gap);
      const seed = scatter[index % scatter.length];
      const startX = seed.x * layout.width - layout.tile / 2;
      const startY = seed.y * layout.height - layout.tile / 2;

      item.dataset.finalX = String(finalX);
      item.dataset.finalY = String(finalY);
      item.dataset.startX = String(startX);
      item.dataset.startY = String(startY);
      item.dataset.startR = String(seed.r);
      item.dataset.startS = String(seed.s);

      gsap.set(item, {
        width: layout.tile,
        height: layout.tile,
        x: startX,
        y: startY,
        rotation: seed.r,
        scale: seed.s,
        autoAlpha: 0,
        filter: "blur(8px) saturate(.7)",
        zIndex: index + 1
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
        end: () => `+=${Math.max(2600, window.innerHeight * 3.2)}`,
        pin: true,
        scrub: 0.9,
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
      const start = 0.18 + (index % 4) * 0.022 + Math.floor(index / 4) * 0.035;
      section2Timeline
        .to(item, {
          autoAlpha: 0.92,
          filter: "blur(0px) saturate(.88)",
          duration: 0.18,
          ease: "power2.out"
        }, start)
        .to(item, {
          x: Number(item.dataset.finalX),
          y: Number(item.dataset.finalY),
          rotation: index % 2 ? 2 : -2,
          scale: 1.02,
          duration: 0.76,
          ease: "power2.inOut"
        }, start + 0.04)
        .to(item, {
          rotation: 0,
          scale: 1,
          filter: "blur(0px) saturate(.96)",
          duration: 0.24,
          ease: "power3.out"
        }, start + 0.74);
    });

    section2Timeline
      .to(titleWrap, {
        x: () => window.innerWidth < 810 ? 0 : -window.innerWidth * 0.075,
        scale: 0.98,
        duration: 0.72,
        ease: "power2.inOut"
      }, 0.36)
      .to(title, {
        autoAlpha: 0.86,
        duration: 0.42,
        ease: "none"
      }, 0.72)
      .to(items, {
        y: (index, item) => Number(item.dataset.finalY) - 18,
        duration: 0.42,
        ease: "power2.out",
        stagger: { each: 0.018, from: "center" }
      }, 1.08)
      .to(items, {
        y: (index, item) => Number(item.dataset.finalY),
        duration: 0.28,
        ease: "power2.out",
        stagger: { each: 0.012, from: "center" }
      }, 1.38);
  }

  buildSection2();

  window.addEventListener("resize", () => {
    buildSection2();
    ScrollTrigger.refresh();
  }, { passive: true });
})();

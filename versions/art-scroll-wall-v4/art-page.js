(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  const page = document.querySelector(".art-page");
  const stage = document.querySelector(".art-stage");
  const title = document.querySelector(".art-title");
  const columns = gsap.utils.toArray(".art-column");
  const images = gsap.utils.toArray(".art-column img");
  const cue = document.querySelector(".art-scroll-cue");

  if (!page || !stage || !title || !columns.length) return;

  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    gsap.set([title, columns, images], { clearProps: "all" });
    return;
  }

  const columnBase = [-220, -360, -250, -310];
  const columnTravel = [-1320, 1120, -1240, 980];

  gsap.set(title, {
    autoAlpha: 0,
    y: 18,
    scale: 0.985,
    filter: "blur(8px)"
  });

  gsap.set(images, {
    autoAlpha: 0,
    y: 70,
    scale: 0.965,
    filter: "blur(10px) saturate(.82)"
  });

  columns.forEach((column, index) => {
    gsap.set(column, {
      y: columnBase[index] || 0,
      force3D: true
    });
  });

  const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
  intro
    .to(title, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 0.8
    }, 0.08)
    .to(images, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px) saturate(.96)",
      stagger: { each: 0.025, from: "center" },
      duration: 0.9
    }, 0.16);

  ScrollTrigger.create({
    id: "art-page-image-wall",
    trigger: stage,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.9,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const p = self.progress;
      columns.forEach((column, index) => {
        const base = columnBase[index] || 0;
        const travel = columnTravel[index] || 0;
        const drift = Math.sin((p * Math.PI * 1.15) + index * 0.6) * 24;
        gsap.set(column, {
          y: base + travel * p + drift,
          x: (index - 1.5) * Math.sin(p * Math.PI) * 8
        });
      });

      gsap.set(title, {
        y: -42 * p,
        scale: 1 - p * 0.035,
        autoAlpha: gsap.utils.clamp(0.35, 1, 1 - p * 0.42),
        filter: `blur(${p * 2.2}px)`
      });

      if (cue) {
        gsap.set(cue, {
          autoAlpha: gsap.utils.clamp(0, 1, 1 - p * 4),
          y: p * 18
        });
      }
    }
  });

  images.forEach((image) => {
    image.addEventListener("mouseenter", () => {
      gsap.to(image, {
        scale: 0.985,
        filter: "saturate(1.08) contrast(1.03)",
        duration: 0.45,
        ease: "power3.out",
        overwrite: true
      });
    });

    image.addEventListener("mouseleave", () => {
      gsap.to(image, {
        scale: 1,
        filter: "saturate(.96) contrast(1)",
        duration: 0.55,
        ease: "power3.out",
        overwrite: true
      });
    });
  });

  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
})();

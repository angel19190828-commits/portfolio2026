(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (!document.querySelector(".art-section")) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  gsap.registerPlugin(ScrollTrigger);

  const artItems = gsap.utils.toArray(".art-grid img");
  if (!artItems.length) return;

  gsap.fromTo(artItems,
    { autoAlpha: 0, y: 70, filter: "blur(10px)", scale: 0.985 },
    {
      autoAlpha: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      stagger: { each: 0.055, from: "center" },
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: ".art-section", start: "top 72%" }
    }
  );

  gsap.to(artItems, {
    y: (index) => index % 2 === 0 ? -54 : 36,
    scale: (index) => index % 3 === 0 ? 1.035 : 1,
    filter: (index) => index % 2 === 0 ? "saturate(1.04)" : "saturate(.92)",
    ease: "none",
    scrollTrigger: {
      trigger: ".art-section",
      start: "top bottom",
      end: "bottom top",
      scrub: 0.8
    }
  });
})();

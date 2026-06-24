(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  const section = document.querySelector(".featured-work");
  const stack = document.querySelector(".project-stack");
  if (!section || !stack) return;

  gsap.registerPlugin(ScrollTrigger);

  const cards = gsap.utils.toArray(".stack-card");
  const orbitItems = gsap.utils.toArray(".orbit-copy span");
  const isMobile = () => window.matchMedia("(max-width: 809px)").matches;
  let activeIndex = -1;

  function setActive(index) {
    const clamped = gsap.utils.clamp(0, cards.length - 1, index);
    if (clamped === activeIndex) return;
    activeIndex = clamped;

    cards.forEach((card, cardIndex) => {
      card.classList.toggle("is-current", cardIndex === clamped);
      card.setAttribute("aria-current", cardIndex === clamped ? "true" : "false");
    });

    orbitItems.forEach((item) => item.classList.remove("active-orbit", "near-orbit"));

    const orbitIndex = Number(cards[clamped]?.dataset.orbit || clamped + 6);
    orbitItems[orbitIndex]?.classList.add("active-orbit");
    orbitItems[orbitIndex - 1]?.classList.add("near-orbit");
    orbitItems[orbitIndex + 1]?.classList.add("near-orbit");
  }

  gsap.set(cards, {
    autoAlpha: 0,
    y: 42,
    filter: "blur(8px)",
    pointerEvents: "none"
  });

  const segment = 1;
  const total = cards.length * segment + 0.65;

  function indexFromProgress(progress) {
    const time = gsap.utils.clamp(0, 0.999, progress) * total;
    return Math.min(cards.length - 1, Math.max(0, Math.floor((time - 0.08) / segment)));
  }

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${Math.max(3000, window.innerHeight * 4.8)}`,
      pin: true,
      scrub: 0.85,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        setActive(indexFromProgress(self.progress));
      },
      onRefresh: (self) => {
        setActive(indexFromProgress(self.progress || 0));
      }
    }
  });

  tl.to(".orbit-copy", {
    rotation: () => isMobile() ? -54 : -82,
    y: () => isMobile() ? -300 : -520,
    x: () => isMobile() ? -24 : -4,
    scale: () => isMobile() ? 0.76 : 1,
    duration: total
  }, 0);

  cards.forEach((card, index) => {
    const enterAt = index * segment + 0.08;
    const hold = index === cards.length - 1 ? 0.82 : 0.58;

    tl.fromTo(card,
      { autoAlpha: 0, y: 42, filter: "blur(8px)" },
      { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.26, ease: "power2.out" },
      enterAt
    );

    tl.to(card, {
      autoAlpha: 1,
      y: 0,
      filter: "blur(0px)",
      duration: hold
    }, enterAt + 0.26);

    if (index < cards.length - 1) {
      tl.to(card, {
        autoAlpha: 0,
        y: -30,
        filter: "blur(6px)",
        duration: 0.22,
        ease: "power2.in"
      }, enterAt + 0.26 + hold);
    } else {
      tl.to(card, {
        autoAlpha: 0,
        y: -36,
        filter: "blur(8px)",
        duration: 0.36,
        ease: "power2.in"
      }, enterAt + 0.26 + hold);
    }
  });

  setActive(0);
})();

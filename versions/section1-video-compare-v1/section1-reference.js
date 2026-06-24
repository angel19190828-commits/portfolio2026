(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  const section = document.querySelector(".featured-work");
  const orbit = document.querySelector(".orbit-copy");
  const stack = document.querySelector(".project-stack");
  if (!section || !orbit || !stack) return;

  gsap.registerPlugin(ScrollTrigger);

  const cards = gsap.utils.toArray(".stack-card");
  const orbitItems = gsap.utils.toArray(".orbit-copy span");
  const complete = document.querySelector(".work-complete");
  const isMobile = () => window.matchMedia("(max-width: 809px)").matches;
  let activeIndex = -1;
  let completeShown = false;
  const orbitItemTops = [580, 690, 800, 892, 976];
  const orbitItemLefts = [318, 340, 322, 280, 226];

  function orbitIndexForCard(index) {
    return Number(cards[index]?.dataset.orbit || index + 6);
  }

  function setOrbitActive(index) {
    const orbitIndex = orbitIndexForCard(index);
    orbitItems.forEach((item, itemIndex) => {
      item.classList.toggle("active-orbit", itemIndex === orbitIndex);
      item.classList.toggle("near-orbit", Math.abs(itemIndex - orbitIndex) === 1);
    });
  }

  function showCard(index, immediate) {
    cards.forEach((card, cardIndex) => {
      const selected = cardIndex === index;
      card.classList.toggle("is-current", selected);
      card.setAttribute("aria-current", selected ? "true" : "false");

      gsap.killTweensOf(card);

      if (selected) {
        gsap.to(card, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          pointerEvents: "auto",
          duration: immediate ? 0 : 0.08,
          ease: "power2.out",
          overwrite: true
        });
      } else {
        gsap.to(card, {
          autoAlpha: 0,
          y: -18,
          filter: "blur(0px)",
          pointerEvents: "none",
          duration: immediate ? 0 : 0.08,
          ease: "power1.out",
          overwrite: true
        });
      }
    });
  }

  function setCompleteVisible(visible) {
    if (!complete || visible === completeShown) return;
    completeShown = visible;

    gsap.to(complete, {
      autoAlpha: visible ? 1 : 0,
      y: visible ? 0 : 24,
      pointerEvents: visible ? "auto" : "none",
      duration: visible ? 0.18 : 0.12,
      ease: "power2.out",
      overwrite: true
    });
  }

  function setActive(index, immediate) {
    const clamped = gsap.utils.clamp(0, cards.length - 1, index);
    if (clamped === activeIndex && !immediate) return;
    activeIndex = clamped;
    setOrbitActive(clamped);
    showCard(clamped, immediate);
  }

  function moveOrbitTo(index, progress, immediate) {
    const activeOrbit = orbitIndexForCard(index);
    const local = activeOrbit - 6;
    const focusY = index === cards.length - 1 && progress > 0.76 ? 330 : 540;
    const focusX = isMobile() ? 250 : 330;
    const baseTop = orbitItemTops[local] || orbitItemTops[0];
    const baseLeft = orbitItemLefts[local] || orbitItemLefts[0];

    gsap.to(orbit, {
      x: focusX - baseLeft,
      y: focusY - baseTop,
      rotation: isMobile() ? -local * 7 : -local * 8,
      scale: isMobile() ? 0.76 : 1,
      duration: immediate ? 0 : 0.28,
      ease: "power2.out",
      overwrite: true
    });
  }

  gsap.set(cards, {
    autoAlpha: 0,
    y: 18,
    filter: "blur(0px)",
    pointerEvents: "none"
  });

  if (complete) {
    gsap.set(complete, {
      autoAlpha: 0,
      y: 24,
      pointerEvents: "none"
    });
  }

  setActive(0, true);
  moveOrbitTo(0, 0, true);

  const holdProgress = 0.88;
  const projectCount = cards.length;

  function activeFromProgress(progress) {
    const p = gsap.utils.clamp(0, 0.999, progress);
    if (p >= holdProgress) return projectCount - 1;
    return Math.min(projectCount - 1, Math.floor((p / holdProgress) * projectCount));
  }

  ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${Math.max(4300, window.innerHeight * 6.7)}`,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const index = activeFromProgress(self.progress);
        setActive(index, false);
        moveOrbitTo(index, self.progress, false);
        setCompleteVisible(self.progress > 0.86);
      },
      onRefresh: (self) => {
        const index = activeFromProgress(self.progress || 0);
        setActive(index, true);
        moveOrbitTo(index, self.progress || 0, true);
        setCompleteVisible((self.progress || 0) > 0.86);
      }
  });
})();

(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  const section = document.querySelector(".featured-work");
  const orbit = document.querySelector(".orbit-copy");
  const stack = document.querySelector(".project-stack");
  if (!section || !orbit || !stack) return;

  gsap.registerPlugin(ScrollTrigger);

  const cards = gsap.utils.toArray(".stack-card");
  const completeLink = document.querySelector(".work-complete");
  let orbitItems = gsap.utils.toArray(".orbit-copy span");
  const focusDot = document.querySelector(".wheel-focus-dot");
  const isMobile = () => window.matchMedia("(max-width: 809px)").matches;

  let activeIndex = -1;
  let projectAngles = [];
  let currentRotation = 0;

  function extendOrbitForLoopRead() {
    if (orbit.dataset.extended === "true") return;
    const baseItems = orbitItems.slice();
    baseItems.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.classList.remove("active-orbit", "near-orbit", "active-dot");
      clone.setAttribute("aria-hidden", "true");
      clone.dataset.loopCopy = "true";
      orbit.appendChild(clone);
    });
    orbit.dataset.extended = "true";
    orbitItems = gsap.utils.toArray(".orbit-copy span");
  }

  function orbitIndexForCard(index) {
    return Number(cards[index]?.dataset.orbit || index + 6);
  }

  function layoutWheel() {
    const mobile = isMobile();
    const size = mobile ? 980 : 1440;
    const center = size / 2;
    const radius = mobile ? 500 : 720;
    const focusX = mobile ? 148 : Math.min(window.innerWidth * 0.17, 330);
    const focusY = mobile ? 284 : window.innerHeight * 0.5;
    const wheelLeft = focusX - center - radius;
    const wheelTop = focusY - center;
    const step = mobile ? 11.5 : 10.6;
    const firstProjectOrbitIndex = orbitIndexForCard(0);

    orbit.style.left = `${wheelLeft}px`;
    orbit.style.top = `${wheelTop}px`;
    orbit.style.width = `${size}px`;
    orbit.style.height = `${size}px`;
    orbit.style.transformOrigin = `${center}px ${center}px`;

    if (focusDot) {
      focusDot.style.left = `${focusX - (mobile ? 36 : 48)}px`;
      focusDot.style.top = `${focusY - 6}px`;
    }

    orbitItems.forEach((item, index) => {
      const angle = (index - firstProjectOrbitIndex) * step;
      const radians = angle * Math.PI / 180;
      const x = center + Math.cos(radians) * radius;
      const y = center + Math.sin(radians) * radius;

      gsap.set(item, {
        x,
        y,
        xPercent: 0,
        yPercent: -50,
        rotation: angle - 2,
        transformOrigin: "left center"
      });
    });

    projectAngles = cards.map((_, index) => {
      const orbitIndex = orbitIndexForCard(index);
      return (orbitIndex - firstProjectOrbitIndex) * step;
    });

    gsap.set(orbit, { rotation: currentRotation, x: 0, y: 0, scale: 1 });
    setActive(0, true);
  }

  function setActive(index, immediate) {
    const clamped = gsap.utils.clamp(0, cards.length - 1, index);
    if (clamped === activeIndex && !immediate) return;
    activeIndex = clamped;

    const activeOrbit = orbitIndexForCard(clamped);
    orbitItems.forEach((item, itemIndex) => {
      item.classList.toggle("active-orbit", itemIndex === activeOrbit);
      item.classList.toggle("near-orbit", Math.abs(itemIndex - activeOrbit) === 1 && !item.dataset.loopCopy);
    });

    cards.forEach((card, cardIndex) => {
      const selected = cardIndex === clamped;
      card.classList.toggle("is-current", selected);
      card.setAttribute("aria-current", selected ? "true" : "false");
      gsap.to(card, {
        autoAlpha: selected ? 1 : 0,
        y: selected ? 0 : -12,
        filter: selected ? "blur(0px)" : "blur(1px)",
        pointerEvents: selected ? "auto" : "none",
        duration: immediate ? 0 : 0.18,
        ease: selected ? "power2.out" : "power1.out",
        overwrite: true
      });
    });
  }

  function rotationFromProgress(progress) {
    const p = gsap.utils.clamp(0, 0.999, progress);
    const carouselProgress = gsap.utils.clamp(0, 1, p / 0.82);
    const first = projectAngles[0] || 0;
    const last = projectAngles[cards.length - 1] || first;
    return -gsap.utils.interpolate(first, last, carouselProgress);
  }

  function activeFromProgress(progress) {
    const carouselProgress = gsap.utils.clamp(0, 0.999, progress / 0.82);
    const index = Math.floor(carouselProgress * cards.length);
    return gsap.utils.clamp(0, cards.length - 1, index);
  }

  function renderWheel(progress, immediate) {
    const p = gsap.utils.clamp(0, 0.999, progress);
    currentRotation = rotationFromProgress(p);
    gsap.set(orbit, { rotation: currentRotation });
    setActive(activeFromProgress(p), immediate);

    const outro = gsap.utils.clamp(0, 1, (p - 0.82) / 0.18);
    gsap.set(stack, {
      autoAlpha: 1 - outro,
      y: -28 * outro
    });
    gsap.set([orbit, focusDot].filter(Boolean), {
      autoAlpha: 1 - outro
    });
    if (completeLink) {
      gsap.set(completeLink, {
        autoAlpha: outro,
        y: 18 * (1 - outro),
        pointerEvents: outro > 0.5 ? "auto" : "none"
      });
    }
  }

  gsap.set(cards, {
    autoAlpha: 0,
    y: 24,
    filter: "blur(1px)",
    pointerEvents: "none"
  });
  gsap.set(completeLink, { autoAlpha: 0, y: 18, pointerEvents: "none" });

  extendOrbitForLoopRead();
  layoutWheel();

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: () => `+=${Math.max(4200, window.innerHeight * 6.2)}`,
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      renderWheel(self.progress, false);
    },
    onRefresh: (self) => {
      layoutWheel();
      renderWheel(self.progress || 0, true);
    }
  });

  window.addEventListener("resize", () => {
    layoutWheel();
    ScrollTrigger.refresh();
  }, { passive: true });
})();

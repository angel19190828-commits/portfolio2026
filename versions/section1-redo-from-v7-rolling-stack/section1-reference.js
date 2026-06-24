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
  const settleEase = gsap.parseEase("power2.inOut");

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
    const previousIndex = activeIndex < 0 ? clamped : activeIndex;
    const direction = clamped >= previousIndex ? 1 : -1;
    activeIndex = clamped;

    const activeOrbit = orbitIndexForCard(clamped);
    orbitItems.forEach((item, itemIndex) => {
      item.classList.toggle("active-orbit", itemIndex === activeOrbit);
      item.classList.toggle("near-orbit", Math.abs(itemIndex - activeOrbit) === 1 && !item.dataset.loopCopy);
    });

    if (!immediate) {
      gsap.fromTo(orbit,
        { rotation: currentRotation - direction * 0.48 },
        {
          rotation: currentRotation,
          duration: 0.46,
          ease: "elastic.out(0.72, 0.7)",
          overwrite: "auto"
        }
      );
    }
  }

  function rollingPosition(progress) {
    const carouselProgress = gsap.utils.clamp(0, 1, progress / 0.82);
    const transitions = Math.max(1, cards.length - 1);
    if (carouselProgress >= 0.999) return cards.length - 1;

    const stage = carouselProgress * transitions;
    const segment = Math.min(transitions - 1, Math.floor(stage));
    const local = stage - segment;
    const hold = 0.18;

    if (local <= hold) return segment;
    if (local >= 1 - hold) return segment + 1;

    const easedLocal = settleEase((local - hold) / (1 - hold * 2));
    return segment + easedLocal;
  }

  function rotationFromPosition(position) {
    const carouselProgress = gsap.utils.clamp(0, 1, position / Math.max(1, cards.length - 1));
    const first = projectAngles[0] || 0;
    const last = projectAngles[cards.length - 1] || first;
    return -gsap.utils.interpolate(first, last, carouselProgress);
  }

  function activeFromPosition(position) {
    return gsap.utils.clamp(0, cards.length - 1, Math.round(position));
  }

  function renderCardStack(position) {
    const activeCard = activeFromPosition(position);
    const mobile = isMobile();
    const travel = mobile ? 96 : 132;
    const settleWindow = 0.22;
    const bounce = mobile ? 14 : 20;

    cards.forEach((card, cardIndex) => {
      const offset = cardIndex - position;
      const absOffset = Math.abs(offset);
      const selected = cardIndex === activeCard;
      let y = offset * travel;

      if (absOffset > 0.001 && absOffset < settleWindow) {
        const settleAmount = Math.sin((1 - absOffset / settleWindow) * Math.PI);
        y -= Math.sign(offset) * bounce * settleAmount;
      }

      const autoAlpha = gsap.utils.clamp(0, 1, 1 - Math.max(0, absOffset - 0.04) / 0.72);
      const scale = 1 - Math.min(absOffset, 1) * 0.024;

      card.classList.toggle("is-current", selected);
      card.setAttribute("aria-current", selected ? "true" : "false");
      gsap.set(card, {
        autoAlpha,
        y,
        scale,
        filter: "blur(0px)",
        zIndex: 20 - Math.round(absOffset * 10),
        pointerEvents: selected && absOffset < 0.34 ? "auto" : "none"
      });
    });
  }

  function renderWheel(progress, immediate) {
    const p = gsap.utils.clamp(0, 0.999, progress);
    const cardPosition = rollingPosition(p);
    currentRotation = rotationFromPosition(cardPosition);
    gsap.set(orbit, { rotation: currentRotation });
    setActive(activeFromPosition(cardPosition), immediate);
    renderCardStack(cardPosition);

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
    y: 120,
    scale: 0.976,
    filter: "blur(0px)",
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

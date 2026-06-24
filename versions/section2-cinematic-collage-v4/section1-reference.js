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
  let orbitLayout = [];
  let currentRotation = 0;
  const workState = { position: 0, outro: 0 };
  let workTimeline = null;
  let track = null;
  let cardSlot = 0;

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

  function setupCardTrack() {
    if (!track) {
      track = document.createElement("div");
      track.className = "project-track";
      cards.forEach((card) => track.appendChild(card));
      stack.appendChild(track);
    }

    const mobile = isMobile();
    const gap = mobile ? 78 : 96;
    gsap.set(cards, {
      clearProps: "position,inset",
      autoAlpha: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)"
    });
    cards.forEach((card, index) => {
      card.style.marginBottom = index === cards.length - 1 ? "0px" : `${gap}px`;
    });

    const firstCardHeight = cards[0]?.offsetHeight || stack.offsetHeight;
    cardSlot = firstCardHeight + gap;
    stack.style.height = `${firstCardHeight}px`;
    gsap.set(track, { y: 0 });
  }

  function layoutWheel() {
    const mobile = isMobile();
    const size = mobile ? 920 : 1280;
    const center = size / 2;
    const radius = mobile ? 380 : 440;
    const focusX = mobile ? 156 : gsap.utils.clamp(300, 420, window.innerWidth * 0.2);
    const focusY = mobile ? 284 : window.innerHeight * 0.5;
    const wheelLeft = focusX - center - radius;
    const wheelTop = focusY - center;
    const step = mobile ? 9.6 : 8.2;
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

    orbitLayout = [];
    orbitItems.forEach((item, index) => {
      const angle = (index - firstProjectOrbitIndex) * step;
      const radians = angle * Math.PI / 180;
      const x = center + Math.cos(radians) * radius;
      const y = center + Math.sin(radians) * radius;
      orbitLayout[index] = { x, y, angle };

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

  function applyOrbitDepth(position) {
    const focusOrbit = orbitIndexForCard(0) + position;

    orbitItems.forEach((item, itemIndex) => {
      const base = orbitLayout[itemIndex];
      if (!base) return;

      const distance = Math.abs(itemIndex - focusOrbit);
      const depth = gsap.utils.clamp(0, 1, distance / 5.2);
      const side = itemIndex - focusOrbit;
      const activeProximity = gsap.utils.clamp(0, 1, 1 - distance / 0.72);
      const nearProximity = gsap.utils.clamp(0, 1, 1 - Math.max(0, distance - 0.6) / 2.4);
      const scale = gsap.utils.interpolate(1, 0.92, depth);
      const opacity = gsap.utils.clamp(0.26, 1, 0.26 + nearProximity * 0.38 + activeProximity * 0.36);
      const depthX = -12 * depth + Math.sign(side || 1) * depth * 5;
      const depthY = Math.sign(side || 1) * depth * 4;

      gsap.set(item, {
        x: base.x + depthX,
        y: base.y + depthY,
        scale,
        opacity,
        zIndex: Math.round(100 - distance * 10)
      });
    });
  }

  function renderCardStack(position) {
    const activeCard = activeFromPosition(position);
    if (!track || !cardSlot) setupCardTrack();
    const trackY = -position * cardSlot;

    gsap.set(track, { y: trackY });

    cards.forEach((card, cardIndex) => {
      const offset = cardIndex - position;
      const absOffset = Math.abs(offset);
      const selected = cardIndex === activeCard;
      const scale = 1 - Math.min(absOffset, 1) * 0.012;

      card.classList.toggle("is-current", selected);
      card.setAttribute("aria-current", selected ? "true" : "false");
      gsap.set(card, {
        autoAlpha: 1,
        y: 0,
        scale,
        filter: "blur(0px)",
        zIndex: 20 - Math.round(absOffset * 4),
        pointerEvents: selected && absOffset < 0.34 ? "auto" : "none"
      });
    });
  }

  function renderFromState(immediate) {
    const cardPosition = gsap.utils.clamp(0, cards.length - 1 + 0.12, workState.position);
    currentRotation = rotationFromPosition(cardPosition);
    gsap.set(orbit, { rotation: currentRotation });
    setActive(activeFromPosition(cardPosition), immediate);
    applyOrbitDepth(cardPosition);
    renderCardStack(cardPosition);

    const outro = gsap.utils.clamp(0, 1, workState.outro);
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

  function buildWorkTimeline() {
    if (workTimeline) {
      workTimeline.scrollTrigger?.kill();
      workTimeline.kill();
    }

    workState.position = 0;
    workState.outro = 0;
    renderFromState(true);

    workTimeline = gsap.timeline({
      onUpdate: () => renderFromState(false),
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${Math.max(4600, window.innerHeight * 6.8)}`,
        pin: true,
        scrub: 0.9,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: () => {
          setupCardTrack();
          layoutWheel();
          renderFromState(true);
        }
      }
    });

    for (let index = 0; index < cards.length - 1; index += 1) {
      workTimeline.to(workState, {
        position: index,
        duration: 0.56,
        ease: "none"
      });
      workTimeline.to(workState, {
        position: index + 0.92,
        duration: 0.62,
        ease: "power2.inOut"
      });
      workTimeline.to(workState, {
        position: index + 1.075,
        duration: 0.18,
        ease: "power3.out"
      });
      workTimeline.to(workState, {
        position: index + 1,
        duration: 0.26,
        ease: "power2.out"
      });
    }

    workTimeline.to(workState, {
      position: cards.length - 1,
      duration: 0.72,
      ease: "none"
    });
    workTimeline.to(workState, {
      outro: 1,
      duration: 0.72,
      ease: "power2.inOut"
    });
  }

  gsap.set(cards, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    pointerEvents: "none"
  });
  gsap.set(completeLink, { autoAlpha: 0, y: 18, pointerEvents: "none" });

  extendOrbitForLoopRead();
  setupCardTrack();
  layoutWheel();
  buildWorkTimeline();

  window.addEventListener("resize", () => {
    setupCardTrack();
    layoutWheel();
    ScrollTrigger.refresh();
  }, { passive: true });
})();

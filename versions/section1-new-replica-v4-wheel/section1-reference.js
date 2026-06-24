(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  const section = document.querySelector(".featured-work");
  const orbit = document.querySelector(".orbit-copy");
  const stack = document.querySelector(".project-stack");
  if (!section || !orbit || !stack) return;

  gsap.registerPlugin(ScrollTrigger);

  const cards = gsap.utils.toArray(".stack-card");
  const orbitItems = gsap.utils.toArray(".orbit-copy span");
  const focusDot = document.querySelector(".wheel-focus-dot");
  const isMobile = () => window.matchMedia("(max-width: 809px)").matches;

  let activeIndex = -1;
  let wheelStartRotation = 0;
  let wheelEndRotation = 0;
  let step = 0;

  function orbitIndexForCard(index) {
    return Number(cards[index]?.dataset.orbit || index + 6);
  }

  function layoutWheel() {
    const mobile = isMobile();
    const size = mobile ? 980 : 1520;
    const center = size / 2;
    const radius = mobile ? 500 : 760;
    const focusX = mobile ? 150 : Math.min(window.innerWidth * 0.18, 360);
    const focusY = mobile ? 286 : window.innerHeight * 0.5;
    const wheelLeft = focusX - center - radius;
    const wheelTop = focusY - center;

    orbit.style.left = `${wheelLeft}px`;
    orbit.style.top = `${wheelTop}px`;
    orbit.style.width = `${size}px`;
    orbit.style.height = `${size}px`;
    orbit.style.transformOrigin = `${center}px ${center}px`;

    if (focusDot) {
      focusDot.style.left = `${focusX - (mobile ? 36 : 54)}px`;
      focusDot.style.top = `${focusY - 6}px`;
    }

    step = mobile ? 12.5 : 11.5;
    const focusAngle = 0;
    const firstProjectOrbitIndex = orbitIndexForCard(0);

    orbitItems.forEach((item, index) => {
      const angle = focusAngle + (index - firstProjectOrbitIndex) * step;
      const radians = angle * Math.PI / 180;
      const x = center + Math.cos(radians) * radius;
      const y = center + Math.sin(radians) * radius;
      const tangent = angle + 90;

      gsap.set(item, {
        x,
        y,
        rotation: tangent,
        transformOrigin: "left center"
      });
    });

    wheelStartRotation = 0;
    wheelEndRotation = -(orbitIndexForCard(cards.length - 1) - firstProjectOrbitIndex) * step;
    gsap.set(orbit, { rotation: wheelStartRotation, x: 0, y: 0, scale: 1 });
    setActive(0, true);
  }

  function setActive(index, immediate) {
    const clamped = gsap.utils.clamp(0, cards.length - 1, index);
    if (clamped === activeIndex && !immediate) return;
    activeIndex = clamped;

    const activeOrbit = orbitIndexForCard(clamped);
    orbitItems.forEach((item, itemIndex) => {
      item.classList.toggle("active-orbit", itemIndex === activeOrbit);
      item.classList.toggle("near-orbit", Math.abs(itemIndex - activeOrbit) === 1);
    });

    cards.forEach((card, cardIndex) => {
      const selected = cardIndex === clamped;
      card.classList.toggle("is-current", selected);
      card.setAttribute("aria-current", selected ? "true" : "false");
      gsap.to(card, {
        autoAlpha: selected ? 1 : 0,
        y: selected ? 0 : -18,
        filter: selected ? "blur(0px)" : "blur(3px)",
        pointerEvents: selected ? "auto" : "none",
        duration: immediate ? 0 : 0.18,
        ease: selected ? "power2.out" : "power1.out",
        overwrite: true
      });
    });
  }

  function activeFromProgress(progress) {
    const p = gsap.utils.clamp(0, 0.999, progress);
    return Math.min(cards.length - 1, Math.floor(p * cards.length));
  }

  function rotationFromProgress(progress) {
    const p = gsap.utils.clamp(0, 0.999, progress);
    const index = activeFromProgress(p);
    const localStart = index / cards.length;
    const local = gsap.utils.clamp(0, 1, (p - localStart) * cards.length);
    const travel = (local - 0.5) * step * 0.5;
    return -(index * step) + travel;
  }

  function renderWheel(progress, immediate) {
    const p = gsap.utils.clamp(0, 0.999, progress);
    const index = activeFromProgress(p);
    setActive(index, immediate);
    gsap.set(orbit, { rotation: rotationFromProgress(p) });
  }

  gsap.set(cards, {
    autoAlpha: 0,
    y: 24,
    filter: "blur(4px)",
    pointerEvents: "none"
  });

  layoutWheel();

  ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${Math.max(3600, window.innerHeight * 5.4)}`,
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

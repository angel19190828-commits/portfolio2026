(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  const section = document.querySelector(".featured-work");
  const orbit = document.querySelector(".orbit-copy");
  const stack = document.querySelector(".project-stack");
  if (!section || !orbit || !stack) return;

  gsap.registerPlugin(ScrollTrigger);

  const cards = gsap.utils.toArray(".stack-card");
  const focusDot = document.querySelector(".wheel-focus-dot");
  const isMobile = () => window.matchMedia("(max-width: 809px)").matches;
  const slotCount = 20;
  let orbitItems = [];

  let activeIndex = -1;
  let projectAngles = [];
  let projectSlots = [];
  let currentRotation = 0;

  function buildOrbitSlots() {
    const titles = cards.map((card) => card.querySelector("h2")?.textContent.trim()).filter(Boolean);
    orbit.innerHTML = "";

    for (let index = 0; index < slotCount; index += 1) {
      const projectIndex = index % titles.length;
      const item = document.createElement("span");
      item.textContent = titles[projectIndex];
      item.dataset.project = String(projectIndex);
      item.dataset.slot = String(index);
      orbit.appendChild(item);
    }

    orbitItems = gsap.utils.toArray(".orbit-copy span");
    projectSlots = cards.map((_, index) => index);
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

    const step = 360 / slotCount;
    const focusAngle = 0;
    projectAngles = cards.map((_, index) => index * step);

    orbitItems.forEach((item, index) => {
      const angle = focusAngle + index * step;
      const radians = angle * Math.PI / 180;
      const x = center + Math.cos(radians) * radius;
      const y = center + Math.sin(radians) * radius;

      gsap.set(item, {
        x,
        y,
        rotation: -currentRotation,
        xPercent: -50,
        yPercent: -50,
        transformOrigin: "50% 50%"
      });
    });

    gsap.set(orbit, { rotation: 0, x: 0, y: 0, scale: 1 });
    setActive(0, true);
  }

  function setActive(index, immediate) {
    const clamped = gsap.utils.clamp(0, cards.length - 1, index);
    if (clamped === activeIndex && !immediate) return;
    activeIndex = clamped;

    orbitItems.forEach((item, itemIndex) => {
      const isProject = Number(item.dataset.project) === clamped;
      const isActiveSlot = itemIndex === projectSlots[clamped];
      item.classList.toggle("active-orbit", isActiveSlot);
      item.classList.toggle("near-orbit", isProject && !isActiveSlot);
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
    const hold = 0.58;
    const current = projectAngles[index] || 0;
    const next = projectAngles[Math.min(cards.length - 1, index + 1)] ?? current;
    const travel = local <= hold ? 0 : gsap.utils.interpolate(0, next - current, (local - hold) / (1 - hold));
    return -(current + travel);
  }

  function renderWheel(progress, immediate) {
    const p = gsap.utils.clamp(0, 0.999, progress);
    const index = activeFromProgress(p);
    setActive(index, immediate);
    currentRotation = rotationFromProgress(p);
    gsap.set(orbit, { rotation: currentRotation });
    gsap.set(orbitItems, { rotation: -currentRotation });
  }

  gsap.set(cards, {
    autoAlpha: 0,
    y: 24,
    filter: "blur(4px)",
    pointerEvents: "none"
  });

  buildOrbitSlots();
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

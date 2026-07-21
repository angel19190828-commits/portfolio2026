(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  const section = document.querySelector(".featured-work");
  const orbit = document.querySelector(".orbit-copy");
  const stack = document.querySelector(".project-stack");
  if (!section || !orbit || !stack) return;

  gsap.registerPlugin(ScrollTrigger);

  const cards = gsap.utils.toArray(".stack-card");
  const completeLink = document.querySelector(".work-complete");
  const mobileCompleteLink = document.querySelector(".mobile-work-all");
  let orbitItems = gsap.utils.toArray(".orbit-copy span");
  const focusDot = document.querySelector(".wheel-focus-dot");
  const mobileQuery = window.matchMedia("(max-width: 809px)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const isMobile = () => mobileQuery.matches;

  let activeIndex = -1;
  let projectAngles = [];
  let orbitLayout = [];
  let currentRotation = 0;
  const workState = { position: 0, outro: 0 };
  const wheelMotion = {
    targetPosition: 0,
    currentPosition: 0,
    targetOutro: 0,
    currentOutro: 0,
    lastPosition: 0,
    velocity: 0,
    targetSlot: 0,
    scrollDirection: 1
  };
  let workTimeline = null;
  let renderTick = null;
  let settleCall = null;
  let track = null;
  let cardSlot = 0;
  let mobileTrackSet = null;
  let mobileActiveIndex = -1;
  let mobileSectionActive = false;
  let mobileSnapTween = null;
  const mobileSnapState = { y: 0 };
  let mobileSnapListenersAttached = false;
  let mobileGesturePeakVelocity = 0;
  let mobileLastDirection = 1;
  let activeMode = null;
  let resizeTimer = null;

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

  function setupOrbitClicks() {
    orbitItems.forEach((span, index) => {
      if (span.dataset.workOrbitClickBound === "true") return;
      const cardIndex = index % cards.length;
      span.style.pointerEvents = "auto";
      span.style.cursor = "pointer";
      span.addEventListener("click", () => {
        if (!workTimeline) return;
        const targetProgress = (cardIndex / Math.max(1, cards.length - 1)) * 0.86;
        const scrollPos = workTimeline.start + targetProgress * (workTimeline.end - workTimeline.start);
        window.scrollTo({ top: scrollPos, behavior: "smooth" });
      });
      span.dataset.workOrbitClickBound = "true";
    });
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
    const gap = mobile ? 12 : 96;
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

    cards.forEach((card) => {
      card.style.height = "";
      card.style.minHeight = "";
    });

    stack.style.height = "";
    const measuredHeight = Math.max(...cards.map((card) => card.offsetHeight), stack.offsetHeight);
    cardSlot = measuredHeight + gap;
    stack.style.height = `${measuredHeight}px`;
    cards.forEach((card, index) => {
      card.style.height = `${measuredHeight}px`;
      card.style.marginBottom = index === cards.length - 1 ? "0px" : `${gap}px`;
    });
    if (mobile) {
      const safeTop = 84;
      const bottomSafe = 24;
      const ctaGap = 18;
      const targetCenter = window.innerHeight * 0.44;
      const ctaHeight = mobileCompleteLink?.offsetHeight || 50;
      const idealStackTop = targetCenter - measuredHeight / 2;
      const maxStackTop = window.innerHeight - bottomSafe - ctaHeight - ctaGap - measuredHeight;
      const stackTop = Math.max(safeTop, Math.min(idealStackTop, maxStackTop));
      stack.style.top = `${stackTop}px`;
      if (mobileCompleteLink) {
        mobileCompleteLink.style.top = `${stackTop + measuredHeight + ctaGap}px`;
      }
    } else {
      stack.style.top = "";
      if (mobileCompleteLink) mobileCompleteLink.style.top = "";
    }
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

  function magneticPosition(rawPosition) {
    const max = cards.length - 1;
    const clamped = gsap.utils.clamp(0, max, rawPosition);
    const nearest = Math.round(clamped);
    const distance = clamped - nearest;
    const range = 0.48;
    const pull = gsap.utils.clamp(0, 1, 1 - Math.abs(distance) / range);
    const softened = pull * pull * (3 - 2 * pull);
    return clamped - distance * softened * 0.08;
  }

  function slotTargetFromScroll(rawPosition, direction) {
    const max = cards.length - 1;
    const clamped = gsap.utils.clamp(0, max, rawPosition);
    const threshold = 0.16;
    const blend = 0.52;

    if (clamped <= threshold) return 0;
    if (clamped >= max - threshold) return max;

    let slot;
    if (direction < 0) {
      slot = gsap.utils.clamp(0, max, Math.floor(clamped + threshold));
    } else {
      slot = gsap.utils.clamp(0, max, Math.ceil(clamped - threshold));
    }

    return gsap.utils.interpolate(clamped, slot, blend);
  }

  function settleTarget(targetPosition, scrollVelocity) {
    const max = cards.length - 1;
    const nearest = gsap.utils.clamp(0, max, Math.round(targetPosition));
    const distance = Math.abs(targetPosition - nearest);
    const slowScroll = Math.abs(scrollVelocity || 0) < 440;

    if (distance < 0.2 || slowScroll) return nearest;
    return targetPosition;
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
      const scale = gsap.utils.interpolate(1.015, 0.92, depth) + activeProximity * 0.02;
      const opacity = gsap.utils.clamp(0.26, 1, 0.28 + nearProximity * 0.38 + activeProximity * 0.42);
      const color = gsap.utils.interpolate("rgba(46, 47, 49, .72)", "#151515", activeProximity);

      gsap.set(item, {
        scale,
        opacity,
        color,
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
      const proximity = gsap.utils.clamp(0, 1, 1 - absOffset / 0.46);
      const focusEase = proximity * proximity * (3 - 2 * proximity);
      const scale = 1 - Math.min(absOffset, 1) * 0.006 + focusEase * 0.0015;

      card.classList.toggle("is-current", selected);
      card.setAttribute("aria-current", selected ? "true" : "false");

      const video = card.querySelector("video");
      if (video && selected && absOffset < 0.42 && video.paused) {
        video.play().catch(() => {});
      }

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

    const outro = isMobile() ? 0 : gsap.utils.clamp(0, 1, workState.outro);
    const stackExit = gsap.utils.clamp(0, 1, outro / 0.58);
    const linkIntro = gsap.utils.clamp(0, 1, (outro - 0.2) / 0.24);
    const linkEase = linkIntro * linkIntro * (3 - 2 * linkIntro);
    gsap.set(stack, {
      autoAlpha: 1 - stackExit,
      y: -70 * stackExit,
      pointerEvents: stackExit < 0.2 ? "auto" : "none"
    });
    gsap.set([orbit, focusDot].filter(Boolean), {
      autoAlpha: 1 - stackExit
    });
    if (completeLink) {
      gsap.set(completeLink, {
        autoAlpha: linkEase,
        y: 28 * (1 - linkEase),
        pointerEvents: linkEase > 0.65 ? "auto" : "none"
      });
    }
  }

  function pauseAllCardVideos() {
    cards.forEach((card) => card.querySelector("video")?.pause());
  }

  function playMobileActiveVideo() {
    if (!mobileSectionActive || mobileActiveIndex < 0) return;
    const video = cards[mobileActiveIndex]?.querySelector("video");
    if (video?.paused) video.play().catch(() => {});
  }

  function setMobileActive(index, force) {
    const nextIndex = gsap.utils.clamp(0, cards.length - 1, index);
    if (nextIndex === mobileActiveIndex && !force) return;
    mobileActiveIndex = nextIndex;
    pauseAllCardVideos();

    cards.forEach((card, cardIndex) => {
      const selected = cardIndex === nextIndex;
      card.classList.toggle("is-current", selected);
      card.setAttribute("aria-current", selected ? "true" : "false");
      gsap.set(card, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        zIndex: selected ? 20 : 10,
        pointerEvents: selected ? "auto" : "none"
      });
    });

    playMobileActiveVideo();
  }

  function renderMobileProgress(progress, immediate) {
    if (!track || !cardSlot) setupCardTrack();
    const position = gsap.utils.clamp(0, 1, progress) * Math.max(0, cards.length - 1);
    const trackY = -position * cardSlot;

    if (!mobileTrackSet) mobileTrackSet = gsap.quickSetter(track, "y", "px");
    mobileTrackSet(trackY);

    setMobileActive(Math.round(position), false);
  }

  function cancelMobileSnap() {
    if (mobileSnapTween) mobileSnapTween.kill();
    mobileSnapTween = null;
    mobileGesturePeakVelocity = 0;
  }

  function snapMobileToNearest() {
    if (!isMobile() || !workTimeline?.isActive || cards.length < 2) return;

    const maxIndex = cards.length - 1;
    const currentProgress = gsap.utils.clamp(0, 1, workTimeline.progress || 0);
    const rawIndex = currentProgress * maxIndex;
    const gestureVelocity = mobileGesturePeakVelocity;
    const gestureDirection = Math.sign(gestureVelocity) || mobileLastDirection || 1;
    const fastGesture = Math.abs(gestureVelocity) >= 650;
    const targetIndex = gsap.utils.clamp(0, maxIndex, fastGesture
      ? (gestureDirection > 0 ? Math.ceil(rawIndex + 0.001) : Math.floor(rawIndex - 0.001))
      : Math.round(rawIndex));
    const targetProgress = targetIndex / maxIndex;
    const targetScroll = workTimeline.start + targetProgress * (workTimeline.end - workTimeline.start);
    const currentScroll = window.scrollY;
    mobileGesturePeakVelocity = 0;

    if (Math.abs(targetScroll - currentScroll) < 2) {
      renderMobileProgress(targetProgress, true);
      return;
    }

    cancelMobileSnap();
    if (reducedMotionQuery.matches) {
      window.scrollTo(0, targetScroll);
      renderMobileProgress(targetProgress, true);
      return;
    }

    mobileSnapState.y = currentScroll;
    mobileSnapTween = gsap.to(mobileSnapState, {
      y: targetScroll,
      duration: gsap.utils.clamp(0.48, 0.68, Math.abs(targetScroll - currentScroll) / 1200),
      ease: "power3.out",
      overwrite: true,
      onUpdate: () => window.scrollTo(0, Math.round(mobileSnapState.y)),
      onComplete: () => {
        mobileSnapTween = null;
        renderMobileProgress(targetProgress, true);
      }
    });
  }

  function attachMobileSnapListeners() {
    if (mobileSnapListenersAttached) return;
    ScrollTrigger.addEventListener("scrollEnd", snapMobileToNearest);
    window.addEventListener("touchstart", cancelMobileSnap, { passive: true });
    window.addEventListener("pointerdown", cancelMobileSnap, { passive: true });
    window.addEventListener("wheel", cancelMobileSnap, { passive: true });
    mobileSnapListenersAttached = true;
  }

  function detachMobileSnapListeners() {
    if (!mobileSnapListenersAttached) return;
    ScrollTrigger.removeEventListener("scrollEnd", snapMobileToNearest);
    window.removeEventListener("touchstart", cancelMobileSnap);
    window.removeEventListener("pointerdown", cancelMobileSnap);
    window.removeEventListener("wheel", cancelMobileSnap);
    mobileSnapListenersAttached = false;
  }

  function buildMobileWorkTimeline() {
    mobileSectionActive = false;
    mobileActiveIndex = -1;
    mobileGesturePeakVelocity = 0;
    mobileLastDirection = 1;
    pauseAllCardVideos();
    gsap.set(stack, { autoAlpha: 1, y: 0, pointerEvents: "auto" });
    mobileTrackSet = gsap.quickSetter(track, "y", "px");
    setMobileActive(0, true);

    workTimeline = ScrollTrigger.create({
      id: "section1-work-carousel",
      trigger: section,
      start: "top top",
      end: () => `+=${Math.max(2400, window.innerHeight * 3.2)}`,
      pin: true,
      anticipatePin: 1,
      refreshPriority: 20,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (!mobileSnapTween) {
          const velocity = self.getVelocity ? self.getVelocity() : 0;
          if (Math.abs(velocity) > Math.abs(mobileGesturePeakVelocity)) {
            mobileGesturePeakVelocity = velocity;
          }
          mobileLastDirection = self.direction || mobileLastDirection || 1;
        }
        renderMobileProgress(self.progress, false);
      },
      onToggle: (self) => {
        mobileSectionActive = self.isActive;
        renderMobileProgress(self.progress, true);
        if (mobileSectionActive) {
          playMobileActiveVideo();
        } else {
          mobileGesturePeakVelocity = 0;
          pauseAllCardVideos();
        }
      },
      onRefresh: (self) => {
        setupCardTrack();
        renderMobileProgress(self.progress || 0, true);
      }
    });

    mobileSectionActive = workTimeline.isActive;
    renderMobileProgress(workTimeline.progress || 0, true);
    playMobileActiveVideo();
    attachMobileSnapListeners();
  }

  function buildDesktopWorkTimeline() {
    if (workTimeline) {
      workTimeline.kill();
    }
    if (renderTick) {
      gsap.ticker.remove(renderTick);
      renderTick = null;
    }
    if (settleCall) {
      settleCall.kill();
      settleCall = null;
    }

    workState.position = 0;
    workState.outro = 0;
    wheelMotion.targetPosition = 0;
    wheelMotion.currentPosition = 0;
    wheelMotion.targetOutro = 0;
    wheelMotion.currentOutro = 0;
    wheelMotion.lastPosition = 0;
    wheelMotion.velocity = 0;
    wheelMotion.targetSlot = 0;
    wheelMotion.scrollDirection = 1;
    renderFromState(true);

    renderTick = () => {
      const delta = gsap.ticker.deltaRatio();
      const outroEase = 1 - Math.pow(0.82, delta);
      const maxPosition = cards.length - 1;
      const targetForce = (wheelMotion.targetPosition - wheelMotion.currentPosition) * 0.085;
      const nearest = Math.round(wheelMotion.currentPosition);
      const detentDistance = wheelMotion.currentPosition - nearest;
      const detentRange = 0.46;
      const detentField = gsap.utils.clamp(0, 1, 1 - Math.abs(detentDistance) / detentRange);
      const detentEase = detentField * detentField * (3 - 2 * detentField);
      const detentForce = -detentDistance * detentEase * 0.034;

      wheelMotion.velocity += (targetForce + detentForce) * delta;
      wheelMotion.velocity *= Math.pow(0.7, delta);
      wheelMotion.currentPosition += wheelMotion.velocity * delta;
      wheelMotion.currentPosition = gsap.utils.clamp(0, maxPosition, wheelMotion.currentPosition);
      wheelMotion.currentOutro += (wheelMotion.targetOutro - wheelMotion.currentOutro) * outroEase;

      if (Math.abs(wheelMotion.targetPosition - wheelMotion.currentPosition) < 0.001 && Math.abs(wheelMotion.velocity) < 0.001) {
        wheelMotion.currentPosition = wheelMotion.targetPosition;
        wheelMotion.velocity = 0;
      }
      if (Math.abs(wheelMotion.targetOutro - wheelMotion.currentOutro) < 0.001) {
        wheelMotion.currentOutro = wheelMotion.targetOutro;
      }

      workState.position = magneticPosition(wheelMotion.currentPosition);
      workState.outro = wheelMotion.currentOutro;
      renderFromState(false);
    };
    gsap.ticker.add(renderTick);

    workTimeline = ScrollTrigger.create({
      id: "section1-work-carousel",
      trigger: section,
      start: "top top",
      end: () => `+=${Math.max(3600, window.innerHeight * 4.85)}`,
      pin: true,
      anticipatePin: 1,
      refreshPriority: 20,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const carouselProgress = gsap.utils.clamp(0, 1, self.progress / 0.86);
        const rawPosition = carouselProgress * (cards.length - 1);
        wheelMotion.scrollDirection = self.direction || wheelMotion.scrollDirection || 1;
        wheelMotion.targetSlot = slotTargetFromScroll(rawPosition, wheelMotion.scrollDirection);
        wheelMotion.targetPosition = settleTarget(wheelMotion.targetSlot, self.getVelocity ? self.getVelocity() : 0);
        wheelMotion.targetOutro = gsap.utils.clamp(0, 1, (self.progress - 0.94) / 0.06);
        if (settleCall) settleCall.kill();
        settleCall = gsap.delayedCall(0.18, () => {
          if (wheelMotion.targetOutro > 0.08) return;
          const max = cards.length - 1;
          const projected = gsap.utils.clamp(0, max, wheelMotion.currentPosition + wheelMotion.velocity * 0.7);
          const slot = gsap.utils.clamp(0, max, Math.round(projected));
          wheelMotion.targetSlot = slot;
          wheelMotion.targetPosition = slot;
        });
      },
      onRefresh: (self) => {
        setupCardTrack();
        layoutWheel();
        const carouselProgress = gsap.utils.clamp(0, 1, (self.progress || 0) / 0.86);
        wheelMotion.targetSlot = Math.round(carouselProgress * (cards.length - 1));
        wheelMotion.targetPosition = wheelMotion.targetSlot;
        wheelMotion.currentPosition = wheelMotion.targetPosition;
        wheelMotion.targetOutro = gsap.utils.clamp(0, 1, ((self.progress || 0) - 0.94) / 0.06);
        wheelMotion.currentOutro = wheelMotion.targetOutro;
        wheelMotion.lastPosition = wheelMotion.currentPosition;
        wheelMotion.velocity = 0;
        wheelMotion.scrollDirection = self.direction || wheelMotion.scrollDirection || 1;
        workState.position = magneticPosition(wheelMotion.currentPosition);
        workState.outro = wheelMotion.currentOutro;
        renderFromState(true);
      }
    });
  }

  function cleanupWorkMode() {
    if (workTimeline) {
      workTimeline.kill();
      workTimeline = null;
    }
    if (renderTick) {
      gsap.ticker.remove(renderTick);
      renderTick = null;
    }
    if (settleCall) {
      settleCall.kill();
      settleCall = null;
    }
    mobileTrackSet = null;
    cancelMobileSnap();
    detachMobileSnapListeners();
    mobileSectionActive = false;
    mobileActiveIndex = -1;
    if (track) gsap.killTweensOf(track);
    pauseAllCardVideos();
  }

  function initializeWorkMode() {
    const nextMode = isMobile() ? "mobile" : "desktop";
    cleanupWorkMode();
    activeMode = nextMode;
    activeIndex = -1;
    setupCardTrack();

    if (nextMode === "mobile") {
      buildMobileWorkTimeline();
      return;
    }

    extendOrbitForLoopRead();
    setupOrbitClicks();
    layoutWheel();
    buildDesktopWorkTimeline();
    cards.forEach((card) => {
      const video = card.querySelector("video");
      if (video?.paused) video.play().catch(() => {});
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

  initializeWorkMode();

  const handleModeChange = () => initializeWorkMode();
  if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", handleModeChange);
  else mobileQuery.addListener(handleModeChange);

  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const nextMode = isMobile() ? "mobile" : "desktop";
      if (nextMode !== activeMode) initializeWorkMode();
      else ScrollTrigger.refresh();
    }, 180);
  }, { passive: true });
})();

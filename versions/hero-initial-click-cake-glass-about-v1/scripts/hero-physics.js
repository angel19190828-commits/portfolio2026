(function () {
  const root = document.querySelector("[data-hero-physics]");
  const stage = root?.querySelector(".hero-physics__stage");
  const hero = document.querySelector(".hero");
  if (!root || !stage || !hero || !window.Matter) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const { Engine, World, Bodies, Body, Vector } = Matter;
  const engine = Engine.create({ enableSleeping: false });
  engine.gravity.y = 1.35;
  engine.gravity.x = 0;

  const initialStickerSources = [
    { src: "./assets/stickers/web/cat.png", width: 150, ratio: 1.0, restitution: 0.32 },
    { src: "./assets/stickers/web/horse.png", width: 128, ratio: 0.68, restitution: 0.36 },
    { src: "./assets/stickers/web/cake.png", width: 188, ratio: 1.0, restitution: 0.28 },
    { src: "./assets/stickers/web/polaroids.png", width: 190, ratio: 0.75, restitution: 0.25 },
  ];

  const clickStickerSources = [
    ...initialStickerSources,
    { src: "./assets/stickers/click/cat.png", width: 150, ratio: 1.18, restitution: 0.32 },
    { src: "./assets/stickers/click/horse.png", width: 142, ratio: 0.68, restitution: 0.36 },
    { src: "./assets/stickers/click/cake-day.png", width: 188, ratio: 0.78, restitution: 0.28, achievement: "cake" },
    { src: "./assets/stickers/click/polaroids.png", width: 190, ratio: 0.74, restitution: 0.25 },
    { src: "./assets/stickers/click/notebook.png", width: 196, ratio: 0.86, restitution: 0.24 },
    { src: "./assets/stickers/click/tiny-heart.png", width: 88, ratio: 0.72, restitution: 0.42 },
  ];

  const stickers = [];
  const boundaries = [];
  let pointerBody = null;
  let width = 0;
  let height = 0;
  let lastTime = performance.now();
  let pointerTarget = { x: -999, y: -999 };
  let pointerCurrent = { x: -999, y: -999 };
  let pointerPrevious = { x: -999, y: -999 };
  let pointerSpeed = 0;
  let isStarted = false;
  let isHeroActive = true;
  let cakeCount = 0;
  let achievementShown = false;

  function heroRect() {
    return hero.getBoundingClientRect();
  }

  function syncSize() {
    const rect = heroRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);

    if (boundaries.length) World.remove(engine.world, boundaries);
    boundaries.length = 0;

    const wall = 180;
    boundaries.push(
      Bodies.rectangle(width / 2, height + wall / 2 - 22, width + wall * 2, wall, {
        isStatic: true,
        label: "hero-floor",
        friction: 0.86,
        restitution: 0.08,
      }),
      Bodies.rectangle(-wall / 2, height / 2, wall, height * 2.4, {
        isStatic: true,
        label: "hero-left-wall",
        friction: 0.24,
      }),
      Bodies.rectangle(width + wall / 2, height / 2, wall, height * 2.4, {
        isStatic: true,
        label: "hero-right-wall",
        friction: 0.24,
      })
    );
    World.add(engine.world, boundaries);
  }

  function makePointer() {
    pointerBody = Bodies.circle(-999, -999, 92, {
      isStatic: true,
      label: "pointer-collider",
      restitution: 0.5,
      friction: 0,
    });
    World.add(engine.world, pointerBody);
  }

  function createSticker(config, index, spawnOptions = {}) {
    const viewportScale = width < 720 ? 0.72 : width < 1100 ? 0.88 : 1;
    const displayWidth = Math.round(config.width * viewportScale * (0.88 + Math.random() * 0.22));
    const ratio = config.ratio || 1;
    const displayHeight = Math.max(44, displayWidth * ratio);
    const x = typeof spawnOptions.x === "number"
      ? Math.max(displayWidth * 0.55, Math.min(width - displayWidth * 0.55, spawnOptions.x))
      : width * (0.08 + Math.random() * 0.84);
    const y = typeof spawnOptions.y === "number"
      ? spawnOptions.y
      : -displayHeight - 80 - Math.random() * 180;

    const body = Bodies.rectangle(x, y, displayWidth * 0.9, displayHeight * 0.86, {
      chamfer: { radius: Math.min(28, displayWidth * 0.16) },
      friction: 0.78,
      frictionAir: 0.018,
      restitution: config.restitution,
      density: 0.0018,
      angle: -0.36 + Math.random() * 0.72,
      label: "physics-sticker",
    });
    Body.setAngularVelocity(body, -0.035 + Math.random() * 0.07);
    Body.setVelocity(body, {
      x: -1.4 + Math.random() * 2.8,
      y: 5.5 + Math.random() * 5.5,
    });

    const el = document.createElement("img");
    el.className = "physics-sticker";
    if (config.achievement === "cake") el.dataset.achievement = "cake";
    el.src = config.src;
    el.alt = "";
    el.style.opacity = "0";
    el.style.setProperty("--sticker-w", `${displayWidth}px`);
    stage.appendChild(el);

    body.plugin = {
      el,
      width: displayWidth,
      height: displayHeight,
    };
    stickers.push(body);
    World.add(engine.world, body);
    if (config.achievement === "cake") {
      cakeCount += 1;
      if (cakeCount >= 3) showAchievement();
    }

    const delay = 0.22 + index * 0.18 + Math.random() * 0.12;
    if (window.gsap) {
      gsap.delayedCall(delay, () => {
        gsap.to(el, { opacity: 0.92, duration: 0.42, ease: "power2.out" });
      });
    } else {
      window.setTimeout(() => { el.style.opacity = "0.92"; }, delay * 1000);
    }
  }

  function showAchievement() {
    if (achievementShown) return;
    achievementShown = true;

    const box = document.createElement("div");
    box.className = "hero-achievement";
    box.innerHTML = "<span>Achieve</span><strong>Happy Cake Day</strong>";
    document.body.appendChild(box);

    const confetti = Array.from({ length: 18 }, (_, index) => {
      const piece = document.createElement("i");
      piece.className = "hero-confetti";
      piece.style.setProperty("--tx", `${-84 + Math.random() * 168}px`);
      piece.style.setProperty("--ty", `${-46 + Math.random() * 118}px`);
      piece.style.setProperty("--rot", `${-220 + Math.random() * 440}deg`);
      piece.style.setProperty("--delay", `${index * 0.012}s`);
      box.appendChild(piece);
      return piece;
    });

    if (window.gsap) {
      gsap.fromTo(box,
        { autoAlpha: 0, x: 36, y: -10, filter: "blur(10px)" },
        { autoAlpha: 1, x: 0, y: 0, filter: "blur(0px)", duration: 0.44, ease: "power3.out" }
      );
      gsap.fromTo(confetti,
        { autoAlpha: 1, x: 0, y: 0, rotate: 0, scale: 0.7 },
        {
          autoAlpha: 0,
          x: (i, target) => parseFloat(target.style.getPropertyValue("--tx")),
          y: (i, target) => parseFloat(target.style.getPropertyValue("--ty")),
          rotate: (i, target) => target.style.getPropertyValue("--rot"),
          scale: 1,
          stagger: 0.012,
          duration: 0.82,
          ease: "power3.out"
        }
      );
      gsap.to(box, {
        autoAlpha: 0,
        x: 18,
        filter: "blur(7px)",
        delay: 3,
        duration: 0.42,
        ease: "power2.in",
        onComplete: () => box.remove()
      });
    } else {
      window.setTimeout(() => box.remove(), 3600);
    }
  }

  function getClickSource(index) {
    const sources = cakeCount >= 3
      ? clickStickerSources.filter((source) => source.achievement !== "cake")
      : clickStickerSources;
    return sources[Math.floor(Math.random() * sources.length)] || clickStickerSources[index % clickStickerSources.length];
  }

  function spawnInitialStickers() {
    const copies = prefersReduced ? 6 : width < 720 ? 8 : 11;
    const configs = Array.from({ length: copies }, (_, index) => {
      const base = initialStickerSources[index % initialStickerSources.length];
      return { ...base };
    }).sort(() => Math.random() - 0.5);

    configs.forEach((config, index) => {
      createSticker(config, index, {
        x: width * (0.16 + Math.random() * 0.68),
        y: -80 - Math.random() * 260,
      });
    });
  }

  function spawnBurst() {
    const copies = 3 + Math.floor(Math.random() * 3);
    const configs = Array.from({ length: copies }, (_, index) => {
      const base = getClickSource(index);
      return { ...base };
    }).sort(() => Math.random() - 0.5);

    configs.forEach((config, index) => {
      createSticker(config, index, {
        x: width * (0.08 + Math.random() * 0.84),
        y: -80 - Math.random() * 180,
      });
    });
  }

  function shouldIgnoreClick(event) {
    return !!event.target.closest("a, button, .site-header, .mobile-menu");
  }

  function updatePointer() {
    pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.22;
    pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.22;

    pointerSpeed = Vector.magnitude({
      x: pointerCurrent.x - pointerPrevious.x,
      y: pointerCurrent.y - pointerPrevious.y,
    });
    pointerPrevious = { ...pointerCurrent };

    if (pointerBody) Body.setPosition(pointerBody, pointerCurrent);
  }

  function applyPointerForce() {
    if (pointerCurrent.x < -200 || pointerCurrent.y < -200) return;
    const radius = 162;
    const strength = Math.min(0.075, 0.01 + pointerSpeed * 0.0034);

    stickers.forEach((body) => {
      const dx = body.position.x - pointerCurrent.x;
      const dy = body.position.y - pointerCurrent.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > radius || dist < 0.001) return;

      const falloff = 1 - dist / radius;
      const force = {
        x: (dx / dist) * strength * falloff * body.mass,
        y: (dy / dist) * strength * falloff * body.mass,
      };
      Body.applyForce(body, body.position, force);
      Body.setAngularVelocity(body, body.angularVelocity + (dx > 0 ? 1 : -1) * 0.018 * falloff);
    });
  }

  function renderStickers() {
    stickers.forEach((body) => {
      const data = body.plugin;
      if (!data?.el) return;
      const x = body.position.x - data.width / 2;
      const y = body.position.y - data.height / 2;
      data.el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${body.angle}rad)`;
    });
  }

  function clampStickerVelocity() {
    stickers.forEach((body) => {
      const speed = Vector.magnitude(body.velocity);
      if (speed > 24) {
        const next = Vector.mult(Vector.normalise(body.velocity), 24);
        Body.setVelocity(body, next);
      }
      if (Math.abs(body.angularVelocity) > 0.34) {
        Body.setAngularVelocity(body, Math.sign(body.angularVelocity) * 0.34);
      }
    });
  }

  function tick(now) {
    const delta = Math.min(33.33, now - lastTime || 16.67);
    lastTime = now;
    const rect = heroRect();
    isHeroActive = rect.bottom > 0 && rect.top < window.innerHeight;
    if (!isHeroActive || document.hidden) {
      requestAnimationFrame(tick);
      return;
    }
    updatePointer();
    applyPointerForce();
    Engine.update(engine, delta);
    clampStickerVelocity();
    renderStickers();
    requestAnimationFrame(tick);
  }

  function updatePointerTarget(event) {
    const rect = heroRect();
    pointerTarget.x = event.clientX - rect.left;
    pointerTarget.y = event.clientY - rect.top;
  }

  function handleHeroPointerDown(event) {
    if (shouldIgnoreClick(event)) return;
    const rect = heroRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;
    spawnBurst();
  }

  function start() {
    if (isStarted) return;
    isStarted = true;
    syncSize();
    makePointer();
    requestAnimationFrame((time) => {
      lastTime = time;
      requestAnimationFrame(tick);
    });
    window.setTimeout(spawnInitialStickers, 2200);
  }

  window.addEventListener("pointermove", updatePointerTarget, { passive: true });
  hero.addEventListener("pointerdown", handleHeroPointerDown);
  window.addEventListener("resize", () => {
    syncSize();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();

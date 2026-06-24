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

  const stickerSources = [
    { src: "./assets/stickers/web/cat.png", width: 150, ratio: 1.0, restitution: 0.32 },
    { src: "./assets/stickers/web/horse.png", width: 128, ratio: 0.68, restitution: 0.36 },
    { src: "./assets/stickers/web/cake.png", width: 188, ratio: 1.0, restitution: 0.28 },
    { src: "./assets/stickers/web/polaroids.png", width: 190, ratio: 0.75, restitution: 0.25 },
    { src: "./assets/stickers/web/angel-yu-sticker.png", width: 232, ratio: 0.26, restitution: 0.2 },
  ];

  const stickers = [];
  const boundaries = [];
  let pointerBody = null;
  let titleBlocker = null;
  let width = 0;
  let height = 0;
  let lastTime = performance.now();
  let pointerTarget = { x: -999, y: -999 };
  let pointerCurrent = { x: -999, y: -999 };
  let pointerPrevious = { x: -999, y: -999 };
  let pointerSpeed = 0;
  let isStarted = false;
  let isHeroActive = true;

  function heroRect() {
    return hero.getBoundingClientRect();
  }

  function syncSize() {
    const rect = heroRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);

    if (boundaries.length) World.remove(engine.world, boundaries);
    boundaries.length = 0;
    if (titleBlocker) {
      World.remove(engine.world, titleBlocker);
      titleBlocker = null;
    }

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
    syncTitleBlocker();
  }

  function syncTitleBlocker() {
    const title = document.querySelector(".hero-copy");
    if (!title || !width || !height) return;
    const heroBox = heroRect();
    const titleBox = title.getBoundingClientRect();
    const blockerWidth = Math.max(420, titleBox.width + 88);
    const blockerHeight = Math.max(92, titleBox.height + 54);
    const x = titleBox.left - heroBox.left + titleBox.width / 2;
    const y = titleBox.top - heroBox.top + titleBox.height / 2;

    if (titleBlocker) World.remove(engine.world, titleBlocker);
    titleBlocker = Bodies.rectangle(x, y, blockerWidth, blockerHeight, {
      isStatic: true,
      label: "hero-title-blocker",
      friction: 0.64,
      restitution: 0.18,
    });
    World.add(engine.world, titleBlocker);
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

  function createSticker(config, index) {
    const viewportScale = width < 720 ? 0.72 : width < 1100 ? 0.88 : 1;
    const displayWidth = Math.round(config.width * viewportScale * (0.88 + Math.random() * 0.22));
    const ratio = config.ratio || 1;
    const displayHeight = Math.max(44, displayWidth * ratio);
    const x = width * (0.16 + Math.random() * 0.68);
    const y = -displayHeight - 30 - Math.random() * 260;

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

    const delay = 0.22 + index * 0.18 + Math.random() * 0.12;
    if (window.gsap) {
      gsap.delayedCall(delay, () => {
        gsap.to(el, { opacity: 0.92, duration: 0.42, ease: "power2.out" });
      });
    } else {
      window.setTimeout(() => { el.style.opacity = "0.92"; }, delay * 1000);
    }
  }

  async function spawnStickers() {
    const copies = prefersReduced ? 6 : width < 720 ? 8 : 11;
    const configs = Array.from({ length: copies }, (_, index) => {
      const base = stickerSources[index % stickerSources.length];
      return { ...base };
    }).sort(() => Math.random() - 0.5);

    configs.forEach((config, index) => createSticker(config, index));
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

  function start() {
    if (isStarted) return;
    isStarted = true;
    syncSize();
    makePointer();
    window.setTimeout(spawnStickers, 3200);
    requestAnimationFrame((time) => {
      lastTime = time;
      requestAnimationFrame(tick);
    });
  }

  window.addEventListener("pointermove", updatePointerTarget, { passive: true });
  window.addEventListener("resize", () => {
    syncSize();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();

(function () {
  const section = document.querySelector(".art-scroll-section");
  const stage = document.querySelector(".art-stage");
  const wall = document.querySelector(".art-wall");
  const columns = Array.from(document.querySelectorAll(".art-column"));
  const initialImages = Array.from(document.querySelectorAll(".art-column img"));

  if (!section || !stage || !wall || !columns.length) return;

  const loopCopies = 3;
  const centerCopy = 1;
  const cycleDistances = [1200, 1200, 1200, 1200];
  const baseOffsets = [-240, -760, -300, -700];
  const directions = [-1, 1, -1, 1];
  const speeds = [1, 0.92, 1.04, 0.96];

  let target = 0;
  let current = 0;
  let velocity = 0;
  let lastTouchY = 0;
  let rafId = 0;

  function transform(element, value) {
    element.style.transform = value;
  }

  function clampDelta(delta) {
    return Math.max(-180, Math.min(180, delta));
  }

  function buildLoopColumns() {
    columns.forEach((column) => {
      if (column.dataset.loopReady === "true") return;
      const originals = Array.from(column.children).map((item) => item.cloneNode(true));
      column.replaceChildren();

      for (let copy = 0; copy < loopCopies; copy += 1) {
        const group = document.createElement("div");
        group.className = "art-loop-group";
        if (copy !== centerCopy) group.setAttribute("aria-hidden", "true");

        originals.forEach((item) => {
          const clone = item.cloneNode(true);
          if (copy !== centerCopy) clone.setAttribute("aria-hidden", "true");
          group.appendChild(clone);
        });

        column.appendChild(group);
      }
      column.dataset.loopReady = "true";
    });
  }

  function wrap(value, cycle) {
    return ((value % cycle) + cycle) % cycle;
  }

  function measure() {
    section.style.minHeight = "100vh";
    stage.style.position = "fixed";
    stage.style.inset = "0";
    stage.style.height = "100vh";
    stage.style.width = "100%";
    document.documentElement.classList.add("art-virtual-page");
    document.body.classList.add("art-virtual-page");

    columns.forEach((column, index) => {
      const group = column.querySelector(".art-loop-group");
      cycleDistances[index] = Math.max(window.innerHeight * 1.35, group ? group.offsetHeight : column.scrollHeight / loopCopies);
    });
  }

  function addInput(delta) {
    velocity += clampDelta(delta) * 0.62;
  }

  function onWheel(event) {
    event.preventDefault();
    addInput(event.deltaY);
  }

  function onTouchStart(event) {
    lastTouchY = event.touches[0]?.clientY || 0;
  }

  function onTouchMove(event) {
    const nextY = event.touches[0]?.clientY || lastTouchY;
    event.preventDefault();
    addInput((lastTouchY - nextY) * 1.6);
    lastTouchY = nextY;
  }

  function onKeyDown(event) {
    if (event.defaultPrevented) return;
    const keyMap = {
      ArrowDown: 70,
      PageDown: 260,
      " ": 220,
      ArrowUp: -70,
      PageUp: -260
    };
    if (!(event.key in keyMap)) return;
    event.preventDefault();
    addInput(keyMap[event.key]);
  }

  function render(force) {
    target += velocity;
    velocity *= 0.88;
    current += (target - current) * (force ? 1 : 0.2);

    const referenceCycle = cycleDistances[0] || 1;
    const progress = wrap(current, referenceCycle) / referenceCycle;

    transform(wall, "translate3d(-50%, 0, 0)");
    wall.style.opacity = "1";

    columns.forEach((column, index) => {
      const cycle = cycleDistances[index] || referenceCycle;
      const signedDistance = directions[index] * current * speeds[index];
      const driftX = (index - 1.5) * Math.sin(progress * Math.PI) * 5;
      const y = wrap(baseOffsets[index] + signedDistance, cycle) - cycle * centerCopy;
      transform(column, `translate3d(${driftX}px, ${y}px, 0)`);
      column.dataset.trackY = String(Math.round(y));
    });

    section.dataset.trackA = columns[0]?.dataset.trackY || "0";
    section.dataset.trackB = columns[1]?.dataset.trackY || "0";
    section.dataset.trackC = columns[2]?.dataset.trackY || "0";
    section.dataset.trackD = columns[3]?.dataset.trackY || "0";
    section.dataset.virtualY = String(Math.round(current));
    section.dataset.velocity = String(Math.round(velocity));

  }

  function tick() {
    render(false);
    rafId = window.requestAnimationFrame(tick);
  }

  function refresh(force) {
    measure();
    render(force);
  }

  buildLoopColumns();
  wall.style.opacity = "0";
  columns.forEach((column, index) => {
    transform(column, `translate3d(0, ${baseOffsets[index]}px, 0)`);
  });

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("resize", () => refresh(true), { passive: true });
  window.addEventListener("load", () => refresh(true), { once: true });
  initialImages.forEach((image) => image.addEventListener("load", () => refresh(false), { once: true }));
  Array.from(document.querySelectorAll(".art-column video")).forEach((video) => {
    video.play().catch(() => {});
  });

  refresh(true);
  window.requestAnimationFrame(() => {
    wall.style.transition = "opacity 700ms ease";
    wall.style.opacity = "1";
    if (!rafId) tick();
  });
})();

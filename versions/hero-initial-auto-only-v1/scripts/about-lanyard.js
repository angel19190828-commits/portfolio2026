(function () {
  const scene = document.querySelector("[data-lanyard]");
  const card = scene?.querySelector(".lanyard-card");
  if (!scene || !card) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let velocityX = 0;
  let velocityY = 0;
  let rotation = 0;
  let dragging = false;
  let lastPointer = { x: 0, y: 0 };

  function setTargetFromPointer(event) {
    const rect = scene.getBoundingClientRect();
    targetX = event.clientX - (rect.left + rect.width / 2);
    targetY = event.clientY - (rect.top + rect.height * 0.56);
    targetX = Math.max(-180, Math.min(180, targetX));
    targetY = Math.max(-160, Math.min(160, targetY));
  }

  function handlePointerDown(event) {
    dragging = true;
    card.setPointerCapture?.(event.pointerId);
    lastPointer = { x: event.clientX, y: event.clientY };
    setTargetFromPointer(event);
    card.classList.add("is-dragging");
  }

  function handlePointerMove(event) {
    if (!dragging) {
      const rect = scene.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      targetX = Math.max(-48, Math.min(48, dx * 0.08));
      return;
    }
    velocityX += (event.clientX - lastPointer.x) * 0.06;
    velocityY += (event.clientY - lastPointer.y) * 0.03;
    lastPointer = { x: event.clientX, y: event.clientY };
    setTargetFromPointer(event);
  }

  function handlePointerUp() {
    dragging = false;
    targetX = 0;
    targetY = 0;
    card.classList.remove("is-dragging");
  }

  function tick() {
    const stiffness = dragging ? 0.22 : 0.055;
    const damping = dragging ? 0.72 : 0.9;
    velocityX += (targetX - currentX) * stiffness;
    velocityY += (targetY - currentY) * stiffness;
    velocityX *= damping;
    velocityY *= damping;
    currentX += velocityX;
    currentY += velocityY;
    rotation += (currentX * 0.045 + velocityX * 0.7 - rotation) * 0.12;

    scene.style.setProperty("--card-x", `${currentX}px`);
    scene.style.setProperty("--card-y", `${currentY}px`);
    scene.style.setProperty("--card-rot", `${rotation}deg`);
    scene.style.setProperty("--card-tilt", `${currentX * 0.035}deg`);
    scene.style.setProperty("--band-x", `${currentX * 0.22}px`);
    scene.style.setProperty("--band-rot", `${rotation * 0.28}deg`);
    requestAnimationFrame(tick);
  }

  card.addEventListener("pointerdown", handlePointerDown);
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  window.addEventListener("pointerup", handlePointerUp);
  window.addEventListener("pointercancel", handlePointerUp);
  requestAnimationFrame(tick);
})();

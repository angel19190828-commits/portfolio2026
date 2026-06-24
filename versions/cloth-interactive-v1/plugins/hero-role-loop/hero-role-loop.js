(function () {
  function parseRoles(value) {
    return String(value || "Product,Website,Interactive,Visual")
      .split(",")
      .map((role) => role.trim())
      .filter(Boolean);
  }

  function mount(root, options) {
    if (!root || root.dataset.heroRoleMounted === "true") return null;

    const roles = options?.roles || parseRoles(root.dataset.roles);
    const interval = Number(options?.interval || root.dataset.interval || 2600);
    const label = options?.label || root.dataset.label || "I AM A(N)";
    const fixed = options?.fixed || root.dataset.fixed || "Designer";
    const reduceMotion = root.dataset.respectReducedMotion === "true"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.dataset.heroRoleMounted = "true";
    root.classList.add("hero-role-loop");
    root.innerHTML = [
      `<span class="hero-role-loop__label">${label}</span>`,
      `<div class="hero-role-loop__mask"><h1 id="word1" class="hero-role-loop__word is-active">${roles[0] || ""}</h1></div>`,
      `<h1 class="hero-role-loop__fixed">${fixed}</h1>`
    ].join("");

    const word = root.querySelector(".hero-role-loop__word");
    let index = 0;
    let delayedCall = null;

    if (window.gsap) {
      gsap.set(word, { autoAlpha: 1, y: 0, filter: "blur(0px)" });
    }

    function scheduleNext(delay) {
      if (reduceMotion || roles.length <= 1) return;
      if (window.gsap) {
        delayedCall = gsap.delayedCall(delay / 1000, () => go((index + 1) % roles.length));
      } else {
        delayedCall = window.setTimeout(() => go((index + 1) % roles.length), delay);
      }
    }

    function go(nextIndex) {
      if (!word || !roles.length || nextIndex === index) return;

      if (window.gsap && !reduceMotion) {
        gsap.to(word, {
          filter: "blur(10px)",
          opacity: 0,
          y: -16,
          duration: 0.42,
          ease: "power2.in",
          overwrite: true,
          onComplete: () => {
            index = nextIndex;
            word.textContent = roles[index];
            gsap.fromTo(word,
              { filter: "blur(10px)", opacity: 0, y: 16 },
              {
                filter: "blur(0px)",
                opacity: 1,
                y: 0,
                duration: 0.52,
                ease: "power2.out",
                overwrite: true,
                onComplete: () => scheduleNext(interval)
              }
            );
          }
        });
      } else {
        index = nextIndex;
        word.textContent = roles[index];
        scheduleNext(interval);
      }
    }

    if (!reduceMotion && roles.length > 1) {
      scheduleNext(900);
    }

    return {
      next: () => go((index + 1) % roles.length),
      destroy: () => {
        if (delayedCall?.kill) delayedCall.kill();
        if (delayedCall && !delayedCall.kill) window.clearTimeout(delayedCall);
        root.dataset.heroRoleMounted = "false";
      }
    };
  }

  function autoMount() {
    document.querySelectorAll("[data-hero-role-loop]").forEach((root) => mount(root));
  }

  window.HeroRoleLoop = { mount, autoMount };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoMount, { once: true });
  } else {
    autoMount();
  }
})();

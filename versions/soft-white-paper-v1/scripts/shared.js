(function () {
  const hasGsap = !!window.gsap;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const menuButton = document.querySelector(".menu-button");
  const mobileMenu = document.querySelector(".mobile-menu");

  function closeMenu() {
    mobileMenu?.setAttribute("aria-hidden", "true");
    if (hasGsap && !prefersReduced) {
      gsap.to(mobileMenu, { y: "-110%", duration: 0.35, ease: "power2.in" });
    } else if (mobileMenu) {
      mobileMenu.style.transform = "translateY(-110%)";
    }
  }

  function openMenu() {
    mobileMenu?.setAttribute("aria-hidden", "false");
    if (hasGsap && !prefersReduced) {
      gsap.to(mobileMenu, { y: "0%", duration: 0.5, ease: "expo.out" });
      gsap.fromTo(".mobile-menu a", { y: -16, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.35, delay: 0.1 });
    } else if (mobileMenu) {
      mobileMenu.style.transform = "translateY(0)";
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
      closeMenu();
    });
  });

  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (event) => {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.14;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.14;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0, 0)";
    });
  });

  menuButton?.addEventListener("click", () => {
    const isOpen = mobileMenu?.getAttribute("aria-hidden") === "false";
    isOpen ? closeMenu() : openMenu();
  });
})();

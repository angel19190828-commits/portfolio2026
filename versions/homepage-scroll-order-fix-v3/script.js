(function () {
  const hasGsap = window.gsap && window.ScrollTrigger;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const menuButton = document.querySelector(".menu-button");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
  }

  function fallbackReveal() {
    document.body.classList.add("no-gsap");
    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12 })
      : null;

    document.querySelectorAll(".reveal, [data-animate]").forEach((el) => {
      if (observer) {
        observer.observe(el);
      } else {
        el.classList.add("is-visible");
      }
    });

    setTimeout(() => {
      document.querySelector(".site-header")?.classList.add("is-visible");
      document.querySelector(".hero-copy")?.classList.add("is-visible");
      document.querySelector(".spline-shell")?.classList.add("is-visible");
    }, 250);
  }

  if (!hasGsap || prefersReduced) {
    fallbackReveal();
  } else {
    const hasOpening = !!document.querySelector(".opening");
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (hasOpening) {
      gsap.set(".opening", { autoAlpha: 1, filter: "blur(0px)" });
      gsap.set(".opening__mark", { autoAlpha: 0, scale: 0.7, rotation: -92, filter: "blur(8px)" });
      tl.to(".opening__mark", { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.48, ease: "power2.out" }, 0)
        .to(".opening__mark", { rotation: 238, duration: 1.45, ease: "power2.inOut" }, 0.06)
        .to(".opening__mark", { autoAlpha: 0, scale: 1.18, filter: "blur(10px)", duration: 0.54, ease: "power3.inOut" }, 1.18)
        .set(".opening", { autoAlpha: 0 });
    }
    tl.from(".site-header", { y: -30, opacity: 0, duration: 0.8 }, hasOpening ? "-=0.4" : 0)
      .fromTo(".spline-shell",
        { autoAlpha: 0, filter: "blur(18px)", scale: 1.02 },
        { autoAlpha: 0.9, filter: "blur(0px)", scale: 1, duration: 1.45, ease: "power3.out" },
        "-=0.45"
      )
      .fromTo(".hero-copy",
        { y: -22, autoAlpha: 0, filter: "blur(10px)", scale: 0.985 },
        { y: 0, autoAlpha: 1, filter: "blur(0px)", scale: 1, duration: 0.95, ease: "back.out(1.25)" },
        "-=0.92"
      )
      .fromTo([".hero-statement", ".skill-strip", ".resume-button", ".geo-panel", ".school-panel", ".based-panel", ".scroll-hint", ".page-intro", ".detail-hero-copy"],
        { autoAlpha: 0, filter: "blur(7px)", scale: 0.96 },
        { autoAlpha: 1, filter: "blur(0px)", scale: 1, stagger: 0.06, duration: 0.48, ease: "power2.out" },
        "-=0.28"
      );

    gsap.to(".hero__photo", {
      yPercent: 10,
      scale: 1.08,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });

    gsap.to(".spline-shell", {
      yPercent: -8,
      scale: 1.04,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });

    gsap.to(".hero-copy", {
      yPercent: -18,
      filter: "blur(3px)",
      autoAlpha: 0.72,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "55% top", end: "bottom top", scrub: true }
    });

    gsap.utils.toArray(".reveal").forEach((el) => {
      if (el.closest("[data-section2-collage]")) return;
      gsap.from(el, {
        opacity: 0,
        y: 42,
        scale: 0.985,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 86%" }
      });
    });

    gsap.utils.toArray(".feature-tags span, .skill-strip li").forEach((pill, index) => {
      gsap.fromTo(pill,
        { autoAlpha: 0, y: 10, filter: "blur(5px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.38, delay: index * 0.015, ease: "power2.out" }
      );
    });
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

  const preview = document.querySelector(".cursor-preview");
  document.querySelectorAll(".work-row").forEach((row) => {
    row.addEventListener("mouseenter", () => {
      if (!preview) return;
      preview.style.backgroundImage = `url("${row.dataset.img}")`;
      if (hasGsap && !prefersReduced) {
        gsap.to(preview, { opacity: 1, scale: 1, rotate: -2, duration: 0.22 });
      } else {
        preview.style.opacity = "1";
      }
    });
    row.addEventListener("mouseleave", () => {
      if (!preview) return;
      if (hasGsap && !prefersReduced) {
        gsap.to(preview, { opacity: 0, scale: 0.82, rotate: -3, duration: 0.22 });
      } else {
        preview.style.opacity = "0";
      }
    });
  });

  window.addEventListener("mousemove", (event) => {
    if (!preview) return;
    if (hasGsap && !prefersReduced) {
      gsap.to(preview, { x: event.clientX + 22, y: event.clientY + 10, duration: 0.18, ease: "power2.out" });
    } else {
      preview.style.transform = `translate(${event.clientX + 22}px, ${event.clientY + 10}px)`;
    }
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

  function openMenu() {
    mobileMenu?.setAttribute("aria-hidden", "false");
    if (hasGsap && !prefersReduced) {
      gsap.to(mobileMenu, { y: "0%", duration: 0.5, ease: "expo.out" });
      gsap.fromTo(".mobile-menu a", { y: -16, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.35, delay: 0.1 });
    } else if (mobileMenu) {
      mobileMenu.style.transform = "translateY(0)";
    }
  }

  function closeMenu() {
    mobileMenu?.setAttribute("aria-hidden", "true");
    if (hasGsap && !prefersReduced) {
      gsap.to(mobileMenu, { y: "-110%", duration: 0.35, ease: "power2.in" });
    } else if (mobileMenu) {
      mobileMenu.style.transform = "translateY(-110%)";
    }
  }

  menuButton?.addEventListener("click", () => {
    const isOpen = mobileMenu?.getAttribute("aria-hidden") === "false";
    isOpen ? closeMenu() : openMenu();
  });
})();

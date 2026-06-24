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
    const hasOpeningMark = !!document.querySelector(".opening__mark");
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (hasOpening) {
      gsap.set(".opening", { autoAlpha: 1, filter: "blur(0px)" });
      if (hasOpeningMark) {
        gsap.set(".opening__mark", { autoAlpha: 0, scale: 0.7, rotation: -92, filter: "blur(8px)" });
        tl.to(".opening__mark", { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.48, ease: "power2.out" }, 0)
          .to(".opening__mark", { rotation: 238, duration: 1.45, ease: "power2.inOut" }, 0.06)
          .to(".opening__mark", { autoAlpha: 0, scale: 1.18, filter: "blur(10px)", duration: 0.54, ease: "power3.inOut" }, 1.18);
      }
      tl.set(".opening", { autoAlpha: 0 }, hasOpeningMark ? undefined : 0.65);
    }
    tl.from(".site-header", { y: -30, opacity: 0, duration: 0.8 }, hasOpening ? "-=0.4" : 0);
    if (document.querySelector(".spline-shell")) {
      tl.fromTo(".spline-shell",
          { autoAlpha: 0, filter: "blur(18px)", scale: 1.02 },
          { autoAlpha: 0.9, filter: "blur(0px)", scale: 1, duration: 1.45, ease: "power3.out" },
          "-=0.45"
        );
    }
    tl
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

    if (document.querySelector(".hero__photo")) {
      gsap.to(".hero__photo", {
        yPercent: 10,
        scale: 1.08,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
      });
    }

    if (document.querySelector(".spline-shell")) {
      gsap.to(".spline-shell", {
        yPercent: -8,
        scale: 1.04,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
      });
    }

    gsap.to(".hero-copy", {
      yPercent: -18,
      filter: "blur(3px)",
      autoAlpha: 0.72,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "55% top", end: "bottom top", scrub: true }
    });

    gsap.to(".ticker__track", {
      xPercent: -45,
      ease: "none",
      scrollTrigger: { trigger: ".work-section", start: "top bottom", end: "bottom top", scrub: 0.8 }
    });

    const carouselProjects = [
      {
        orbit: 6,
        title: "Grantx Marketing Website Redesign",
        image: "https://framerusercontent.com/images/PBRv1EewSUpeKGWhItqUTqONJgI.png?scale-down-to=1024&width=3200&height=2000",
        tags: ["Branding", "Web UIUX", "3D", "AI", "Information Architecture"],
        meta: ["Dec 2025 - Ongoing", "Founding Designer"],
        href: "/work/grantx-marketing-website/"
      },
      {
        orbit: 7,
        title: "Grantx - Agentic AI Funding Platform",
        image: "https://framerusercontent.com/images/x5dkDZTJDXjhJVhBbai9HbJ8WIs.png?scale-down-to=1024&width=3200&height=2000",
        tags: ["AI", "Product Design", "Design System", "User Research"],
        meta: ["Dec 2025 - Ongoing", "Founding Designer"],
        href: "/work/grantx-marketing-website/"
      },
      {
        orbit: 8,
        title: "Ounce by Ocean Spray",
        image: "https://framerusercontent.com/images/ZgfOjLEtzWuMKZLvQQOWm6kjLg.png?scale-down-to=1024&width=3200&height=2000",
        tags: ["Branding", "Product Experience", "Wellness", "Packaging", "Prototyping"],
        meta: ["Sep 2024 - Jan 2025", "Product Strategist"],
        href: "/work/"
      },
      {
        orbit: 9,
        title: "A Distant Slumber",
        image: "https://framerusercontent.com/images/83kwKklV2mrIGy9B7pc9shTjYc.gif?scale-down-to=1024&width=1606&height=877",
        tags: ["Unreal Engine", "Environment Design", "Technical Art", "Virtual Experience"],
        meta: ["Jan 2025 - May 2025", "Technical Artist"],
        href: "/work/"
      },
      {
        orbit: 10,
        title: "We3",
        image: "https://framerusercontent.com/images/bCBKoscbdzIw6YG1PlFpmoCF0.gif?scale-down-to=1024&width=1920&height=1080",
        tags: ["Game Development", "Unity", "Pixel Art", "RPG", "Exhibition Installation"],
        meta: ["Jan 2023 - May 2023", "Game Designer"],
        href: "/work/"
      }
    ];

    const featureCard = document.querySelector(".feature-card");
    const featureImg = featureCard?.querySelector("img");
    const featureTitle = featureCard?.querySelector(".feature-title h2");
    const featureTags = featureCard?.querySelector(".feature-tags");
    const featureMeta = featureCard?.querySelectorAll(".feature-meta span");
    const orbitItems = gsap.utils.toArray(".orbit-copy span");
    let activeProjectIndex = -1;
    let featureCardLive = false;

    function setFeatureCardLive(isLive) {
      if (!featureCard || featureCardLive === isLive) return;
      featureCardLive = isLive;
      featureCard.classList.toggle("is-live", isLive);
      gsap.to(featureCard, {
        autoAlpha: isLive ? 1 : 0,
        y: isLive ? 0 : 28,
        scale: isLive ? 1 : 0.985,
        filter: isLive ? "blur(0px)" : "blur(6px)",
        duration: isLive ? 0.48 : 0.22,
        overwrite: true,
        ease: isLive ? "power3.out" : "power2.in"
      });
    }

    function setFeaturedProject(index, animate) {
      if (!featureCard || index === activeProjectIndex) return;
      activeProjectIndex = index;
      const project = carouselProjects[index];
      const commit = () => {
        featureCard.href = project.href;
        if (featureImg) featureImg.src = project.image;
        if (featureTitle) featureTitle.textContent = project.title;
        if (featureTags) featureTags.innerHTML = project.tags.map((tag) => `<span>${tag}</span>`).join("");
        if (featureMeta?.length >= 2) {
          featureMeta[0].textContent = project.meta[0];
          featureMeta[1].textContent = project.meta[1];
        }
        orbitItems.forEach((item) => item.classList.remove("active-orbit"));
        orbitItems[project.orbit]?.classList.add("active-orbit");
      };
      if (animate) {
        featureCard.classList.add("is-swapping");
        gsap.to(featureCard, {
          autoAlpha: featureCardLive ? 0.18 : 0,
          filter: "blur(5px)",
          scale: 0.985,
          duration: 0.12,
          overwrite: true,
          onComplete: () => {
            commit();
            gsap.to(featureCard, {
              autoAlpha: featureCardLive ? 1 : 0,
              filter: "blur(0px)",
              scale: 1,
              duration: 0.28,
              overwrite: true,
              ease: "power3.out",
              onComplete: () => featureCard.classList.remove("is-swapping")
            });
          }
        });
      } else {
        commit();
      }
    }

    setFeaturedProject(1, false);
    const wheelStage = document.querySelector(".work-wheel-stage");
    if (wheelStage && featureCard && !document.querySelector(".project-stack")) {
      const isMobile = () => window.matchMedia("(max-width: 809px)").matches;
      const projectCount = carouselProjects.length;
      const wheelTween = gsap.to(".orbit-copy", {
        rotation: () => isMobile() ? -50 : -66,
        y: () => isMobile() ? -340 : -520,
        scale: () => isMobile() ? 0.74 : 1,
        ease: "none",
        paused: true
      });
      const imageTween = gsap.to(featureImg, {
        yPercent: -5,
        scale: 1.035,
        ease: "none",
        paused: true
      });
      const spriteTween = gsap.timeline({ paused: true })
        .fromTo(".work-sprites img",
          { autoAlpha: 0, y: 48, scale: 0.82, filter: "blur(12px) saturate(.75)" },
          { autoAlpha: 0.54, y: 0, scale: 1, filter: "blur(0px) saturate(.95)", stagger: 0.06, duration: 0.32, ease: "power2.out" },
          0.14
        )
        .to(".work-sprites img:nth-child(odd)", { y: -72, x: -18, rotation: -4, ease: "none", duration: 0.72 }, 0.28)
        .to(".work-sprites img:nth-child(even)", { y: 58, x: 24, rotation: 5, ease: "none", duration: 0.72 }, 0.28);

      ScrollTrigger.create({
        trigger: ".featured-work",
        start: "top top",
        end: () => `+=${Math.max(2100, window.innerHeight * 3.85)}`,
        pin: true,
        scrub: 0.72,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = gsap.utils.clamp(0, 0.999, self.progress);
          const cardProgress = gsap.utils.clamp(0, 0.999, (progress - 0.48) / 0.52);
          const nextIndex = Math.min(projectCount - 1, Math.floor(cardProgress * projectCount));
          wheelTween.progress(progress);
          imageTween.progress(progress);
          spriteTween.progress(progress);
          setFeatureCardLive(progress > 0.46);
          setFeaturedProject(nextIndex, true);
        },
        onRefresh: (self) => {
          const progress = gsap.utils.clamp(0, 0.999, self.progress || 0);
          const cardProgress = gsap.utils.clamp(0, 0.999, (progress - 0.48) / 0.52);
          wheelTween.progress(progress);
          imageTween.progress(progress);
          spriteTween.progress(progress);
          setFeatureCardLive(progress > 0.46);
          setFeaturedProject(Math.min(projectCount - 1, Math.floor(cardProgress * projectCount)), false);
        }
      });
    }

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

    const artItems = document.querySelector("[data-section2-collage]")
      ? []
      : gsap.utils.toArray(".art-grid img");
    if (artItems.length) {
      gsap.fromTo(artItems,
        { autoAlpha: 0, y: 70, filter: "blur(10px)", scale: 0.985 },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
          stagger: { each: 0.055, from: "center" },
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".art-section", start: "top 72%" }
        }
      );

      gsap.to(artItems, {
        y: (index) => index % 2 === 0 ? -54 : 36,
        scale: (index) => index % 3 === 0 ? 1.035 : 1,
        filter: (index) => index % 2 === 0 ? "saturate(1.04)" : "saturate(.92)",
        ease: "none",
        scrollTrigger: {
          trigger: ".art-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8
        }
      });
    }

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

(function () {
  const isStaleBabyStepsPage = (() => {
    const path = decodeURIComponent(window.location.pathname).replace(/\/+$/, "");
    return /\/work\/Baby Steps$/i.test(path)
      && document.title === "Baby Steps - Angel Yu"
      && !document.querySelector(".cs-timeline");
  })();

  if (isStaleBabyStepsPage) {
    const rescueUrl = new URL("./index.html", window.location.href);
    rescueUrl.searchParams.set("cache-rescue", Date.now().toString());

    fetch(rescueUrl.href, { cache: "no-store" })
      .then((response) => response.text())
      .then((html) => {
        document.open();
        document.write(html);
        document.close();
      })
      .catch(() => {
        window.location.replace(rescueUrl.href);
      });
    return;
  }

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

  if (!hasGsap) {
    fallbackReveal();
  } else {
    const loadingAsset = document.querySelector(".loading-corner-asset");
    const revealSelectors = ".site-header, .hero-copy, .hero-statement, .skill-strip, .resume-button, .geo-panel, .school-panel, .based-panel, .scroll-hint";
    const openingStorageKey = "angel-portfolio-opening-seen";
    const openingCookieKey = "angelPortfolioOpeningSeen";
    const revealPageChrome = () => {
      gsap.set(revealSelectors, {
        autoAlpha: 1,
        filter: "blur(0px)",
        y: 0,
        yPercent: 0,
        scale: 1
      });
    };
    const parkLoadingAssetInHeader = () => {
      if (!loadingAsset) return;
      const brand = document.querySelector(".site-header .brand");
      brand?.appendChild(loadingAsset);
      loadingAsset.className = "brand__image";
      gsap.set(loadingAsset, {
        clearProps: "position,left,top,width,maxHeight,zIndex,pointerEvents,willChange",
        x: 0,
        y: 0,
        xPercent: 0,
        yPercent: 0,
        scale: 1,
        rotation: -1.5,
        autoAlpha: 0.95,
        filter: "blur(0px) saturate(.96)"
      });
    };
    const markOpeningSeen = () => {
      try {
        window.localStorage.setItem(openingStorageKey, "true");
      } catch (error) {}
      try {
        document.cookie = `${openingCookieKey}=true; path=/; max-age=31536000; SameSite=Lax`;
      } catch (error) {}
    };
    const openingSeen = (() => {
      const cookieSeen = document.cookie.split(";").some((item) => item.trim() === `${openingCookieKey}=true`);
      try {
        return window.localStorage.getItem(openingStorageKey) === "true" || cookieSeen;
      } catch (error) {
        return cookieSeen;
      }
    })();
    if (!document.querySelector(".opening")) {
      markOpeningSeen();
    }
    if (openingSeen) {
      document.querySelector(".opening")?.remove();
      parkLoadingAssetInHeader();
      revealPageChrome();
    }
    const hasOpening = !!document.querySelector(".opening") && !openingSeen;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (hasOpening) {
      let openingFinished = false;
      gsap.set(".site-header", { y: 0, autoAlpha: 1 });
      const getBrandRect = () => {
        const brand = document.querySelector(".site-header .brand");
        const probe = document.createElement("img");
        probe.className = "brand__image";
        probe.src = loadingAsset?.getAttribute("src") || "";
        probe.style.visibility = "hidden";
        brand?.appendChild(probe);
        const rect = probe.getBoundingClientRect();
        probe.remove();
        return rect;
      };
      const finishOpening = () => {
        if (openingFinished) return;
        openingFinished = true;
        markOpeningSeen();
        tl.kill();
        gsap.killTweensOf(revealSelectors);
        parkLoadingAssetInHeader();
        gsap.to(revealSelectors, {
          autoAlpha: 1,
          filter: "blur(0px)",
          y: 0,
          yPercent: 0,
          scale: 1,
          duration: 0.34,
          ease: "power2.out",
          overwrite: "auto"
        });
        gsap.set(".opening", { autoAlpha: 0, display: "none", pointerEvents: "none" });
        window.requestAnimationFrame(() => document.querySelector(".opening")?.remove());
      };
      gsap.set(".opening", { autoAlpha: 1, filter: "blur(0px)" });
      if (loadingAsset) {
        tl.fromTo(loadingAsset,
          { autoAlpha: 0, xPercent: -50, yPercent: -50, x: 0, y: 18, scale: 0.94, rotation: -1.8, filter: "blur(22px) saturate(.9)" },
          { autoAlpha: 1, xPercent: -50, yPercent: -50, y: 0, scale: 1, rotation: 0, filter: "blur(0px) saturate(1)", duration: 1.05, ease: "power3.out" },
          0
        );
      }
      if (loadingAsset) {
        tl.to(loadingAsset, {
          x: () => {
            const from = loadingAsset.getBoundingClientRect();
            const to = getBrandRect();
            return to.left + to.width / 2 - (from.left + from.width / 2);
          },
          y: () => {
            const from = loadingAsset.getBoundingClientRect();
            const to = getBrandRect();
            return to.top + to.height / 2 - (from.top + from.height / 2);
          },
          scale: () => {
            const from = loadingAsset.getBoundingClientRect();
            const to = getBrandRect();
            return to.width / Math.max(from.width, 1);
          },
          rotation: -1.5,
          xPercent: -50,
          yPercent: -50,
          filter: "blur(0px) saturate(.96)",
          duration: 0.82,
          ease: "power3.inOut"
        }, 1.18);
      }
      tl.call(() => {
          window.dispatchEvent(new CustomEvent("angel:opening-tail"));
        }, null, 1.55)
        .to(".opening", { autoAlpha: 0, filter: "blur(8px)", duration: 0.44, ease: "power3.inOut" }, 1.7)
        .call(finishOpening, null, 2.18);
      window.setTimeout(finishOpening, 2600);
    }
    if (!hasOpening) {
      tl.from(".site-header", { y: -30, opacity: 0, duration: 0.8 }, 0);
    }
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

    gsap.fromTo(".hero-copy",
      { yPercent: 0, filter: "blur(0px)", autoAlpha: 1 },
      {
        yPercent: -18,
        filter: "blur(2px)",
        autoAlpha: 0.9,
        ease: "none",
        immediateRender: false,
        scrollTrigger: {
          trigger: ".hero",
          start: "55% top",
          end: "bottom top",
          scrub: true,
          onLeaveBack: () => gsap.set(".hero-copy", { autoAlpha: 1, filter: "blur(0px)", yPercent: 0 })
        }
      }
    );

    const tickerTrack = document.querySelector(".ticker__track");
    if (tickerTrack) {
      gsap.to(tickerTrack, {
        xPercent: -45,
        ease: "none",
        scrollTrigger: { trigger: ".work-section", start: "top bottom", end: "bottom top", scrub: 0.8 }
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

    gsap.utils.toArray(".skill-strip li").forEach((pill, index) => {
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
  const workScrollHint = document.querySelector(".work-scroll-hint");

  function updateWorkScrollHint() {
    if (!workScrollHint) return;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    workScrollHint.classList.toggle("is-hidden", window.scrollY > maxScroll - 220);
  }

  if (workScrollHint) {
    updateWorkScrollHint();
    window.addEventListener("scroll", updateWorkScrollHint, { passive: true });
    window.addEventListener("resize", updateWorkScrollHint);
    window.addEventListener("load", updateWorkScrollHint);
    const footer = document.querySelector(".footer");
    if (footer && "IntersectionObserver" in window) {
      const footerObserver = new IntersectionObserver((entries) => {
        const footerVisible = entries.some((entry) => entry.isIntersecting);
        workScrollHint.classList.toggle("is-hidden", footerVisible);
      }, { rootMargin: "0px 0px -12% 0px" });
      footerObserver.observe(footer);
    }
    const watchWorkScrollHint = () => {
      updateWorkScrollHint();
      requestAnimationFrame(watchWorkScrollHint);
    };
    requestAnimationFrame(watchWorkScrollHint);
  }

  const previewRows = document.querySelectorAll(".index-row[data-img], .work-row[data-img]");
  previewRows.forEach((row) => {
    if (!row.dataset.img) return;
    const preloadImage = new Image();
    preloadImage.decoding = "async";
    preloadImage.src = row.dataset.img;
  });

  previewRows.forEach((row) => {
    row.addEventListener("mouseenter", () => {
      if (!preview || !row.dataset.img) return;
      preview.style.backgroundImage = `url("${row.dataset.img}")`;
      if (hasGsap && !prefersReduced) {
        gsap.to(preview, { opacity: 1, scale: 1, rotate: -2, duration: 0.22, overwrite: true });
      } else {
        preview.style.opacity = "1";
      }
    });
    row.addEventListener("mouseleave", () => {
      if (!preview) return;
      if (hasGsap && !prefersReduced) {
        gsap.to(preview, { opacity: 0, scale: 0.82, rotate: -3, duration: 0.22, overwrite: true });
      } else {
        preview.style.opacity = "0";
      }
    });
  });

  window.addEventListener("mousemove", (event) => {
    if (!preview) return;
    if (hasGsap && !prefersReduced) {
      gsap.to(preview, { x: event.clientX + 22, y: event.clientY - 34, duration: 0.18, ease: "power2.out", overwrite: "auto" });
    } else {
      preview.style.transform = `translate(${event.clientX + 22}px, ${event.clientY - 34}px)`;
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

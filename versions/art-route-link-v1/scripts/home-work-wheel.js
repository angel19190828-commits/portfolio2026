(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  const section = document.querySelector(".featured-work");
  const stage = document.querySelector(".stair-work-stage");
  if (!section || !stage) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  gsap.registerPlugin(ScrollTrigger);

  const projects = [
    {
      title: "Fableware Impact Engine",
      tags: ["AI", "UIUX", "Product Design", "Prototyping", "Gotdot"],
      date: "May 2026 - Ongoing",
      role: "Design Engineer"
    },
    {
      title: "AI Workflow",
      tags: ["AI implementation", "Product Design", "Design System", "Web Design", "Motion"],
      date: "Jan 2026 - Ongoing",
      role: "Frontend Designer"
    },
    {
      title: "Baby Steps",
      tags: ["AR", "Branding", "2D animations", "Prototyping"],
      date: "Jan 2026 - April 2026",
      role: "Visual Designer"
    },
    {
      title: "Trash Talk with Rumi",
      tags: ["Prototyping", "Web UIUX", "User Research"],
      date: "Nov 2025 - Dec 2025",
      role: "Design Engineer"
    },
    {
      title: "FlyLens",
      tags: ["AI", "UIUX", "User Research", "Case Studies", "Mock Up"],
      date: "June2026",
      role: "UIUX Designer"
    }
  ];

  const list = stage.querySelector(".stair-list");
  const items = gsap.utils.toArray(".stair-item");
  const panel = stage.querySelector(".project-panel");
  const indexEl = stage.querySelector(".project-panel__index");
  const titleEl = stage.querySelector(".project-panel h2");
  const tagsEl = stage.querySelector(".project-panel__tags");
  const metaValues = stage.querySelectorAll(".project-panel__meta strong");
  let activeIndex = -1;

  function updatePanel(index, animate) {
    if (index === activeIndex || !projects[index]) return;
    activeIndex = index;
    const project = projects[index];

    items.forEach((item, itemIndex) => {
      item.classList.toggle("is-active", itemIndex === index);
      item.setAttribute("aria-current", itemIndex === index ? "true" : "false");
    });

    const commit = () => {
      if (indexEl) indexEl.textContent = `${String(index + 1).padStart(2, "0")} / 05`;
      if (titleEl) titleEl.textContent = project.title;
      if (tagsEl) tagsEl.innerHTML = project.tags.map((tag) => `<span>${tag}</span>`).join("");
      if (metaValues.length >= 2) {
        metaValues[0].textContent = project.date;
        metaValues[1].textContent = project.role;
      }
    };

    if (!animate || prefersReduced || !panel) {
      commit();
      return;
    }

    gsap.to(panel, {
      autoAlpha: 0.28,
      y: 12,
      filter: "blur(5px)",
      duration: 0.12,
      overwrite: true,
      onComplete: () => {
        commit();
        gsap.fromTo(panel,
          { autoAlpha: 0.28, y: -10, filter: "blur(5px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.32, ease: "power3.out", overwrite: true }
        );
      }
    });
  }

  updatePanel(0, false);

  if (prefersReduced) return;

  const listTween = gsap.to(list, {
    y: () => window.matchMedia("(max-width: 809px)").matches ? -270 : -390,
    x: () => window.matchMedia("(max-width: 809px)").matches ? 34 : 58,
    ease: "none",
    paused: true
  });

  gsap.set(items, { transformOrigin: "left center" });

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: () => `+=${Math.max(1900, window.innerHeight * 3.15)}`,
    pin: true,
    scrub: 0.62,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const progress = gsap.utils.clamp(0, 0.999, self.progress);
      const index = Math.min(projects.length - 1, Math.floor(progress * projects.length));
      listTween.progress(progress);
      updatePanel(index, true);

      items.forEach((item, itemIndex) => {
        const distance = Math.abs(itemIndex - index);
        gsap.to(item, {
          autoAlpha: distance === 0 ? 1 : Math.max(0.34, 0.82 - distance * 0.14),
          x: distance === 0 ? 8 : 0,
          duration: 0.16,
          overwrite: true,
          ease: "power2.out"
        });
      });
    },
    onRefresh: (self) => {
      const progress = gsap.utils.clamp(0, 0.999, self.progress || 0);
      listTween.progress(progress);
      updatePanel(Math.min(projects.length - 1, Math.floor(progress * projects.length)), false);
    }
  });
})();

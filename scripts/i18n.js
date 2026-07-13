(function () {
  const KEY = "site-lang";

  const DICT = {
    en: {
      title: "Angel Yu Portfolio",
      navHome: "home",
      navWork: "work",
      navArt: "art",
      heroLabel: "I AM A(N)",
      heroRoles: "Product,Website,Interactive,Visual",
      heroFixed: "Designer",
      heroStatement: "I see design as a space where time, form, and interaction unfold. I create digital experiences that feel alive, layered.",
      skill1: "Art Direction",
      skill2: "Prototyping",
      skill3: "Frontend",
      skill4: "Creative Coding",
      skill5: "Motion",
      skill6: "UIUX",
      resume: "Resume",
      basedLabel: "BASED IN VANCOUVER",
      basedCity: "VANCOUVER",
      scrollHint: "SCROLL",
      viewAllWork: "View All Work",
      artworkTitle: "Artwork",
      viewAllArt: "View All Artwork ",
      backTop: "BACK TO TOP",
      tagUIUX: "UIUX",
      tagProductDesign: "Product Design",
      tagPrototyping: "Prototyping",
      tagAIImplementation: "AI implementation",
      tagDesignSystem: "Design System",
      tagWebDesign: "Web Design",
      tagMotion: "Motion",
      tagBranding: "Branding",
      tag2DAnimations: "2D animations",
      tagWebUIUX: "Web UIUX",
      tagUserResearch: "User Research",
      tagCaseStudies: "Case Studies",
      tagMockUp: "Mock Up",
      dateFableware: "May 2026 - Ongoing",
      dateAIWorkflow: "Jan 2026 - Ongoing",
      dateBabySteps: "Jan 2026 - April 2026",
      dateRumi: "Nov 2025 - Dec 2025",
      dateFlyLens: "June 2026",
      roleDesignEngineer: "Design Engineer",
      roleFrontendDesigner: "Frontend Designer",
      roleVisualDesigner: "Visual Designer",
      roleUIUXDesigner: "UI-UX Designer",
      titleWork: "Work - Angel Yu",
      titleArt: "Art - Angel Yu",
      workIntro: "Selected projects across interactive products, visual systems, AI workflows, prototypes, and motion-driven digital experiences.",
      catProject: "PROJECT",
      catInProgress: "IN PROGRESS",
      catPersonal: "PERSONAL",
      tagFrontend: "Frontend",
      tagCreativeCoding: "Creative Coding",
      tagPortfolioSystem: "Portfolio System",
      roleUIUXDesigner2: "UIUX Designer",
      artTitle: "\"Artwork\"",
      artWip: "WORK IN PROGRESS"
    },
    zh: {
      title: "Angel Yu 个人作品集",
      navHome: "首页",
      navWork: "作品",
      navArt: "艺术",
      heroLabel: "我是一名",
      heroRoles: "产品,网站,交互,视觉",
      heroFixed: "设计师",
      heroStatement: "我把设计看作时间、形态与交互徐徐展开的空间，致力于创造鲜活而富有层次的数字体验。",
      skill1: "艺术指导",
      skill2: "原型设计",
      skill3: "前端开发",
      skill4: "创意编程",
      skill5: "动效设计",
      skill6: "UI/UX",
      resume: "简历",
      basedLabel: "常驻温哥华",
      basedCity: "温哥华",
      scrollHint: "下滑",
      viewAllWork: "查看全部作品",
      artworkTitle: "艺术品",
      viewAllArt: "查看全部艺术作品 ",
      backTop: "返回顶部",
      tagUIUX: "UI/UX",
      tagProductDesign: "产品设计",
      tagPrototyping: "原型设计",
      tagAIImplementation: "AI 应用落地",
      tagDesignSystem: "设计系统",
      tagWebDesign: "网页设计",
      tagMotion: "动效",
      tagBranding: "品牌设计",
      tag2DAnimations: "2D 动画",
      tagWebUIUX: "网页 UI/UX",
      tagUserResearch: "用户研究",
      tagCaseStudies: "案例研究",
      tagMockUp: "界面样机",
      dateFableware: "2026年5月至今",
      dateAIWorkflow: "2026年1月至今",
      dateBabySteps: "2026年1月至4月",
      dateRumi: "2025年11月至12月",
      dateFlyLens: "2026年6月",
      roleDesignEngineer: "设计工程师",
      roleFrontendDesigner: "前端设计师",
      roleVisualDesigner: "视觉设计师",
      roleUIUXDesigner: "UI/UX 设计师",
      titleWork: "作品 - Angel Yu",
      titleArt: "艺术 - Angel Yu",
      workIntro: "精选项目，涵盖交互产品、视觉系统、AI 工作流、原型与动效驱动的数字体验。",
      catProject: "项目",
      catInProgress: "进行中",
      catPersonal: "个人",
      tagFrontend: "前端开发",
      tagCreativeCoding: "创意编程",
      tagPortfolioSystem: "作品集系统",
      roleUIUXDesigner2: "UI/UX 设计师",
      artTitle: "“作品”",
      artWip: "持续更新中"
    }
  };

  /* Case-study pages register their own strings via window.PAGE_DICT
     (loaded before this script). */
  if (window.PAGE_DICT) {
    Object.assign(DICT.en, window.PAGE_DICT.en || {});
    Object.assign(DICT.zh, window.PAGE_DICT.zh || {});
  }

  function getSavedLang() {
    try { return localStorage.getItem(KEY) === "zh" ? "zh" : "en"; }
    catch (e) { return "en"; }
  }

  let lang = getSavedLang();
  let heroInstance = null;

  /* Swap only the first meaningful text node so child elements
     (nav dots <i>, arrow <span>s) survive the translation. */
  function setText(el, value) {
    const textNodes = Array.prototype.filter.call(
      el.childNodes,
      (n) => n.nodeType === 3 && n.nodeValue.trim()
    );
    if (textNodes.length) textNodes[0].nodeValue = value;
    else el.textContent = value;
  }

  function applyStatic(l) {
    const d = DICT[l];
    document.documentElement.lang = l === "zh" ? "zh-Hans" : "en";
    const titleKey = document.body.dataset.i18nTitle;
    if (titleKey && d[titleKey]) document.title = d[titleKey];
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = d[el.dataset.i18n];
      if (value != null) setText(el, value);
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const value = d[el.dataset.i18nHtml];
      if (value != null) el.innerHTML = value;
    });
    document.querySelectorAll(".lang-toggle").forEach((btn) => {
      btn.setAttribute("aria-label", l === "zh" ? "Switch to English" : "切换到中文");
    });
  }

  function mountHero(l) {
    const root = document.querySelector("[data-hero-role-loop]");
    if (!root || !window.HeroRoleLoop) return;
    const d = DICT[l];
    if (heroInstance) heroInstance.destroy();
    const oldWord = root.querySelector(".hero-role-loop__word");
    if (oldWord && window.gsap) gsap.killTweensOf(oldWord);
    root.dataset.label = d.heroLabel;
    root.dataset.roles = d.heroRoles;
    root.dataset.fixed = d.heroFixed;
    root.dataset.heroRoleMounted = "false";
    root.innerHTML = "";
    heroInstance = window.HeroRoleLoop.mount(root);
  }

  function apply(l) {
    lang = l;
    applyStatic(l);
    mountHero(l);
    if (window.PAGE_APPLY) window.PAGE_APPLY(l);
  }

  /* This script sits at the end of <body>, so the DOM above is parsed but
     HeroRoleLoop.autoMount (DOMContentLoaded) has not fired yet — mounting
     here wins the race and autoMount becomes a no-op. */
  apply(lang);

  document.querySelectorAll(".lang-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = lang === "zh" ? "en" : "zh";
      try { localStorage.setItem(KEY, next); } catch (e) {}
      apply(next);
    });
  });
})();

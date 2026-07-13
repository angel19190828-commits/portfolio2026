/* FlyLens case-study translations.
   Loaded BEFORE ../../scripts/i18n.js. Body copy is swapped by matching each
   element's original English text (normalized) against MAP — the original
   innerHTML is snapshotted on first run so EN can always be restored.
   Project name "FlyLens" and tool/brand names (Figma, Photoshop, Illustrator)
   stay untranslated. Hex color values in the swatch section are numbers, not
   language-dependent, and are intentionally not selected. */
(function () {
  window.PAGE_DICT = {
    en: { titleFlyLens: "FlyLens Case Study" },
    zh: { titleFlyLens: "FlyLens 案例研究" }
  };

  const SELECTORS = [
    ".hero-badge", ".hero-sub", ".hero-scroll-hint",
    ".hero-pills span", ".strip-label", ".strip-val",
    ".eyebrow", "h2.up",
    ".body",
    ".persona-tag .pa", ".quote", ".attr .at", ".attr ul li",
    ".flow-label",
    ".id-logo-note", ".swatch .sn",
    ".jt-hc", ".jt-subject", ".jt-about", ".jt-sc-label",
    ".gcap",
    ".closing-intro", ".rl", ".rb"
  ].join(", ");

  const MAP = {
    /* ---- Hero ---- */
    "UX / UI Case Study · 2026": "UX/UI 案例研究 &nbsp;&middot;&nbsp; 2026",
    "An AI-driven flight search app that turns scattered flight prices into clear booking decisions, compare fares, and watch routes before prices change.":
      "一款 AI 驱动的机票搜索应用，把散落各处的机票价格整理成清晰的订票决策，帮你比价，并在价格变动前持续关注航线。",
    "UX/UI Designer": "UX/UI 设计师",
    "iOS Mobile": "iOS 移动端",
    "Scroll to explore": "向下滚动探索",

    /* ---- Overview strip ---- */
    "Role": "角色",
    "Platform": "平台",
    "Tools": "工具",
    "iOS Mobile App": "iOS 移动应用",

    /* ---- 01 Problem ---- */
    "01 The Problem": "01 问题",
    "Travellers were checking 8 tabs. For one flight.": "旅客要开<br>8 个分页<br>才能订一张机票。",
    "International students and price-sensitive travelers often spend days or even weeks checking the same routes across multiple booking platforms. The problem is not a lack of flight options, but the difficulty of understanding which fare is actually reasonable and when to book.":
      "国际学生和价格敏感型旅客常常要花上几天甚至几周，在多个订票平台上反复查看同一条航线。问题不在于航班选择太少，而在于很难判断哪个价格才是真正合理的、什么时候该下手订票。",
    "Because prices change quickly and each platform presents different information, users are left to compare fares manually, second-guess their decisions, and worry about either booking too early or waiting too long. This creates unnecessary stress and makes finding a suitable flight feel more complicated than it should be.":
      "由于价格变化很快，各平台展示的信息又不一致，用户只能手动比价、反复纠结，还要担心自己订早了或等太久。这种压力本不该存在，也让找到一张合适的机票变得比实际情况更复杂。",

    /* ---- 02 Design Process ---- */
    "02 Design Process": "02 设计流程",

    /* ---- 03 User Persona ---- */
    "03 User Research": "03 用户研究",
    "28 · Marketing Manager · Vancouver": "28 岁 · 市场经理 · 温哥华",
    "\"I find a flight, close the tab, check again the next day, and somehow I'm still not sure if I should book it.\"":
      "\"我找到一个航班，关掉页面，第二天又回来查一遍，结果还是不确定到底该不该订。\"",
    "Goals": "目标",
    "Frustrations": "痛点",
    "Behaviours": "行为习惯",
    "Find the lowest fare quickly": "快速找到最低价",
    "Know when the right time to book is": "知道什么时候是最佳订票时机",
    "Track prices without constant checking": "不用反复查看也能追踪价格",
    "Smooth, trustworthy booking flow": "顺畅、可信赖的订票流程",
    "Prices change between browser tabs": "不同分页里的价格都不一样",
    "No single reliable source of truth": "没有一个可靠的统一信息源",
    "Unclear if a price is actually fair": "不确定价格到底合不合理",
    "Missing deals because of bad timing": "因为时机不对错过了优惠",
    "Travels 4-6x per year": "每年出行 4-6 次",
    "Books 3-6 weeks in advance": "提前 3-6 周订票",
    "Heavy mobile user": "重度移动端用户",
    "Price-conscious, values speed": "在意价格，也看重效率",

    /* ---- 04 Architecture ---- */
    "04 Architecture": "04 信息架构",
    "Mapping the journey.": "梳理用户旅程。",
    "Before screens, the structure. User flow and information architecture grounded every design decision.":
      "在设计界面之前，先搭好结构。用户流程和信息架构是每一个设计决策的依据。",
    "User Flow": "用户流程",
    "Information Architecture": "信息架构",

    /* ---- 05 Visual Identity ---- */
    "05 Visual Identity": "05 视觉识别",
    "Built on clarity and trust.": "建立在清晰<br>与信任之上。",
    "A palette of soft blues and cobalt, a wordmark with a spark. FlyLens looks like a brand that knows what it's doing.":
      "柔和蓝调与钴蓝色的搭配，一个带着火花标记的品牌字标。FlyLens 看起来就像一个懂自己在做什么的品牌。",
    "The FlyLens wordmark pairs a spark mark with a clean sans-serif, readable at a glance, trustworthy at scale. Cobalt blue as primary; white for all reversed contexts.":
      "FlyLens 的字标把火花图形和简洁的无衬线字体搭配在一起，一眼可读，放大也依然可信。主色为钴蓝，反白场景则统一使用白色。",
    "Primary": "主色",
    "Lavender": "薰衣草紫",
    "Surface": "浅底色",
    "Ink": "墨黑",

    /* ---- 06 User Journey ---- */
    "06 User Journey": "06 用户旅程",
    "Six moments that define the experience.": "六个定义体验的<br>关键时刻。",
    "No": "编号",
    "Subject": "主题",
    "About": "说明",
    "Flight Tracking App": "机票追踪应用",
    "Onboarding": "引导流程",
    "Registration": "注册",
    "Booking Journey": "订票流程",
    "Watchlist": "关注列表",
    "Profile": "个人主页",
    "Success Booking": "订票成功",
    "Onboarding introduces FlyLens through a simple, guided flow. It helps first-time users understand how the app compares fares, explains price signals, and supports smarter booking decisions.":
      "引导流程用简单的分步方式介绍 FlyLens，帮助初次使用的用户理解应用如何比价、解读价格信号，并做出更明智的订票决策。",
    "After the introduction, users can quickly enter the app through Google, email, or guest access. The registration step is kept minimal so users can start searching flights without unnecessary friction.":
      "介绍流程之后，用户可以通过 Google、邮箱或访客身份快速进入应用。注册步骤被尽量简化，让用户可以毫无阻力地直接开始搜索航班。",
    "Our booking journey is the main experience in FlyLens. Users enter their route, travel dates, traveler details, and price prediction preference, then FlyLens compares available fare options and presents the results in a clearer format. The results screen does not only show the lowest price; it also shows the provider source, price trend, and AI Prediction guidance.":
      "订票流程是 FlyLens 的核心体验。用户输入航线、出行日期、乘客信息和价格预测偏好后，FlyLens 会比较可选票价，并以更清晰的方式呈现结果。结果页面不只显示最低价，还会显示票价来源、价格趋势和 AI 预测建议。",
    "The Watchlist works as a price monitoring hub for users who are not ready to book immediately. It allows users to save routes, compare the current fare against their target price, review recent price changes, and receive alerts when a route becomes worth booking. This turns the app from a one-time search tool into an ongoing travel assistant.":
      "关注列表是为还没准备好立即订票的用户设计的价格监控中心。用户可以收藏航线、把当前票价和目标价格对比、查看近期价格变化，并在航线值得下手时收到提醒。这让应用从一次性的搜索工具，变成了持续陪伴的旅行助手。",
    "Profile brings together saved routes, fare updates, travel preferences, notifications, and account settings so users can manage their travel decisions from one place. This reduces repeated setup work and makes future searches more relevant. Instead of starting from zero every time, users can rely on FlyLens to remember their travel habits and support faster, more confident booking decisions.":
      "个人主页把收藏航线、票价更新、出行偏好、通知和账户设置整合在一起，让用户可以在一个地方管理所有出行决策。这减少了重复设置的麻烦，也让之后的搜索更贴合需求。用户不用每次都从零开始，FlyLens 会记住他们的出行习惯，帮助他们更快、更有把握地做出订票决定。",
    "The Success Booking screen confirms that the user's flight information is ready after choosing a deal. The ticket-style layout highlights key trip details such as destination, flight number, gate, seat, passenger, and digital pass.":
      "订票成功页面在用户选定票价后确认行程信息已准备就绪。票据式的版面突出显示目的地、航班号、登机口、座位、乘客和电子登机牌等关键行程信息。",
    "Stop Checking 8 Tabs": "别再开 8 个分页了",
    "Watch the Right Price": "盯紧对的价格",
    "Know If the Price Is Fair": "判断价格是否合理",
    "Sign In / Register": "登录 / 注册",
    "Route & Date Input": "航线与日期输入",
    "Price Results": "价格结果",
    "AI Prediction": "AI 预测",
    "Price Watchlist": "价格关注列表",
    "Profile & Preferences": "个人主页与偏好设置",
    "Digital Boarding Pass": "电子登机牌",
    "Add to Calendar": "添加到日历",

    /* ---- 07 Full Screen ---- */
    "07 Full Screen": "07 完整界面",
    "The full system.": "完整的设计系统。",
    "Drag to explore every screen.": "拖动查看每一个界面。",
    "Login": "登录",
    "Onboarding 1": "引导页 1",
    "Onboarding 2": "引导页 2",
    "Onboarding 3": "引导页 3",
    "Route Input": "航线输入",
    "Calendar": "日历",
    "Digital Pass": "电子登机牌",
    "Calendar Pass": "日历卡片",

    /* ---- 08 Reflection ---- */
    "08 Reflection": "08 反思",
    "What I learned.": "我学到的<br><em>东西。</em>",
    "FlyLens began with my own experience as an international student, where booking flights home always felt more stressful than it should be.":
      "FlyLens 的起点是我自己作为国际学生的经历，每次订机票回家，都比实际情况更让人紧张。",
    "Where it started": "从哪里开始",
    "Beyond search": "不止是搜索",
    "AI with purpose": "有目的的 AI",
    "Who it's for": "它是为谁做的",
    "I often need to travel between school and home, and booking flights has always been a stressful process. Prices change quickly, information is scattered across different platforms, and even when I find a fare that looks reasonable, it is still difficult to know whether I should book it immediately or wait.":
      "我经常需要往返学校和家，订机票一直是个让人紧张的过程。价格变化很快，信息又分散在不同平台上，就算找到一个看起来合理的价格，也很难判断该马上订还是再等等。",
    "I wanted FlyLens to be more than another flight search tool — an AI-assisted travel product that helps users compare fares, understand price changes, and make more confident booking decisions. Instead of forcing users to repeatedly check different websites, FlyLens brings the information together and provides clearer guidance on whether a fare is worth booking, watching, or reconsidering.":
      "我希望 FlyLens 不只是又一个机票搜索工具，而是一款 AI 辅助的旅行产品，帮用户比价、理解价格变化，并更有把握地做出订票决定。FlyLens 不会让用户反复跑不同网站，而是把信息整合在一起，更清楚地告诉你这个价格是该订、该观望，还是该重新考虑。",
    "Throughout the project, I focused on how AI could support users in a practical way rather than simply being added as a trendy feature. For FlyLens, the value of AI is in reducing search friction, organizing complex fare information, and helping users feel less anxious about missing the right ticket.":
      "在整个项目中，我关注的是 AI 如何以实际有用的方式帮助用户，而不是把它当成一个赶时髦的功能加上去。对 FlyLens 来说，AI 的价值在于减少搜索阻力、整理复杂的票价信息，并让用户不再那么担心错过合适的机票。",
    "I hope FlyLens can support people with similar experiences, especially international students and frequent travelers, by making it easier to find suitable flights and feel more confident about when to book.":
      "我希望 FlyLens 能帮到有类似经历的人，尤其是国际学生和常旅客，让他们更容易找到合适的航班，也更有把握地知道什么时候该订票。"
  };

  const probe = document.createElement("div");
  function norm(s) { return s.replace(/\s+/g, " ").trim(); }
  function keyOf(el) {
    probe.innerHTML = el.dataset.i18nEn;
    probe.querySelectorAll("br").forEach((br) => br.replaceWith(" "));
    return norm(probe.textContent);
  }

  let scoped = null;
  function ensureSnapshot() {
    if (scoped) return;
    scoped = Array.prototype.slice.call(document.querySelectorAll(SELECTORS));
    scoped.forEach((el) => { el.dataset.i18nEn = el.innerHTML; });
  }

  window.PAGE_APPLY = function (lang) {
    ensureSnapshot();
    scoped.forEach((el) => {
      if (lang === "zh") {
        const zh = MAP[keyOf(el)];
        if (zh != null) el.innerHTML = zh;
      } else if (el.innerHTML !== el.dataset.i18nEn) {
        el.innerHTML = el.dataset.i18nEn;
      }
    });
  };
})();

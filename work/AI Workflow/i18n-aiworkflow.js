/* AI Workflow case-study translations.
   Loaded BEFORE ../../scripts/i18n.js. Body copy is swapped by matching each
   element's original English text (normalized) against MAP — the original
   innerHTML is snapshotted on first run so EN can always be restored.
   Project name "AI Workflow" itself stays untranslated, as do proper nouns
   (Claude, Codex, Three.js, GSAP, Figma). */
(function () {
  window.PAGE_DICT = {
    en: { titleAIWorkflow: "AI Workflow - Angel Yu" },
    zh: { titleAIWorkflow: "AI 工作流 - Angel Yu" }
  };

  const SELECTORS = [
    ".aw-label", ".hero-headline .word-inner", ".hero-sub", ".hero-scroll",
    ".aw-tag", ".aw-meta-label", ".aw-meta-value",
    ".overview-headline .iw-inner", ".overview-body p",
    ".wf-flow-headline", ".wf-title", ".wf-desc",
    ".limits-col-header", ".limits-issue",
    ".section-004-title",
    ".back-label", ".back-case",
    ".process-text p", ".process-block-label",
    ".fails-section-title",
    ".reflection-headline", ".reflection-intro", ".reflection-row-label", ".reflection-row-body"
  ].join(", ");

  const MAP = {
    /* ---- Hero ---- */
    "DIRECTING": "设计",
    "TO AI": "",
    "THROUGH": "通向",
    "DESIGN": "AI",
    "An AI-assisted workflow for building interactive design systems": "一套借助 AI 打造交互设计系统的工作方法",
    "SCROLL TO DISCOVER": "向下滚动探索",

    /* ---- 00 Overview ---- */
    "00 — Overview": "00 — 概览",
    "AI Implementation": "AI 应用",
    "Web Design": "网页设计",
    "Motion": "动效",
    "Frontend": "前端开发",
    "Type": "类型",
    "Timeline": "周期",
    "Role": "角色",
    "Tools": "工具",
    "Self-initiated": "自主发起",
    "Jan 2026 – Ongoing": "2026年1月至今",
    "Frontend Designer": "前端设计师",
    "Claude, Codex Three.js, GSAP": "Claude、Codex<br>Three.js、GSAP",

    /* ---- 01 Problem ---- */
    "01 — Problem": "01 — 问题",
    "Define": "定义",
    "Problem": "问题",
    "I built this because I kept running into the same problem. The tools exist, but using them well is harder than it looks. Most people interact with AI through a chat box. I wanted to find out what happens when you push it further: use it as a production partner, not a search engine.":
      "我做这个项目，是因为一次又一次撞上同一个问题：工具都在，但真正用好它们比看起来难得多。大多数人和 AI 的互动，只是打开一个聊天框。我想知道，如果把它往前推一步，当成生产伙伴而不是搜索引擎来用，会发生什么。",
    "But the real question I was trying to answer was: how do you give an AI taste? How do you build a shared aesthetic, label it, describe it precisely enough, so that what comes out actually matches what you had in mind? This site is the experiment. Every piece of it was built without writing a line of code by hand. What I was figuring out the whole time was the language. The exact way to describe a visual feeling so the AI can replicate it perfectly. That is what this project documents.":
      "但我真正想回答的问题是：怎么给 AI「审美」？怎么建立一套共享的美学语言、把它标注清楚、描述得足够精确，让产出的东西真的符合脑子里的样子？这个网站就是实验本身，每一处都没有手写一行代码。我自始至终在摸索的，是「语言」：那种能精确描述视觉感受、让 AI 完美复现的表达方式。这就是这个项目记录的内容。",

    /* ---- 02 My Workflow ---- */
    "02 — My Workflow": "02 — 我的工作流程",
    "How I Work": "我的工作方式",
    "Ideation": "构思",
    "Experiment": "实验",
    "Test": "测试",
    "Refine": "打磨",
    "REFERENCES Studied motion-focused and 3D web experiences before writing any code. Identified specific techniques and visual languages worth adapting for this project. DIRECTION Assembled two moodboards to lock in the visual direction early. One focused on material and form, the other on typography and graphic system. Both fed into the final visual language.":
      '<span class="wf-desc-label">参考调研</span>在写任何代码之前，先研究了一批以动效和 3D 见长的网页作品，找出值得借鉴的具体手法和视觉语言。<br><br><span class="wf-desc-label">方向确定</span>整理了两块情绪板尽早锁定视觉方向：一块聚焦材质与形态，一块聚焦字体与图形系统，两者共同确立了最终的视觉语言。',
    "STRUCTURE Started with a rough page structure to test the scroll flow. Sections were blocked in quickly to find the right rhythm before any visual polish was applied. INTERACTION Multiple approaches to the 3D scene and card interactions were tested in parallel. Speed mattered more than quality at this stage.":
      '<span class="wf-desc-label">搭建结构</span>先用一版粗糙的页面结构测试滚动节奏，各个板块被快速拼出来，先找感觉，再做视觉打磨。<br><br><span class="wf-desc-label">交互探索</span>3D 场景与卡片交互的多种方案被并行测试，这个阶段速度比质量更重要。',
    "REBUILT The workflow layout was rebuilt after the first version felt wrong on screen. The pinning behavior broke completely and required a full rewrite. The hero scroll animation produced a visual glitch and the entire approach was replaced. REVERTED Two versions of the camera movement were tested. Both felt wrong once seen in the browser. The original position was locked. A fix for the hero headline created a worse problem than the original bug. Both fixes were reverted.":
      '<span class="wf-desc-label">推倒重来</span>第一版工作流布局在屏幕上感觉不对，被整个推翻重做。吸顶行为彻底失效，只能重写；Hero 的滚动动画出现视觉错位，整套方案被替换。<br><br><span class="wf-desc-label">方案回退</span>相机运动测试了两个版本，放到浏览器里看都不对劲，最终锁定了原始机位。一次针对 Hero 标题的修复反而制造出比原 bug 更严重的问题，两处修复都被撤销。',
    "SPACING Typography scale and section spacing were adjusted repeatedly. Small changes in padding and proportion made large differences to the overall feel of the page. MOTION Scroll speeds, easing curves, and transition timings were dialed in last. Each value was adjusted until the movement felt intentional at full scroll speed.":
      '<span class="wf-desc-label">间距打磨</span>字号比例和板块间距被反复调整，内边距和比例上的微小改动，往往会让整个页面的感觉产生很大差异。<br><br><span class="wf-desc-label">动效微调</span>滚动速度、缓动曲线、过渡时长是最后确定的，每个数值都被调到在全速滚动下也感觉「刻意为之」为止。',

    /* ---- 03 AI Limitations ---- */
    "03 — AI Limitations": "03 — AI 的局限",
    "When It": "限制",
    "Breaks": "",
    "HUMAN": "人类",
    "Cannot See": "缺乏视觉感知",
    "No Aesthetic Sense": "缺乏审美判断力",
    "Memory Resets": "上下文记忆有限",
    "Does Not Self-Audit": "缺乏自我校验机制",
    "Needs To See It First": "需要先看到结果才能判断",
    "Describes With Feeling": "依赖直觉与感受表达",
    "Changes Direction Mid-Build": "制作过程中会调整方向",
    "Does Not Always State The Boundary": "未必能明确表达边界条件",

    /* ---- 04 What I Found ---- */
    "04 — What I Found": "04 — 我的发现",
    "What I Found": "我的<br>发现",
    "In Practice": "实战案例",
    "I described the hero background as \"warm, soft, like paper.\" Claude returned a generic cream — nothing close to the Figma file. Replacing the description with the exact hex #f4f2ef produced a match on the first attempt.":
      "我把 Hero 背景描述成「温暖、柔和、像纸一样」。Claude 给出的是一种泛泛的奶油色，和 Figma 文件完全对不上。把描述换成精确的色值 #f4f2ef 后，第一次就匹配上了。",
    "I asked Claude to adjust the card layout. It also shifted camera.position from (0, 5.0, 8.66) without being asked — the cinematic angle was lost. Adding \"do not change camera.position\" to every subsequent prompt stopped the drift.":
      "我让 Claude 调整卡片布局，结果它顺手把 camera.position 从 (0, 5.0, 8.66) 也改了，电影感的机位就这么丢了。在后续每条指令里都加上「不要改动 camera.position」之后，这种漂移才停下来。",
    "\"Animate the 3D objects rotating slowly\" produced chaotic spin on each axis. Rewriting as \"Three knots orbit at 120° apart, one full revolution every 8 seconds\" generated the hero animation directly on the first attempt.":
      "「让 3D 物体缓慢旋转」这句指令，产出的是三个轴上乱转一气的效果。改写成「三个结每隔 120° 环绕运行，每 8 秒转完一整圈」之后，第一次就直接生成了想要的 Hero 动画。",

    /* ---- 06 Design ---- */
    "06 — Design": "06 — 设计过程",
    "At first, I considered exploring the project through industrial design and physical product development. As the idea evolved, however, I realized that I was more interested in how a concept could be communicated through 3D, motion, and interactive web experiences.":
      "一开始，我考虑过用工业设计和实体产品开发的方式来做这个项目。但随着想法演进，我发现自己更感兴趣的是：一个概念如何通过 3D、动效和交互式网页体验被传达出来。",
    "I therefore developed the project as an experimental, AI-assisted website. This direction gave me an opportunity to explore how 3D motion, scroll interaction, and cinematic language could be translated into a digital experience.":
      "于是我把这个项目做成了一个实验性的、AI 辅助的网站。这个方向让我有机会去探索：3D 动效、滚动交互和电影语言，要如何被转译成一段数字体验。",
    "Before building the website, I studied a range of 3D and motion-focused websites and created several moodboards to analyze their camera movement, materials, typography, composition, and pacing. This research helped me establish the project's visual direction and explore how AI could support the process from concept development and prototyping to implementation.":
      "在动手搭建网站之前，我研究了一批以 3D 和动效见长的网站，做了几块情绪板，分析它们的运镜方式、材质、字体、构图和节奏。这些研究帮我确立了项目的视觉方向，也让我探索了 AI 如何在从概念构思、原型制作到最终实现的整个流程中提供支持。",
    "VISUAL DIRECTION — MATERIAL & FORM": "视觉方向：材质与形态",
    "VISUAL DIRECTION — TYPOGRAPHY & GRAPHIC SYSTEM": "视觉方向：字体与图形系统",
    "ORIGINAL AI DESIGN": "AI 原始设计稿",
    "I DESIGN AND REPLACED": "由我重新设计替换",

    /* ---- 07 Tools ---- */
    "07 — Tools": "07 — 工具",
    "Stack": "技术栈",

    /* ---- 08 Reflection ---- */
    "08 — Reflection": "08 — 反思",
    "What I Learned": "我的<br>收获",
    "Designing with AI changed what I thought the designer's job was.": "和 AI 一起设计，改变了我对「设计师该做什么」的理解。",
    "What I originally thought": "最初的想法",
    "What changed": "发生的变化",
    "What I learned": "我的收获",
    "Going forward": "接下来",
    "I assumed that if I wrote a detailed enough prompt, AI would be able to generate the website I had in mind.":
      "<p>我原以为，只要提示词写得足够详细，AI 就能生成我脑子里的那个网站。</p>",
    "During production, Before the results became accurate, I had to define the design foundation myself: typography weight, scale, and hierarchy page spacing, card proportions, and information structure 3D materials, lighting, and environment reflections the camera movement from far to near and back into position scroll, hover, flip, and loading interactions which elements were allowed to change and which had to remain fixed the references, screenshots, colors, and assets used as visual evidence Only after these decisions were clear could Claude translate them into working HTML, CSS, JavaScript, Three.js, and GSAP.":
      '<p>在实际制作过程中，</p><p>在结果变准确之前，我必须自己先把设计的地基定下来：</p><ul><li>字重、字号与层级关系</li><li>页面间距、卡片比例与信息结构</li><li>3D 材质、灯光与环境反射</li><li>相机从远到近、再归位的运动路径</li><li>滚动、悬停、翻转与加载交互</li><li>哪些元素可以变、哪些必须保持不变</li><li>用作视觉依据的参考图、截图、色值与素材</li></ul><p>只有这些决定都清晰了，Claude 才能把它们转译成可运行的 HTML、CSS、JavaScript、Three.js 和 GSAP 代码。</p>',
    "The main skill I developed was not simply prompting AI to write code. I had to specify: where the camera should begin how close it should move how long the movement should take how subtle the rotation should be which easing curve to use where the camera should finally settle I also learned that generating more versions does not always improve the result. Knowing which parts are already working, what should remain untouched, and when to stop is also part of design judgment.":
      '<p>我练出来的主要能力，不只是让 AI 写代码，而是要把这些都说清楚：</p><ul><li>相机从哪里开始</li><li>要推近到什么程度</li><li>这段运动该持续多久</li><li>旋转要多细微</li><li>用哪一种缓动曲线</li><li>相机最终停在哪里</li></ul><p>我也发现，多生成几个版本不代表结果会更好。知道哪些部分已经可以了、哪些不该再动、什么时候该停下来，这同样是设计判断力的一部分。</p>',
    "For future AI-assisted projects, I would define the full experience before asking AI to build it: collect references and create a moodboard establish the typography, color, material, and layout system map the page structure and interaction flow prepare the 3D models, images, and other assets":
      '<p>对未来的 AI 辅助项目，我会先把整个体验定义清楚，再让 AI 动手：</p><ol><li>收集参考、做一版情绪板</li><li>确立字体、色彩、材质与版式系统</li><li>梳理页面结构与交互流程</li><li>准备好 3D 模型、图片等素材</li></ol>'
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

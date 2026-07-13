/* Trash Talk with Rumi case-study translations.
   Loaded BEFORE ../../scripts/i18n.js. Body copy is swapped by matching each
   element's original English text (normalized) against MAP — the original
   innerHTML is snapshotted on first run so EN can always be restored.
   Project name "Trash Talk with Rumi", the mascot name "Rumi", and the team
   name "Slay" stay untranslated, as do vendor/tool names (Figma, Gemini API,
   Three.js). The hero canvas decrypt/physics text (S1) is out of scope for
   this pass — it's driven by a Matter.js physics simulation, not static DOM
   text, and re-triggering it per language is a separate, riskier project. */
(function () {
  window.PAGE_DICT = {
    en: { titleRumi: "Trash Talk with Rumi — Case Study" },
    zh: { titleRumi: "Trash Talk with Rumi — 案例研究" }
  };

  const SELECTORS = [
    ".eyebrow", "#s3-heading h2", "#s6 h2", ".s-heading",
    ".context-desc", ".overview-role-label", ".overview-role-list span",
    ".meta-label", ".meta-value",
    ".s3-body",
    ".method-title", ".method-body",
    ".persona-role", ".persona-quote",
    ".trait-label", ".trait-val",
    ".insert-section-copy",
    ".idea-title", ".idea-body",
    ".chart-title", ".chart-legend-row span", ".bar-row span",
    ".testing-title", ".testing-body", ".testing-list",
    "#s6 p.s6-el", ".rumi-pill", ".rumi-stat-big", ".rumi-stat-label",
    "#s6c p.s6c-el", ".experience-caption",
    ".ia-label", ".ia-desc",
    "#s8-left-heading", ".s8-step-title", ".s8-panel-title", ".s8-panel-body",
    "#s14 p.s14-el", ".rumi-loc",
    "#s16 p.s16-el", ".reflect-label", ".reflect-body", ".rumi-team-meta"
  ].join(", ");

  const MAP = {
    /* ---- S2 — 00 Overview ---- */
    "00 — Overview": "00 — 概览",
    "A community-facing waste sorting activity that combines an AI character, real-time item recognition, physical sorting, and public engagement. Designed as a pop-up learning installation, it helps people act with confidence at the moment of disposal.":
      "一场面向社区的垃圾分类活动，结合了 AI 角色、实时物品识别、实体分拣与公众参与。作为一套快闪式学习装置，它帮助人们在投放垃圾的那一刻更有把握地做出行动。",
    "My Achieve": "我的成就",
    "Product Design": "产品设计",
    "AI Interaction": "AI 交互",
    "Motion Design": "动效设计",
    "UX Research": "用户研究",
    "3D Assets": "3D 资产",
    "Client": "客户",
    "Team": "团队",
    "Timeline": "周期",
    "My Role": "我的角色",
    "Tools": "工具",
    "Deliverables": "交付物",
    "Slay (6 members)": "Slay（6 人小组）",
    "10 weeks Winter 2026": "10 周<br/>2026年冬季",
    "Product Designer UX Researcher": "产品设计师<br/>用户体验研究员",
    "Figma, Three.js Gemini API": "Figma、Three.js<br/>Gemini API",
    "Kiosk UI, AI Demo Motion System": "终端界面、AI 演示<br/>动效系统",

    /* ---- S3 — 01 Problem ---- */
    "01 — Problem": "01 — 问题",
    "People want to sort correctly. The system fails them.": "人们想要<br/>正确分类。<br/><em>系统却辜负了他们。</em>",
    "Most people genuinely try — but recycling rules are inconsistent, unclear, and change by city. The result: contaminated bins, recyclables in landfills, and no clear path forward.":
      "大多数人是真心在努力，但回收规则不统一、不清晰，还因城市而异。结果就是：被污染的回收桶、本该回收却进了垃圾填埋场的物品，以及看不清的出路。",

    /* ---- S4 — 02 Research ---- */
    "02 — Research": "02 — 研究",
    "How we found it": "我们是怎么发现的",
    "Field Study": "实地调研",
    "Observed UBC and CDM waste areas. Unlabelled bins, unclear signage, and abandoned items showed that users had intent, but lacked guidance.":
      "实地观察了 UBC 和 CDM 的垃圾投放区域。没有标签的垃圾桶、含糊的标识和被遗弃在一旁的物品，说明用户是有意愿的，只是缺少引导。",
    "Interviews + Survey": "访谈与问卷",
    "Asked young adults about recycling habits and confidence. Most cared about sustainability, but felt unsure about what belonged in each bin.":
      "询问了年轻人的回收习惯与信心程度。大多数人在意可持续性，但并不确定每样东西该扔进哪个桶。",
    "Secondary Research": "二手研究",
    "Reviewed local policies and global sorting examples. Strong systems reduced friction, used clear guidance, and gave immediate feedback.":
      "梳理了本地政策和全球范围内的分类案例。表现好的系统都在降低操作阻力、给出清晰引导，并提供即时反馈。",

    /* ---- S5 — 03 Users ---- */
    "03 — Users": "03 — 用户",
    "Who are our users?": "我们的用户<br/><em>是谁？</em>",
    "Urban Commuter, 17": "城市通勤者，17 岁",
    "\"I care about the planet, but school and social life take up so much time. I just guess and hope.\"":
      "\"我在乎这个星球，但学业和社交已经占满了时间。我只能靠猜，然后祈祷猜对了。\"",
    "University Student, 23": "大学生，23 岁",
    "\"Sorting feels like homework. I don't want to think about it — just tell me where to put it.\"":
      "\"分类感觉就像作业。我不想动脑子，直接告诉我扔哪就行。\"",
    "Mall Visitor, 29": "商场访客，29 岁",
    "\"If I could see the real impact of sorting correctly, I'd definitely do it. Right now it feels pointless.\"":
      "\"如果能看到正确分类带来的真实影响，我肯定会去做。现在这么做感觉毫无意义。\"",
    "Motivation": "动机",
    "Barrier": "障碍",
    "Need": "诉求",
    "Eco-conscious, wants to do right": "有环保意识，想做对的事",
    "No time, no knowledge of local rules": "没时间，也不了解本地规则",
    "Instant, frictionless guidance": "即时、无摩擦的引导",
    "Low effort, convenience-first": "图省事，优先方便",
    "Ambiguous labels, complex materials": "标签模糊，材质复杂",
    "Clear, immediate feedback": "清晰、即时的反馈",
    "Data-driven, wants visible results": "看数据说话，想看到实际成果",
    "System too vague, no feedback loop": "系统太模糊，没有反馈闭环",
    "Real-time data + positive reinforcement": "实时数据 + 正向激励",

    /* ---- S6A — 04 Ideation ---- */
    "04 — Ideation": "04 — 构思",
    "Three Ideas": "三个想法",
    "Before committing to the kiosk interaction, we explored different ways to make recycling guidance feel immediate, visible, and low effort.":
      "在确定终端交互方式之前，我们探索了多种让回收引导变得即时、直观、省力的方式。",
    "Idea 01: Interactive Game-Based Sorting Experience": "想法 01：互动游戏式分类体验",
    "A gamified concept that turns waste sorting into a quick challenge. Users learn recycling rules through playful decision-making, scoring, and feedback. This direction explored whether game mechanics could make sustainability education more engaging for young adults.":
      "把垃圾分类变成一场快速挑战的游戏化方案。用户通过有趣的决策、计分和反馈来学习回收规则。这个方向探索的是：游戏机制能否让可持续教育对年轻人更有吸引力。",
    "Idea 02: Mobile Sorting Guide / Digital Tool": "想法 02：移动端分类指南／数字工具",
    "A mobile-first concept that helps users look up sorting rules and receive guidance through a digital interface. This direction focused on accessibility and convenience, but risked becoming another passive information tool that users would only open when highly motivated.":
      "一个以移动端为先的方案，帮助用户通过数字界面查询分类规则、获得引导。这个方向聚焦于可及性与便利性，但有风险：它可能只是又一个被动的信息工具，只有在用户动力很强时才会打开。",
    "Idea 03: AI-Assisted Interactive Sorting Installation": "想法 03：AI 辅助的互动分类装置",
    "A public-facing installation concept where users interact with a character guide, scan or present a waste item, receive instant sorting feedback, and are guided toward the correct physical bin. This direction was selected because it connected digital feedback with real-world sorting behaviour.":
      "一个面向公众的装置方案：用户与一个角色向导互动，扫描或出示垃圾物品，获得即时的分类反馈，并被引导至正确的实体垃圾桶。这个方向最终被选中，因为它把数字反馈和真实世界的分类行为连接了起来。",

    /* ---- S6B — 05 User Testing ---- */
    "05 — User Testing": "05 — 用户测试",
    "Feedback": "反馈",
    "Participant demographics / n = 32": "参与者构成／n = 32",
    "Preferred learning tools": "偏好的学习方式",
    "Under 18": "18岁以下",
    "Posters / visual guides": "海报／视觉指南",
    "Apps": "应用程序",
    "Videos": "视频",
    "Internal testing": "内部测试",
    "Internal critique helped refine the character tone and interaction logic. The Wizard of Oz setup showed that Rumi could attract attention, but the original spicy tone needed to become more supportive and community-safe.":
      "内部评审帮助我们打磨角色语气和交互逻辑。「绿野仙踪」式测试（人工幕后操控）显示 Rumi 能吸引注意力，但原本比较「辛辣」的语气需要变得更友善、更适合公共场合。",
    "Keep the character engaging, but make the tone public-friendly. Use feedback to guide the action, not to judge the user.":
      "<div>让角色保持吸引力，但语气要适合公共场合。</div><div>用反馈去引导行动，而不是评判用户。</div>",

    /* ---- S6D — 05.1 External Testing ---- */
    "05.1 — External Testing": "05.1 — 外部测试",
    "Testing the flow in public.": "在公共场所<br/>测试整个流程。",
    "The external test compared two interaction modes: character-guided sorting and interactive video. The videos helped the team see where the experience created momentum and where it interrupted the learning sequence.":
      "外部测试对比了两种交互方式：角色引导式分类和互动视频。这些录像帮助团队看清了体验在哪里能带动情绪、又在哪里打断了学习节奏。",
    "Character-guided sorting": "角色引导式分类",
    "Participants learned through Rumi's guidance, then applied the instruction through a physical sorting task. This flow kept the action, feedback, and retention task connected.":
      "参与者先通过 Rumi 的引导学习，再通过实际分类任务应用这些指令。这套流程把行动、反馈和记忆巩固三者连在了一起。",
    "Interactive video station": "互动视频站点",
    "The video attracted attention, but when placed inside the active learning flow it created a break between guidance and sorting. It was repositioned as an idle attraction and group engagement tool.":
      "视频很能吸引注意力，但放在主动学习流程中时，会在「引导」和「分类」之间造成断层。后来它被重新定位为闲时的吸引物和群体互动工具。",

    /* ---- S6 — 06 The Product ---- */
    "06 — The Product": "06 — 产品本身",
    "A pop-up sorting activity with Rumi.": "一场与 Rumi 一起的<br/><em style=\"font-style:normal;color:var(--mid)\">快闪分类活动。</em>",
    "Trash Talk is a community-facing interactive waste sorting installation. It combines an AI character, real-time waste classification, physical sorting, and an interactive video attraction screen to turn confusing disposal rules into a public learning activity.":
      "Trash Talk 是一套面向社区的互动式垃圾分类装置。它结合了 AI 角色、实时垃圾分类、实体分拣，以及互动视频吸引屏，把令人困惑的投放规则变成一场公共学习活动。",
    "AI character guidance": "AI 角色引导",
    "Real-time classification": "实时分类识别",
    "Physical sorting station": "实体分拣站",
    "Community pop-up": "社区快闪活动",
    "AI": "AI",
    "Sort": "分类",
    "Video": "视频",
    "Character support": "角色支持",
    "Physical action": "实际行动",
    "Attraction mode": "吸引模式",

    /* ---- S6C — 06.1 Experience Flow ---- */
    "06.1 — Experience Flow": "06.1 — 体验流程",
    "From attraction to action.": "从吸引<br/><em style=\"font-style:normal;color:var(--mid)\">到行动。</em>",
    "The final concept works as a portable learning setup: it draws people in, classifies real objects, gives character feedback, and asks users to physically complete the sorting action.":
      "最终方案是一套可移动的学习装置：它吸引人们靠近，识别真实物品，给出角色反馈，并邀请用户亲自完成分类这个动作。",
    "Prototype flow map": "原型流程图",
    "Community pop-up setup": "社区快闪现场布置",
    "Rumi character feedback": "Rumi 角色反馈",

    /* ---- S7 — 07 User Flow ---- */
    "07 — User Flow": "07 — 用户流程",
    "How the activity unfolds.": "活动是如何<br/><em>展开的。</em>",
    "Attract": "吸引",
    "Join": "加入",
    "Classify": "识别",
    "Reflect": "回顾",
    "Looping video draws attention.": "循环播放的视频<br/>吸引注意力。",
    "User steps into the pop-up station.": "用户走进<br/>快闪站点。",
    "Computer vision reads the waste item.": "计算机视觉识别<br/>垃圾物品。",
    "Rumi explains the right bin.": "Rumi 说明<br/>该扔哪个桶。",
    "User completes the physical action.": "用户完成<br/>实际分类动作。",
    "The result becomes a shared learning moment.": "结果成为<br/>一次共同的学习时刻。",

    /* ---- S8 — How It Works ---- */
    "Five steps. Zero confusion.": "五个步骤",
    "Item enters the frame.": "物品进入画面。",
    "Scan beam activates.": "扫描光束启动。",
    "AI identifies the material.": "AI 识别材质。",
    "Arrow points to the bin.": "箭头指向对应垃圾桶。",
    "Rumi responds.": "Rumi 给出反馈。",
    "You hold your item up to the kiosk camera. Rumi's scan frame activates automatically — no button needed.":
      "把物品举到终端摄像头前，Rumi 的扫描框会自动启动，不需要按任何按钮。",
    "A lime-green beam sweeps the object. Real-time visual feedback shows the scan is in progress.":
      "一道青柠色光束扫过物体，实时的视觉反馈告诉你扫描正在进行。",
    "Gemini reads the actual material — not just the shape. A juice carton is paper + plastic + aluminum. Rumi knows.":
      "Gemini 识别的是真实材质，而不只是外形。一个果汁纸盒其实是纸＋塑料＋铝箔，Rumi 知道。",
    "An animated arrow lights up the correct bin. No ambiguity. No reading labels. Just follow the arrow.":
      "一个动态箭头会点亮正确的垃圾桶。没有歧义，不用读标签，跟着箭头走就行。",
    "Feedback is immediate and personal. Rumi confirms, celebrates, or redirects — in real time, in character.":
      "反馈即时且带有个性。Rumi 会实时确认、庆祝，或是纠正——始终保持角色感。",

    /* ---- S14 — 08 In Context ---- */
    "08 — In Context": "08 — 落地场景",
    "Where it lives.": "它会出现<br/><em style=\"font-style:normal;color:var(--mid)\">在哪里。</em>",
    "Trash Talk with Rumi is designed for high-traffic public spaces — shopping malls, university campuses, transit hubs. Anywhere waste decisions happen fast, and confusion is costly.":
      "Trash Talk with Rumi 是为高人流的公共空间设计的：商场、大学校园、交通枢纽，任何垃圾投放决定要快速做出、而困惑代价高昂的地方。",
    "Shopping mall food courts": "商场美食广场",
    "University campuses and residences": "大学校园与宿舍",
    "Transit stations and public plazas": "交通站点与公共广场",
    "Event venues and convention centres": "活动场馆与会展中心",

    /* ---- S16 — 09 Reflection ---- */
    "09 — Reflection": "09 — 反思",
    "What I learned.": "我学到了<br/><em>什么。</em>",
    "This project taught us that behaviour change isn't about information — it's about reducing friction at the exact moment of decision.":
      "这个项目让我们明白：行为改变靠的不是信息，而是在做决定的那一刻，把阻力降到最低。",
    "What worked": "奏效的部分",
    "What we changed": "我们做的调整",
    "Next steps": "下一步",
    "Rumi's character. Making the mascot opinionated and playful removed the stigma of \"being taught.\" People laughed at the trash talk — and remembered the lesson.":
      "Rumi 这个角色本身。把吉祥物设计得有主见、爱玩，去掉了「被说教」的尴尬感。人们被这些「毒舌吐槽」逗笑，也因此记住了背后的知识点。",
    "Early prototypes showed the result card first. Testing revealed users wanted the arrow before the explanation — action over education. We flipped the order.":
      "早期原型会先展示结果卡片。测试发现用户想先看到箭头、再看解释，行动优先于说教。于是我们调换了顺序。",
    "Gamification layer: streak tracking, neighbourhood leaderboards. Physical kiosk pilot at CDM campus. Multi-language support for Vancouver's diverse communities.":
      "游戏化层：连续打卡记录、社区排行榜。在 CDM 校园试点实体终端。为温哥华多元社区提供多语言支持。",
    "CDM DMED 520 · Winter 2026": "CDM DMED 520 · 2026年冬季"
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

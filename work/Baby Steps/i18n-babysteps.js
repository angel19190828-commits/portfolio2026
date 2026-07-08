/* BabySteps case-study translations.
   Loaded BEFORE ../../scripts/i18n.js. Body copy is swapped by matching each
   element's original English text (normalized) against MAP — the original
   innerHTML is snapshotted on first run so EN can always be restored. */
(function () {
  window.PAGE_DICT = {
    en: { titleBabySteps: "BabySteps - Case Study" },
    zh: { titleBabySteps: "BabySteps - 案例研究" }
  };

  const SELECTORS = [
    ".cs-hero-sub", ".cs-hero-desc", ".cs-hero-status", ".cs-hero-collab-label",
    ".cs-stat-label",
    ".section-label", ".section-title", ".section-body", ".project-title",
    ".overview-role-label", ".overview-role-list span", ".meta-label", ".meta-value",
    ".cs-problem-card-title", ".cs-problem-card-body",
    ".cs-role-tag", ".cs-role-card-title", ".cs-role-card-body",
    ".rq-text", ".rq-attr", ".reflect-label", ".reflect-body", ".reflection-intro",
    ".cs-phases-head", ".cs-phase-num", ".cs-phase-name", ".cs-phase-hint",
    ".cs-pivot-col-title", ".cs-pivot-item", ".cs-caption",
    ".cs-artpipe-step-name", ".cs-artpipe-step-sub", ".cs-artpipe-frame-label",
    ".cs-prod-col-title", ".cs-prod-col-body",
    ".as-tab", ".as-stage-nav-label", ".as-stage-nav-sub", ".as-name", ".as-desc",
    ".cs-decision-title", ".cs-decision-body",
    ".cs-usertest-title", ".cs-usertest-chip", ".cs-usertest-colhead", ".cs-usertest-list li",
    ".cs-testing-title",
    ".cs-timeline-meta-text", ".cs-timeline-phase", ".cs-timeline-name", ".cs-timeline-desc", ".cs-timeline-badge",
    ".cs-handoff-item-title", ".cs-handoff-cta",
    ".feature-col-num", ".feature-col-title", ".feature-col-body",
    ".ims-copy-card h2", ".ims-feature-list li"
  ].join(", ");

  const MAP = {
    /* ---- Hero / stats ---- */
    "AR Storytelling for Prenatal Bonding": "面向产前情感联结的<br>AR 叙事体验",
    "An augmented reality prenatal experience that transforms emotional connection between expectant parents and their baby — through an interactive AR night sky, progressive storytelling, and a 3D baby model.":
      "一款增强现实产前体验：通过可交互的 AR 夜空、渐进式叙事与 3D 宝宝模型，重塑准父母与宝宝之间的情感联结。",
    "Capstone Prototype · UBC MDM 2025": "毕业设计原型 &nbsp;·&nbsp; UBC MDM 2025",
    "A collaboration of": "合作方",
    "Weeks": "周",
    "Users": "名用户",
    "Phases": "个阶段",

    /* ---- 00 Overview ---- */
    "00 — Overview": "00 — 概览",
    "Prenatal Emotional Connection": "产前情感<br/><em>联结</em>",
    "Pillars": "三大支柱",
    "Emotional": "情感",
    "Educational": "教育",
    "Experiential": "体验",
    "Client": "客户",
    "Team": "团队",
    "Timeline": "周期",
    "My Role": "我的角色",
    "Tools": "工具",
    "Deliverables": "交付物",
    "12 weeks 2026": "12 周<br/>2026",
    "Visual Designer": "视觉设计师",
    "Figma, ARKit Procreate, Illustrator": "Figma、ARKit<br/>Procreate、Illustrator",
    "AR App Brand System": "AR 应用<br/>品牌系统",

    /* ---- 01 Problem ---- */
    "01 — Problem": "01 — 问题",
    "The Bonding Gap": "联结的缺口",
    "Expectant parents — especially in the first and second trimesters — lack experiences that make the invisible reality of their developing baby feel present. Existing prenatal tools focus on information delivery: weekly statistics, checklists, clinical diagrams. Partners feel peripheral to a journey they cannot physically experience, and that engagement gap is rarely acknowledged. Prenatal bonding is not automatic — it is cultivated through repeated, intentional engagement. BabySteps responds with three design stances:":
      "准父母，尤其在孕早期和孕中期，缺少能让「看不见的宝宝」变得真实可感的体验。现有孕期工具专注于信息投递：每周数据、清单、临床图示。伴侣对这段无法亲身经历的旅程感到疏离，而这种参与缺口几乎从未被正视。产前情感联结不是自动发生的，需要反复、有意识的投入来培养。BabySteps 以三个设计立场作出回应：",
    "Emotional accompaniment": "情感陪伴",
    "over information delivery. Parents witness growth as a living visual world, not a fact card.": "而非信息灌输。父母见证的是一个鲜活的视觉世界，而不是一张数据卡片。",
    "Ritual": "仪式感",
    "over task completion. No streaks, no metrics, no guilt for missing a day.": "而非任务打卡。没有连续记录、没有指标，错过一天也不必内疚。",
    "Shared participation": "共同参与",
    "over solitary use. Every feature includes the partner, from the very first week.": "而非独自使用。从第一周起，每个功能都把伴侣纳入其中。",

    /* ---- 02 My Role ---- */
    "02 — My Role": "02 — 我的角色",
    "2D Animation": "2D 动画",
    "Visual Design": "视觉设计",
    "Art Direction": "艺术指导",
    "Illustration": "插画",
    "Asset Production": "资产制作",
    "Defined the visual language — colour palette, star character design, and the emotional tone that carries through every scene.":
      "定义整体视觉语言：配色、星星角色设计，以及贯穿每个场景的情感基调。",
    "Created all Procreate + frame-by-frame animations: idle loops, stage transitions, environmental effects, and character moments.":
      "制作全部 Procreate 逐帧动画：待机循环、阶段过渡、环境特效与角色瞬间。",
    "Exported and optimised every animation asset for Unity AR integration — working directly with the dev team on format and timing.":
      "为 Unity AR 集成导出并优化所有动画资产，直接与开发团队对齐格式与时间轴。",

    /* ---- 03 Research ---- */
    "03 — Research": "03 — 调研",
    "Research": "调研",
    "I wanted to help — I just didn't know what to do, or when. It felt like standing on the sidelines.":
      "我想帮忙，只是不知道该做什么、什么时候做。感觉自己一直站在场边。",
    "Interview — First-time father, 30": "访谈 · 初为人父，30 岁",
    "Mixed emotions": "复杂交织的情绪",
    "Joy, worry, strength, and anxiety coexist through pregnancy — often in the same week.": "喜悦、担忧、坚强与焦虑在孕期并存，常常出现在同一周里。",
    "Fathers feel sidelined": "父亲被边缘化",
    "Excluded and unsure of their role; their only support today is informal — friends, online content, AI.": "被排除在外、不确定自己的角色；目前能依靠的只有朋友、网络内容和 AI 等非正式支持。",
    "Context shapes the bond": "境遇影响联结",
    "Planned vs. unplanned, finances, and access to care all shape attachment and confidence.": "是否计划怀孕、经济状况与医疗可及性，都影响依恋与信心。",
    "Connection is sensory": "联结源自感官",
    "Heartbeat, movement, touch, and voice build the bond — for the whole family, not just the mother.": "心跳、胎动、触摸与声音最能建立联结，属于全家人，而不只是母亲。",
    "Development milestones that anchor stage-based interaction:": "支撑分阶段交互的胎儿发育里程碑：",
    "15–18 Weeks": "15–18 周",
    "Hearing begins": "听觉开始发育",
    "Talk to the baby, play music": "对宝宝说话、播放音乐",
    "20–24 Weeks": "20–24 周",
    "Responds to touch & voice": "回应触摸与声音",
    "Belly touch, read stories": "抚摸腹部、读故事",
    "25+ Weeks": "25 周以上",
    "Hearing fully functional": "听觉发育成熟",
    "Music, voice recordings": "音乐、语音录音",
    "Third Trimester": "孕晚期",
    "Senses light & taste": "感知光线与味道",
    "Light play, food moments": "光影互动、味觉时刻",

    /* ---- 04 Ideation / 05 Pivot ---- */
    "04 — Ideation": "04 — 概念构思",
    "3 Concepts": "三个概念方向",
    "05 — Pivot": "05 — 方向转变",
    "Pivot": "方向转变",
    "Original Direction": "原方向",
    "Pivoted To": "转向",
    "Constellations as fetal milestones. Clients felt it tied the app to astrology & mysticism": "用星座对应胎儿里程碑。客户认为这让产品带上了占星与神秘主义色彩",
    "After Effects for animation workflow. Mismatched with our painterly art direction": "用 After Effects 做动画流程。与我们手绘感的美术方向不匹配",
    "Story-based AR night sky. Warmth and wonder, no zodiac associations": "以故事驱动的 AR 夜空。温暖而充满奇想，不含星座联想",
    "Hand-drawn frame-by-frame in Procreate. Matched the storybook feel perfectly": "在 Procreate 中手绘逐帧动画。与绘本质感完美契合",
    "No baby-related illustrations in the AR sky. Abstract warmth over literal imagery": "AR 夜空中不出现具象的宝宝形象。用抽象的温暖代替直白的描绘",

    /* ---- 06 Moodboard / 07 Visual / 08 Story ---- */
    "06 — Moodboard": "06 — 情绪板",
    "Moodboard": "情绪板",
    "The visual direction is inspired by a storybook aesthetic, where textures and brush strokes remain visible, creating a sense of warmth, tactility, and hand-crafted intimacy. Motion is suggested through painterly strokes and elongated shapes, particularly in the depiction of comets and falling stars.":
      "视觉方向源自绘本美学：保留可见的纹理与笔触，营造温暖、可触、手作般的亲密感。动势通过绘画性的笔触与拉长的形状来暗示，尤其体现在彗星与流星的描绘中。",
    "Source from Pinterest": "素材来源：Pinterest",
    "07 — Visual Style": "07 — 视觉风格",
    "Visual Style": "视觉风格",
    "The night sky is treated as an emotional space. Deep blues, soft purples, and muted blacks form the base, while glowing yellow and whites introduce moments of warmth and focus. Light is used as a central storytelling element — bright glowing forms guide attention and evoke wonder.":
      "夜空被当作一个情感空间来处理。深蓝、柔紫与哑黑构成底色，发光的黄与白带来温暖与聚焦的瞬间。光是核心的叙事元素，明亮的发光形体引导视线、唤起惊奇。",
    "Envisioning the Placement of an Asset in the Night Sky": "设想资产在夜空中的置放方式",
    "08 — Story Making": "08 — 故事构建",
    "Story Making": "故事构建",
    "With the constellation concept behind us, we built a layered AR narrative — the night sky becomes a living storybook that grows alongside the pregnancy. Each AR scene is composed of three depth layers that stack to form a complete environment.":
      "告别星座概念后，我们构建了分层的 AR 叙事：夜空成为一本随孕期一同生长的活绘本。每个 AR 场景由三个景深图层叠加而成，构成完整的环境。",
    "AR layer system: Default assets → Depth of stars → Story": "AR 图层系统：默认资产 → 星空景深 → 故事层",

    /* ---- 09 Art Assets ---- */
    "09 — Art Assets": "09 — 美术资产",
    "Production Pipeline": "制作流程",
    "All 2D assets were created from scratch using a three-stage pipeline — from hand-drawn illustration to Unity-ready PNG sequences.":
      "所有 2D 资产均从零制作，经过三段式流程：从手绘插画到可直接进入 Unity 的 PNG 序列帧。",
    "Hand-draw + animate frame by frame": "手绘 + 逐帧动画",
    "Composite layers, color grade, export": "图层合成、调色、导出",
    "PNG Sequence": "PNG 序列帧",
    "Frame-by-frame PNGs → Unity AR": "逐帧 PNG → Unity AR",
    "Heart Beat": "心跳",
    "Night Sky": "夜空",

    /* ---- 10 Leading Production ---- */
    "10 — Leading Production": "10 — 生产管理",
    "Leading Production": "主导资产生产",
    "With 30+ assets moving through the pipeline, production needed a system — and the team needed to be able to produce without me becoming a bottleneck. I ran the asset tracker and onboarded teammates into the animation workflow directly.":
      "30 多个资产同时在流水线上推进，生产必须有一套系统，团队也需要在我不成为瓶颈的前提下持续产出。我负责维护资产追踪表，并亲自把队友带入动画工作流。",
    "One source of truth for 30+ assets": "30+ 资产",
    "Every asset was tracked by format (flat / motion), where it appears (storytelling / night sky), assignee (me, another member, or client-provided), status, and the narrative phase it belongs to (S1–S6). At any point, anyone on the team could see what was done, what was in progress, and what was blocking Unity integration.":
      "每个资产都按格式（静态 / 动态）、出现场景（叙事 / 夜空）、负责人（我、其他成员或客户提供）、状态与所属叙事阶段（S1–S6）追踪。团队任何人随时都能看到哪些已完成、哪些进行中、哪些在阻塞 Unity 集成。",
    "Teaching the workflow, not just handing off files": "工作流教程",
    "When another member joined asset production, I recorded a walkthrough video breaking my animation process into clear, repeatable steps — from frame-by-frame drawing in Procreate to export settings Unity expects. The member went on to deliver assets like the Bone, Planet Earth, and Nebula Mist independently, in a style consistent with mine.":
      "另外一位成员加入资产制作时，我录制了一段讲解视频，把我的动画流程拆解成清晰、可复用的步骤：从 Procreate 逐帧绘制到 Unity 所需的导出设置。之后该成员独立完成了骨头、地球、星云迷雾等资产，风格与我的保持一致。",

    /* ---- 11 Showcase ---- */
    "11 — Showcase": "11 — 动画展示",
    "Animation Showcase": "动画展示",
    "A compact asset gallery with category switching, uniform frames, and a dedicated ordered stage progression.":
      "一个紧凑的资产画廊：支持分类切换、统一画框，并按阶段顺序专门编排。",
    "Stages": "阶段",
    "Character": "角色",
    "Environment": "环境",
    "Stage 1": "阶段 1",
    "Stage 2": "阶段 2",
    "Stage 3": "阶段 3",
    "Stage 4": "阶段 4",
    "Stage 5": "阶段 5",
    "Stage 6": "阶段 6",
    "Beginning": "起点",
    "Growth": "成长",
    "Development": "发育",
    "Transition": "过渡",
    "Advanced": "进阶",
    "Final Stage": "最终阶段",
    "Character 01": "角色 01",
    "Character 02": "角色 02",
    "Character 03": "角色 03",
    "Character 04": "角色 04",
    "Character 05": "角色 05",
    "Environment 01": "环境 01",
    "Environment 02": "环境 02",
    "Environment 05": "环境 05",
    "Effect 01": "特效 01",
    "Effect 02": "特效 02",
    "Stage 1 — 01": "阶段 1 — 01",
    "Stage 1 — 02": "阶段 1 — 02",
    "Stage 1 — 03": "阶段 1 — 03",
    "Stage 1 — 04": "阶段 1 — 04",
    "Stage 1 — 05": "阶段 1 — 05",
    "Stage 1 — 06": "阶段 1 — 06",
    "Stage 2 — 01": "阶段 2 — 01",
    "Stage 2 — 02": "阶段 2 — 02",
    "Stage 3 — 01": "阶段 3 — 01",
    "Stage 3 — 02": "阶段 3 — 02",
    "Stage 3 — 03": "阶段 3 — 03",
    "Stage 4 — 01": "阶段 4 — 01",
    "Stage 4 — 02": "阶段 4 — 02",
    "Stage 4 — 03": "阶段 4 — 03",
    "Stage 4 — 04": "阶段 4 — 04",
    "Stage 4 — 05": "阶段 4 — 05",
    "Stage 5 — 01": "阶段 5 — 01",
    "Stage 5 — 02": "阶段 5 — 02",
    "Stage 5 — 03": "阶段 5 — 03",
    "Stage 6 — 01": "阶段 6 — 01",
    "Stage 6 — 02": "阶段 6 — 02",
    "Stage 6 — 03": "阶段 6 — 03",
    "Stage 6 — 04": "阶段 6 — 04",
    "Stage 6 — 05": "阶段 6 — 05",
    "Stage 6 — 06": "阶段 6 — 06",
    "Idle Loop": "待机循环",
    "Shooting Star": "流星",
    "Star 2": "星星 2",
    "Star 3": "星星 3",
    "Star 4": "星星 4",
    "Cloud Layer": "云层",
    "Sun": "太阳",
    "Moon": "月亮",
    "Meteor Shower": "流星雨",
    "Sparkle": "星光闪烁",
    "Star1_Beginning": "星星 1 · 起点",
    "Outline Star": "描边星星",
    "Organization Star": "组织星星",
    "Universe": "宇宙",
    "FireWorks": "烟花",
    "Star to Outline": "星星变描边",
    "Star To Outline": "星星变描边",
    "Ear + Volume": "耳朵与音量",
    "Star Opens A Little": "星星微微张开",
    "Filling Circle with Star": "星星填充圆环",
    "Heart House": "爱心小屋",
    "Aurora": "极光",
    "Moon Slides Star": "月亮滑过星星",
    "Clock": "时钟",
    "Star to Earth": "星星变地球",
    "Star to Sun": "星星变太阳",
    "Star Opens": "星星绽开",
    "Hand Held Star": "手捧星星",
    "Bird Flying": "飞鸟",
    "Flying Fullloop": "飞行完整循环",
    "Kite": "风筝",

    /* ---- 12 Team Decisions ---- */
    "12 — Team Decisions": "12 — 团队决策",
    "Team Decisions & Client Communication": "团队决策与<br>客户沟通",
    "Concept Merge": "概念合并",
    "We evaluated 3 directions. No single concept was enough. We merged Constellation (AR immersion) + Scrapbook (personal memory) into the Night Sky experience—creating something more powerful than either alone.":
      "我们评估了三个方向，没有任何一个单独成立。于是将 <strong>Constellation</strong>（AR 沉浸）与 <strong>Scrapbook</strong>（个人记忆）合并为「夜空」体验，比任何单一方案都更有力量。",
    "Partner-First Constraint": "伴侣优先原则",
    "Client feedback mid-sprint: AR and partner engagement must be core, not add-ons. Every feature now requires a Partner View. This constraint forced us to think inclusively from the start.":
      "客户在冲刺中期反馈：AR 与伴侣参与必须是核心，而非附加项。现在每个功能都必须包含<strong>伴侣视图</strong>。这个约束让我们从一开始就以包容的方式思考。",
    "Scope Protection": "范围管控",
    "Explicitly cut 6 features to protect 12-week delivery: medical monitoring, social sharing, user login, 3D animation rigging. Quality over quantity—we shipped something polished rather than something rushed.":
      "为保障 12 周交付，明确砍掉 6 个功能：医疗监测、社交分享、用户登录、3D 动画绑定等。<strong>质量优先于数量</strong>，我们交付的是打磨过的产品，而不是赶工的半成品。",

    /* ---- 13 User Test ---- */
    "13 — User Test": "13 — 用户测试",
    "Two Rounds of Testing": "两轮用户测试",
    "Round 1 — Internal User Test": "第一轮 · 内部用户测试",
    "Week 6 · Feb 9, 2026": "第 6 周 · 2026年2月9日",
    "42 participants": "42 名参与者",
    "Round 2 — External User Test": "第二轮 · 外部用户测试",
    "Week 9 · Mar 10, 2026": "第 9 周 · 2026年3月10日",
    "65 participants": "65 名参与者",
    "What we found": "我们的发现",
    "How we responded": "我们的应对",
    "59.6% found onboarding clear — abstract phrasing like “journey under the stars” confused the rest": "59.6% 认为引导流程清晰，「星空下的旅程」这类抽象措辞让其余用户感到困惑",
    "28.6% struggled to locate the Journal, and dead-end buttons created false friction": "28.6% 找不到日记入口，无响应的按钮造成了不必要的挫败感",
    "The AR dome earned a real wow-factor, but content sat too high — arms above shoulder height": "AR 穹顶带来真实的惊叹感，但内容位置过高，手臂需举过肩",
    "Users instinctively reached out to touch the sky, moon, and baby elements": "用户会本能地伸手去触碰夜空、月亮和宝宝元素",
    "Rewrote onboarding copy to name the app’s purpose earlier in the flow": "重写引导文案，在流程更早处点明产品目的",
    "Gave the Journal a clear visual entry point and made every button state interactive": "为日记提供清晰的视觉入口，并让所有按钮状态可交互",
    "Lowered the dome so key elements are reachable without raised arms": "降低穹顶高度，关键元素无需抬臂即可触及",
    "Added an interaction layer — sky, moon, and baby became tappable": "增加交互层，夜空、月亮和宝宝都可以点按",
    "The storytelling animation rated 3.6/5 emotionally engaging — curious, calm, and peaceful led the responses": "叙事动画的情感投入度评分为 3.6/5，「好奇」「平静」「安宁」是最高频的反馈",
    "Holding the phone upward was tiring, and potentially inaccessible for heavily pregnant users": "长时间举起手机很累，对孕晚期用户尤其不友好",
    "The 3D baby read as “too medical” — transparency and visible organs unsettled many participants": "3D 宝宝被认为「太医学化」，透明材质与可见器官让许多参与者感到不适",
    "The link between the night sky and fetal development was unclear on first encounter": "初次接触时，夜空与胎儿发育之间的联系不够清晰",
    "Repositioned visual elements lower and constrained interaction to a comfortable ~180° range": "下调视觉元素位置，把交互限制在舒适的约 180° 范围内",
    "Hid internal organs by default and committed to a warm, soft rendering direction": "默认隐藏内部器官，确立温暖柔和的渲染方向",
    "Added animated cues to start each story sequence, plus pinch-to-zoom on the baby model": "为每段故事加入动画引导提示，并为宝宝模型加入双指缩放",
    "Rebuilt onboarding to name the Night Sky concept and its link to fetal development up front": "重构引导流程，开篇即点明夜空概念及其与胎儿发育的关联",

    /* ---- 14 Testing Results ---- */
    "14 — Testing Results": "14 — 测试结果",
    "Testing Results": "测试结果",
    "Emotional Connection": "情感联结",
    "Daily Engagement": "日常参与",
    "Anxiety Reduction": "焦虑缓解",
    "Task Completion": "任务完成率",
    "Usability Score": "可用性评分",
    "Design Iterations": "设计迭代次数",

    /* ---- 15 Timeline ---- */
    "15 — Timeline": "15 — 时间线",
    "Development Timeline": "开发时间线",
    "12 Weeks": "12 周",
    "4 Sprints": "4 个冲刺",
    "3 Phases": "3 个阶段",
    "Phase 01 — Weeks 1–2": "阶段 01 — 第 1–2 周",
    "Research & Ideation": "调研与构思",
    "User interviews with expectant parents, competitive analysis of existing pregnancy apps, and definition of the core emotional problem space.":
      "访谈准父母，分析现有孕期应用的竞品格局，定义核心的情感问题空间。",
    "Discovery": "探索",
    "Phase 02 — Weeks 3–5": "阶段 02 — 第 3–5 周",
    "Prototyping & AR Exploration": "原型与 AR 探索",
    "Low-fidelity wireframes tested with 12 participants. AR anchoring and night sky environment explored in RealityKit and Unity AR Foundation.":
      "低保真线框图经 12 名参与者测试；在 RealityKit 与 Unity AR Foundation 中探索 AR 锚定与夜空环境。",
    "Design + Prototype": "设计 + 原型",
    "Phase 03 — Weeks 6–7": "阶段 03 — 第 6–7 周",
    "MVP & First Feature": "MVP 与首个功能",
    "Night sky AR scene shipped as the core MVP. Onboarding flow and due-date setup integrated. Internal alpha tested with 18 users.":
      "夜空 AR 场景作为核心 MVP 上线；整合引导流程与预产期设置；18 名用户参与内部 alpha 测试。",
    "Sprint 01–02": "冲刺 01–02",
    "Phase 04 — Weeks 8–9": "阶段 04 — 第 8–9 周",
    "Iteration & Second Feature": "迭代与第二个功能",
    "3D baby model integrated with week-based progression. Daily task system built and connected to the journey map. Feedback incorporated from first alpha.":
      "3D 宝宝模型接入按周推进机制；搭建每日任务系统并接入旅程地图；消化首轮 alpha 反馈。",
    "Sprint 03": "冲刺 03",
    "Phase 05 — Weeks 10–11": "阶段 05 — 第 10–11 周",
    "Integration & Second Feature": "整合与端到端联调",
    "Full user journey connected end-to-end. Push notifications for daily tasks. Wider beta with 107 users across two cohorts.":
      "完整用户旅程端到端打通；每日任务推送上线；107 名用户、两个批次的更大规模 beta 测试。",
    "Sprint 04": "冲刺 04",
    "Phase 06 — Week 12": "阶段 06 — 第 12 周",
    "Polish & Handoff": "打磨与交付",
    "Animation polish, performance optimisation, and full design handoff package delivered to the Tandem engineering team.":
      "动画打磨、性能优化，并向 Tandem 工程团队交付完整的设计交付包。",
    "Handoff": "交付",

    /* ---- 16 Tools / 17 Handoff ---- */
    "16 — Tools": "16 — 工具",
    "Tools Used": "使用工具",
    "17 — Handoff": "17 — 交付",
    "Everything Handed Off": "完整交付",
    "A complete handoff package was delivered to the Tandem engineering team — ready for production.":
      "完整的交付包已移交 Tandem 工程团队，随时可以投入生产。",
    "Figma Design": "Figma 设计稿",
    "2D Animations": "2D 动画",
    "Unity AR Project": "Unity AR 工程",
    "Component Library": "组件库",
    "User Testing": "用户测试",
    "Product Roadmap": "产品路线图",
    "View Art Style Guide →": "查看美术风格指南 →",

    /* ---- 18 Features / 19 Demo ---- */
    "18 — Features": "18 — 核心功能",
    "Core Features": "核心功能",
    "Feature 01": "功能 01",
    "The Night Sky Experience": "夜空体验",
    "Users anchor a dynamic AR night sky in their physical space. Stars, clouds, and ambient elements fill the room as the story begins to unfold around them.":
      "用户在自己的物理空间中锚定一片动态 AR 夜空。星星、云朵与环境元素充满房间，故事在身边徐徐展开。",
    "Feature 02": "功能 02",
    "3D Baby Visualization": "3D 宝宝可视化",
    "An interactive 3D model of the baby evolves alongside each development stage. Parents can rotate, zoom, and explore the model in AR.":
      "可交互的 3D 宝宝模型随每个发育阶段演变。父母可以在 AR 中旋转、缩放并探索模型。",
    "Feature 03": "功能 03",
    "Journey & Daily Task": "旅程与每日任务",
    "A structured journey maps out the pregnancy from week 1 to birth. Each day presents a small task that deepens the bond.":
      "结构化的旅程覆盖从第 1 周到分娩的全过程。每天一个小任务，让联结日渐加深。",
    "19 — Demo": "19 — 演示",
    "iPhone Mockup Showcase": "iPhone 实机演示",
    "The Stage 1 AR story within a realistic mobile device frame — as it appears in-hand.":
      "第一阶段的 AR 故事置于逼真的手机框架中，如同握在手中的样子。",
    "Keypoints": "要点",
    "Highlights 2D animation and visual language": "突出 2D 动画与视觉语言",
    "Simulates real-device interaction for a grounded viewing experience": "模拟真机交互，带来贴近实际的观看体验",
    "Combines motion, light, and composition to establish emotional tone": "结合动效、光线与构图，确立情感基调",

    /* ---- 20 Reflection / 21 Team ---- */
    "20 — Reflection": "20 — 反思",
    "What I learned.": "我学到了<br><span class=\"accent\">什么。</span>",
    "Looking back over the past twelve weeks, this project taught me much more than how to design an AR experience. It showed me what it feels like to build a product as part of a multidisciplinary team, where every decision, asset, and iteration contributes to a much larger system.":
      "回望这十二周，这个项目教给我的远不止如何设计一个 AR 体验。它让我体会到在多学科团队中打造产品的感觉：每一个决策、每一个资产、每一次迭代，都在为一个更大的系统添砖加瓦。",
    "From designer to product creator": "从设计师到产品创造者",
    "As the project progressed, I gradually became responsible for most of the visual production — the storybook illustrations, night sky assets, animations, and documentation. Creating assets is only one part of the process; equally important is organizing them, communicating with developers, and ensuring they can be integrated smoothly into the final experience.":
      "随着项目推进，我逐渐承担起大部分视觉生产：绘本插画、夜空资产、动画与文档。制作资产只是一部分；同样重要的是组织资产、与开发沟通，并确保它们能顺利集成进最终体验。",
    "Iterating with feedback": "在反馈中迭代",
    "We constantly iterated based on client feedback and user testing. Many ideas evolved over time, and some had to be completely reworked. Rather than seeing feedback as criticism, I learned to treat it as part of the design process — every iteration brought us closer to a clearer and more meaningful experience.":
      "我们基于客户反馈与用户测试持续迭代。许多想法随时间演变，有些甚至彻底重做。我学会不把反馈当成批评，而是把它当作设计过程本身：每一次迭代都让体验更清晰、更有意义。",
    "The team behind it": "背后的团队",
    "Despite tight deadlines and occasional setbacks, we maintained open communication and supported one another throughout. Small moments outside of work — sharing meals, going bowling, or simply talking during breaks — helped build trust and made collaboration much more enjoyable. Successful projects are built not only through good design, but through strong relationships.":
      "尽管工期紧张、偶有挫折，我们始终保持开放的沟通、彼此支持。工作之外的小时光，一起吃饭、打保龄球、休息时闲聊，建立了信任，也让协作愉快得多。成功的项目不只靠好的设计，更靠牢固的关系。",
    "Going forward": "未来方向",
    "This project has strengthened my confidence in visual storytelling, production planning, and cross-disciplinary collaboration. More importantly, it has changed the way I approach design — I now think beyond individual screens or assets, and instead focus on designing complete experiences that connect storytelling, interaction, and emotion.":
      "这个项目增强了我在视觉叙事、生产规划与跨学科协作上的信心。更重要的是，它改变了我做设计的方式：我不再局限于单个界面或资产，而是着眼于设计连接叙事、交互与情感的完整体验。",
    "21 — Team": "21 — 团队",
    "Team Panoruk": "Panoruk 团队"
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

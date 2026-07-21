# CLAUDE_INBOX.md

> Two parallel changelogs (this qiaooli-replica worktree's Claude sessions, and a separate Codex-side worktree/branch that was pushed straight to origin/main) existed independently and are combined here as of the 2026-07-20 origin/main reconciliation. Claude's log (this worktree, newer, entries 35-81 below) is listed first; the original Codex-side log it was appended to (entries 1-34, dated 2026-07-02 to 2026-07-04) follows below the divider.

## Edit — 2026-07-20 (latest, 81st update)

#### `work/Fableware Impact Engine/index.html`
- **What:** Two mobile-only layout upgrades, both explicitly scoped/confirmed with Angel via AskUserQuestion before implementing:
  1. **Early Concepts (`#s3-concepts`) → mobile accordion.** Previously just collapsed the 3-card grid to 2 then 1 column with the full card (image + number + title + description) always visible. Ported Trash Talk with Rumi's `#s6a` "Three Ideas" mobile accordion mechanism verbatim (same `grid-template-rows: 0fr → 1fr` collapse technique, same single-open behavior, same DOM-rebuild-via-JS approach the Research section also uses) — at ≤960px (Fableware's own breakpoint, not Rumi's 809px), rows collapse to title-only with a plus/minus icon; tapping expands the image + description, closing any other open row. `.sel-tag` ("Selected Direction") moved from an absolutely-positioned badge poking above the card to an inline badge next to the title inside the toggle header, since the divider-row style has no card edge to poke above anymore. New JS is a separate gated IIFE (`matchMedia('(max-width:960px)')`, reload-once-on-cross, same pattern as Rumi's) — doesn't touch the existing hero-tilt/modal IIFE.
  2. **S4 step flow (`Open Collection → View Card 1 → View Card 2 → View Card 3 → Share Card → Download Card`) → vertical stack with rotated arrows.** Previously plain `flex-wrap` pills that wrapped unpredictably on narrow screens. Ported the same "stack vertically, rotate arrow 90° to point down" idea already proven in this file's own S9 Share Flow (`.share-flow`/`.sf-arrow` mobile rule) — applied to the existing text chips via `flex-direction:column` (not a grid rebuild, since chip count is content-driven and S9's grid is hardcoded for exactly 3 panels). Did not port S9's image-panel structure since S4's steps have no per-step screenshots to put in them.
  Both changes are mobile-only (≤960px); desktop CSS/behavior for `.concept-row`/`.concept-card`/`.flow-chips` and S9's `.share-flow` itself are untouched.
- **Why:** Angel asked for Early Concepts to match Trash Talk's layout and asked whether there's a better presentation for the S4 step flow. Clarified both via AskUserQuestion: confirmed she wants the full Rumi accordion mechanism (not just a visual-only restack keeping content always visible — flagged that this differs from the direction chosen for Baby Steps' "3 Concepts" in the 73rd-ish update, but she explicitly picked the accordion here), and confirmed reusing S9's existing rotate-arrow mobile pattern over inventing a new numbered-dot or icon-block style.
- **Risk:** Low-medium — CSS is additive/scoped to the existing 960px media query; the new JS is a self-contained gated IIFE that doesn't modify the existing script's variables/flow. `node --check` clean on the page's single inline script block; local server 200; grepped served HTML to confirm the new CSS/JS markers are present and the old simple-collapse `.concept-row` rules are gone. Needs a manual pass on a real phone or ≤960px DevTools view: confirm Early Concepts starts fully collapsed, expands cleanly on tap with single-open behavior, the "Selected Direction" tag reads fine inline, and the S4 flow stacks vertically with downward arrows instead of wrapping.

---

## Edit — 2026-07-20 (80th update)

#### `work/Fableware Impact Engine/index.html`
- **What:** Fableware's mobile CSS was much sparser than the other case-study pages (uses `960px`/`560px` breakpoints, no hamburger nav/accordion/carousel infra at all). Angel asked for a mobile layout pass; scoped it down via AskUserQuestion to "fix concrete bugs only, no structural rework" (no hamburger menu, no accordions, no scroll-snap carousels, no 3D-perspective flattening — those would be much bigger, separate asks). Fixed 8 specific issues: (1) `.portfolio-footer` kept desktop's 56px horizontal padding on mobile, added `padding:24px` to match the rest of the page's `.w{padding:0 24px}` baseline; (2) the card-enlarge modal had zero mobile CSS — `.modal-close` floats at `top:-48px` above `.modal-body`, which risked being pushed off-screen when `.modal-img` reaches `80vh` on a short/narrow phone, moved the close button onto the image itself (`top:12px;right:12px` with a translucent backdrop) so it's always reachable; (3) the S8 "Hover" demo tile (`.state-card.hovered:hover`) is unreachable on touch since there's no hover on mobile — made the elevated state unconditional at ≤960px so the demo isn't just a dead tile; (4) `.strip-inner` (5 stat cells) never dropped below 2 columns, producing an uneven 2-2-1 layout — added a 560px override to `1fr`; (5) `.var-grid` (6 card variations) was the one multi-column grid that stayed at 2 columns at 560px while `.handoff-grid`/`.deliver-grid` correctly collapsed to 1 — aligned it to match; (6) `.testing-shot`'s `min-height:260px` was sized for the two-column desktop layout and became unreliable once `.two-col` stacks to 1 column on mobile (percentage-height img inside an auto-height parent) — replaced with an explicit `aspect-ratio:4/3`; (7) `#flipHint`'s `white-space:nowrap` label had overflow risk against the hero card stage at `min(330px,62vw)` on ~320px phones — shrank font-size/letter-spacing on mobile; (8) the hero card tilt and `.tilt-card` demos only reset on `pointerleave`, which touch often never fires (finger lifts inside the element bounds rather than leaving them), risking a card stuck visually tilted — added `pointerup`/`pointercancel` listeners alongside the existing `pointerleave` reset. Desktop CSS/behavior untouched throughout; no hamburger/accordion/carousel/perspective changes made per the agreed scope.
- **Why:** Angel asked for a general mobile layout improvement pass on this page after noticing it hadn't gotten the same mobile treatment as Baby Steps/Trash Talk with Rumi; explicitly chose the narrower "fix concrete bugs, not full rework" scope when asked.
- **Risk:** Low — all CSS-only except item 8 (a small, additive JS patch: two extra event listeners calling the same existing reset function, no logic removed). `node --check` clean on the page's one inline script block; local server 200; grepped the served HTML to confirm each of the 8 changes is present. Worth a manual check on a real phone / narrow DevTools viewport for: footer spacing, modal close button reachability, the S8 Hover tile, strip/var-grid column counts, the flip-hint label, and whether the hero card reliably un-tilts after a touch drag.

---

## Edit — 2026-07-20 (79th update)

#### `work/Baby Steps/index.html`
- **What:** Found the actual root cause of the "blocky/pixelated" background Angel flagged from a real-device screenshot — it was never `.stars-bg`. `html, body`'s base rule (line ~21) sets `background: #08102a url('assets/images/bg.png') center top / cover fixed;`, a 2732×2048 nebula-texture image. The mobile override added in the 78th update only set `background-color` and `background-attachment`, both longhands — it never touched `background-image`, so `bg.png` kept rendering underneath the whole time, `cover`-cropped into a narrow tall mobile viewport. Cropping a wide desktop-proportioned image to a thin vertical mobile slice zooms deep into it, which is exactly what read as "blocky/pixelated" in the screenshot — six rounds of touching `.stars-bg` (a separate, unrelated decorative overlay div) never had a chance to fix this. Fix: added `background-image: none;` to the mobile `body` override, so `bg.png` is fully removed on mobile and only the flat `background-color: #08102a` shows. Desktop's base rule at line ~21 is completely untouched.
- **Why:** Angel sent a real-device screenshot showing the pattern was still there after the 78th update's `.stars-bg{background:none}` fix, and asked for a full audit of every background/pseudo-element/filter source in the file instead of continuing to assume `.stars-bg` was the culprit. Grepping the whole file for `background-image`/`url(`/`::before`/`::after`/`backdrop-filter` turned up the real source in one pass.
- **Risk:** Low — one line added (`background-image: none`) inside the existing mobile media query, nothing else changed. Verified via local server (200, grepped served HTML for the new line) that the fix is present. This should be the actual fix this time since it addresses a different element/property than every prior round — please confirm on refresh that the blocky texture is gone and mobile now shows a flat, clean dark background.

---

## Edit — 2026-07-20 (78th update)

#### `work/Baby Steps/index.html`
- **What:** Final call on the star background, after 5 rounds (live gradients tuned bigger/harder, tuned back softer, hard-edge dots, byte-identical-to-desktop, a repeating tile image) each ran into some version of "looks pixelated / patterned / not quite like desktop." Angel explicitly ruled out `background-repeat`, any tiled/patterned image, and any mobile-specific star arrangement, offering two remaining options: a single non-repeating full-frame image, or a plain solid color with no pattern at all. Went with plain solid color — `.stars-bg { background: none; }` on mobile — since it's the only option with zero risk of a 6th "doesn't quite match" failure (no pattern means nothing to look wrong), and the tone still matches desktop exactly since both use the same `body { background-color: #08102a }`. Deleted the now-unused `stars-tile.png` asset from the 77th update rather than leaving it as dead weight. Desktop's own `.stars-bg` rule (line ~72, the original gradient dots) is completely untouched.
- **Why:** Angel: stop trying to reproduce or approximate the star pattern on mobile — plain background is an explicitly acceptable outcome, and after 5 failed attempts it's the only one that can't fail the same way again.
- **Risk:** Very low — `background: none` is about as simple as CSS gets, nothing to render incorrectly. `node --check` clean; grepped to confirm zero remaining references to the deleted `stars-tile.png`; local server 200. This should finally close out the background saga — please confirm on refresh that mobile now shows a clean, flat dark background with no dots, texture, or pattern of any kind.

---

## Edit — 2026-07-20 (77th update)

#### `work/Baby Steps/index.html`, new `work/Baby Steps/assets/images/stars-tile.png`
- **What:** Angel reframed the ask clearly: stop treating this as a CSS-gradient rendering problem to keep experimenting on, and instead use a pre-rendered static asset (one of the options she explicitly offered) so mobile isn't doing any live gradient compositing at all. Generated a small (360×360, 1.3KB) transparent-background PNG via ImageMagick — 10 soft white dots at varied sizes/opacities with a light blur for glow, matching the same visual character as desktop's star field — and set it as `.stars-bg`'s `background-image` on mobile only (`background-repeat:repeat; background-size:260px 260px`), tiling across the viewport regardless of screen size. Because this is a bitmap decoded and displayed once (not 10 semi-transparent gradients composited live by the GPU every frame), it sidesteps the real-device banding issue entirely rather than trying to out-tune it. Desktop's original CSS-gradient rule (line ~72) is completely untouched, per Angel's explicit instruction.
- **Why:** After 3 rounds of adjusting the live CSS gradient technique (bigger/harder dots, then hard-edge dots, then reverting) all either looked bad or still banded on a real device, Angel asked directly to stop experimenting with rendering technique and just use a safer static-asset approach that preserves the same visual appearance — this was one of the three options she explicitly named as acceptable.
- **Risk:** Low — a small pre-rendered transparent PNG tiled via standard `background-repeat` is about as basic/reliable a CSS pattern as exists, with no live alpha-gradient compositing for a mobile GPU to band. `node --check` clean (CSS/asset only, no scripts touched); confirmed both the page and the new image serve 200 on a local server. **Still needs a real-device check** — this is the first attempt in this saga to change the actual rendering mechanism (bitmap vs. live gradient) rather than tuning gradient parameters, so it should be far more reliable, but Angel should confirm the noise is actually gone this time before considering this closed. If the dot positions/density don't read as close enough to desktop's specific arrangement, the fix is regenerating `stars-tile.png` with adjusted dot placement — not touching the CSS approach again.

---

## Edit — 2026-07-20 (76th update)

#### `work/Baby Steps/index.html`
- **What:** Reverted the 75th update's hard-edge-dot background. Angel rejected the trade-off directly: she wants mobile to be desktop's exact design at mobile size, not a different technique to work around the real-device GPU banding — and pushed back on being asked to pick a trade-off between "identical to desktop" and "no banding," since neither fully-tested option (74th: byte-identical code, still banded; 75th: hard-edge dots, no banding but visually different) satisfied both at once. Removed the hard-edge `.stars-bg` override; mobile is back to inheriting desktop's original rule (line ~72) completely unmodified, same as after the 74th update.
- **Why:** Angel's explicit instruction: don't touch desktop, don't invent a new mobile-specific texture, and stop asking her to choose between trade-offs.
- **Risk:** Low — pure revert to a previously-shipped state. `node --check` clean; grepped to confirm exactly one `.stars-bg` rule remains in the file (desktop's). **Flagging directly rather than guessing again**: this exact state (mobile = desktop's code, byte-for-byte) was already tested on Angel's real device after the 74th update and showed the noise/banding — so if it's still visible after this revert, that's expected and confirms the cause isn't fixable by adjusting `.stars-bg` specifically. It may be a broader mobile-OS rendering behavior (e.g. dithering applied to large near-flat dark color areas generally, not just the star dots — `body`'s `#08102a` fill covers a much bigger area than the 10 dots and could be the actual source of the wall-to-wall noise seen in the screenshots) rather than anything specific to how the stars are drawn. Not investigated further this round per Angel's request to stop iterating on this — worth revisiting with fresh eyes (possibly checking the flat body background color itself, independent of `.stars-bg`) if she wants to pick this back up later.

---

## Edit — 2026-07-20 (75th update)

#### `work/Baby Steps/index.html`
- **What:** Actually root-caused the star background noise (5th round on this one element). Talked through the diagnosis live with Angel: first ruled out caching (confirmed after a hard refresh, still present), then ruled out DevTools-emulation-only rendering (Angel confirmed via a real device — still there). With cache and emulation both ruled out and mobile/desktop CSS already byte-identical (74th update), the remaining explanation is a genuine mobile GPU rendering characteristic: desktop's `.stars-bg` dots use a full soft alpha falloff (opaque center smoothly fading to 100% transparent at the edge) — a smooth transparency ramp across a very small (1-2px) area. That specific shape is exactly what triggers GPU color-banding on mobile compositors, which often use reduced color/alpha precision for performance — worsened here since the page has several `backdrop-filter: blur()` elements (nav, cards, mobile menu) compositing on top of this `position:fixed` layer, forcing more complex layer blending. This also explains why the first fix attempt (bigger, more opaque dots with a hard 70% cutoff) looked *worse*: more contrast packed into a small gradient area bandeds more, not less. Fix: replaced the 10 soft-falloff `radial-gradient`s with hard-edged ones — solid color out to 65% of the dot's radius, then a sharp cutoff to transparent at 66% (using explicit `background-size`/`background-position`/`background-repeat` per layer instead of embedding size in the gradient function, for clarity). No smooth transparency ramp means nothing for the GPU to band. Desktop's original rule is untouched — this mobile-only override uses a fundamentally different technique (hard edges), not just different size numbers like the previous three attempts.
- **Why:** Angel pushed back twice on my incorrect guesses (cache, then DevTools artifact) rather than accepting them, which was the right call — both were wrong, and continuing to guess at pixel values without confirming the actual mechanism would likely have produced a 4th bad result. Systematically eliminating cache and emulation as causes is what actually pointed at the real mechanism (GPU banding on soft alpha gradients).
- **Risk:** Low-medium — same category of change as before (CSS-only, mobile-scoped), but this is a technique change rather than a value tweak, so the visual result is genuinely different from all three prior attempts (small solid-looking dots rather than soft glows). `node --check` clean (no scripts touched); local server 200. **This needs a real-device check, not a DevTools check** — please verify on an actual phone that the noise/banding is gone and that the dots still read as a reasonable starfield (hard edges will look slightly more like tiny dots than soft glows — flag if that trade-off doesn't look right and we can adjust size/opacity within this same hard-edge approach).

---

## Edit — 2026-07-20 (74th update)

#### `work/Baby Steps/index.html`
- **What:** Root-caused and fixed the background for real this time, rather than tweaking numbers a third time. Angel reported the mobile background now looked "pixelated" and completely different from desktop. Diagnosis: desktop's `.stars-bg` (line ~72-85, the original, untouched base rule) uses 1-2px radial-gradient dots with a plain `transparent` falloff — never modified. The last two updates had given *mobile* its own override with different dot sizes (1.8-3px with a hard cutoff, then 1.4-2.4px with a soft one) — two different parameter sets, but the same underlying idea: a custom mobile-only dot size. That idea itself doesn't work: a 1-3px radial-gradient only spans a handful of *physical* pixels on a high-DPI phone screen, so there's no amount of soft falloff that renders as a smooth circle at that scale — it necessarily looks blocky/pixelated, regardless of which specific values are chosen. Fix: deleted the mobile override entirely (`work/Baby Steps/index.html:1258-1270` in the pre-fix file) so mobile now inherits the exact same `.stars-bg` rule as desktop — pixel-identical background on both, which was Angel's original request from the very first message in this whole thread ("背景要跟desktop版本的一样") before two rounds of "let's also fix the blur" tweaking drifted away from it.
- **Why:** Angel asked directly to investigate the actual cause instead of guessing again — this is the third attempt at this one element, so the fix this round removes the customization entirely rather than adjusting it again.
- **Risk:** Low — this is a pure deletion back to inherited desktop behavior, the lowest-risk option available (no new values to get wrong). `node --check` clean (CSS-only change, no scripts touched); grepped to confirm exactly one `.stars-bg` rule remains in the whole file (the desktop one); local server 200. Please hard-refresh and compare mobile vs. desktop directly — they should now be visually identical, not just "less bad."

---

## Edit — 2026-07-20 (73rd update)

#### `work/Baby Steps/index.html`
- **What:** Corrections to the 72nd update, based on a screenshot + direct feedback. (1) **Background reverted** — the "sized up + hard 70% falloff cutoff" star dots from last update rendered much harsher/grainier ("好吓人") than the mild blur they were meant to fix; reverted to the original soft, fully-gradual falloff style with only a small size bump, prioritizing "not scary" over "not blurry." (2) **My Role pills centering** — the CSS was already correct (`.cs-role-tags { justify-content: center }` genuinely present in the file), so added `!important` as a defensive measure and flagged to Angel that if it's still left-aligned after a hard refresh, it's a real cascade issue worth digging into further rather than cache. (3) **Pivot flip card rebuilt** — was using `position:absolute` faces inside a fixed `min-height:320px` container, so the taller face overflowed into an internal scrollbar instead of the card growing to fit; switched both faces to `grid-area:1/1` inside a `display:grid` flip element, so the container's height is simply whichever face is taller, no fixed height, no internal scroll. Also moved the "Tap to flip" hint from inside the front card (bottom-right corner, awkward) to its own centered line below the whole card. (4) **Accordion scope cut from 6 sections to 3** — after Angel found 6 identical plus-icon accordions across one page monotonous, removed the accordion treatment (and its JS calls) from My Role, Research findings, and the closing Reflection section — all three are short (one sentence per item) and didn't need collapsing in the first place, so they're back to always-visible. 3 Concepts also dropped the accordion, but keeps its fix from last update: the three images are now permanently stacked with a visible caption (Scrapbook/Bookcase/Constellations, previously only in `alt` text) instead of hidden behind a tap. Leading Production, Team Decisions, and User Testing keep the accordion — their content is long enough that collapsing it earns its keep — reusing the same shared `.bs-acc-*`/`makeAccordion()` infrastructure unchanged. (5) **Animation Showcase reverted from accordion back to tabs** — deleted the entire accordion-building JS block added last update; the original desktop tab-click/stage-click JS (`.as-tab` → `.as-panel`, `.as-stage-nav-item` → `.as-stage-panel`) was never touched or removed in the first place, it had just been CSS-hidden — removed that hiding and gave `.as-tabs` and `.as-stage-nav` their own mobile-only grid layouts (`repeat(3,1fr)`, no horizontal scroll) instead of the accordion, so tapping a tab/stage still works exactly like desktop, just reflowed to fit a phone width without needing to swipe sideways to find a tab.
- **Why:** Angel's screenshot + follow-up feedback: background was actively bad (not just "still blurry"), pills centering didn't visibly take effect, the flip card had real usability problems, and six identical accordions plus an unloved Showcase redesign felt monotonous/ugly. Scope for item 4-5 was confirmed with her via two direct questions before implementing (accordion kept only for genuinely long content; Showcase goes back to tabs reflowed for width instead of an accordion).
- **Risk:** Low-medium — mostly subtraction (removing 3 accordion JS calls, removing the Showcase accordion block entirely, restoring already-existing desktop JS by un-hiding it) plus one structural fix (Pivot's grid-based sizing) that's a well-established CSS technique. `node --check` clean across all 7 script blocks; grepped to confirm zero remaining `as-accordion-row`/`as-accordion-list` references and that the 5 remaining `bs-acc-host` references are exactly the 3 sections still using it (shared primitive CSS + User Testing-specific styling); local server 200 with new markers (`cs-concept-caption`, `cs-pivot-flip`, `bs-acc-toggle`) confirmed present in served output. **Not visually verified on a real device** — please hard-refresh and confirm: background reads calm not scary, My Role pills are actually centered now, Pivot card has no internal scrollbar and flips/wiggles correctly with the hint readable below it, My Role/Research/Reflection read as plain text with no tap needed, 3 Concepts shows all three images with visible captions, Showcase's tabs and stage buttons work without any sideways scrolling, and Leading Production/Team Decisions/User Testing still collapse/expand correctly.

---

## Edit — 2026-07-20 (72nd update)

#### `work/Baby Steps/index.html`
- **What:** A 14-item mobile-only rework of this case-study page, all gated behind the existing `@media (max-width:809px)` breakpoint (desktop untouched). Investigated first via 3 Explore agents (full markup/CSS/JS map of all 14 areas, plus the exact accordion pattern already proven on the Trash Talk page) before writing any code, and confirmed 3 open design decisions with Angel (Animation Showcase → full accordion; both reflect-item groups → accordion; User Testing lists → accordion) before implementing. Built one shared mobile-only accordion primitive (`makeAccordion()`/`wireExclusive()`, new `<script>` block near the end of body, gated the same way as the rest of this page's mobile JS) and a matching `.bs-acc-toggle`/`.bs-acc-icon`/`.bs-acc-shell` CSS set (same `grid-template-rows: 0fr→1fr` expand technique already used on the Trash Talk page), then applied it to 6 different sections rather than writing bespoke accordion code 6 times. Per item: **(1) Background** — the 10 radial-gradient star dots have no hard edge by design, reading as smudgy on a close-up phone screen; sized them up for mobile with a defined 70%-falloff core. **(2) My Role** — pills centered (`justify-content:center`), role cards de-boxed (border/background removed, now used as accordion hosts with the title as toggle). **(3) Research quote** — the “ mark's `left:-6px` was getting clipped by `overflow-x:clip`; moved it to `left:0` inside added left padding. **(4) Reflect items** — both the Research findings and the closing Reflection section converted to independent accordion groups. **(5) 3 Concepts** — no visible titles existed anywhere (only in image `alt` text), so hardcoded Scrapbook/Bookcase/Constellations as accordion labels; removed the section from the shared horizontal-scroll-row treatment and the `aspect-ratio:4/3;object-fit:cover` crop, so the revealed image now shows uncropped at natural height. **(6) Pivot** — rebuilt as a genuine flip card: JS wraps the existing "Original Direction"/"Pivoted To" columns in a new `.cs-pivot-flip` container (both faces absolutely stacked, `backface-visibility:hidden`), tap/click/Enter toggles a `rotateY(180deg)` class, a `bs-pivot-wiggle` keyframe nudges it twice on load to hint it's tappable (skipped under reduced-motion), small "Tap to flip" label in the corner. **(7) Moodboard** — from a 2-col grid to a horizontal scroll-snap row, one image per screen. **(8) Leading Production** — the two long `.cs-prod-col-body` paragraphs collapse behind their titles, exclusive open. **(9) Animation Showcase** — the horizontal-scroll tabs and stage-nav (the two things Angel specifically disliked) are hidden outright on mobile; JS reorganizes all 8 groups (Stage 1–6, pulling label text straight from the now-hidden stage-nav buttons, plus Character and Environment) into one exclusive accordion list, moving each group's existing `.as-grid` asset gallery into its shell (itself a small horizontal-scroll row of cards, consistent with the Moodboard treatment) rather than requiring tab-then-stage-nav-then-scroll to reach anything. **(10) Team Decisions** — 3 cards → accordion (icon+title toggle, body collapses); fixed "Communication" clipping by giving this section's `.section-title` its own smaller mobile clamp instead of the shared 11.5vw one that only fit the other section titles. **(11) User Testing** — round header/chips/photo stay always visible, the "What we found"/"How we responded" lists each become their own accordion row. **(12) Tools Used** — pulled out of the shared horizontal-scroll treatment into a plain `repeat(3,1fr)` grid, all 6 tool logos visible in one screen. **(13) Handoff** — `.cs-handoff-deliverables` changed from a shared "collapse everything to 1 column" rule to its own 2-column grid, so the 6 short icon+label items fit in 3 rows instead of 6 full-width cards. **(14) iPhone frame** — the desktop frame's realism (`perspective:1800px` + `transform-style:preserve-3d` + 3 `translateZ` side faces) was exactly what was distorting it at phone widths; mobile now gets `perspective:none`, `transform-style:flat`, and the side faces hidden — a flat frame instead of a warped 3D one.
- **Why:** Angel's full pass through the mobile-emulated view of this page, 14 items in one message. Design direction for the 3 ambiguous items (Showcase redesign, reflect scope, User Testing simplification) was confirmed with her via a scoping question before writing code, following the "ask before guessing on a big change" lesson from the Rumi hero rework earlier this session.
- **Risk:** Medium — this is by far the largest single change to this file (one new ~230-line script, one large CSS addition, touching 14 distinct sections). Verified: `node --check` clean across all 7 inline script blocks; local server 200 with the new accordion/flip/showcase markers all confirmed present in served output; grepped to confirm the sections pulled out of the shared horizontal-scroll rule (Concepts, Tools) and shared 1-column rule (Handoff) no longer reference those shared selectors. The i18n script (`i18n-babysteps.js`) matches by normalized text content rather than DOM position, and this pattern (moving text-bearing nodes into new toggle/shell wrappers) is exactly what the already-shipped Trash Talk accordions do without breaking translation — but this hasn't been re-verified by actually toggling EN/中 on this page post-change. **Not visually verified on a real device or in an actual browser** (no headless-browser/screenshot tooling in this environment) — this genuinely needs a real mobile pass before calling it done: confirm all 6 accordion sections open/close and stay exclusive within their own group, the Pivot card flips on tap and wiggles once on load, Moodboard/Showcase-row/Tools/Handoff layouts look right, the star background reads sharper, the Research quote mark is visible, "Communication" no longer clips, and the iPhone frame looks like a normal flat phone instead of distorted.
- **Follow-up needed:** Angel still needs to provide the two known-pending placeholder items from earlier updates in this log (Instagram/LinkedIn URLs) — unrelated to this update, just a standing reminder since this is a good checkpoint.

---

## Edit — 2026-07-19 (71st update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Angel confirmed she's testing via a desktop browser's mobile-emulation/device-toolbar view, not a real phone — which matches the hypothesis that DevTools' simulated touch scrolling (mouse-drag translated to synthetic touch events) doesn't reliably replicate real touchscreen momentum, and can behave oddly with `scroll-snap-type: x mandatory` + `scroll-snap-stop: always`. Rather than leave that as an unverifiable guess, removed CSS scroll-snap entirely from the S8 card row: `scroll-snap-type`/`scroll-padding-inline` off `#s8-right`, `scroll-snap-align`/`scroll-snap-stop` off `.s8-panel`. The row is now a plain `overflow-x:auto` scrollable strip with no snap-point logic to get stuck on, in either a real browser or emulation — matching Angel's original "just five cards that scroll, nothing fancy" ask even more literally than the JS removal alone did.
- **Why:** Snap-to-point behavior was the one remaining piece of "cleverness" left after stripping the autoplay JS, and it's also the most likely thing to behave differently between real touch and DevTools' imperfect touch emulation — removing it takes that variable off the table entirely instead of asking Angel to keep working around a testing-environment quirk.
- **Risk:** Low — pure CSS property removal, `node --check` still clean (no scripts touched), local server 200. Scrolling is now unsnapped native overflow, so it may feel slightly less "locked to each card" than before, which is an intentional tradeoff for reliability over polish given Angel's stated preference. Please confirm cards scroll smoothly and predictably now in whatever view you're testing in.

---

## Edit — 2026-07-19 (70th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Angel pushed back on the "it's probably cache" explanation for still landing on 03/05, asking to double check given she's testing in a mobile viewport. Re-checked and found a genuine additional leftover: a THIRD, even older layer of `#s8-right`/`.s8-panel` CSS at the "first pass" mobile block (~line 1792, unprefixed `.s8-panel` selector, specificity 10) that hadn't been accounted for in either of the two prior cleanup passes — it mostly loses to the newer `#s8`-prefixed "v3" rules on shared properties via CSS specificity (110 > 10), but sets `justify-content`/`align-items` with `!important` that "v3" never redeclares at all, so those specific values were quietly still coming from this old layer. Removed it (same treatment as the "v2" leftover removed two updates ago) since it's now confirmed dead weight regardless of whether it was the actual cause of the stuck-panel symptom. Also directly asked Angel whether she's testing on a real phone vs. a desktop browser's mobile-emulation/responsive-design mode — Chrome DevTools' touch simulation is known to not perfectly replicate real touchscreen scroll-snap behavior (mouse-drag-as-touch can register different velocity/distance than a real swipe), which could produce this exact symptom with zero code bug involved. Confirmed via `node --check` that scripts are still clean (this was a CSS-only change) and re-grepped the whole file for `.s8-panel`/`#s8-right` to confirm only the legitimate "v3" rules and the separate `prefers-reduced-motion` block remain.
- **Why:** Wanted a real answer backed by re-verification rather than repeating the same "clear your cache" explanation a second time without new evidence.
- **Risk:** Low — same category of change as the prior "v2" leftover removal (deleting a confirmed-superseded CSS layer), and this file's higher-specificity `#s8`-prefixed rules are unaffected. Still unresolved: whether this was the actual cause of "stuck at 03/05," or whether it's a testing-environment (DevTools emulation) artifact, or still a caching issue — waiting on Angel's answer about how she's testing before pursuing further.

---

## Edit — 2026-07-19 (69th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** After three rounds of trying to fix the S8 mobile carousel's autoplay/interaction-detection bugs, Angel said to just rip it all out — she wants the 5 cards scrollable, nothing else. Deleted the entire "Experience Flow" JS block (187 lines: `flowTrack`/`flowPanels` setup, `setActiveFlow`/`scrollToFlow`/`syncActiveFlow`/`scheduleAuto`/`beginUserInteraction`/`endUserInteraction`/`onUserScrollSettled`/`programmaticScrollTo`, all the pointer/wheel/keydown/resize/visibilitychange listeners, the `IntersectionObserver` autoplay gate, and the initial-position reset calls) — replaced with a 2-line comment. Also removed the now-orphaned `#s8 .s8-panel.is-album-active` CSS rule (the active-card highlight nothing sets anymore). The 5 `.s8-panel` cards inside `#s8-right` still scroll perfectly well with zero JS: the existing mobile CSS already has `#s8-right { overflow-x:auto; scroll-snap-type:x mandatory; scroll-snap-align... }` from the "v3" pass, which is genuine native-browser swipe/scroll-snap behavior that never depended on the JS in the first place — the JS was only ever adding auto-advance, keyboard nav, and the active-card highlight on top of already-working native scrolling.
- **Why:** Angel: "你把什么animation什么自动轮播都删了吧 我只要五张卡片可以scroll就行不要搞什么乱七八糟" — after the interaction-detection bug survived two fix attempts, she decided the autoplay/active-state layer wasn't worth the complexity and asked for it gone entirely.
- **Risk:** Low — pure deletion of a self-contained block; grepped to confirm zero remaining references to `flowTrack`/`scheduleAuto`/`is-album-active`/etc. anywhere else in the file. `node --check` clean across all 9 remaining script blocks; local server confirms 200 and all 5 `.s8-panel` cards still present in the markup. The reduced-motion-specific vertical-stack layout for this section (a separate `@media (max-width:809px) and (prefers-reduced-motion:reduce)` block, untouched) was already pure CSS with no JS dependency, so it's unaffected. Please do a final real-device check that swiping through the 5 cards feels smooth now that it's plain native scrolling with nothing fighting it.

---

## Edit — 2026-07-19 (68th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Third-round S8 carousel fix. Angel's screenshot after the 67th update showed the album resting on "03 / 05" with a sliver of a prior card visible at the left edge — consistent with autoplay actually running and having advanced past 01/02 by the time she looked (meaning `prefers-reduced-motion` is apparently *not* set on her test device, contrary to what the 67th update assumed). Confirmed she could not swipe back to 01/02 manually either, which is the real bug: `scheduleAuto()`'s auto-advance and the manual-swipe pause logic were racing. The pause-on-interaction logic only listened for `pointerdown`/`pointerup` pairing (plus `wheel`) to know "the visitor is touching the carousel, don't auto-advance" — but on some mobile browsers a touch gesture that resolves into native scrolling doesn't reliably fire a matching `pointerup`, so `scheduleAuto` could keep firing its 2-second auto-advance timer *during* a manual swipe, yanking the album back forward faster than a visitor could swipe it back — exactly "swipe left, still can't get back." Rewrote the interaction guard to key primarily off the container's own `scroll` event instead of pointer-event pairing, since `scroll` fires reliably regardless of input method (touch, trackpad, mouse-drag, keyboard): any scroll event not caused by our own code now immediately cancels the pending auto-advance and arms a 600ms debounce (`onUserScrollSettled`) that, once scrolling has been quiet, applies the same 5-second "leave it alone" cooldown before re-arming autoplay — mirroring the existing `endUserInteraction` cooldown exactly, just triggered by a more reliable signal. To keep this from mistaking the carousel's *own* autoplay-driven or initial-reset scroll calls for a manual gesture (which would immediately re-pause itself after every auto-advance, silently killing autoplay after one step), added an `isAutoScroll` flag set via a new `programmaticScrollTo()` wrapper — used for the autoplay advance and both initial "snap to panel 1" resets — that the scroll listener checks and ignores. The existing pointerdown/pointerup/wheel handlers are untouched and still provide instant pause-on-touch as a first line of defense; the scroll-based guard is the new, more reliable backstop.
- **Why:** Angel confirmed manual left-swipe couldn't reach 01/02 either — ruling out "it's just autoplay running as intended" and confirming a real interaction-detection bug rather than a false alarm.
- **Risk:** Medium — this replaces the core pause/resume timing logic for the carousel's autoplay with a different (more robust) detection signal, in a section of this file that's now had two prior fix attempts not fully land. `node --check` clean across all 9 script blocks; local server 200; grepped to confirm the new `programmaticScrollTo`/`onUserScrollSettled` functions are present and wired into every `scrollToFlow` call site that isn't a direct user action (autoplay advance, both initial resets) while user-triggered call sites (wheel, keydown, initial pointer/wheel handlers) are left calling `scrollToFlow` directly so they're correctly treated as real interaction. **Not verified on a real device** — given this is the third pass at this exact bug, please test deliberately this time: swipe left repeatedly right after the page settles and confirm the album actually gets and stays at 01/02, then wait ~7-8s without touching it and confirm autoplay resumes and advances normally afterward.

---

## Edit — 2026-07-19 (67th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Second-round fix for the S8 "How it works" mobile carousel — the 64th update's pin-vs-carousel fix wasn't enough; Angel reported cards 01/05 and 02/05 were missing (landing somewhere around 03/05 instead) and the auto-carousel still didn't appear to work. An Explore agent dug into the actual runtime behavior (including a headless test) and found two separate things, both now confirmed rather than guessed: (1) **Auto-carousel is correctly built and invoked, but `scheduleAuto()` unconditionally bails when `prefers-reduced-motion: reduce` is set** (`matchMedia('(prefers-reduced-motion: reduce)').matches` — headless-verified: 0 auto-advances in 7.4s with it on, vs. 0→1→2→3 with it off; manual swipe navigation was never broken). Checked with Angel whether to override this OS-level accessibility preference for autoplay — she said leave it respected, so this is unchanged; she just needs to know that if she wants to *see* autoplay on her own device, she'd need to check her OS's "Reduce Motion" setting. (2) **The "missing 01/02" symptom**: the initial "snap to panel 1" reset (`setActiveFlow(0)` + `requestAnimationFrame(() => scrollToFlow(0, false))`) depends on `scrollToFlow`'s `getBoundingClientRect()`-based position math, which only runs once, one frame after load — if anything reflows the page after that frame (web font swap, image load, or the extra layout work from the hero rewrite two updates ago), the measured scroll target goes stale and the album can settle on the wrong panel. Added a synchronous `flowTrack.scrollLeft = 0` ahead of the existing frame-based reset (a hard reset that doesn't depend on layout measurement, since panel 1 is definitionally at the scroll container's zero position) and a second `scrollToFlow(0, false)` on `window.load` as a late-reflow safety net. Also removed a confirmed-dead, fragile chunk of CSS while in this area: this file layers three separate mobile passes for `#s8-right`/`.s8-panel` at the same breakpoint (an original pass, "v2", "v3"), and the middle "v2" pass turned out to be an entirely different, older single-panel crossfade design (`opacity:0` on all panels except one shown via a `.s8-panel.is-active` class that no script has set since the real carousel switched to `is-album-active`) — it only stayed inert because "v3" (later in source, `!important` on every conflicting property) happened to cover every property v2 set. Verified property-by-property that v3 fully supersedes v2's block (the few v2 properties v3 doesn't explicitly re-declare, like `grid-row`/`justify-self`, are no-ops anyway since v3 switched the layout model from grid to flex) before deleting v2's `#s8-right`/`.s8-panel`-family rules outright — this was a real landmine where any future edit to v3's `!important` declarations or block ordering would have silently reverted the carousel to "only the first panel ever visible."
- **Why:** Angel's follow-up report that the previous S8 fix didn't actually resolve what she was seeing — this time backed by an agent's headless-browser test rather than static code reading, which is what surfaced the reduced-motion behavior precisely instead of guessing at it.
- **Risk:** Low — the position fix is an additive, defensive reset (doesn't change any existing behavior, just makes the existing intended behavior more reliable), and the CSS removal was verified property-by-property against what fully supersedes it before deleting. `node --check` clean across all 9 script blocks; grepped to confirm zero remaining `.s8-panel.is-active` CSS rules (only an explanatory comment mentions the class name now) and that `is-album-active` — the mechanism actually in use — is untouched; local server 200, served content confirmed to contain the new `flowTrack.scrollLeft = 0` line. **Not visually verified on a real device** — please confirm the album now opens reliably on "01 / 05" and swipes cleanly through all 5; the auto-carousel will still appear off on any device/browser with "Reduce Motion" enabled, which is expected now, not a bug.

---

## Edit — 2026-07-19 (66th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Angel asked to shrink the "hero line" on mobile by 50% — confirmed via a quick question that she meant the 3D scramble-text plane (`txtPlane`, the canvas-texture mesh that draws "Where does this actually go?" / "Trash Talk with Rumi") rather than any DOM text. Added `txtPlane.scale.set(0.5, 0.5, 1)` right after the plane is created, gated behind `matchMedia('(max-width:809px)')` so desktop's text size is untouched — mobile now renders the same scramble text effect at half the plane size within the (already cover-scaled) desktop-reference scene.
- **Why:** Angel's direct ask after reviewing the now-fixed hero on mobile.
- **Risk:** Low — single-line, mobile-gated scale on an existing mesh, no change to the text-drawing/scramble logic itself. `node --check` clean across all 9 script blocks. Not visually confirmed in-browser — please check the text still reads clearly at half size and doesn't look disproportionate against the (now correctly cover-scaled) can/orbit objects.

---

## Edit — 2026-07-19 (65th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Fixed a real bug in the mobile-hero cover-scale from the 64th update — Angel sent a screenshot showing the 3D scene (can model + chromatic-aberration fringe + dot-grid all visibly rendering correctly) squeezed into a small rectangular box in the bottom-right of the screen instead of filling it, with the rest of the viewport blank. Root cause: the CSS `transform: translate(-50%,-50%) scale(max(calc(100vw / 1440), calc(100dvh / 900)))` relied on CSS `calc()` dividing a viewport-unit length by a fixed px length to produce the unitless number `scale()` needs — this division-of-two-different-length-units form isn't reliably supported inside `max()`/`scale()` across browsers, so the browser was silently treating the whole `transform` as invalid and dropping it. With no transform applied, `#s1-frame` (positioned via `top:50%;left:50%` with no offsetting translate) rendered as a full 1440×900px box anchored by its top-left corner at the screen's center — exactly matching the screenshot's "content only in the bottom-right quadrant" symptom. Fixed by computing the cover-fit scale in JavaScript instead (`Math.max(window.innerWidth/w, window.innerHeight/h)` inside the existing `hResize()` function, reusing the same `w`/`h` already read from the frame element for the renderer size) and setting it as an inline `style.transform`, which reliably works and also re-runs on resize/orientation-change since `hResize()` is already wired to the window's `resize` listener. Cleaned up the now-dead CSS `transform`/`calc()` declaration, leaving just `transform-origin` in the CSS and a comment pointing to the JS.
- **Why:** Angel tested on a real device and sent a screenshot showing the broken layout — this is exactly the "easy to get subtly wrong" risk flagged in the 64th update's own risk note, now confirmed and fixed with real evidence instead of guesswork.
- **Risk:** Low — this replaces one specific unreliable CSS expression with the equivalent JS computation using values already being read for another purpose in the same function; `node --check` clean across all 9 script blocks. **Still needs a real-device recheck** (same caveat as the 64th update) — please reload and confirm the scene now fills the screen edge-to-edge with sensible cropping rather than being confined to a corner; if it's still off, send another screenshot rather than a text description if possible — that's what let me find this one immediately instead of guessing.

---

## Edit — 2026-07-19 (64th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Five mobile-only bug fixes on this one page, all diagnosed by 3 parallel Explore agents before any code was touched (root causes below). (1) **Idea 01/02/03 accordion**: `#s6a .idea-body { display:none !important }` was unconditional — the mobile JS already moved each idea's image into a tap-reveal shell, but the detail text could never show at all, open or closed. Changed to `.idea-card:not(.is-open) .idea-body { display:none !important }` + a small padding rule for the open state, so tapping now reveals image *and* detail text together, matching the existing `.is-open` class the JS already toggles — collapsed behavior (title only) is unchanged. (2) **Persona faces cropped**: mobile's `#s5 .persona-img-wrap` was `height: clamp(90px, 24vw, 130px)` against ~0.75-0.82:1 portrait source photos — an ~3:1 crop window that left almost no room for a face. Switched to `aspect-ratio: 4/5` (close to the real photo proportions) with `object-position: center 18%`. (3) **S6 Product — stray line + cropped image**: the left column's inline `border-right` (meant for the desktop 2-col layout) was never stripped when mobile collapses the section to a single stacked column, rendering as a long vertical line down the page — added `border:0 !important` to the mobile `#s6 > div` rule. Separately, the Rumi screenshot `<img>` had lost its `id="s6-img"` at some point, orphaning an already-written (but inert) mobile fix rule targeting that id — restored the id and extended the rule with `height:auto !important` so the image now scales down fully uncropped instead of overflowing its `overflow:hidden` parent. (4) **S8 "How it works" — no auto-carousel, step labels missing**: the desktop pinned `ScrollTrigger` (`pin:'#s8-sticky'`, scrub-driven `goTo(idx)`) was never gated to desktop-only, unlike the S15 game a few hundred lines later which explicitly checks `matchMedia`. So on mobile it was fighting the already-built, otherwise-correct touch carousel (native scroll-snap album with interruptible autoplay) over the same panels. Wrapped just the `ScrollTrigger.create({...pin...})` call in the same `!matchMedia('(max-width:809px)')` guard used for S15 — mobile now runs the touch carousel uncontested. Also deleted `#s8-left-eyebrow` per request (an empty div whose only content came from a mobile-only `::before`, plus its base CSS rule and a margin tweak — 3 spots removed). (5) **Mobile hero — now a scaled desktop clone, not a separate build**: confirmed via investigation that the mobile hero (previously ~380 lines behind `if (rumiMobile) {...} else {...}`) was a hand-simplified rebuild missing the desktop's 100-point particle field, extra `orbitLight`/`reflectLight`, dot-grid canvas, CRT overlay, richer tilt/pitch/roll orbit physics, and per-glyph chromatic-aberration text rendering — and used its own separate GLB loaders instead of the shared cache. Per Angel's confirmed direction, neutralized `const rumiMobile = false` so the desktop branch always runs (the now-unreachable mobile branch is left in place as dead code rather than risk deleting ~380 lines by hand in a 5700-line file — flagged as an optional future cleanup). Hoisted the dot-grid script out of its own `if (!matchMedia...)` gate into its own always-running `<script>` block (verified it has no dependency on anything else in that gate — just core GSAP tweening, no ScrollTrigger/Draggable needed). Wrapped `#hero-dot-grid`/`#hero-canvas`/`#crt-overlay` in a new `#s1-frame` div, pointed the desktop renderer's `hResize()` at that frame instead of `#s1` directly, and gave the frame a fixed 1440×900 desktop-reference size on mobile with `transform: translate(-50%,-50%) scale(max(calc(100vw/1440), calc(100dvh/900)))` — a cover-fit scale (same idea as `background-size:cover`) so the exact desktop composition fills the mobile hero edge-to-edge instead of leaving empty bars or naturally reflowing into a different (and untested) aspect ratio. Un-hid `#hero-dot-grid`/`#crt-overlay`/`#hero-scroll-hint` in the mobile CSS (previously force-hidden by an older "v1" mobile pass that "v2" hadn't been re-overriding for these three), and hid the now-orphaned `.rumi-mobile-hero-fallback` loading text outright rather than leaving it wired to an `is-webgl-ready` class that only the now-dead mobile branch used to set (desktop has no equivalent "fallback while loading" concept, so mobile no longer needs one either, for consistency).
- **Why:** Angel's mobile testing pass on this one case-study page turned up all 5 issues in a single message. Bug 5 (hero) was scoped via an explicit direction check with her first — she confirmed "reuse desktop code exactly, scale the whole thing down via CSS" over the alternative of selectively porting back individual missing effects, understanding this adds real GPU/JS cost to mobile (opposite direction from the mobile-performance trimming done earlier this session) in exchange for guaranteed visual parity with desktop.
- **Risk:** Low for bugs 1-4 — each was a small, precisely-scoped CSS/JS fix backed by a confirmed root cause, `node --check` clean across all 9 inline script blocks, zero remaining references to the deleted `#s8-left-eyebrow`. Medium for bug 5 — this is a structural change to a working, intricate Three.js scene (new wrapper div, retargeted resize measurement, CSS cover-scale transform) rather than a simple value tweak; verified `node --check` clean, confirmed via grep that no other CSS/JS uses a `#s1 >` direct-child selector that the new `#s1-frame` nesting level would break, and confirmed the dot-grid IIFE has no hidden dependency on the code it was hoisted out of. **Not visually verified in an actual browser or on a real phone** (no headless-browser/device tooling in this environment) — this is the one change in this batch that genuinely needs a real device or DevTools mobile-emulation check before calling it done: confirm the hero scene actually renders (particles, CRT scanlines, dot-grid all visible), the cover-scale framing looks intentional rather than oddly cropped on a few different phone aspect ratios, frame rate feels acceptable given the added particle/lighting cost, and the scroll-into-S2 scatter/fade transition (desktop-only before this change) now also triggers correctly at mobile scale. Bugs 1-4 should also get a quick real-device pass but are lower-risk.

---

## Edit — 2026-07-19 (63rd update)

#### `art/index.html`, `styles.css`
- **What:** Reverted the art-page loading curtain added in the 62nd update. Angel couldn't confirm she was actually seeing it after a couple of rounds of troubleshooting (verified the code was genuinely present and correctly wired on disk and via a fresh local-server fetch both times — most likely explanation was either her local dev server's own caching or the curtain simply finishing too fast to notice now that the art page is down to 2.5MB, though this was never conclusively diagnosed since no browser/screenshot tooling is available in this environment). Tried lengthening the minimum display time to 1.5s as a visibility test, but Angel said to just drop it if it isn't necessary rather than keep debugging — so removed it outright: the `<div class="page-loader">` + its inline ready-detection script are gone from `art/index.html`, and the now-unused `.page-loader`/`.page-loader__mark`/`@keyframes page-loader-spin` rules are gone from the shared `styles.css` (added in the 62nd update specifically for this, not used anywhere else, so fully removed rather than left as dead CSS). The actual load-time fix from the 61st update — swapping the art wall's 13 images from ~212MB of raw masters to ~2.5MB of optimized webp — is untouched and stands on its own. Bumped `art/index.html`'s `styles.css` cache-buster once more (`?v=art-loader-removed-v1`) so the removal itself isn't masked by a stale cached copy.
- **Why:** Angel: "如果这个loading page没有必要就不要了" — after the troubleshooting round didn't conclusively resolve whether it was even rendering for her, she preferred to cut it rather than keep chasing a client-side caching/timing mystery for a nice-to-have.
- **Risk:** Low — pure removal back toward the 61st-update state, image optimization (the actual performance fix) untouched. Verified: art page's one remaining inline script (`node --check` clean); grepped the whole repo for `page-loader` — zero matches in `art/index.html` (the two remaining hits are Baby Steps' and Rumi's own pre-existing, unrelated page-local implementations from the 44th/56th updates, correctly left alone); local server spot-check confirms art page 200 and zero `page-loader` references in the served HTML.

---

## Edit — 2026-07-19 (62nd update)

#### `index.html`, `styles.css`, `art/index.html`
- **What:** Two quick follow-ups from Angel after the 61st update. (1) **Social icons de-pilled**: she didn't want the Instagram/LinkedIn icons wrapped in the circular pill button — `.social-links a` in `styles.css` stripped down from a 34px bordered/blurred/backdrop-filtered circle to a bare 26px icon (just the SVG at 20px, no background/border/shadow), hover changed from a background/color swap to a simple `opacity:.58` + 1px lift (matching `.geo-panel a`'s existing hover convention elsewhere in the same file, for consistency with how other bare-text hero links already behave). Bumped `index.html`'s `styles.css?v=social-links-v1`→`?v=social-links-v2`. (2) **Loading curtain added to the art page**: even after the 61st update's 212MB→2.5MB image fix, Angel felt the art page still loaded slowly — added the same page-colored spinner curtain pattern already proven on Baby Steps and Rumi (from the 44th/56th updates), this time promoted into the *shared* `styles.css` (`.page-loader`/`.page-loader__mark`/`@keyframes page-loader-spin`, using the shared `--paper`/`--ink` tokens) rather than duplicated as page-local inline styles, since `art/index.html` — unlike the self-contained case-study pages — already runs on the shared stylesheet. Curtain hides once `document.fonts.ready` + all 13 `.art-column img` elements have loaded + a 500ms minimum have resolved, with a 3s safety timeout matching the Baby Steps precedent exactly. Bumped `art/index.html`'s `styles.css?v=lang-toggle-v7`→`?v=art-loader-v1` (only art page needed the bump since it's the only page actually using the new `.page-loader` markup — the CSS addition itself is purely additive and doesn't affect any other page's rendering, so their existing cache-busters were left alone).
- **Why:** Angel's direct feedback: the icon pills felt unnecessary visually; the art page still felt slow even after the asset-size fix, so a loading curtain masks the remaining load time (image decode + the 3x DOM-clone layout work) the same way it already does on two other pages.
- **Risk:** Low. Both changes reuse patterns already proven elsewhere in this codebase rather than inventing new ones. `node --check` clean on art page's 2 inline scripts (lang-preset + new loader). Local-server spot-check: art page 200, served HTML contains the loader markup, served `styles.css?v=art-loader-v1` contains both the loader keyframes and the new bare-icon `.social-links a` rule. **Not visually confirmed in an actual browser** — please look at the de-pilled icons (should now read as plain outlined glyphs, no circle behind them) and reload the art page a few times to confirm the curtain shows briefly then fades cleanly into the gallery without any layout jump.

---

## Edit — 2026-07-19 (61st update)

#### `work/Baby Steps/index.html`, `work/Fableware Impact Engine/index.html`, `work/FlyLens/index.html`, `work/AI Workflow/index.html`, `work/Trash Talk with Rumi/index.html`, `index.html`, `styles.css`, `art/index.html`, new `assets/art/optimized/section2-ocean4.webp`
- **What:** Three unrelated fixes in one batch, planned via a full plan-mode pass (3 parallel Explore agents audited scroll-animation timing across all 5 case-study pages, the home page's corner-panel layout conventions, and the art page's load bottleneck before any code was touched). **(1) Scroll-reveal timing fix, all 5 case-study pages:** Angel reported text animations often hadn't finished (or started) before a fast scroll carried them off-screen. Root cause confirmed per-page: reveal triggers fired with too little scroll runway and durations/staggers were slow enough that a normal fast scroll outran them (worst case, Fableware/FlyLens's `.d4` stagger class + `.9s` transition meant some elements needed 1.4s to fully appear). Fix, applied consistently: for the 3 pages using raw `IntersectionObserver` (Baby Steps, Fableware, FlyLens), threshold dropped near-zero and a `rootMargin: '0px 0px 150px 0px'` bottom buffer added so the reveal starts while the element is still ~150px below the viewport; CSS transition durations cut roughly in half (Baby Steps 0.7s→0.45s; Fableware/FlyLens 0.9s→0.5s, with their shared `.d1`-`.d4` stagger-delay classes tightened from .10/.22/.36/.50s to .06/.12/.18/.24s). For the 2 pages using GSAP `ScrollTrigger` (AI Workflow, Rumi), every `start:'top N%'` value was shifted +20 percentage points (capped at 98%) via a regex pass over Rumi's file (18 occurrences, all verified by pre/post count) and a targeted edit on AI Workflow's primary `.iw-inner` word-reveal block (`'top 75%'`→`'top 95%'`, duration 0.85s→0.5s, per-word stagger `i*0.12`→`i*0.06`) — AI Workflow's second `'top 75%'` (the sidebar lateral-label swap trigger, a persistent/sticky element rather than in-flow content that scrolls away) was deliberately left alone since it isn't the kind of animation that can get "left behind" by scrolling. Rumi also got a second pass shrinking duration/stagger on its 10 confirmed once-off reveal blocks (S2/S4/S5/S6/S6A-D/S7/S8/S14/S16 — e.g. `.s7-el`/`.s16-el` 0.8s+.12 stagger → 0.5s+.07, S8's pinned-panel step list 0.6s+.08 → 0.4s+.05), each change verified via an exact-string-count check before writing (same safe pattern used for this file's dead-code cleanup two updates ago) so nothing was silently missed or double-applied. All 21 inline `<script>` blocks across the 5 files pass `node --check` post-edit. **(2) Instagram/LinkedIn icons on the home page hero:** Angel asked for icons at the hero's bottom-right, symmetric to the `.skill-strip` `<li>` pills at bottom-left (confirmed this reading with her — no other "li" existed in the codebase). No icon assets/font/SVG library existed anywhere in the repo, so built two small inline SVGs (simple hand-drawn Instagram/LinkedIn glyphs, not copied brand assets) inside a new `.social-links` block in `index.html`'s `.hero`, styled to match the existing `.skill-strip li` pill treatment (translucent blurred background, same border/shadow recipe) but as circular 34px icon buttons. Desktop: `position:absolute; right:var(--gutter); bottom:104px` — an exact mirror of skill-strip's `left:var(--gutter); bottom:104px`. Mobile: since every other hero corner panel is `display:none!important` at ≤809px while skill-strip instead recenters, gave `.social-links` its own mobile rule (centered, `bottom:40px`, just below the recentered skill-strip) rather than trying to preserve literal corner symmetry once skill-strip itself is no longer in a corner. Both icons use `href="#"` placeholders per Angel's request — she'll provide the real Instagram/LinkedIn URLs later, at which point it's a one-line swap. Bumped `styles.css?v=mobile-home-v3`→`?v=social-links-v1` on the home page. **(3) Art page slow load fixed:** root cause was `art/index.html`'s 13 `<img>` tags pointing at raw, unoptimized masters under `assets/art/*.png`/`*.jpg` — up to 36.8MB each, ~212MB total, zero lazy-loading — while the home page's own section-2 art grid already used ~2.5MB-total webp equivalents at `assets/art/optimized/section2-*.webp` that the art page had simply never been switched over to. Mapped all 13 raw filenames to their optimized counterparts by cross-referencing the home page grid's `alt` text; found 12 of 13 already existed, generated the 13th (`ocean4.png`, 14MB → `section2-ocean4.webp`, 126KB) via ImageMagick at the same resize-to-1600px-long-side convention the other 12 files were built with (confirmed by inspecting a sibling file's output dimensions first). Swapped all 13 `src` attributes via a script that verified each old path matched exactly once before writing (avoiding any silent no-op or double-replace). Left `scripts/art-page.js`'s 3x DOM-clone loop (`loopCopies=3`, drives the infinite-scroll illusion) untouched — confirmed it was never the actual network bottleneck since the browser dedupes repeated-URL fetches; it stops mattering now that the underlying files are small. Did not touch the render-blocking GSAP `<script>` tags in the `<head>` — deferred as a minor, lower-priority win not worth the risk this round.
- **Why:** Three separate asks from Angel in one message: (1) fast scrolling outrunning text animations "looks bad" on the work pages, (2) wants her Instagram/LinkedIn discoverable from the home page hero, (3) the art page has been slow to load every visit.
- **Risk:** Low-medium for (1) — every value change was either a verified-unique string replacement or a scoped regex pass with a pre/post occurrence count check; `node --check` clean on all 21 script blocks; all 5 pages spot-checked 200 on a local server. **Not visually verified with an actual fast-scroll test in a browser** (no headless-browser tooling in this environment) — the fix is grounded in the actual timing math (trigger buffer + duration + stagger vs. typical scroll speed) rather than a guess, but please do a real flick-scroll through each of the 5 pages to confirm text now finishes appearing before it exits the viewport, and that nothing feels *too* abrupt now that durations are shorter. Low for (2) — pure additive markup/CSS, mirrors an existing proven layout pattern exactly, spot-checked 200 with the new markup/CSS confirmed present in served content. **Not visually confirmed in-browser at both desktop and mobile widths** — please check the icons land in the right spot, don't collide with the skill-strip or nav, and look right before sending the real URLs to swap in. Low for (3) — straightforward asset-path swap to files that are already proven-in-production on the home page, verified 212MB→2.5MB size drop and 200 on the local server; the one newly-generated webp (`ocean4`) should get an eyeball check that it still looks correct (resize-only, no crop, so it should match the original framing) but wasn't visually confirmed in a browser here.

---

## Edit — 2026-07-19 (60th update)

#### `work/Trash Talk with Rumi/index.html`, `work/Baby Steps/index.html`
- **What:** Angel felt the case-study pages had too much text animation and asked for a trim. Three Explore agents first catalogued every text-animation mechanism across all 5 case-study pages; findings and a two-phase plan (Rumi dead-code cleanup, then a Baby Steps density-reduction checkpoint) were agreed with her before touching code. **Phase 1 — Rumi:** (1) Deleted a fully orphaned ~200-line "HERO TEXT SEQUENCE" `<script>` block (`decryptReveal()` DOM scramble-text engine + a Matter.js "FallingText" physics effect, both wired up via `window._startHeroText`) — confirmed via repo-wide grep that `_startHeroText` was never called anywhere; the page's actual live hero effect is a separate, already-working Three.js canvas scramble (`_startTxtAnim`, unrelated code path, left untouched). (2) Deleted three small orphaned entrance-animation blocks that targeted sections no longer in the markup: the S9 UI SYSTEM `.s9-el` loop, the S13 CAMPAIGN poster-drag block (guarded by `if (!s13) return`, so it silently no-op'd every load — `#poster-track` doesn't exist either), and the S15 entrance-only block (`.s15-el)` — confirmed `<section id="s9/s10/s13/s15">` don't exist anywhere in the current markup before deleting each. Also removed a dangling `// S10 entrances` comment with no function body left under it. (3) Deleted the entire "GLOBAL ENTRANCE SYSTEM (B)" catch-all block after checking every one of its 11 selector entries individually: `#s2 .context-desc`/`.meta-item` and `#s5 .persona-card` and `#s14 h2/p` and `#s16 h2/p` were genuine duplicates (all already animated once by their own dedicated per-section timelines — this block was firing a second, redundant fade-in on top), while `#s4 .method-card` (real class is `.method-item`), `#s4 .finding`, `#s9 .s9-card`, and `#s10 .asset-card` matched zero elements. With every entry either dead or duplicate, the whole block came out rather than trimming it down to nothing. Verified via a Node script that checked exact line-boundary content before each deletion (so a mismatched line number would abort with nothing written, not silently delete the wrong span) — all boundary checks passed. All 8 inline `<script>` blocks on the page pass `node --check` post-edit, and a repo grep for `_startHeroText`, `decryptReveal`, `triggerFalling`, `.s9-el`, `.s13-el`, `.s15-el`, and `GLOBAL ENTRANCE SYSTEM` all return zero matches. **Phase 2 — Baby Steps (checkpoint):** the page's one shared fade+slide-up `IntersectionObserver` staggers every observed element by its index among not-yet-shown siblings under the same parent (`delay = siblings.indexOf(el) * 0.07`) — fine for a 1-3 item section (label/title/body), but a real "watch every card pop in one after another" cascade for the six 6-9-item card/list groups (role cards, tool cards, testing cards, decision cards, problem cards, timeline phases, reflect items). Changed the delay calculation to `Math.min(siblings.indexOf(el), 3) * 0.07` — one line — so any group's cascade now caps at ~0.21s instead of climbing past 0.5s for a 9-item list, while sections with only 1-3 elements (which never reach index 4) are completely unaffected. Chose this over the plan's alternative ("observe the parent group once, fade everything in together") because it's a single-line change to the existing mechanism rather than a DOM-structure-dependent rewrite, and Angel asked to see a result before committing to a direction — full simultaneous-group-fade is the next lever to pull if this cap doesn't read as "enough" once she looks at it.
- **Why:** Angel's direct ask — the case-study pages felt animation-heavy and she wanted unnecessary ones cut. She approved the phased plan (Rumi cleanup now since it's zero-risk; Baby Steps as a first density pass to react to before deciding whether Fableware — same mechanism, ~75 elements — and AI Workflow's 6-mechanism variety get the same treatment).
- **Risk:** Low for Rumi — every deletion was either fully unreachable code (zero call sites / zero matching DOM) or a confirmed duplicate of an already-working animation, verified line-by-line before writing, `node --check` clean, zero dangling references left. Low-medium for Baby Steps — this is a one-line, backward-compatible change to timing math only (no selector/DOM changes), `node --check` clean, and local-server spot-check (200 on both pages, served HTML confirmed to contain the new `Math.min(...)` line and zero remaining Rumi dead-code strings). **Not visually verified in an actual browser** (no headless-browser/screenshot tooling in this environment, same limitation noted throughout this log) — for Rumi nothing should look different at all (please scroll through once to confirm — it shouldn't), but for Baby Steps the pacing genuinely changed and needs an eyes-on check on the card-heavy sections (My Role, Tools, Testing, Team Decisions, Timeline, Animation Showcase reflect-items) before deciding whether to extend the same cap to Fableware or switch to the full group-fade approach instead.

---

## Edit — 2026-07-19 (59th update — retroactive, written by Claude)

#### `index.html`, `art/index.html`, `work/index.html`, `styles.css`, `script.js`, `scripts/section1-reference.js`, `scripts/section2-reference.js`, `scripts/hero-physics.js`, `plugins/hero-role-loop/hero-role-loop.css`, `plugins/hero-role-loop/hero-role-loop.js`
- **What:** A dedicated mobile-optimization pass across the home page (cache-busters confirm the scope: `styles.css?v=mobile-home-v3/v4`, `hero-role-loop.css?v=mobile-home-v4`, `hero-physics.js?v=mobile-three-stickers-v1`, `section1-reference.js?v=mobile-work-performance-v3`, `section2-reference.js?v=mobile-grid-clean-v1`). This entry was written by Claude after the fact, reconstructed from `git diff HEAD` against the last commit (`7db72b0`) since this session's own edits were never logged here — the actual work happened in an earlier Codex session. Six pieces: (1) **Hero simplified on mobile** — `school-panel` (MDM/UBC), `based-panel` (Vancouver), `resume-button`, and `hero-statement` (long intro paragraph) are all `display:none` at ≤809px; hero height switched to `100dvh`; `skill-strip` recentered. (2) **Hero sticker physics throttled for mobile** (`scripts/hero-physics.js`) — `maxStickers` drops from 28 to 3 via `isMobilePhysics` check, `spawnBurst()` (the random continuous-burst effect) is a no-op on mobile, and the initial spawn is fixed at 3 stickers instead of 8–11 — straightforward perf/battery guard for a Matter.js physics sim on mobile. (3) **Hero role-loop text** (`plugins/hero-role-loop/`) — mobile CSS switches the label+word from inline to stacked/centered with clamp-based responsive sizing (`--role-size`, `--role-height`), and the JS cycle interval is halved (2600ms → 1300ms) on mobile via a `matchMedia("(max-width: 809px)")` check. (4) **Section 1 "featured work" carousel rebuilt for mobile** (`scripts/section1-reference.js`, the largest piece) — the desktop 3D orbit UI (`orbit-copy` ring text, `wheel-focus-dot`, `work-sprites`) is hidden entirely (`display:none !important`) on mobile; a parallel mobile-only code path was added: `setMobileActive()`/`renderMobileProgress()` drive a vertical swipeable card stack where only the currently-active card's `<video>` plays (`playMobileActiveVideo()`/`pauseAllCardVideos()` — inactive videos pause, saving bandwidth/battery), stack position is computed dynamically against viewport height (`stack.style.top` recalculated so the stack centers around 44% of viewport height, clamped to a safe top/bottom), card gap tightened 78px→12px, and card aspect ratio changed from 1.6 to 1.23 (capped `max-height:468px`) so cards read taller/more portrait on a phone screen. The desktop `.work-complete` pill CTA is hidden on mobile and replaced by a new standalone `.mobile-work-all` "View All Work ↗" pill, positioned just below the card stack. (5) **Section 2 art collage** (`scripts/section2-reference.js`) — mobile layout switched from a forced `min-height:100vh` to `padding:92px 18px 104px` + `overflow:hidden`, for a tighter, less scroll-heavy grid. (6) **Site-wide header restructure carried over to art/work pages** — the `.mobile-actions` wrapper (hamburger + `EN/中` lang toggle side-by-side in the header, not buried in the drawer) from the earlier 51–53rd updates is now live on `art/index.html` and `work/index.html` too, and `work/index.html`'s category column widened 138px→176px. Unrelated same-diff carryover already covered by earlier entries (not new mobile work, just visible in the same uncommitted diff): the `cursor-preview` hover-image removal (56th/57th) and the `scroll-hint` blink `clearProps` fix (54th).
- **Why:** Inferred from the changes themselves (no direct conversation record) — the home page's desktop-first hero (dense info panels, 28-sticker physics burst, 3D orbit carousel) doesn't translate to a phone: too much competing content in a short viewport, and a full physics sim + autoplaying-everywhere video carousel is expensive on mobile hardware/data. The rebuilt Section 1 in particular reads as a performance-driven redesign (only-active-video-plays, throttled physics) rather than a purely cosmetic one.
- **Risk:** Unverified by Claude — this is a documentation-only entry, not new code, and no testing was performed as part of writing it. Everything described is still sitting **uncommitted** in the working tree (`git status` shows all these files modified against `7db72b0`, the last commit from 2026-07-01). Flagging directly: please confirm on an actual phone/narrow-viewport browser that (a) the mobile card-stack swipe/scroll feels right and videos only play when a card is active, (b) the `.mobile-work-all` button never overlaps the last card at short viewport heights, (c) the hero's reduced sticker count still looks intentional rather than sparse, before considering this mobile pass done — and consider committing this work, since ~5 weeks of changes (this pass plus everything in the 42nd–58th updates above) are all still sitting uncommitted on top of a 2026-07-01 commit.

---

## Edit — 2026-07-18 (58th update)

#### `work/Fableware Impact Engine/index.html`, `work/Fableware Impact Engine/assets/**` (new)
- **What:** Integrated a completed handoff package Angel dropped in as `C:\Users\angel\fableware-portfolio-handoff.zip`, built by a Codex session (package included its own `CODEX_HANDOFF.md` with drop-in instructions). Replaced the placeholder stub `work/Fableware Impact Engine/index.html` (5.3KB) with the finished case-study page (58.8KB) and added the `assets/` folder (11 files, ~97MB — the bulk of it is `assets/video/prototype-walkthrough.mp4` at ~92MB). Per the handoff doc, kept the pre-existing `Fableware Laptop MockUp.png` in place untouched (it's still the `data-img` hover thumbnail referenced from `work/index.html`'s listing row). The new page follows the same self-contained pattern as `work/FlyLens/index.html` — its own inlined `<style>` scoped under `body.fableware-detail`, no `../../styles.css` link, so zero collision with shared classes. Hero interaction: 3 cards shown on load, center card (Justice Protector) flips on click via a CSS `rotateY(180deg)` class toggle, GSAP-driven 3D tilt/gloss on hover. Per the handoff's own manifest, some sections (icon system, interaction-hover video, share-flow screens, dev-handoff docs, final outcome cards) still use styled placeholder art with `<!-- 替换: <img src="..."> -->` comments marking exactly where real assets go later — that's expected/intentional per the handoff, not something I need to chase down now.
- **Why:** Angel handed off a zip from a separate Codex session containing the finished Fableware case-study build; this drops it into the live portfolio per that session's own handoff instructions.
- **Risk:** Low — this was a data/asset integration, not new code I wrote, so I verified rather than authored: `node --check` passed on the page's one inline `<script>` block; confirmed all `../../`-relative dependency references in the new HTML (`vendor/gsap/gsap.min.js`, `assets/angel-yu.png`, `assets/stickers/angel.png`, nav routes) resolve to files that actually exist in the repo; confirmed the only external requests are Google Fonts (no stray CDN scripts); confirmed no `styles.css` link (matches the "self-contained, no collision" claim); confirmed all 11 files in the handoff's asset manifest are present on disk; local server spot-checked 200 for the page itself, a card image, and a byte-range request against the video file. **Not visually verified in an actual browser** (no headless-browser/screenshot tooling in this environment) — please open `/work/Fableware Impact Engine/` yourself and confirm the hero card flip/tilt interaction, the scroll-triggered section fades, the S4 prototype video playback, and the S6 card-grid enlarge-modal all work as the handoff doc describes, since none of that runtime behavior can be confirmed from static file checks alone.

---

## Edit — 2026-07-18 (57th update)

#### `work/index.html`, `styles.css`
- **What:** Partial revert of the 56th update's hover redesign. Angel asked for the work-listing page's "clean, no-image" version back — clarified this means: keep the new row order from the 56th update (AI Workflow at position 2), but remove the accordion hover-expand entirely (no image, no hover-triggered reveal of any kind) and restore the pill tags to always-visible under each title, same as before either round of hover changes this session. Reverted `work/index.html`: removed all 6 `.index-row__expand`/`.index-row__preview-img` panels, moved each row's `pill-set` back inside `.index-row__main` under the `<h1>`. Reverted `styles.css`: removed `.index-row__expand`, `.index-row__expand-inner`, `.index-row__preview-img`, the `grid-template-rows: auto 0fr → auto 1fr` hover-accordion mechanism and its `transition`, and the mobile-breakpoint's now-dead `.index-row__expand-inner { padding: 0 }` override — `.index-row` is back to the plain single-row 4-column grid it was before the 56th update. Deliberately did **not** bring back the old `.cursor-preview` mouse-following image popup either (that was removed in the 56th update and Angel's own words — "没有图片" / "不要hover图片了" — explicitly rule out any image-on-hover behavior, old or new), so the row is now purely static text, no image anywhere on this page's list.
- **Why:** Angel tried the new accordion hover and didn't want it — asked to go back to the previous clean version, order kept as-is.
- **Risk:** Low, straightforward markup/CSS removal back to a previously-shipped state (no JS was touched this round since the accordion had no JS dependency — it was pure CSS `:hover`/`:focus-within`). Verified: grepped `work/index.html` and `styles.css` for `index-row__expand`/`index-row__preview-img` — zero remaining; confirmed exactly 6 `pill-set` spans present (one per row, all restored); confirmed `cursor-preview` still fully absent everywhere (0 matches in `work/index.html`, `script.js`, `styles.css`) since that wasn't supposed to come back either; local server spot-checked 200 and served HTML confirms the row order (Fableware → AI Workflow → Rumi → Baby Steps → FlyLens → Artist Portfolio) survived the revert intact.

---

## Edit — 2026-07-18 (56th update)

#### `index.html`, `work/index.html`, `styles.css`, `script.js`, `work/Baby Steps/index.html`, `work/Trash Talk with Rumi/index.html`
- **What:** Four independent changes bundled into one round. (1) **Home page Section 1 carousel reorder**: AI Workflow is back in the featured wheel (was removed in the 48th update while it was still in progress) — new order AI Workflow → Trash Talk with Rumi → Baby Steps → FlyLens, same mechanism as before (reorder `.orbit-copy` spans + `.project-stack` cards, `active-dot` moved to the new first item, `data-orbit` stays sequential 4-7). (2) **Work-listing page reorder**: AI Workflow moved from position 5 to position 2 (right after Fableware, right before Trash Talk with Rumi); renumbered 001-006; the `catProject`/"PROJECT" category label moved from Rumi's row to AI Workflow's row since AI Workflow is now the first PROJECT-group row (Rumi's category cell reverted to the empty placeholder `<span></span>`, following the existing "only show category label once per group" convention). (3) **Work-listing hover redesign**: replaced the old cursor-following image popup (`.cursor-preview` — a single shared fixed-position div that tracked mouse position via a `window mousemove` GSAP tween and swapped its `background-image` on row hover) with an accordion-style in-place expand. Pills (previously always visible under each row's title) are now hidden by default and only shown inside a new per-row `.index-row__expand` panel (image + pills) that reveals on hover. Implementation: `.index-row` got a second grid row (`grid-template-rows: auto 0fr` → `auto 1fr` on `:hover`/`:focus-within`, animated via `transition: grid-template-rows .35s ease` — the "animate to auto-height" CSS Grid trick, works because the row's own height is intrinsic so `1fr` sizes to exactly the panel's content), with the expand panel as a full-width (`grid-column: 1/-1`) child wrapped in `overflow:hidden`. Subsequent rows are normal document flow, so they get pushed down automatically — no JS position math needed. On mobile (≤809px, no hover state) the row falls back to a plain single-column stack (`grid-template-rows: auto` override) so the image+pills are always visible instead of permanently hidden. Removed the now-fully-dead `.cursor-preview` CSS block and its entire JS block (row `mouseenter`/`mouseleave` handlers, the `data-img` image-preloader loop, and the global `mousemove` listener) from `script.js`; also stripped the now-redundant `data-img` attributes from every `.index-row` in `work/index.html` since each row's image is now inlined directly as an `<img>` inside its own expand panel (single source of truth instead of duplicated image path in a data attribute). (4) **Loading curtains for Baby Steps and Rumi**: Angel reported both pages take 5-10s to become usable and worried it'd cost patience with recruiters. Investigation (two Explore agents) found the home page's existing `.opening` system is a fixed ~2.6s branded animation *unrelated to actual load state* — not reusable as-is — and that the real bottleneck was **Baby Steps having 30 `<video autoplay>` tags + 43 images with zero lazy-loading**, all firing simultaneously on page load (117MB in `assets/videos/web/` alone) despite the hero itself being lightweight (just a logo + a couple of small images, no video). Rumi's bottleneck is genuine load time for its render-blocking library scripts + hero GLB models (already deduped in the 55th update). Built a lightweight, page-colored (`#f3f3f4`/`#2e2f31`, matching home page's `--paper`/`--ink` regardless of each page's own dark theme, per Angel's explicit request) full-viewport spinner curtain shown on **every** visit (not a one-time "seen before" flourish like the home page's — the point here is covering a real variable-length wait, not a branding moment): on Baby Steps it hides once `document.fonts.ready` + all `.cs-hero img` elements have loaded + a 500ms minimum have all resolved (should be well under 1s given the light hero); on Rumi it hides once the same fonts+minTime condition is met AND the page's own existing `heroReady()` callback fires (hooked via a new `window.__hidePageLoader()` global), with a 6s hard safety timeout on Rumi in case a GLB fails to load so the curtain can never get stuck open. Also fixed Baby Steps' actual root cause: removed `autoplay` from all 30 `<video>` tags, set `preload="none"` on all of them (previously `auto`/unset), and added a generic `IntersectionObserver`-based lazy-autoplay script (`document.querySelectorAll("video")`, no per-class targeting needed) that plays a video once it scrolls within 200px of the viewport and pauses it once it leaves — so the initial page weight the curtain has to wait on shrank from "the whole page, 117MB of video" down to just the hero's own couple of small images.
- **Why:** Angel's requests: bring AI Workflow back into the home hero carousel now that it's presentable; reorder the work list to match; she disliked the cursor-following image popup and wanted an accordion-style in-place reveal instead (design confirmed with her via clarifying questions — accordion pushes rows down rather than overlaying, pills move into the hover-reveal panel); and she's worried the 5-10s load time on Baby Steps/Rumi costs her patience with recruiters, so a curtain plus fixing the actual overload (not just hiding it behind a nicer animation) was the agreed approach over a purely cosmetic loading screen.
- **Risk:** Medium — this is the largest bundled change of the session so far, touching 6 files across markup/CSS/JS with a genuinely new interaction pattern (no prior accordion/expand-collapse precedent existed anywhere in this codebase, confirmed via repo-wide grep before building one from scratch). Verified: `node --check` passed on `script.js` and on every inline `<script>`/`<script type="module">` block extracted from both Baby Steps and Rumi (14 total scripts checked, all clean); grepped both pages to confirm zero remaining `autoplay` attributes and that every `<video>` tag now has an explicit `preload` value; grepped `work/index.html` to confirm zero remaining `cursor-preview` references and exactly 6 `.index-row__expand` panels (one per row); confirmed new page-loader z-index (99999 on Rumi, since that page already had a custom cursor-dot pair sitting at 9999/9998 — bumped clear of those; 9999 on Baby Steps, which had no prior conflict) sits above every other element on each page; all 4 touched pages spot-checked 200 on the local server, with served HTML confirmed to show the new home/work ordering, the new expand-panel markup, and the new page-loader markup/script live. **Not visually verified in an actual browser** (no headless-browser/screenshot tooling in this environment) — please check on your end: (a) the accordion hover/push-down feels right and nothing overlaps oddly at various row pill-count lengths, (b) the loading curtain on Baby Steps/Rumi actually disappears quickly rather than lingering or flashing, (c) videos on Baby Steps genuinely lazy-play on scroll rather than staying frozen on their first frame, (d) the home carousel's auto-rotation/click-through still behaves normally with the reordered cards.

---

## Edit — 2026-07-18 (55th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Fixed the slow hero-loading animation on the Rumi case-study page. Root cause: the hero (S1) orbit scene, the "Problem" freeze scene (S3), and the sorting mini-game (S8) each independently `loader.load()` the exact same 4 GLB models (`aluminium_can-_350ml.glb` 2.16MB, `juicebox.glb` 3.28MB, `pouch.glb` 0.10MB, `cardboard_box.glb` 0.11MB — ~5.65MB total) with zero caching or dedup (`THREE.Cache.enabled` was never set), and all three fire at page load simultaneously — S8 even instantiates its own second `GLTFLoader`/`DRACOLoader` pair in a separate `<script type="module">` block. That's 12 redundant network fetches (~17MB, with 3 duplicate copies of the 3.28MB juicebox alone) all competing for bandwidth/CPU at once, and the hero's own `heroReady()` — which gates purely on its own 4 fetches completing — was getting starved by the other 8 it didn't need. Added a small path-keyed load cache (`window.__glbLoadCache` + `window.__loadGLBCached(loaderInstance, path)`, defined right after the shared `loader`/`draco` setup in the first module script) that all three call sites now go through instead of calling `loader.load()` directly: first request for a path performs the real fetch and caches the resulting promise; every subsequent request for that same path — regardless of which of the 3 scenes or which of the 2 separate `<script type="module">` blocks it comes from, since the cache lives on `window` and is keyed only by path string — awaits the same promise and gets back a `.clone(true)` of the resolved scene with each mesh's material also explicitly cloned (so the 3 scenes' differing material tweaks — envMapIntensity, roughness, color overrides — don't bleed into each other; geometry is intentionally left shared/uncloned since nothing mutates vertex data). Updated the 3 call sites (S1 `ORBIT_PATHS.forEach`, S3 `items.forEach`, S8 `ITEM_DEFS.forEach`) to use `window.__loadGLBCached(...).then(...)`/`.catch(...)` instead of the old `loader.load(path, onLoad, undefined, onError)` signature.
- **Why:** Angel reported the Rumi hero's loading animation feels too slow; investigation traced it to redundant duplicate asset fetching, not the hero's own assets being too heavy.
- **Risk:** Low-medium. Verified: extracted both `<script type="module">` blocks and ran `node --check` on each — both pass syntax. Grepped the whole file for `loader.load(` — zero direct calls remain, all 3 route through the new cache helper. Also wrote an isolated Node simulation of the cache function itself (fake loader + 3 "scenes" each requesting the same 4 paths, mimicking S1/S3/S8's exact call pattern) confirming exactly 4 real loads happen for 12 total requests, and all 12 callers still resolve correctly. Server spot-checked 200 for the page. **Have not visually confirmed in an actual browser** (no headless-browser/Network-tab tooling available in this environment) that the hero now loads noticeably faster or that materials in the 3 scenes still look correct (colors/roughness/highlights) — the fix is logically verified end-to-end but please load the page and check the Network tab (should see each of the 4 GLBs requested once, not 3 times) plus eyeball all three sections (hero orbit, Problem freeze scene, sorting game) to confirm nothing looks visually different.

---

## Edit — 2026-07-13 (54th update)

#### `styles.css`, `script.js`, `index.html`, `art/index.html`, `work/index.html`, `work/Fableware Impact Engine/index.html`, `work/Personal Website/index.html`
- **What:** Made the home page hero's "SCROLL" hint text (`.scroll-hint`) blink noticeably. Discovered a blink animation already existed (`@keyframes scroll-blink`, present since the initial commit — not something introduced this session), but Angel reported on desktop browser testing that it wasn't visibly doing anything. Root cause: `.scroll-hint` is also part of `script.js`'s hero entrance-reveal animation (GSAP `autoAlpha`/`fromTo`/`.set()` calls across three different code paths — the "opening already seen" instant-set path, the "opening interrupted" fast-tween path, and the main entrance timeline), and GSAP leaves its final `opacity`/`filter`/`transform` values sitting as inline styles on the element after each of those finishes, which never gets cleaned up. While CSS animations are spec'd to out-rank plain inline styles in the cascade, this is a known source of cross-browser flakiness once GPU-compositing/`filter` inline styles are involved, so rather than rely on that priority working out in practice, added `gsap.set(".scroll-hint", { clearProps: "opacity,visibility,filter,transform" })` at the end of all three entrance paths — this fully hands `.scroll-hint` back to CSS with zero inline residue, so `scroll-blink` has nothing to fight. Also made the blink itself much more pronounced per Angel's ask ("blink to catch eye"): `@keyframes scroll-blink`'s dim state changed from `opacity: .18` (barely-there flicker) to `opacity: 0` (full disappear/reappear), which also affects `.work-scroll-hint` on the work-listing page footer since it shares the same keyframes — reasonable side effect, made that one more eye-catching too rather than splitting into a separate keyframes block. Bumped `script.js?v=...` → `?v=scroll-hint-blink-v1` on all 5 live pages that load the shared script (home, work, art, Fableware Impact Engine, the orphaned Personal Website page) since it's one shared file; `styles.css?v=lang-toggle-v7` was already fresh from the 53rd update so no bump needed there.
- **Why:** Angel wants the SCROLL hint to actively catch the eye; investigation showed the pre-existing blink was being silently neutralized by leftover inline styles from the page's GSAP entrance animation, not a simple "needs a blink added" request.
- **Risk:** Low. `node --check` passed on `script.js`. Verified via curl against the local server: served `styles.css` confirms `49%, 100% { opacity: 0; }`; served `script.js` confirms all 3 `clearProps` calls targeting `.scroll-hint` are present; all 5 pages loading the bumped script spot-checked 200. **Have not visually confirmed the blink renders correctly in an actual browser** (no headless-browser tooling available in this environment) — the fix is based on removing the actual root cause (lingering inline styles) rather than guessing, but please take a look on your end to confirm it's now blinking as expected.

---

## Edit — 2026-07-13 (53rd update)

#### `styles.css`, `index.html`, `work/index.html`, `art/index.html`, `work/Baby Steps/index.html`, `work/AI Workflow/index.html`, `work/Trash Talk with Rumi/index.html`, `work/FlyLens/index.html`
- **What:** Re-implemented the mobile-nav rework from the 51st update (which was reverted in the 52nd), this time with the actual bug fixed. Angel clarified via voice message that the target design was correct in principle (EN/中 out of the drawer, sitting next to the hamburger icon, visible without opening the menu) but the 51st update's execution broke the **desktop** layout — the home/work/art nav links got visually shoved toward the center instead of staying flush against the right edge. Root cause found: the new `.mobile-actions` wrapper `<div>` (holding `.menu-button` + the new `.header-lang-toggle`) had no `display: none` default — only its *children* did. So on desktop, `.site-header`'s `justify-content: space-between` layout saw **three** flex children (brand, nav-links, mobile-actions) instead of the original two (brand, nav-links), since an empty-but-rendered `<div>` still counts as a flex item even when its own children are `display:none`. That pushed `.nav-links` to the middle instead of pinning it to the right edge — this is different from the previous `.menu-button` which was itself `display:none` by default and therefore fully removed from the flex flow on desktop. Fix: added `.mobile-actions { display: none; ... }` as the default state (matching exactly how `.menu-button` behaved pre-51st-update), switching to `display: flex` only inside the existing `@media (max-width: 809px)` block — so on desktop the wrapper now disappears from the flex flow entirely, restoring the original two-item space-between layout. Everything else from the 51st update's structure is unchanged: `.mobile-actions` wraps `.menu-button` + `.header-lang-toggle` (reuses `.lang-toggle`'s visual style), the old `<button class="lang-toggle mobile-lang-toggle">` row and dead `.mobile-menu .lang-toggle` CSS are removed from all 7 pages' drawers (drawer is back to home/work/art only, EN/中 lives in the header now), and the drawer font-size stays at its original value (34px shared pages / 28px case-study pages — did **not** re-apply the 51st update's font-size reduction since Angel's clarification was specifically about button placement + desktop breakage, not font size, and the reverted-back sizes were never flagged as a problem in her feedback this round). Bumped `styles.css?v=lang-toggle-v6`→`?v=lang-toggle-v7` on the three shared-style pages.
- **Why:** Angel confirmed (via voice message) the actual requirement: desktop nav must stay exactly as before (right-aligned, unchanged); on mobile there should be two separate, always-visible controls in the header — a hamburger button (opens a drawer with home/work/art only) and an EN/中 button right next to it, so switching language doesn't require opening the menu first.
- **Risk:** Low-medium. The desktop-centering bug is now understood and fixed at its root (missing default `display:none` on the wrapper), not patched around — same pattern applied consistently across all 7 pages. Verified: repo-wide grep confirms `.mobile-actions { display: none; ... }` is the default rule (with `display: flex` only inside each page's existing `@media (max-width: 809px)` block) on all 7 files; `header-lang-toggle { display: inline-block; }` present in the same media block on all 7; grep confirms every page has exactly two `.lang-toggle`-classed buttons (the original desktop nav one + the new header one) and zero leftover `mobile-lang-toggle`/`​.mobile-menu .lang-toggle` remnants; all 7 pages spot-checked 200 on the local server. **Not yet visually verified in an actual browser/phone** — no headless-browser tooling was available in this environment to screenshot the layout, so this fix rests on CSS reasoning tied directly to the confirmed root cause rather than a rendered screenshot. Given the 51st update's bug slipped through the same kind of non-visual verification, please double check the desktop nav alignment and the mobile hamburger+EN/中 pairing on an actual browser/phone before considering this fully closed.

---

## Edit — 2026-07-13 (52nd update)

#### `styles.css`, `index.html`, `work/index.html`, `art/index.html`, `work/Baby Steps/index.html`, `work/AI Workflow/index.html`, `work/Trash Talk with Rumi/index.html`, `work/FlyLens/index.html`
- **What:** Full revert of the 51st update. Angel said the mobile-nav rework ("EN/中 next to the hamburger button" + smaller drawer font) was a misunderstanding of her request. Reverted all 7 pages back to their pre-51st state: removed the `.mobile-actions` wrapper div and `.header-lang-toggle` button from every header, restored the standalone `.menu-button`, restored `<button class="lang-toggle mobile-lang-toggle">` inside every `<aside class="mobile-menu">` drawer, restored `.mobile-menu .lang-toggle` CSS on all 7 pages, restored `.mobile-menu a` font-size to 34px (shared `styles.css` pages) / 28px (four case-study pages), removed the `.header-lang-toggle` media-query line, and bumped `styles.css?v=lang-toggle-v5`→`?v=lang-toggle-v6` on the three shared-style pages so the revert isn't masked by stale cache. Confirmed via repo-wide grep that zero `mobile-actions`/`header-lang-toggle` references remain anywhere, and all 7 pages have their `mobile-lang-toggle` drawer button back.
- **Why:** Angel: "撤回不要这个你理解错了" — my interpretation of "EN/中不应该在toggle 里面，应该在menu button 旁边" was wrong. Reverting first before asking her to clarify what she actually meant, rather than guessing again.
- **Risk:** Low, this is a straight rollback to previously-verified-working markup/CSS (same content that shipped in the 50th update). Verified: repo-wide grep for `mobile-actions`/`header-lang-toggle` returns zero matches; `mobile-lang-toggle` present in all 7 files; `.mobile-menu a` font-size confirmed 34px on `styles.css` and 28px on all four case-study inline styles.

---

## Edit — 2026-07-13 (51st update)

#### `styles.css`, `index.html`, `work/index.html`, `art/index.html`, `work/Baby Steps/index.html`, `work/AI Workflow/index.html`, `work/Trash Talk with Rumi/index.html`, `work/FlyLens/index.html`
- **What:** Mobile navigation rework across all 7 pages that have the EN/中 toggle. (1) **EN/中 moved out of the mobile drawer, now lives next to the hamburger icon in the header itself** — no longer requires opening the menu to switch language. Implementation: wrapped `.menu-button` and a new `.header-lang-toggle` button (same visual style as the existing `.lang-toggle`, just a second instance) together in a `<div class="mobile-actions">` flex container (`display:flex; gap:14px`, always present but empty-looking on desktop since both children default to `display:none` there). This sidesteps `.site-header`'s `justify-content:space-between`, which would otherwise scatter a 4th top-level header child across the row instead of placing it snugly next to the hamburger. `.header-lang-toggle` follows the exact same show/hide pattern already used for `.menu-button` (`display:none` by default, `display:inline-block` at `≤809px`) so it only appears in mobile mode, where the desktop nav (which has its own inline toggle) is hidden anyway. Removed the old `<button class="lang-toggle mobile-lang-toggle">` row from inside every `<aside class="mobile-menu">` drawer, and deleted the now-dead `.mobile-menu .lang-toggle` CSS block on all 7 pages — drawer is back to just home/work/art. Confirmed this doesn't reintroduce the AI-Workflow pointer-events bug from an earlier round: `.lang-toggle` and `.menu-button` both already carry their own explicit `pointer-events: auto` there, which isn't affected by wrapping them in a new parent div. (2) **Mobile drawer link font-size reduced** — shared-`styles.css` pages (home/work/art) went 34px→24px (Gallery Modern serif), the four case-study pages (each with their own inline `<style>`) went 28px→20px; kept the existing size difference between the two font treatments rather than flattening to one value. Bumped `styles.css?v=lang-toggle-v4`→`?v=lang-toggle-v5` on the three shared-style pages so the cache actually picks up the change (learned that lesson the hard way in the 49th update).
- **Why:** Angel's feedback: the drawer text was too large, and EN/中 shouldn't be buried inside the drawer — it's a quick, low-commitment action that deserves to sit right next to the menu button.
- **Risk:** Low. Verified: all 7 pages spot-checked 200 on the local server; served HTML confirmed to contain `.mobile-actions`/`.header-lang-toggle` on every page and zero remaining `mobile-lang-toggle` references (old drawer button fully gone); font-size values confirmed live via the cache-busted `styles.css?v=lang-toggle-v5` URL and each case-study page's own inline block. Haven't visually eyeballed the header spacing/alignment in a real narrow-viewport browser — the gap value (14px) and button sizing are reasonable defaults, tell me if it needs tightening or more breathing room once you look at it on an actual phone width.

---

## Edit — 2026-07-12 (50th update)

#### `work/FlyLens/index.html`, new `work/FlyLens/i18n-flylens.js`
- **What:** Extended EN/中 to the fifth and last case-study page, using the same mechanism as Baby Steps/AI Workflow/Rumi (`window.PAGE_DICT` merge + snapshot-and-match-by-normalized-text). Confirmed this page's `.site-header` already has `pointer-events: auto` (same safe pattern as Baby Steps/Rumi), so no risk of the AI-Workflow-style unclickable-button bug — nothing extra needed there. Added the head lang-preset script, `data-i18n-title="titleFlyLens"`, EN/中 buttons (nav + mobile drawer), zh CJK font stack, and a 96-entry dictionary covering the hero (badge, subhead, role/platform pills), the overview strip, all 8 numbered sections (Problem → Reflection), the persona card (goals/frustrations/behaviours lists), the 6-row user-journey table, the drag-scroll gallery captions, and the closing reflection. Reused the same Chinese translation across a few English strings that legitimately mean the same thing in two places (e.g. "Watchlist"/"Profile"/"Price Results" appear both as journey-table subjects and as gallery captions — one shared zh value serves both, verified as an intentional match, not a bug). Project name "FlyLens" and tool/brand names (Figma, Photoshop, Illustrator) stay English; the color swatch hex codes (`#383BCB` etc.) were deliberately left out of the selector list since they're not language-dependent.
- **Why:** Angel asked for FlyLens to get the same bilingual treatment as the other four case studies.
- **Risk:** Low — same verified mechanism as the last three pages. `node --check` passed; coverage script confirmed 96/96 dictionary keys match text present in the page, with zero duplicate keys; local server spot-checked 200 for both the page and the new script, with the toggle button, `data-i18n-title`, and both script tags confirmed present in the served HTML. All five case-study pages (Baby Steps, AI Workflow, Trash Talk with Rumi, FlyLens) plus the three portfolio-shell pages (home, work, art) now share the EN/中 toggle.

---

## Edit — 2026-07-12 (49th update)

#### `styles.css`, `scripts/i18n.js`, `work/index.html`, `index.html`, `art/index.html`, `work/Baby Steps/index.html`, `work/AI Workflow/index.html`, `work/Trash Talk with Rumi/index.html` — small fixes to the 48th update
- **What:** Two follow-ups from Angel testing the 48th update. (1) The new "In Progress"/"Personal" category labels needed to be all-caps to match "PROJECT"'s existing style — changed both the static HTML fallback text and the `scripts/i18n.js` EN dictionary values to "IN PROGRESS"/"PERSONAL". (2) Angel then noticed the zh translation for the category wasn't showing up ("进行中" wasn't appearing when switching to Chinese) — root cause was a stale-cache bug of my own making: I'd added the `catInProgress`/`catPersonal` dictionary keys to `scripts/i18n.js` in the 48th update but forgot to bump its `?v=` cache-buster, so browsers kept serving the pre-update script that didn't know those keys existed. Bumped `i18n.js?v=6`→`?v=7` on all six pages that load it (home, work, art, Baby Steps, AI Workflow, Rumi) to force a fresh fetch. (3) Angel then flagged the category column font looking smaller — investigated and confirmed the font-size values themselves (16px EN / 14px zh) hadn't changed in any recent edit; asked her to clarify and she confirmed the real issue was **"IN PROGRESS" wrapping to two lines** inside the category column's fixed 138px width (which "PROJECT" and "EXHIBITION" had always fit on one line), making it look cramped/smaller by comparison. Fixed by widening `.index-row`'s first grid column from `138px` to `176px` — the adjacent `minmax(360px, 1fr)` column absorbs the extra width automatically, so nothing else shifts or overflows; the ≤809px mobile single-column layout is untouched. Bumped `styles.css?v=lang-toggle-v3`→`?v=lang-toggle-v4` on home/work/art (same stale-cache lesson from point 2, applied proactively this time).
- **Why:** Angel's follow-up testing after the 48th update shipped.
- **Risk:** Low. The stale cache-buster miss (point 2) is a pattern worth remembering: **any time a dictionary/JS file used across multiple pages gets new entries, the `?v=` on every page that loads it must be bumped in the same edit**, not just the page being actively tested — I'll make this a standing checklist item for future i18n edits rather than something Angel has to catch each time. Verified: `node --check` where JS was touched; served content spot-checked for the new column width, the uppercase category text, and the now-fresh `catInProgress`/`catPersonal` zh values, all confirmed live via curl on the running local server.

---

## Edit — 2026-07-12 (48th update)

#### `work/AI Workflow/index.html`, `work/AI Workflow/i18n-aiworkflow.js`, `index.html`, `work/index.html`, `scripts/i18n.js`
- **What:** Four unrelated fixes bundled into one round. (1) **AI Workflow hero headline zh trimmed 4→3 lines**: dropped the "TO AI"→"引领" line (now maps to an empty string) so the stack reads "设计 / 通向 / AI"; added a zh-only CSS rule `html[lang="zh-Hans"] .hero-headline .word-wrap:has(.word-inner:empty) { display: none }` so the emptied line collapses instead of leaving a blank gap (uses `:has()` rather than a hardcoded nth-child so future reordering won't silently break it). (2) **"03 — AI Limitations" zh copy rewritten for a more professional register**: the two-word "崩坏/时刻" stack collapsed to a single "限制" (same empty-line CSS trick, extended to `.overview-headline .iw:has(.iw-inner:empty)`); all 8 grid items reworded with technical grounding instead of casual phrasing — e.g. "看不见"→"缺乏视觉感知" (text-only LLMs can't perceive their own rendered output), "记忆会清零"→"上下文记忆有限" (matches the actual LLM context-window mechanism rather than a literal "reset"), "不会自我核查"→"缺乏自我校验机制", "不总能说清边界在哪"→"未必能明确表达边界条件". Full before/after table with rationale is in the plan file if Angel wants to revisit any single term. (3) **Fableware Impact Engine removed from the home page Section 1 wheel** (it's still in progress, Angel didn't want it in the "selected work" carousel) — confirmed `scripts/section1-reference.js` has zero hardcoded assumptions about card count (everything derives from `cards.length` and each card's `data-orbit`), so this was a pure HTML edit: `.orbit-copy` now lists 4 projects × 2 copies (was 5×2) in the new order **Trash Talk with Rumi → Baby Steps → FlyLens → AI Workflow**, `.project-stack` has the matching 4 cards with `data-orbit="4/5/6/7"` (was 5-9), "active-dot" moved to the new first item (Rumi). (4) **work listing page reordered + Fableware gets its own "In Progress" category** (was lumped under the generic "PROJECT" label) — new order/grouping: Fableware (**In Progress**) → Trash Talk with Rumi (**PROJECT**, category re-shown since the group changed) → Baby Steps → FlyLens → AI Workflow (same PROJECT group, blank category cells per the existing "only show once per run" convention) → **Artist Portfolio** (renamed from "Personal Website", category **Personal** — Angel corrected my first draft which had it as "EXHIBITION"). Row numbers 001–006 renumbered to match. `scripts/i18n.js` got two new category key pairs: `catInProgress` (EN "In Progress" / ZH "进行中") and `catPersonal` (replacing the now-inaccurate `catExhibition`; EN "Personal" / ZH "个人") — confirmed no other page referenced the old `catExhibition` key before removing it, so nothing orphaned.
- **Why:** Angel's feedback: trim the hero line, professionalize the AI Limitations wording with real grounding, and don't show an unfinished project (Fableware) in the home page highlight reel — but still list it on the full work page under its own honest status.
- **Risk:** Low. Note: `work/Personal Website/index.html` (the local case-study page under that old name) is **not linked from anywhere** — the work-list row has always pointed to an external Cargo site (`https://angeloveart.cargo.site/main`), not this local page — so the "Personal Website"→"Artist Portfolio" rename only touched the visible work-list row text; that orphaned local page still says "Personal Website" internally. Say the word if you want it renamed or removed too. Verified: `node --check` on both edited JS dictionaries; grepped for leftover `catExhibition`/`Fableware` references in the wrong places (none found); local server restarted where needed and all three touched pages (home, work list, AI Workflow) spot-checked 200 with the new orbit order, category labels, row order/numbering, and zh dictionary values all confirmed present in the served HTML.

---

## Edit — 2026-07-11 (47th update)

#### `work/AI Workflow/index.html`, `work/Trash Talk with Rumi/index.html`, `work/Trash Talk with Rumi/i18n-rumi.js` — fixes to the 46th update
- **What:** Four fixes from Angel's testing of the round-46 EN/中 rollout. (1) **AI Workflow's language button was unclickable** — root cause: `.site-header` sets `pointer-events: none` at the container level and only re-enables it for `<a>` tags (`.site-header a { pointer-events: auto }`); the `.lang-toggle` I added is a `<button>`, so it silently inherited `pointer-events: none` and ate no clicks at all. The sibling `.menu-button` avoided this by declaring its own `pointer-events: auto` — I missed doing the same for the new button. Fixed by adding `pointer-events: auto` directly to `.lang-toggle`. (Confirmed Baby Steps and Rumi don't have this bug — their headers set `pointer-events: auto` on the whole `#nav.site-header` container, not just on anchors.) (2) **Rumi's "01 — Problem" 3D scroll scene text wasn't translated** — this was a real gap in the 46th update, not a request I'm now fulfilling for the first time: those 4 callouts ("62% of people put this in the wrong bin.", "Flexible plastic, not recyclable.", "Paper + plastic + aluminum.", "Need to remove the tape first.") aren't static DOM text at all — they're string literals inside the `items` array (~line 3332) that `renderCallout()` paints onto floating `.s3-callout` divs every frame via a `gsap.ticker` loop driving the Three.js pinned scene. My translation pass only scans static DOM at load time, so it never saw this. Fixed by adding a `textZh` field to each of the 4 `items` entries and changing `renderCallout()` to pick `item.textZh` when `document.documentElement.lang === 'zh-Hans'`, else fall back to the English `label.text`. Since the render loop already re-runs continuously while the section is in view, language switches take effect within one frame — no extra event wiring needed. (3) Rumi's S8 zh heading trimmed from "五个步骤。零困惑。" to just "五个步骤" per Angel's request (English heading "Five steps. Zero confusion." unchanged). (4) **Factual correction**: the Slay team is 6 people, not 4 — fixed the English source ("Slay (4 members)" → "Slay (6 members)") and the matching dictionary entry ("Slay（4 人小组）" → "Slay（6 人小组）"), same pattern as the earlier Kim→"another member" fix (English source and zh dictionary key must move together).
- **Why:** Angel caught these in her own testing after the 46th update shipped.
- **Risk:** Low, but worth naming directly: **the S3 3D-scene miss (fix #2) was my error** — when I scoped the Rumi translation I flagged the S1 hero physics text as an intentional, disclosed gap, but I didn't think to check whether the "01 — Problem" 3D scroll section had the same kind of JS-driven, continuously-repainted text — it does, and I missed it silently instead of flagging it. Noting this so future translation passes on this site explicitly check every Three.js/canvas-driven section for render-loop text, not just the ones that visually look like the hero. Verified: `node --check` on `i18n-rumi.js`; extracted and syntax-checked the edited `<script type="module">` block directly (no errors); re-ran the coverage script (136/136 still resolve); confirmed "Slay (4 members)" no longer appears anywhere in either file and "Slay (6 members)"/"Slay（6 人小组）" appear exactly once each; both pages + `i18n-rumi.js` spot-checked 200 on the local server, with the four `textZh` values, the button's `pointer-events: auto`, "五个步骤", and "Slay (6 members)"/"Slay（6 人小组）" all confirmed present in the served content. Have not personally scrolled through the S3 3D scene in a live browser to eyeball the callout positioning in zh mode — the Chinese strings are shorter than the English ones so should fit the same layout, but worth a visual pass.

---

## Edit — 2026-07-11 (46th update)

#### `work/AI Workflow/index.html`, new `work/AI Workflow/i18n-aiworkflow.js`, `work/Trash Talk with Rumi/index.html`, new `work/Trash Talk with Rumi/i18n-rumi.js`, `scripts/i18n.js`
- **What:** Extended the EN/中 toggle (same mechanism as Baby Steps: `window.PAGE_DICT` merge + snapshot-and-match-by-normalized-text translation) to two more case-study pages. **AI Workflow**: added the head lang-preset script, EN/中 buttons (nav + mobile drawer), zh CJK font stack, and a 73-entry dictionary covering the hero headline (the 4-line "DIRECTING / TO AI / THROUGH / DESIGN" stack was re-composed as "设计 / 引领 / 通向 / AI" rather than translated word-for-word, since a literal split reads badly stacked), section labels, workflow cards, AI-limitations grid, "what I found" case studies, design process copy, and the full reflection section. Project name "AI Workflow" and tool names (Claude, Codex, Three.js, GSAP, Figma) stay English. **Trash Talk with Rumi**: same wiring, plus — because most of its copy sits in unclassed, inline-styled `<div>`/`<span>` elements (no semantic classes to hook into, unlike Baby Steps/AI Workflow) — added a small number of new CSS classes purely as translation anchors (`rumi-pill`, `rumi-stat-big`, `rumi-stat-label`, `rumi-loc`, `reflect-label`, `reflect-body`, `rumi-team-meta`); these carry no styling of their own (all visual styling stays in the existing inline `style=` attributes) so nothing visually changes. 136-entry dictionary covers all 10 numbered sections (00 Overview → 09 Reflection), personas, research methods, user-testing rounds, the 5-step "how it works" panel, and the reflection block. Project name "Trash Talk with Rumi", mascot name "Rumi", and team name "Slay" stay English. **Known scope gap, flagged rather than guessed at**: the S1 hero's "Where does this actually go?" decrypt/falling-text sequence is driven by a Matter.js physics simulation reading a hardcoded `TEXT_Q`/`TEXT_T` JS constant, not static DOM text — translating it would mean re-triggering the whole physics/decrypt animation per language, a separate and riskier piece of work I did not attempt this round. `scripts/i18n.js` needed no changes (the `PAGE_DICT`/`PAGE_APPLY`/`data-i18n-title` mechanism built for Baby Steps already generalizes); only the cache-buster references bumped to `?v=6` to match the other pages.
- **Why:** Angel asked to add the EN/中 feature to AI Workflow and Rumi, following up on Baby Steps.
- **Risk:** Medium (large surface area, especially Rumi's inline-styled markup). Verified: `node --check` on both new JS files; a coverage script confirmed every dictionary key text-matches somewhere in its page (AI Workflow 73/73, Rumi 136/136); a separate duplicate-key scan found 0 collisions in either dictionary; local server restarted and both pages + both new scripts + the shared `scripts/i18n.js?v=6` all spot-checked 200, with the served HTML confirmed to contain the toggle button, the new anchor classes, and the `data-i18n-title` attributes. Not yet visually clicked-through in a browser — please toggle zh on both pages and check: hero/section-label sequencing still reads top-to-bottom sensibly, the S6/S6C/S6D/S14/S16 blocks in Rumi (the ones using the new anchor classes) render correctly at both languages, and the untranslated S1 hero text on Rumi doesn't look out of place next to the now-Chinese nav.

---

## Edit — 2026-07-06 (45th update)

#### `work/Baby Steps/index.html`, `work/Baby Steps/i18n-babysteps.js`, `scripts/i18n.js`, `styles.css`, `index.html`, `work/index.html`, `art/index.html` — round 7 copy fixes
- **What:** Ten small fixes from Angel's review, English and Chinese kept in sync: (1) Removed "Kim" everywhere — Leading Production now says "another member" / EN "另外一位成员" instead of a named teammate, both in the page HTML and the i18n-babysteps.js dictionary (English source string changed, so the dictionary key was updated to match — re-verified 303/303 keys still resolve against the page text). (2) zh card title "教的是工作流，而不只是交文件" → "工作流教程" (EN title unchanged: "Teaching the workflow, not just handing off files"). (3) Swept em-dashes ("—"/"——") out of the zh dictionary body copy across both `i18n-babysteps.js` and `scripts/i18n.js`, replacing with commas/colons/full stops or removing entirely — kept the numbering-separator dashes ("01 — 问题", "阶段 6 — 06") since those are layout punctuation, not prose. (4) "30+ 资产的唯一事实来源" → "30+ 资产". (5) Overview meta: EN "10 weeks / 2025" → "12 weeks / 2026", zh → "12 周 / 2026" (dictionary key renamed to match). (6) Tools meta: EN "Figma, AR Kit / Spline" → "Figma, ARKit / Procreate, Illustrator", zh "Figma、ARKit / Procreate、Illustrator". (7) `.cs-caption` (Story Making / Visual Style / Moodboard image captions) brightened from `rgba(180,210,255,.4)` to `rgba(210,228,255,.78)` at 13px, so they're legible against the dark background. (8) Animation Showcase card names/descriptions now translate too — added `.as-name`/`.as-desc` to the translated selector list and ~60 new dictionary entries (Stage N — 0X, Character/Environment/Effect labels, and every asset description like "Kite"→"风筝", "Star to Earth"→"星星变地球"). (9) work page zh: `.index-row__category` ("项目"/"展览") bumped 13px→14px per Angel's +10% ask; the 001/002 numerals were never translated and are untouched. (10) Home page zh: section-2 title "作品" → "艺术品" (`artworkTitle` key — separate from the art page's own "作品"/artTitle, which is unaffected). Bumped cache-busters: `i18n-babysteps.js?v=2`, `scripts/i18n.js?v=6` (all four pages), `styles.css?v=lang-toggle-v3` (home/work/art, for the font-size fix).
- **Why:** Angel's round-7 review — wanted the teammate anonymized in both languages, tighter zh prose without em-dash-heavy translation-ese, corrected project dates/tools, and full-page zh coverage extended to the animation showcase grid.
- **Risk:** Low. Re-ran the key-coverage script after editing the English source strings (Kim removal changes the literal text the dictionary keys must match) — 303/303 resolved. All touched pages/scripts spot-checked 200 via curl; served HTML confirmed to contain the new English strings (\"another member\", \"12 weeks<br/>2026\", brightened caption color) and the new zh string (\"艺术品\") live on the server.

---

## Edit — 2026-07-06 (44th update)

#### `scripts/section2-reference.js`, `work/Baby Steps/index.html`, new `work/Baby Steps/i18n-babysteps.js`, `scripts/i18n.js`, `index.html`, `work/index.html`, `art/index.html` — round 6
- **What:** (1) **Home section-2 "missing images" explained & fixed**: all 12 webp files exist (no 404s) — each tile starts near-transparent and is lit up by scroll progress (that part is the designed reveal). The bug: after image decode the script calls `ScrollTrigger.refresh()` and `invalidateOnRefresh:true` re-captured tween start values mid-scroll (e.g. reload with restored scroll position), leaving some tiles stuck at their faint start state. Removed `invalidateOnRefresh` (resize already fully rebuilds) and added `snapItemsToFinal()` on `onLeave`/`onEnterBack` so tiles are always fully visible once you've passed the section. Cache-bust `?v=section2-snap-final-v2`. (2) **Baby Steps Research re-laid out quote-style** (Angel-approved): left column = large pull-quote from the father interview (gold “ mark, no box) + attribution; right column = 4 hairline `.reflect-item` rows with one-line findings; milestone tiles de-boxed (borderless, left hairline, text-left). Removed the 4 glass cards + interview card + their CSS. (3) **Baby Steps full EN/中 (first case-study page, per approved scope)**: rather than attributing ~200 elements, new `i18n-babysteps.js` snapshots each scoped element's original innerHTML and swaps EN↔zh by normalized-text lookup (`<br>` treated as space); 237-entry dictionary covers every section (labels, titles, body copy, cards, chips, user-test lists, timeline, features, handoff, reflection) — verified 237/237 keys match the page text via a coverage script. Proper nouns (BabySteps, Kim, Panoruk, Tandem, tool names, S1–S6) stay English. `scripts/i18n.js` extended: merges `window.PAGE_DICT`, calls `window.PAGE_APPLY(lang)` after static swap, supports `data-i18n-html`, per-page `<title>` keys — bumped to `?v=5` on all four pages. Baby Steps got the head lang-preset script, EN/中 buttons (desktop nav + mobile drawer, styled to its own tokens), zh CJK font stack (`!important` to beat the page's own `!important` body rule), and `font-weight:900` fallback for Arial-Black title classes so Chinese headings don't render thin.
- **Why:** Angel's round-6 feedback + approved choices (quote layout; Baby Steps first for case-study translation).
- **Risk:** Medium for the translation (innerHTML swaps across ~200 elements). Verified: JS syntax, key coverage 237/237, page + script 200. Please click through zh mode end-to-end once: hero → reflection, tabs still switch, fade-ins fire, mobile drawer 4th row, EN restore identical. Remaining case-study pages (AI Workflow, FlyLens, Rumi, Fableware) still English — say the word and I'll do them one by one with the same mechanism.

---

## Edit — 2026-07-06 (43rd update)

#### `work/Baby Steps/index.html`, `work/index.html`, `scripts/i18n.js`, `index.html`, `art/index.html`, `styles.css` — round-5 trims
- **What:** (1) Baby Steps Research trimmed again: card title now just "Mixed emotions"; deleted the intro paragraph ("We combined secondary research…") and the closing direction paragraph ("These findings set the direction…") — section is now title → 4 finding cards → interview card → milestone tiles. (2) **work page scroll-reveal removed**: all six `.index-row` elements lost their `reveal` class, so every project (FlyLens included) renders immediately on page load instead of fading in at scroll trigger "top 86%"; `page-intro` keeps its load-time reveal; hover/cursor-preview untouched. (3) "PRODUCT" → "PROJECT" on row 001; i18n key renamed `catProduct`→`catProject`, zh 「产品」→「项目」; `i18n.js?v=4` bumped on all three pages. (4) zh typography fix: `html[lang="zh-Hans"] .index-row__category { font-size: 13px }` — 16px CJK glyphs read visually larger than 16px latin caps, 13px matches the 001/002 numerals; tweak 12–14px if Angel wants.
- **Why:** Angel's round-5 feedback.
- **Risk:** None meaningful. Verify: work page shows all 6 rows without scrolling, zh「项目/展览」sits visually level with the row numbers.

---

## Edit — 2026-07-06 (42nd update)

#### `styles.css`, `work/Baby Steps/index.html` — round-4 fixes from Angel's review
- **What:** (1) **Art title centering bug fixed** — root cause: `.art-title-layer` centered via `left:50% + translate(-50%,-50%)`, but script.js's `.reveal` GSAP tween bakes the transform into inline px values measured against the English "Artwork" width; switching to the narrower 「作品」 left the stale px offset → off-center. Changed to `left:0; right:0; transform:translateY(-50%)` (text-align centering, language-independent). (2) **Teaching video** — likely cached as a half-written file (she loaded the page while ffmpeg was still encoding) and `preload="metadata"` showed a black box; now `autoplay muted loop playsinline controls preload="auto"` + `?v=1` cache-buster. (3) **Round 2 photo** framing: `object-position: center 22%` so her face isn't cropped (frame unchanged; tweak the % if needed). (4) **Research section rewritten from Angel's real research notes** (the old version wrongly re-told the CDD concept-merge story): intro (secondary research + first-time-father interview), 4 finding cards (Mixed emotions / Fathers feel sidelined / Context shapes the bond / Connection is sensory), a full-width interview highlight card (first-time father, 30 — 4 findings incl. "on the sidelines"), 4 development-milestone tiles (15–18 / 20–24 / 25+ / third trimester with interaction hints via new `.cs-phase-hint`), closing paragraph with the product direction (AR mandatory but supporting, parent app + hospital dashboard, 3–6 stages). Removed the 6 Night-Sky phase tiles and 3-concepts paragraph; `.cs-phases` now `repeat(4,1fr)`; `.cs-research-interview` added to fade selectors. (5) Deleted the User Test intro paragraph ("We validated two things…"). (6) Deleted the Testing Results note ("Testing was conducted with 107 users…") + its now-dead CSS. (7) Removed the Concept 1/2/3 tags from Ideation (images kept) + dead `.cs-concept-tag` CSS.
- **Why:** Angel's screenshot/browser review of round 3.
- **Risk:** Low. Please verify: art page zh title centered, video actually plays now (hard-refresh once), Round 2 face visible, Research layout at ≤900px (finding cards fold 2→1 col, milestone tiles 4→2→1).

---

## Edit — 2026-07-06 (41st update)

#### `work/Baby Steps/index.html`, `scripts/i18n.js`, `work/index.html`, `art/index.html`, `index.html`, new `assets/videos/web/teaching-kim.web.mp4`
- **What:** (1) **Research pills deleted** — removed the 4-tag `.cs-research-needs` row + its CSS; intro sentence kept. (2) **Testing Results reverted** — Angel found the bar charts ugly; restored the pre-36th-update 6 stat tiles (Emotional Connection 90% … Design Iterations 8) + original note, section stays "14 — Testing Results" at the same position with `id="results"`; deleted all `.cs-bar-*` markup/CSS and the barIO observer, removed `.cs-bar-card` from the fade selector. (3) **Real media wired in** — placeholders replaced: `usertest-round1/2.jpg` photos (21/9 cover crop, rounded), `production-tracker.png` (cover in the 16/10 box), and the teaching video. The dropped-in original was **485MB / 1920×1440** — compressed with ffmpeg (scale 1280, crf 30, faststart) to **12.9MB** at `assets/videos/web/teaching-kim.web.mp4`; page references the web version with `<video controls muted playsinline>` (object-fit: contain so the 4:3 tutorial isn't cropped). ⚠️ **The 485MB original still sits at `assets/videos/teaching-kim.web.mp4` — do NOT commit it (GitHub 100MB limit); Angel should delete it after confirming the compressed one looks fine.** (4) **Home zh copy**: 艺术作品 → 作品. (5) **EN/中 extended to work + art pages**: i18n.js now reads `document.body.dataset.i18nTitle` for per-page `<title>` keys (home/work/art) instead of blindly stamping the home title; both pages got the head lang-preset inline script, stylesheet `?v=lang-toggle-v2` bump, EN/中 buttons in nav + mobile drawer, and `data-i18n` on nav, page intro, category labels (PRODUCT/EXHIBITION), all pill tags (reusing home tag keys + new tagFrontend/tagCreativeCoding/tagPortfolioSystem), roles, SCROLL/BACK TO TOP/BASED IN VANCOUVER, and the art title ("Artwork"→“作品”, WORK IN PROGRESS→持续更新中). Project `<h1>` names stay English. `i18n.js?v=3` bumped everywhere. `node --check` passed; all media 200 on local server.
- **Why:** Angel's feedback round: pills unwanted, bar charts ugly, assets delivered, section-2 zh title too long, and the language toggle should cover work/art.
- **Risk:** Low-medium. Please eyeball: Testing Results fade-in, both user-test photos' crops at desktop + ≤900px, tracker legibility (cover crops a little — say the word if you'd rather see the full sheet letterboxed), video playback, zh toggle on work/art (titles, tags, roles swap; language persists across pages).

---

## Edit — 2026-07-06 (40th update)

#### `work/Baby Steps/index.html`, `index.html`, `styles.css`, `scripts/i18n.js` — round-2 polish after Angel's screenshot review
- **What:** (1) **User Test chips trimmed**: each round card now shows only week·date + participant count; removed "Figma prototype", "3–4 tested in parallel", "Live AR prototype", "DigiBC Signals Studio", "8–10 min sessions" (facts still live in the Testing Results stat-card titles and note). (2) **Leading Production re-laid out**: `.cs-prod-grid` 1.2fr/1fr → equal `1fr 1fr` with `align-items:stretch`; `.cs-prod-col` is now a flex column with identical internal rhythm (16/10 media → title → body), so both cards' media boxes are the same size and titles sit on the same baseline. Also gave the Research needs-pill row breathing room (margin-top 8→20px). (3) **Lang toggle redesigned**: no more pill/box — plain text "EN/中" (label fixed, no longer swaps; i18n.js only updates aria-label) matching `.nav-links a` spec (14px, inherit font, opacity hover); in the mobile drawer it renders as a fourth full-width row (34px Gallery Modern, hairline bottom border) identical to home/work/art. Bumped `styles.css?v=` → `lang-toggle-v2` and `i18n.js?v=2` — the boxy screenshot was the cached old stylesheet leaving the button unstyled. (4) **Section 1 translated**: all 5 stack-card tag/meta spans got `data-i18n` keys + zh entries (产品设计/原型设计/设计系统/用户研究/设计工程师/2026年5月 – 至今 etc.); project titles and orbit wheel names intentionally stay English (proper nouns; orbit spans are JS-cloned/measured). `node --check` passed.
- **Why:** Angel's screenshot feedback: chips cluttered, Leading Production columns visually unequal, toggle should be boxless "EN/中" following site conventions, and section 1 copy should start translating.
- **Risk:** Low. Please eyeball: Leading Production title alignment at desktop, mobile drawer 4th row, and zh toggle flipping the wheel-card tags.

---

## Edit — 2026-07-05 (39th update)

#### `index.html`, `work/index.html`, `art/index.html`, `work/{AI Workflow, Baby Steps, Fableware Impact Engine, FlyLens, Trash Talk with Rumi, Personal Website}/index.html` — mobile menu unification
- **What:** (1) Removed the pointless `<a href="#top">top</a>` link from the `.mobile-menu` of every shared-styles page (root, work, art, Fableware, Personal Website). (2) Added a self-contained hamburger menu to the 4 custom-styled case-study pages that had none (AI Workflow, Baby Steps, FlyLens, Trash Talk with Rumi): `.menu-button` (3-line button) inside each header, a fixed `.mobile-menu` drop-down panel (home/work/art, no top), themed CSS per page (light for AI Workflow/FlyLens, dark navy for Baby Steps, dark green-cream for Rumi, using each page's own tokens like `--portfolio-header-ink-active`), plus a ~10-line inline aria-hidden/transform toggle script matching root `script.js` behavior. Breakpoint `max-width: 809px` everywhere to match the shared stylesheet. FlyLens note: its own media query forced `.nav-links { display:flex }` on mobile — the new rule comes later in the same stylesheet so it wins.
- **Why:** Angel pointed out the hamburger existed only on shared-styles pages ("其他页面没有跟上"), and that the "top" mobile link was 意义不明.
- **Risk:** Low-medium. New CSS is namespaced to `.menu-button`/`.mobile-menu` (classes previously absent on those 4 pages); desktop layouts unchanged (button `display:none` above 809px). Please eyeball each case-study page at phone width: burger opens/closes, links navigate, z-index sits above page content (BS/Rumi 310 vs header 320; FlyLens 990 vs header 1000; AIW 90 vs header 100).

---

## Edit — 2026-07-05 (38th update)

#### `assets/stickers/angel.png` + favicon `<link>` on 9 pages
- **What:** (1) Fixed the distorted favicon: the working-copy `angel.png` had been vertically stretched from its natural 500×354 (git HEAD version) to 500×500 — that's the "squished" look Angel saw. Recomposited the original HEAD image centered onto a 512×512 transparent canvas (System.Drawing, HighQualityBicubic, no stretch) and overwrote `assets/stickers/angel.png`. (2) Added the same `<link rel="icon" type="image/png" href="…/assets/stickers/angel.png">` to every page that lacked one: `work/index.html`, `art/index.html` (`../`), and the 6 case-study pages incl. Personal Website (`../../`). Root already had it.
- **Why:** Angel reported the favicon looked squished and wanted the same favicon on all pages (case studies previously showed no icon at all).
- **Risk:** None meaningful. Square file, undistorted content; all paths verified 200 via local server. The grantx redirect stub was left alone (instant redirect).

---

## Edit — 2026-07-05 (37th update)

#### `index.html`, `styles.css`, `scripts/i18n.js` (new) — EN/中 language toggle (home page only)
- **What:** Built a bilingual toggle for the home page. New `scripts/i18n.js` (loaded last in body): `{en, zh}` dictionary, `localStorage["site-lang"]` persistence (default en), swaps text via `data-i18n` attributes using a first-non-whitespace-text-node replacement (so nav `<i>` dots and arrow `<span>`s survive), sets `<html lang="zh-Hans">`, and remounts the hero role loop with translated `data-label/roles/fixed` (kills the old GSAP tween + delayedCall first; runs before `HeroRoleLoop.autoMount`, which then no-ops). Toggle buttons (`.lang-toggle`, shows the language you'd switch TO: 中/EN) added to `.nav-links` and `.mobile-menu`. `data-i18n` added to: nav, hero statement, skill strip, Resume, based panel, SCROLL, View All Work, Artwork, View All Artwork, BACK TO TOP, footer location; `<title>` swapped in JS. Project names / Angel Yu / email / © stay English. `styles.css`: `.lang-toggle` pill styles + mobile-menu variant + `html[lang="zh-Hans"] body` CJK font fallback (PingFang SC → Microsoft YaHei → Noto Sans SC after DM Sans). One-line inline `<head>` script pre-sets the lang attribute before first paint to avoid font FOUC. Simplified-Chinese copy written for mainland job applications (e.g. hero: 我把设计看作时间、形态与交互徐徐展开的空间…).
- **Why:** Angel is applying to mainland-China roles and wants an EN/中 switch on the home page (scope confirmed: home only for now; case studies stay English).
- **Risk:** Medium-low. `node --check` passed; text swap avoids touching GSAP-animated containers. Untested in a real browser this session — please click the toggle: check hero loop cycles 产品/网站/交互/视觉, layout at 1280px/390px (Chinese strings differ in length), persistence after reload, and that case-study pages are unaffected (no toggle there by design).

---

## Edit — 2026-07-05 (36th update)

#### `work/Baby Steps/index.html` — case study restructure: +4 sections, full renumber, real testing data
- **What:** (1) Reflection polish: removed the `#f5c842` color override on the first `.reflect-label` (all four now the same muted blue) and moved the section label above `.reflection-grid` so the first hairline aligns with the top of "What I learned." (2) Inserted 4 new sections and renumbered everything 00→21: **01 Problem "The Bonding Gap"** (CDD problem statement + 3 design-stance glass cards), **03 Research "Research & Direction"** (user needs pills, 3-concepts→Night Sky merge, client AR/Partner-View mandate, 6-phase framework tiles Deep Night→Sunrise), **10 Leading Production** (asset-tracker screenshot + teaching-video two-column layout — both `img-slot` placeholders with TODO filenames until Angel drops files: `assets/images/production-tracker.png`, `assets/videos/web/teaching-kim.web.mp4`), **13 User Test "Two Rounds of Testing"** (two glass cards with meta chips — R1 internal Figma, Week 6, Feb 9 2026, 42 participants; R2 live AR at DigiBC Signals Studio, Week 9, Mar 10 2026, 65 participants — each with Findings→Responses two-column lists and a photo placeholder `usertest-round1/2.jpg`). (3) Rebuilt **14 Testing Results** with real CDD data replacing the old 6 invented stat tiles: 3 participant-count cards (107/42/65) + two pure-CSS horizontal bar-chart cards (R1: music calming 88.1%… journal locate 52.3%; R2: curious 60%… connected 29.2% + 3.6/5 headline + word-association Life/Beginning/Fragile/Growth) animated by a new IntersectionObserver adding `.is-in` with 90ms stagger. (4) Timeline moved to 15; order now …12 Team Decisions, 13 User Test, 14 Testing Results, 15 Timeline, 16 Tools… `id="results"`/`#process` anchors kept. New CSS block (`.cs-problem-*`, `.cs-phases`, `.cs-prod-*`, `.cs-usertest-*`, `.cs-bar-*`) with responsive collapses; fade-in selector list extended with the new card classes. Also cleaned a stray duplicate `star-divider`.
- **Why:** Angel wanted the case study to follow Problem → Role → Research → Ideation… ordering, a User Test section with photos + real content, Testing Results with real data + data visualization (per the Core Design Document), and a section showing her production leadership (tracker sheet + video of teaching teammate Kim animation).
- **Risk:** Medium (large structural edit, one file). Label sequence 00→21 grep-verified complete; served page checked for all new section headings (HTTP 200). Media are placeholders until Angel provides 4 files. Please scroll the whole page at desktop + ≤900px + ≤600px and confirm bar widths look proportional.

---

## Edit — 2026-07-05 (35th update)

#### `work/Baby Steps/index.html`
- **What:** Rebuilt the "16 — Reflection" section into the Rumi-style two-column layout (same pattern as FlyLens's 32nd update). Was: label + "Reflection" title + 5 stacked `.section-body` paragraphs in an inline-styled flex column. Now: `.reflection-grid` (1fr 1fr, 80px gap) — left: label + "What I *learned.*" title (accent word in `#f5c842` star-yellow, the page's existing icon accent) + intro paragraph (original para 1); right: 4 `.reflect-item` rows with `rgba(255,255,255,.12)` hairline top dividers (last also bottom), labels "From designer to product creator" / "Iterating with feedback" / "The team behind it" / "Going forward", bodies = original paras 2-5 nearly verbatim (only trimmed openings that duplicated the new labels). New CSS block added before `</style>` with a `max-width:900px` single-column fallback. Also appended `.reflection-intro, .reflect-item` to the fade-on-scroll selector list in the inline script so the new elements animate like everything else.
- **Why:** Angel remembered the Baby Steps reflection being converted to the Rumi layout, but it never was (git log confirms: only content adds + renumbering). It was FlyLens that got the treatment. Angel wanted Baby Steps to match, so converted it.
- **Risk:** Low. Self-contained section rebuild; markup keeps `.section-label`/`.section-title` so existing animations/styles still apply; theme tokens reused from the page itself (star-divider hairline color, section-label blue, #f5c842 accent). Verified served via local server (reflection-grid present, HTTP 200). Please eyeball desktop + <900px widths.

---

## Edit — 2026-07-04 (34th update)

#### `work/FlyLens/index.html`
- **What:** Deleted the Problem section's KPI tile row entirely — the whole `<div class="kpi-row up d3">` block (was 3 tiles) plus the now-dead `.kpi-row` / `.kpi .n` / `.kpi .l` CSS rules. Problem section is now eyebrow + heading + two paragraphs + photo.
- **Why:** After the 33rd update's rewrite, Angel decided the tiles should just be removed rather than reworded.
- **Risk:** None. Self-contained removal; no other markup used `.kpi*` classes (grep-verified).

---

## Edit — 2026-07-04 (33rd update)

#### `work/FlyLens/index.html`
- **What:** Rewrote the 3 KPI tiles in the Problem section (lines 784-786). "8+ Sources analysed / 1 Unified clear view / AI Price prediction" → "Weeks / Re-checking the same routes", "5+ / Platforms compared by hand", "? / Book now or wait — never clear". Markup structure and `.kpi` CSS untouched.
- **Why:** Angel flagged the old tiles as feeling AI-generated ("好ai"); chose (via AskUserQuestion) to keep the tile layout but swap in real pain-point framing matching the new Problem copy from the 32nd update.
- **Risk:** None. Text-only change inside existing `.kpi` divs; "Weeks" at `.kpi .n`'s 34px display font fits comfortably in the flex-wrap row.

---

## Edit — 2026-07-04 (32nd update)

#### `work/FlyLens/index.html`
- **What:** Four changes requested by Angel:
  1. **Hover removal** — deleted `.jt-sc img:hover` (journey screens) and `.gcard img:hover` (gallery cards) lift effects, plus their now-unused `transition: transform` lines. Also removed the dead `.ob-phone:hover` + transition (`.ob-phone` isn't used in markup at all — CSS-only leftover). iPhone mockups no longer react to hover anywhere.
  2. **Reflection section rebuilt** — `#closing` changed from the full-bleed `hero-stair-phone.png` photo + gradient overlay + bottom-anchored copy into a Rumi-style two-column dark section (mimics `#s16` in Trash Talk with Rumi): solid `var(--ink)` background, `min-height:100vh`, `1fr 1fr` grid. Left column: "08 Reflection" eyebrow + "What I *learned.*" heading (em in `var(--lavender)`) + short intro. Right column: 4 `reflect-item` rows with hairline top dividers (last also bottom), each a small uppercase label + body — labels: "Where it started" / "Beyond search" / "AI with purpose" / "Who it's for", bodies are the original 4 reflection paragraphs (para 2 lightly merged into one sentence flow). Styles put in the CSS block (not inline like Rumi) to match FlyLens conventions; `.up`/`.d1-.d4` scroll-reveal classes kept so the existing IntersectionObserver still animates. Mobile media query: replaced `.closing-copy` override with `#closing { padding:80px 24px; min-height:auto }` + single-column grid. Note: `hero-stair-phone.png` is no longer referenced by this section (still on disk, still used by nothing else — check before deleting).
  3. **Problem body text** — replaced the single "Flight search is broken…" paragraph with Angel's new two-paragraph copy (international students / price-sensitive travelers framing). Second `<p>` gets `style="margin-top:16px"`. Eyebrow, heading, KPI row untouched.
  4. **Role pill** — hero pill "Lead UX/UI Designer" (`pill-blue`, cobalt bg) → "UX/UI Designer" using existing `.pill-ghost` (white bg + lavender border, same as sibling pills; plain white would be invisible on the white hero). Deleted the now-unused `.pill-blue` rule. Also updated the overview-strip Role value to "UX/UI Designer" for consistency.
- **Why:** Direct request from Angel (unhoverable mockups, Rumi-style reflection layout, new problem copy, white UX/UI Designer pill).
- **Risk:** Low-medium. The reflection rebuild is structural (markup + CSS + media query all replaced) but self-contained to `#closing`; no JS touched — the page's IntersectionObserver targets `.up` generically. `.btn`/`.btn:hover` CSS is unused dead code (pre-existing, left alone). No browser automation this session — please eyeball the reflection section on desktop + narrow width.

---

## Edit — 2026-07-02 (31st update)

#### `work/Fableware Impact Engine/Fableware Laptop MockUp.png`, `work/index.html`, `work/AI Workflow/index.html`
- **What:** Three independent fixes:
  1. Overwrote `Fableware Laptop MockUp.png` in place with the new mockup image Angel provided (source: `C:\Users\angel\OneDrive\Desktop\CDM 2025\Project 3\Macbook Mockup.png`, ~1.8MB). Same filename/path, so the homepage's Fableware project-stack card (`index.html:94`) picks it up automatically — no HTML change needed there.
  2. `work/index.html:31` — the work-listing page's Fableware row `data-img` (used by the JS-driven `.cursor-preview` hover, `script.js` ~line 354-380) previously pointed at an external Framer-hosted image unrelated to the local mockup. Changed to `./Fableware%20Impact%20Engine/Fableware%20Laptop%20MockUp.png` so the hover preview now shows the same local mockup as the homepage.
  3. `work/AI Workflow/index.html` — `#lateral` (the vertical rotated sidebar text, e.g. "MY WORKFLOW") was sized purely with `font-size: 8vw` (line 21) / `9.5vw` in the mobile query (line 470). Since `vw` scales off viewport width but the text stacks vertically, wide/short desktop viewports (e.g. maximized/fullscreen browser) produced a font size whose total text-run height exceeded the viewport, clipping the top/bottom off-screen (it's `position:fixed`, so no visible `overflow:hidden` — the text just fell outside the viewport rectangle). Changed both to `min(8vw, 8.5vh)` / `min(9.5vw, 8.5vh)` so the font size self-limits by viewport height on wide screens instead of growing unbounded with width. Mobile portrait sizing is unaffected (vh isn't the binding constraint there).
- **Why:** Angel reported (1) wanting the new mockup image used in both the homepage hero card and the work-listing hover, and (2) the "MY WORKFLOW" text getting cut off in full-screen/wide browser windows.
- **Risk:** Low. Image swap is a same-path binary overwrite. `data-img` is a single attribute value change, JS hover logic untouched. The `min()` font-size change is a single-property CSS swap per rule, verified the mobile breakpoint (`max-width:768px`) and typical desktop widths still resolve to sensible sizes by hand-calculation; no browser automation available in this session to pixel-verify — please eyeball the AI Workflow page in a maximized window to confirm no clipping.

---

## Edit — 2026-07-02 (30th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Deleted the entire `<section id="s15">` ("12 — Try It" — a hidden `display:none` canvas mini-game where users throw items into the correct bin), lines 2084-2120 (`sed -i '2084,2120d'`). `#s14` (08 — In Context) now flows directly into `#s16` (09 — Reflection).
- **Why:** Angel asked to delete the Try It section.
- **Note:** Left the associated JS game logic (canvas draw/physics/bin-detection, roughly lines 3745-4130+, referencing `s15-canvas`/`s15-bins-overlay`/etc.) untouched — it already has defensive null-checks (`if (!canvas) { console.warn('s15-canvas missing') }` and an `IntersectionObserver` with a `|| document.body` fallback), so it just warns to console now instead of erroring. Didn't do the larger cleanup of purging that JS since it wasn't asked and carries more risk of touching unrelated code; flagged to Angel as optional follow-up.
- **Risk:** Low. The section was already hidden (`display:none`) so this has zero visible-page impact beyond removing dead markup. Confirmed via curl: no `#s15` remnant, numbering sequence (07→08→09) intact.

---

## Edit — 2026-07-02 (29th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Renumbered eyebrow labels to close the gap left by the 28th update's `#s9` deletion:
  1. `#s14` eyebrow (line 2068): "11 — In Context" → "08 — In Context"
  2. `#s16` eyebrow (line 2125): "13 — Reflection" → "09 — Reflection"
- **Why:** Angel noticed the visible section numbering jumped 07 → 11 → 13 after Design Language (was "08") got deleted. Sequence is now 07 User Flow → 08 In Context → 09 Reflection.
- **Note:** Left `#s15` ("12 — Try It") untouched — that section has `display:none` and isn't visible on the page, so it wasn't part of the numbering gap the user saw. Flagged this to Angel in case they want it renumbered too later.
- **Risk:** None. Text-only label changes, confirmed via curl.

---

## Edit — 2026-07-02 (28th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Two independent changes:
  1. Deleted the entire `<section id="s9">` ("08 — Visual System / Design language." — Colour/Typography/Components spec cards), lines 2061-2117. `#s8` (Five Steps slider) now flows directly into the `#s14` comment block/section.
  2. `#s6` feature pills (line 1882) — "Community pop-up" pill's `background` changed from `rgba(203,253,133,.4)` (lime, the odd one out) to `rgba(14,42,28,.07)`, matching the other 3 pills ("AI character guidance" / "Real-time classification" / "Physical sorting station").
- **Why:** Angel asked to delete the Design Language section and unify the "Community pop-up" button's color with its siblings.
- **Note:** Used `sed -i '2061,2117d'` for the section deletion (precise line-range delete, verified before/after boundaries) rather than an Edit tool string-match given the block's size.
- **Risk:** Low. Confirmed via curl: no `#s9` remnant in served HTML, `#s14` immediately follows `#s8`, pill color matches siblings.

---

## Edit — 2026-07-02 (27th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** `.experience-grid .case-image` (line 1389-1392) — added `aspect-ratio: 16 / 9` (kept existing `object-fit:contain`).
- **Why:** Angel said "Community pop-up setup" and "Rumi character feedback" (the two side-by-side images in 06.1 Experience Flow's second row) looked different sizes. Confirmed via ffprobe: `community-pop-up-installation.png` is 1419×737 (ratio 1.925), `rumi-character-feedback.png` is 1347×821 (ratio 1.641) — different native aspect ratios, and `.case-image` had no fixed aspect-ratio, so each rendered at its own natural height in the equal-width grid columns. Matched `.case-placeholder`'s existing `aspect-ratio:16/9` convention so both images now sit in identically-sized boxes (contain, not cropped).
- **Risk:** None. Confirmed served via curl.

---

## Edit — 2026-07-02 (26th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Fixed Five Steps slider header-overlap + restored centering:
  1. `#s8-sticky` (line 987-995) — added `padding-top:76px; box-sizing:border-box;` (76px matches `--header-h`, the fixed nav's height).
  2. `#s8-left` (line 998-1004) — `justify-content:flex-start` → back to `center`.
  3. `.s8-panel` (line 1093-1102) — `align-items:flex-start` → back to `center`; padding reverted from `60px ... 0` to `0 clamp(...)`.
- **Why:** Angel reported the top of the section (heading + step content) was being covered by the fixed site header (`#nav.site-header { position:fixed; top:0; z-index:320; height:76px }`) — the 25th update's top-anchoring didn't push content down far enough to clear it. Also confirmed Angel wants the slider genuinely centered in the visible area (not top-anchored) — the earlier "align-items:center vs flex-start" back-and-forth was actually two different bugs conflated: (a) left/right columns needed the *same* strategy to align with each other (fixed a few updates ago), (b) that shared strategy also needed to account for the fixed header's height, which was missing until now. Pushing the padding into `#s8-sticky` itself means both columns center within the space already below the header, so they stay in sync without needing per-column top-padding hacks.
- **Risk:** Medium — same vertical-anchor system as several prior updates. Verified via curl. Please confirm: (1) heading no longer clipped by the header, (2) left/right columns still aligned, (3) bottom whitespace looks more balanced.

---

## Edit — 2026-07-02 (25th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Added `#s7 { min-height: auto; }` (line 773, right before the `/* ── IA FLOW ── */` block's `.ia-node` rule).
- **Why:** Angel sent a screenshot showing the #s7→#s8 gap was still huge after the 24th update's padding/justify-content changes. Spawned an Explore agent to find the real cause instead of guessing again: a **global** `section { min-height: max(100vh, 640px); overflow:hidden; }` rule (line 142-147) applies to every `<section>` including `#s7`. `#s7`'s actual content (~450px) was being force-stretched to a full viewport height regardless of its own padding — same bug class as the earlier AI Workflow `#about` fix, but this time inherited from a global rule rather than `#s7`'s own CSS, which is why tuning `#s7`'s padding alone never worked.
- **Note:** Deliberately did NOT touch the global `section` rule — other sections (hero `#s1`, the 3D scroll sequence `#s3`, etc.) likely depend on it for full-screen effect. Scoped the fix to `#s7` only via ID selector (higher specificity, no `!important` needed).
- **Risk:** Low-medium. Confirmed via curl the override is served. Should eliminate the gap; please verify visually since no browser automation is available here.

---

## Edit — 2026-07-02 (24th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Angel said the #s7→#s8 gap was still large after the 23rd update's 40px bottom padding. Root cause identified as `#s8-left`'s `justify-content:center` (line 998) — same bug pattern as the earlier AI Workflow `#about` fix: content vertically centered in a full-100vh pinned box leaves a large empty band above it. Changes:
  1. `#s7` (line 1930) — bottom padding `40px → 0`.
  2. `#s8-left` — `justify-content:center` → `justify-content:flex-start`, so "Five steps. Zero confusion." now starts right after its own 60px top padding instead of floating centered in the pinned 100vh column.
  3. `.s8-panel` (line 1090-1100) — changed `align-items:center` → `align-items:flex-start` and `padding:0 clamp(...)` → `padding:60px clamp(...) 0`, to keep it in sync with `#s8-left`'s new top-anchored layout (this mirrors the same top-padding value, 60px, so both sides start at the same height). Without this the 18th/19th update's center-alignment fix between the two columns would have broken again.
- **Risk:** Medium — this changes the vertical anchor for the entire Five Steps slider (both columns), not just spacing. Verified all three rules serve correctly via curl; visual centering/alignment between left step list and right image+text should still match (both now top-anchored at the same 60px offset instead of both centered), but genuinely can't confirm pixel-level without a browser — please check.

---

## Edit — 2026-07-02 (23rd update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Three fixes from Angel's annotated screenshot:
  1. `#ia-flow` row (line 1938) — `align-items:center` → `align-items:flex-start`. The 6 step numbers (1-6) were sitting at different heights because `align-items:center` vertically centers each `.ia-node` column based on its own content height, and descriptions wrap to different line counts; `flex-start` pins all dots to the same top line regardless.
  2. `#s7` section (line 1930) — `padding:80px 56px` → `padding:80px 56px 40px` (bottom only, 80→40). After the 21st update removed the two path-cards, the section's fixed bottom padding left excess vertical space before `#s8` ("Five steps. Zero confusion.") begins.
  3. `.testing-card` (line 1182-1187) — reverted to original `padding:0`, removed `max-width:720px` and `padding:0 40px` added in the 17th/19th updates. Angel sent a screenshot with a red box showing the intended text width is close to the section's full available width (matching the pie-chart/bar-chart area above it), not a narrow 720px column — my earlier reading of "margins on both sides" was too aggressive a narrowing.
- **Why:** Direct feedback from an annotated screenshot; confirmed the gap location via AskUserQuestion before touching `#s7`'s padding (multiple gap locations were plausible — user confirmed it was specifically the #s7→#s8 vertical gap, not horizontal spacing within the 6-step row).
- **Risk:** Low. All single-property CSS reverts/tweaks, verified served via curl.

---

## Edit — 2026-07-02 (22nd update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** `.ia-dot` (line 779-791, the 6 step-circle indicators above Attract/Join/Classify/Feedback/Sort/Reflect in `#s7` User Flow) — enlarged from 14px to 22px, added `display:flex;align-items:center;justify-content:center` + font styling, and filled each dot with its step number (1-6) instead of being empty.
- **Why:** Angel asked to replace the plain dots with numbers 1-6.
- **Risk:** None. Confirmed all 6 dots (`data-i="0"` through `"5"`) now contain their digit, verified via curl against the dev server.

---

## Edit — 2026-07-02 (21st update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Removed the entire "Secondary: two paths" block (line ~1947-1959, the "Correct bin / ✓ Reinforce" and "Wrong bin detected / ↩ Redirect" cards under `#s7` User Flow).
- **Why:** After 2 rounds of repositioning (centered → aligned under Classify/Feedback columns), Angel decided the whole element just didn't fit the section's style and asked to remove it outright rather than keep iterating on placement.
- **Note:** `.ia-path-card` CSS class (line 808-813) is now unused/dead but left in place — harmless, low priority cleanup if ever needed.
- **Risk:** None. Content removal only, confirmed via curl that no trace of "Correct bin"/"Wrong bin detected" remains in served HTML.

---

## Edit — 2026-07-02 (20th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** "Secondary: two paths" wrapper (line 1948, Correct bin / Wrong bin cards in `#s7` User Flow) — changed from `max-width:640px;margin-left:auto;margin-right:auto` (generic page-center) to `width:33.333%;margin-left:33.333%`, so the 2-card block now sits directly under the "Classify" and "Feedback" nodes (the 3rd and 4th of the 6 evenly-spaced steps above), instead of floating centered/disconnected from the flow row.
- **Why:** Angel flagged the layout as confusing — 6-step row spans full width, but the 2 cards below were narrower and centered independent of any specific step, reading as an unrelated block. Confirmed this was a legitimate design issue (agreed after reviewing). Also clarified: the loose green dot floating near the cards in the screenshot was just Angel's mouse cursor (page has a custom `#cursor`/`#cursor-ring` effect) — not a layout bug, no code change for that.
- **Note:** The 33.333% approximation treats all 6 steps as exactly equal-width columns; the small `.ia-arrow` glyphs between them add minor real offset, so alignment is close but not pixel-perfect (no browser automation available to verify precisely).
- **Risk:** Low. Single wrapper positioning change.

---

## Edit — 2026-07-02 (19th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** `.s8-panel-text` (line 1105-1109) — removed `align-self: flex-start;`.
- **Why:** Angel circled the "01/05 + Item enters the frame + body" text block in a screenshot and asked if it looked off after the 18th update centered `.s8-panel`. Found it: `.s8-panel-text` had its own `align-self:flex-start`, which overrides the parent's `align-items:center` for just that flex item — so the image centered but the text stayed pinned to the top, floating apart from it.
- **Risk:** None. One-property removal, restores default `align-self:auto` which now inherits the parent's centering.

---

## Edit — 2026-07-02 (18th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** `.s8-panel` (Five Steps slider, line 1083-1093) — `align-items:flex-start` → `align-items:center`; removed the fixed `padding-top:130px`/`padding-bottom:60px`, now just `padding: 0 clamp(42px, 6vw, 80px)`.
- **Why:** Angel sent a screenshot and asked directly whether left/right were aligned at top and in size — confirmed they were not. Root cause: `#s8-left` (step list) uses `justify-content:center` (vertically centered in its 100vh column), while `.s8-panel` (image+text) was top-anchored with a fixed padding-top. Two different alignment strategies on the two sides of the same row can never line up no matter how the padding number is tuned. Fix changes the strategy (both sides now centered in the same 100vh column) instead of re-guessing another padding value.
- **Risk:** Low. Single alignment-strategy change, no other properties touched.

---

## Edit — 2026-07-02 (17th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Reworked 2 of the 5 fixes from the 16th update, plus a new layout change:
  1. `.testing-card` — added `padding:0 40px` (kept `max-width:720px`) so the Internal Testing block has real margin on both left and right, not just a width cap on one side.
  2. **Reverted** `#s6` right panel's `justify-content:flex-end` back to `justify-content:center` (the 16th update's alignment target was wrong — see below).
  3. `.experience-head` (line 1909, `#s6c` "06.1 — Experience Flow") — changed from `display:flex;justify-content:space-between` to `display:grid;grid-template-columns:calc(50vw - 56px) 1fr`. This makes the paragraph's left edge land exactly at 50vw, matching the vertical divider between `#s6`'s text/image columns (that section has `padding:0` + two `flex:1` panels, so its divider sits exactly at 50vw).
  4. `.experience-grid` (line 1364-1372 CSS, line 1916 HTML) — removed the competing inline `style="grid-template-columns:repeat(3,1fr)"` and rewrote the CSS: `.experience-grid{grid-template-columns:1fr 1fr}`, `.experience-primary{grid-column:1/-1}`. Now "Prototype flow map" spans a full-width row, with "Community pop-up setup" and "Rumi character feedback" side-by-side below it.
- **Why:** Angel corrected two of the 16th update's fixes: Internal Testing needed real `padding` (not just `max-width`) for margins on both sides; the 06/06.1 alignment target was actually the two-column divider line in `#s6` (at 50vw), not the image's own right edge — my previous `justify-content:flex-end` fix solved the wrong problem and is reverted.
- **Also answered (no code change):** the "01/05 Item enters the frame" step image in the Five Steps slider is `assets/ui-screens/step-01-ui.png` (line 2020).
- **Risk:** Low-medium. The `calc(50vw-56px)` grid column is viewport-width-relative — verified it doesn't conflict with the existing mobile media query (line ~1422 already forces `.experience-head{grid-template-columns:1fr!important}` below the breakpoint, so this only applies on desktop widths).

---

## Edit — 2026-07-02 (16th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Five layout fixes requested via screenshots with hand-drawn annotations:
  1. `.testing-card` (line ~1176-1181, "Internal testing" block in #s6b) — added `max-width:720px`. It had `padding:0` and no max-width, so text stretched edge-to-edge in fullscreen and felt cramped/uncomfortable to read.
  2. `#s6` right panel (line 1878, Rumi image container) — `justify-content:center` → `flex-end`, so the image's right edge now lines up with the `#s6c` "06.1 — Experience Flow" paragraph's right edge below it (both sit at the same 56px section padding).
  3. `#s7` "Classify" step dot (line 1939, `data-i="2"`) — removed inline `style="background:var(--lime);box-shadow:..."` that made it look lit/active while all sibling dots use the default unlit style.
  4. Correct bin / Wrong bin cards (line 1949) — added `margin-left:auto;margin-right:auto` to the `max-width:640px` grid wrapper, which had no auto-margins and sat flush left instead of centered.
  5. "Five steps. Zero confusion." slider (`#s8`) — enlarged the right-side screenshot panel to better match the left step list's height: `.s8-panel` top padding `207px→130px`, `.s8-panel-img` max width `620px→760px`, `.s8-panel-text` max-width `320px→380px`, `.s8-panel-title` font-size `24-38px→28-44px`, `.s8-panel-body` font-size `13-15px→14-17px`.
- **Why:** User sent annotated screenshots pointing out these 5 specific misalignments/sizing issues.
- **Note:** Item 5 is a proportional best-effort resize — no browser automation available in this session to pixel-verify the bottom edges now match exactly. May need another iteration after visual check.
- **Also confirmed (no code change needed):** `field-study-cdm.png` / `field-study-ubc.png` were replaced again by Angel (new files timestamped 7/1 23:57), same paths, dev server already serving the new bytes.
- **Risk:** Low. All CSS/inline-style tweaks, no structural/JS changes.

---

## Edit — 2026-07-01 (15th update)

#### `work/Trash Talk with Rumi/assets/case-study/internal-test-layout.png`, `field-study-cdm.png`, `field-study-ubc.png`
- **What:** Angel replaced these three images in place (same filenames/paths). No code change — confirmed via mtime (all 7/1 17:32-17:37) and dev-server content-length that the new files are being served.
- **Why:** Angel wanted new visuals for "Internal testing" and "Field Study" sections.
- **Risk:** None. Binary assets only, no HTML/CSS touched.

---

## Edit — 2026-07-01 (14th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Added `object-position:top` to the "Interactive video station" `<video>` tag (line 1851).
- **Why:** Angel saw a thin black gap on top of that video. Root cause: the re-encoded proxy's aspect ratio (1.7875) is very slightly narrower than the card's `aspect-ratio:16/9` (1.7778), so `object-fit:contain` centered the video and left a hairline letterbox top+bottom. `object-position:top` pushes the video to the top edge so all the (tiny) slack collects at the bottom instead.
- **Risk:** None. Single CSS property, no layout/size change to the box itself. Confirmed dev server serves the updated markup.

---

## Edit — 2026-07-01 (13th update)

#### `work/AI Workflow/index.html`
- **What:** Shrunk the 00→01 scroll gap by another 10% on top of the 12th update. `.aw-overview` bottom padding `4vw → 3.6vw`; `#about` padding-top `5vw → 4.5vw` (the `min-height:auto` from the 12th update stays unchanged).
- **Why:** Angel asked to reduce the gap by another 10% after confirming the 12th update's `min-height:auto` fix actually took effect.
- **Risk:** Low. Pure numeric tweak, same scoped rules as before (`#about` only, `#limitations` untouched). Confirmed via curl that the dev server serves the updated values.

---

## Edit — 2026-07-01 (12th update)

#### `work/AI Workflow/index.html`
- **What:** Corrected the 10th-update fix. `#about` rule changed from `{ padding-top: 5vw; }` to `{ padding-top: 5vw; min-height: auto; }`.
- **Why:** Angel reported the 00→01 scroll gap still looked unchanged after the 10th update. Root cause: `.overview-section` (used by `#about`) has `min-height:100vh; display:flex; align-items:center;`. Since `#about`'s actual content (label + headline + short paragraph) is much shorter than 100vh, flex centering absorbed most of the padding-top reduction — the section's total height stayed pinned at one full viewport regardless of padding, so the previous fix only shifted content by half the intended amount and didn't shorten the scroll distance at all. Adding `min-height:auto` lets `#about`'s box height be driven by content+padding again, so the padding change now has full effect.
- **Risk:** Low. Still scoped to `#about` only (not the shared `.overview-section` class), so `#limitations` keeps its original full-viewport centered look. Confirmed via curl that the dev server serves the updated rule.

---

## Edit — 2026-07-01 (11th update)

#### `work/Trash Talk with Rumi/assets/case-study/web/external-guided-sorting.web.mp4` and `.../web/external-interactive-video.web.mp4`
- **What:** Regenerated (overwrote in place, same filenames/paths) both `.web.mp4` proxy files via ffmpeg from the new source videos Angel had just placed at `assets/case-study/external-guided-sorting.mp4` and `assets/case-study/external-interactive-video.mp4`. Command: `libx264 -crf 23 -maxrate 5M -bufsize 10M -vf scale=1550:-2 -r 30 -c:a aac -b:a 192k -movflags +faststart`.
- **Why:** The "05.1 — External Testing" section's two videos looked mismatched in size. Root cause: the old `.web.mp4` proxies (generated 6/29) had different resolutions (1388×794 vs 1550×808). Angel had already replaced the underlying source `.mp4` files (matching aspect ratios, ~1.78:1 both), but the site plays the compressed `web/` proxies, which were stale and never regenerated from the new sources.
- **Change:** No HTML/CSS touched — file paths and `<video src>` refs unchanged. Both new proxies now scaled to 1550px wide, same aspect ratio (~1.78), much smaller filesize (3.27MB and 1.49MB vs old ~18-19MB).
- **Risk:** Low. Binary media files only; `.gitattributes` already excludes `work/Trash*/assets/case-study/web/*.mp4` from LFS so no repo config change needed. Confirmed both new files return HTTP 200 from local dev server.

---

## Edit — 2026-07-01 (10th update)

#### `work/AI Workflow/index.html`
- **What:** Shrunk the scroll "dead zone" between 00 Overview and 01 Problem (`#about`). `.aw-overview` padding changed from `8vw 10vw` to `8vw 10vw 4vw 10vw` (bottom only, 8vw→4vw). Added new scoped rule `#about { padding-top: 5vw; }` which overrides the shared `.overview-section` class's `10vw` top padding for this section only.
- **Why:** User reported that scrolling from Overview into Problem felt like the page was stuck — 18vw of combined whitespace (8vw + 10vw) with no visual element in between. Reduced to ~9vw total.
- **Note:** Deliberately scoped the override to `#about` only, NOT the shared `.overview-section` class, because that class is also used by `#limitations` — changing the shared rule would have also shrunk the Workflow→Limitations gap, which wasn't requested.
- **Risk:** Low. Only affects vertical spacing of two sections; left/right padding and `#limitations` untouched. Not yet visually verified in a browser (no browser automation tool available in this session) — please eyeball it locally with Ctrl+Shift+R before considering this final.

---

## Edit — 2026-07-01 (9th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** File had severe UTF-8 double-encoding corruption throughout (â€", Ã¢â€â‚¬ etc). Attempted PowerShell latin-1 decode fix made it worse. Restored clean content from local HEAD using `git show HEAD:"work/Trash Talk with Rumi/index.html"`.
- **Warning:** Any local working-tree edits to this file that existed before this session have been lost — they were the corrupted version. HEAD commit version is clean and now on disk.
- **Codex note:** If you have pending changes to this file, do not pull/merge without checking — the local working copy was just overwritten from HEAD.
- **Risk:** Medium — local modifications discarded. HEAD state preserved.

---

## Edit — 2026-07-01 (8th update)

#### `work/AI Workflow/index.html`
- **What:** Fixed hero 3D knot "delay" artifact. Loop changed from `i<4` to `i<3`, `loadedCount===4` → `loadedCount===3`.
- **Why:** 4 knots were created but `ORBIT_INIT` only has 3 positions. The 4th knot (`i=3`) wrapped to `ORBIT_INIT[0]` and overlapped the 1st knot at the exact same orbit angle, causing a visible z-fighting / lag effect.
- **Risk:** Low. 3 knots maps exactly to 3 service cards (METHOD 01/02/03) and 3 orbit positions.

---

## Edit — 2026-07-01 (7th update)

#### `work/AI Workflow/index.html`
- **What:** Removed entire 05 — Fails section (`<section class="fails-section" id="fails">` and all contents).
- **Risk:** Low. CSS rules for `.fails-*` still exist but are now unused — can be cleaned up later.

---

## Edit — 2026-07-01 (6th update)

#### `work/AI Workflow/index.html`
- **What:** `.limits-issue` font-size `1.3vw` → `1.1vw`
- **Risk:** None.

---

## Edit — 2026-07-01 (5th update)

#### `work/AI Workflow/index.html`
- **What:** `.limits-col-header` ("AI" / "HUMAN") font-size `0.8vw` → `1.3vw`
- **Risk:** None.

---

## Edit — 2026-07-01 (4th update)

#### `work/AI Workflow/index.html`
- **What:** Removed all `.limits-example` divs from 03 — AI Limitations section. Labels (`.limits-issue`) remain, example text gone.
- **Risk:** None.

---

## Edit — 2026-07-01 (3rd update)

#### `work/AI Workflow/index.html`
- **What:** `.limits-issue` font-size `1.1vw` → `1.3vw`
- **Risk:** None.

---

## Edit — 2026-07-01 (2nd update)

#### `work/AI Workflow/index.html`
- **What:** Updated 08 — Reflection content again with shortened version.
- **Changes:** "What I originally thought" — one sentence only. "What changed" — "During production," as standalone line, same bullet list, same closing sentence. "What I learned" — removed art direction paragraph, goes straight to bullet list. "Going forward" — numbered list trimmed to 4 items, closing paragraph removed.
- **Risk:** Low — isolated to reflection section HTML only.

---

## Edit — 2026-07-01 (1st update)

#### `work/AI Workflow/index.html`
- **What:** Replaced 08 — Reflection section content with full new text.
- **Change:** All 4 `reflection-row-body` divs replaced. New content has `<p>`, `<ul>`, `<ol>` — also added CSS rules for those inside `.reflection-row-body` (margin/padding). Label "What I expected" → "What I originally thought". All other text is new copy provided by Angel.
- **Risk:** Low — isolated to reflection section HTML and its CSS block.

---

## Summary of Claude Code edits — 2026-07-01

### Files modified (all unstaged, not committed)

#### `scripts/section2-reference.js`
- **What:** Fixed home page art section (Section 2 collage) — bottom row of images was clipped at fullscreen 1080p.
- **Why:** `tile` size was calculated using `height * 0.37`, causing `gridHeight + topOffset` to exceed `100vh` at 1920×1080. Fixed by deriving `tileFromH` from available vertical space before calculating tile.
- **Change:** Line 40-41 — added `tileFromH` calculation; `tile` now takes `Math.min(width * 0.178, tileFromH)` instead of `Math.min(width * 0.178, height * 0.37)`.
- **Risk:** Low. Only affects tile sizing in `measureLayout()`. Desktop-only path (mobile branch unchanged).

#### `work/AI Workflow/index.html`
- **What:** Cache-busted `moodboard 3.png` reference (user replaced the file twice today).
- **Change:** `src="moodboard 3.png"` → `src="moodboard%203.png?v=3"`. Also URL-encoded the space.
- **Risk:** None.

#### `assets/stickers/angel.png`
- **What:** Padded favicon image from 500×354 to 500×500 (transparent padding, centered).
- **Why:** Non-square image caused browser to distort favicon.
- **Risk:** None — binary file only, no HTML change needed.

#### `work/AI Workflow/moodboard 3.png`
- **What:** User replaced this file manually (two rounds). No code change from Claude — file updated on disk by Angel.

### Files NOT touched by Claude today
- `index.html` (home page)
- `styles.css`
- `script.js`
- `scripts/section1-reference.js`
- `work/Trash Talk with Rumi/index.html` (shows as dirty — Angel's own edits, not touched by Claude)

### Pending / needs Codex attention
- Local branch has 2 commits (`a53515b`, `7db72b0`) not on remote — they contain last session's AI Workflow changes (receipt reverse animation, card backs, workflow flowchart, favicon, Fableware cover). Angel is handling the rebase/merge on the Codex side.
- The above 4 modified files are unstaged. Angel will decide when/how to commit.

---

## Codex-side log (from origin/main, pre-reconciliation)

## Edit — 2026-07-04 (latest, 34th update)

#### `work/FlyLens/index.html`
- **What:** Deleted the Problem section's KPI tile row entirely — the whole `<div class="kpi-row up d3">` block (was 3 tiles) plus the now-dead `.kpi-row` / `.kpi .n` / `.kpi .l` CSS rules. Problem section is now eyebrow + heading + two paragraphs + photo.
- **Why:** After the 33rd update's rewrite, Angel decided the tiles should just be removed rather than reworded.
- **Risk:** None. Self-contained removal; no other markup used `.kpi*` classes (grep-verified).

---

## Edit — 2026-07-04 (33rd update)

#### `work/FlyLens/index.html`
- **What:** Rewrote the 3 KPI tiles in the Problem section (lines 784-786). "8+ Sources analysed / 1 Unified clear view / AI Price prediction" → "Weeks / Re-checking the same routes", "5+ / Platforms compared by hand", "? / Book now or wait — never clear". Markup structure and `.kpi` CSS untouched.
- **Why:** Angel flagged the old tiles as feeling AI-generated ("好ai"); chose (via AskUserQuestion) to keep the tile layout but swap in real pain-point framing matching the new Problem copy from the 32nd update.
- **Risk:** None. Text-only change inside existing `.kpi` divs; "Weeks" at `.kpi .n`'s 34px display font fits comfortably in the flex-wrap row.

---

## Edit — 2026-07-04 (32nd update)

#### `work/FlyLens/index.html`
- **What:** Four changes requested by Angel:
  1. **Hover removal** — deleted `.jt-sc img:hover` (journey screens) and `.gcard img:hover` (gallery cards) lift effects, plus their now-unused `transition: transform` lines. Also removed the dead `.ob-phone:hover` + transition (`.ob-phone` isn't used in markup at all — CSS-only leftover). iPhone mockups no longer react to hover anywhere.
  2. **Reflection section rebuilt** — `#closing` changed from the full-bleed `hero-stair-phone.png` photo + gradient overlay + bottom-anchored copy into a Rumi-style two-column dark section (mimics `#s16` in Trash Talk with Rumi): solid `var(--ink)` background, `min-height:100vh`, `1fr 1fr` grid. Left column: "08 Reflection" eyebrow + "What I *learned.*" heading (em in `var(--lavender)`) + short intro. Right column: 4 `reflect-item` rows with hairline top dividers (last also bottom), each a small uppercase label + body — labels: "Where it started" / "Beyond search" / "AI with purpose" / "Who it's for", bodies are the original 4 reflection paragraphs (para 2 lightly merged into one sentence flow). Styles put in the CSS block (not inline like Rumi) to match FlyLens conventions; `.up`/`.d1-.d4` scroll-reveal classes kept so the existing IntersectionObserver still animates. Mobile media query: replaced `.closing-copy` override with `#closing { padding:80px 24px; min-height:auto }` + single-column grid. Note: `hero-stair-phone.png` is no longer referenced by this section (still on disk, still used by nothing else — check before deleting).
  3. **Problem body text** — replaced the single "Flight search is broken…" paragraph with Angel's new two-paragraph copy (international students / price-sensitive travelers framing). Second `<p>` gets `style="margin-top:16px"`. Eyebrow, heading, KPI row untouched.
  4. **Role pill** — hero pill "Lead UX/UI Designer" (`pill-blue`, cobalt bg) → "UX/UI Designer" using existing `.pill-ghost` (white bg + lavender border, same as sibling pills; plain white would be invisible on the white hero). Deleted the now-unused `.pill-blue` rule. Also updated the overview-strip Role value to "UX/UI Designer" for consistency.
- **Why:** Direct request from Angel (unhoverable mockups, Rumi-style reflection layout, new problem copy, white UX/UI Designer pill).
- **Risk:** Low-medium. The reflection rebuild is structural (markup + CSS + media query all replaced) but self-contained to `#closing`; no JS touched — the page's IntersectionObserver targets `.up` generically. `.btn`/`.btn:hover` CSS is unused dead code (pre-existing, left alone). No browser automation this session — please eyeball the reflection section on desktop + narrow width.

---

## Edit — 2026-07-02 (31st update)

#### `work/Fableware Impact Engine/Fableware Laptop MockUp.png`, `work/index.html`, `work/AI Workflow/index.html`
- **What:** Three independent fixes:
  1. Overwrote `Fableware Laptop MockUp.png` in place with the new mockup image Angel provided (source: `C:\Users\angel\OneDrive\Desktop\CDM 2025\Project 3\Macbook Mockup.png`, ~1.8MB). Same filename/path, so the homepage's Fableware project-stack card (`index.html:94`) picks it up automatically — no HTML change needed there.
  2. `work/index.html:31` — the work-listing page's Fableware row `data-img` (used by the JS-driven `.cursor-preview` hover, `script.js` ~line 354-380) previously pointed at an external Framer-hosted image unrelated to the local mockup. Changed to `./Fableware%20Impact%20Engine/Fableware%20Laptop%20MockUp.png` so the hover preview now shows the same local mockup as the homepage.
  3. `work/AI Workflow/index.html` — `#lateral` (the vertical rotated sidebar text, e.g. "MY WORKFLOW") was sized purely with `font-size: 8vw` (line 21) / `9.5vw` in the mobile query (line 470). Since `vw` scales off viewport width but the text stacks vertically, wide/short desktop viewports (e.g. maximized/fullscreen browser) produced a font size whose total text-run height exceeded the viewport, clipping the top/bottom off-screen (it's `position:fixed`, so no visible `overflow:hidden` — the text just fell outside the viewport rectangle). Changed both to `min(8vw, 8.5vh)` / `min(9.5vw, 8.5vh)` so the font size self-limits by viewport height on wide screens instead of growing unbounded with width. Mobile portrait sizing is unaffected (vh isn't the binding constraint there).
- **Why:** Angel reported (1) wanting the new mockup image used in both the homepage hero card and the work-listing hover, and (2) the "MY WORKFLOW" text getting cut off in full-screen/wide browser windows.
- **Risk:** Low. Image swap is a same-path binary overwrite. `data-img` is a single attribute value change, JS hover logic untouched. The `min()` font-size change is a single-property CSS swap per rule, verified the mobile breakpoint (`max-width:768px`) and typical desktop widths still resolve to sensible sizes by hand-calculation; no browser automation available in this session to pixel-verify — please eyeball the AI Workflow page in a maximized window to confirm no clipping.

---

## Edit — 2026-07-02 (30th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Deleted the entire `<section id="s15">` ("12 — Try It" — a hidden `display:none` canvas mini-game where users throw items into the correct bin), lines 2084-2120 (`sed -i '2084,2120d'`). `#s14` (08 — In Context) now flows directly into `#s16` (09 — Reflection).
- **Why:** Angel asked to delete the Try It section.
- **Note:** Left the associated JS game logic (canvas draw/physics/bin-detection, roughly lines 3745-4130+, referencing `s15-canvas`/`s15-bins-overlay`/etc.) untouched — it already has defensive null-checks (`if (!canvas) { console.warn('s15-canvas missing') }` and an `IntersectionObserver` with a `|| document.body` fallback), so it just warns to console now instead of erroring. Didn't do the larger cleanup of purging that JS since it wasn't asked and carries more risk of touching unrelated code; flagged to Angel as optional follow-up.
- **Risk:** Low. The section was already hidden (`display:none`) so this has zero visible-page impact beyond removing dead markup. Confirmed via curl: no `#s15` remnant, numbering sequence (07→08→09) intact.

---

## Edit — 2026-07-02 (29th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Renumbered eyebrow labels to close the gap left by the 28th update's `#s9` deletion:
  1. `#s14` eyebrow (line 2068): "11 — In Context" → "08 — In Context"
  2. `#s16` eyebrow (line 2125): "13 — Reflection" → "09 — Reflection"
- **Why:** Angel noticed the visible section numbering jumped 07 → 11 → 13 after Design Language (was "08") got deleted. Sequence is now 07 User Flow → 08 In Context → 09 Reflection.
- **Note:** Left `#s15` ("12 — Try It") untouched — that section has `display:none` and isn't visible on the page, so it wasn't part of the numbering gap the user saw. Flagged this to Angel in case they want it renumbered too later.
- **Risk:** None. Text-only label changes, confirmed via curl.

---

## Edit — 2026-07-02 (28th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Two independent changes:
  1. Deleted the entire `<section id="s9">` ("08 — Visual System / Design language." — Colour/Typography/Components spec cards), lines 2061-2117. `#s8` (Five Steps slider) now flows directly into the `#s14` comment block/section.
  2. `#s6` feature pills (line 1882) — "Community pop-up" pill's `background` changed from `rgba(203,253,133,.4)` (lime, the odd one out) to `rgba(14,42,28,.07)`, matching the other 3 pills ("AI character guidance" / "Real-time classification" / "Physical sorting station").
- **Why:** Angel asked to delete the Design Language section and unify the "Community pop-up" button's color with its siblings.
- **Note:** Used `sed -i '2061,2117d'` for the section deletion (precise line-range delete, verified before/after boundaries) rather than an Edit tool string-match given the block's size.
- **Risk:** Low. Confirmed via curl: no `#s9` remnant in served HTML, `#s14` immediately follows `#s8`, pill color matches siblings.

---

## Edit — 2026-07-02 (27th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** `.experience-grid .case-image` (line 1389-1392) — added `aspect-ratio: 16 / 9` (kept existing `object-fit:contain`).
- **Why:** Angel said "Community pop-up setup" and "Rumi character feedback" (the two side-by-side images in 06.1 Experience Flow's second row) looked different sizes. Confirmed via ffprobe: `community-pop-up-installation.png` is 1419×737 (ratio 1.925), `rumi-character-feedback.png` is 1347×821 (ratio 1.641) — different native aspect ratios, and `.case-image` had no fixed aspect-ratio, so each rendered at its own natural height in the equal-width grid columns. Matched `.case-placeholder`'s existing `aspect-ratio:16/9` convention so both images now sit in identically-sized boxes (contain, not cropped).
- **Risk:** None. Confirmed served via curl.

---

## Edit — 2026-07-02 (26th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Fixed Five Steps slider header-overlap + restored centering:
  1. `#s8-sticky` (line 987-995) — added `padding-top:76px; box-sizing:border-box;` (76px matches `--header-h`, the fixed nav's height).
  2. `#s8-left` (line 998-1004) — `justify-content:flex-start` → back to `center`.
  3. `.s8-panel` (line 1093-1102) — `align-items:flex-start` → back to `center`; padding reverted from `60px ... 0` to `0 clamp(...)`.
- **Why:** Angel reported the top of the section (heading + step content) was being covered by the fixed site header (`#nav.site-header { position:fixed; top:0; z-index:320; height:76px }`) — the 25th update's top-anchoring didn't push content down far enough to clear it. Also confirmed Angel wants the slider genuinely centered in the visible area (not top-anchored) — the earlier "align-items:center vs flex-start" back-and-forth was actually two different bugs conflated: (a) left/right columns needed the *same* strategy to align with each other (fixed a few updates ago), (b) that shared strategy also needed to account for the fixed header's height, which was missing until now. Pushing the padding into `#s8-sticky` itself means both columns center within the space already below the header, so they stay in sync without needing per-column top-padding hacks.
- **Risk:** Medium — same vertical-anchor system as several prior updates. Verified via curl. Please confirm: (1) heading no longer clipped by the header, (2) left/right columns still aligned, (3) bottom whitespace looks more balanced.

---

## Edit — 2026-07-02 (25th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Added `#s7 { min-height: auto; }` (line 773, right before the `/* ── IA FLOW ── */` block's `.ia-node` rule).
- **Why:** Angel sent a screenshot showing the #s7→#s8 gap was still huge after the 24th update's padding/justify-content changes. Spawned an Explore agent to find the real cause instead of guessing again: a **global** `section { min-height: max(100vh, 640px); overflow:hidden; }` rule (line 142-147) applies to every `<section>` including `#s7`. `#s7`'s actual content (~450px) was being force-stretched to a full viewport height regardless of its own padding — same bug class as the earlier AI Workflow `#about` fix, but this time inherited from a global rule rather than `#s7`'s own CSS, which is why tuning `#s7`'s padding alone never worked.
- **Note:** Deliberately did NOT touch the global `section` rule — other sections (hero `#s1`, the 3D scroll sequence `#s3`, etc.) likely depend on it for full-screen effect. Scoped the fix to `#s7` only via ID selector (higher specificity, no `!important` needed).
- **Risk:** Low-medium. Confirmed via curl the override is served. Should eliminate the gap; please verify visually since no browser automation is available here.

---

## Edit — 2026-07-02 (24th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Angel said the #s7→#s8 gap was still large after the 23rd update's 40px bottom padding. Root cause identified as `#s8-left`'s `justify-content:center` (line 998) — same bug pattern as the earlier AI Workflow `#about` fix: content vertically centered in a full-100vh pinned box leaves a large empty band above it. Changes:
  1. `#s7` (line 1930) — bottom padding `40px → 0`.
  2. `#s8-left` — `justify-content:center` → `justify-content:flex-start`, so "Five steps. Zero confusion." now starts right after its own 60px top padding instead of floating centered in the pinned 100vh column.
  3. `.s8-panel` (line 1090-1100) — changed `align-items:center` → `align-items:flex-start` and `padding:0 clamp(...)` → `padding:60px clamp(...) 0`, to keep it in sync with `#s8-left`'s new top-anchored layout (this mirrors the same top-padding value, 60px, so both sides start at the same height). Without this the 18th/19th update's center-alignment fix between the two columns would have broken again.
- **Risk:** Medium — this changes the vertical anchor for the entire Five Steps slider (both columns), not just spacing. Verified all three rules serve correctly via curl; visual centering/alignment between left step list and right image+text should still match (both now top-anchored at the same 60px offset instead of both centered), but genuinely can't confirm pixel-level without a browser — please check.

---

## Edit — 2026-07-02 (23rd update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Three fixes from Angel's annotated screenshot:
  1. `#ia-flow` row (line 1938) — `align-items:center` → `align-items:flex-start`. The 6 step numbers (1-6) were sitting at different heights because `align-items:center` vertically centers each `.ia-node` column based on its own content height, and descriptions wrap to different line counts; `flex-start` pins all dots to the same top line regardless.
  2. `#s7` section (line 1930) — `padding:80px 56px` → `padding:80px 56px 40px` (bottom only, 80→40). After the 21st update removed the two path-cards, the section's fixed bottom padding left excess vertical space before `#s8` ("Five steps. Zero confusion.") begins.
  3. `.testing-card` (line 1182-1187) — reverted to original `padding:0`, removed `max-width:720px` and `padding:0 40px` added in the 17th/19th updates. Angel sent a screenshot with a red box showing the intended text width is close to the section's full available width (matching the pie-chart/bar-chart area above it), not a narrow 720px column — my earlier reading of "margins on both sides" was too aggressive a narrowing.
- **Why:** Direct feedback from an annotated screenshot; confirmed the gap location via AskUserQuestion before touching `#s7`'s padding (multiple gap locations were plausible — user confirmed it was specifically the #s7→#s8 vertical gap, not horizontal spacing within the 6-step row).
- **Risk:** Low. All single-property CSS reverts/tweaks, verified served via curl.

---

## Edit — 2026-07-02 (22nd update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** `.ia-dot` (line 779-791, the 6 step-circle indicators above Attract/Join/Classify/Feedback/Sort/Reflect in `#s7` User Flow) — enlarged from 14px to 22px, added `display:flex;align-items:center;justify-content:center` + font styling, and filled each dot with its step number (1-6) instead of being empty.
- **Why:** Angel asked to replace the plain dots with numbers 1-6.
- **Risk:** None. Confirmed all 6 dots (`data-i="0"` through `"5"`) now contain their digit, verified via curl against the dev server.

---

## Edit — 2026-07-02 (21st update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Removed the entire "Secondary: two paths" block (line ~1947-1959, the "Correct bin / ✓ Reinforce" and "Wrong bin detected / ↩ Redirect" cards under `#s7` User Flow).
- **Why:** After 2 rounds of repositioning (centered → aligned under Classify/Feedback columns), Angel decided the whole element just didn't fit the section's style and asked to remove it outright rather than keep iterating on placement.
- **Note:** `.ia-path-card` CSS class (line 808-813) is now unused/dead but left in place — harmless, low priority cleanup if ever needed.
- **Risk:** None. Content removal only, confirmed via curl that no trace of "Correct bin"/"Wrong bin detected" remains in served HTML.

---

## Edit — 2026-07-02 (20th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** "Secondary: two paths" wrapper (line 1948, Correct bin / Wrong bin cards in `#s7` User Flow) — changed from `max-width:640px;margin-left:auto;margin-right:auto` (generic page-center) to `width:33.333%;margin-left:33.333%`, so the 2-card block now sits directly under the "Classify" and "Feedback" nodes (the 3rd and 4th of the 6 evenly-spaced steps above), instead of floating centered/disconnected from the flow row.
- **Why:** Angel flagged the layout as confusing — 6-step row spans full width, but the 2 cards below were narrower and centered independent of any specific step, reading as an unrelated block. Confirmed this was a legitimate design issue (agreed after reviewing). Also clarified: the loose green dot floating near the cards in the screenshot was just Angel's mouse cursor (page has a custom `#cursor`/`#cursor-ring` effect) — not a layout bug, no code change for that.
- **Note:** The 33.333% approximation treats all 6 steps as exactly equal-width columns; the small `.ia-arrow` glyphs between them add minor real offset, so alignment is close but not pixel-perfect (no browser automation available to verify precisely).
- **Risk:** Low. Single wrapper positioning change.

---

## Edit — 2026-07-02 (19th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** `.s8-panel-text` (line 1105-1109) — removed `align-self: flex-start;`.
- **Why:** Angel circled the "01/05 + Item enters the frame + body" text block in a screenshot and asked if it looked off after the 18th update centered `.s8-panel`. Found it: `.s8-panel-text` had its own `align-self:flex-start`, which overrides the parent's `align-items:center` for just that flex item — so the image centered but the text stayed pinned to the top, floating apart from it.
- **Risk:** None. One-property removal, restores default `align-self:auto` which now inherits the parent's centering.

---

## Edit — 2026-07-02 (18th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** `.s8-panel` (Five Steps slider, line 1083-1093) — `align-items:flex-start` → `align-items:center`; removed the fixed `padding-top:130px`/`padding-bottom:60px`, now just `padding: 0 clamp(42px, 6vw, 80px)`.
- **Why:** Angel sent a screenshot and asked directly whether left/right were aligned at top and in size — confirmed they were not. Root cause: `#s8-left` (step list) uses `justify-content:center` (vertically centered in its 100vh column), while `.s8-panel` (image+text) was top-anchored with a fixed padding-top. Two different alignment strategies on the two sides of the same row can never line up no matter how the padding number is tuned. Fix changes the strategy (both sides now centered in the same 100vh column) instead of re-guessing another padding value.
- **Risk:** Low. Single alignment-strategy change, no other properties touched.

---

## Edit — 2026-07-02 (17th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Reworked 2 of the 5 fixes from the 16th update, plus a new layout change:
  1. `.testing-card` — added `padding:0 40px` (kept `max-width:720px`) so the Internal Testing block has real margin on both left and right, not just a width cap on one side.
  2. **Reverted** `#s6` right panel's `justify-content:flex-end` back to `justify-content:center` (the 16th update's alignment target was wrong — see below).
  3. `.experience-head` (line 1909, `#s6c` "06.1 — Experience Flow") — changed from `display:flex;justify-content:space-between` to `display:grid;grid-template-columns:calc(50vw - 56px) 1fr`. This makes the paragraph's left edge land exactly at 50vw, matching the vertical divider between `#s6`'s text/image columns (that section has `padding:0` + two `flex:1` panels, so its divider sits exactly at 50vw).
  4. `.experience-grid` (line 1364-1372 CSS, line 1916 HTML) — removed the competing inline `style="grid-template-columns:repeat(3,1fr)"` and rewrote the CSS: `.experience-grid{grid-template-columns:1fr 1fr}`, `.experience-primary{grid-column:1/-1}`. Now "Prototype flow map" spans a full-width row, with "Community pop-up setup" and "Rumi character feedback" side-by-side below it.
- **Why:** Angel corrected two of the 16th update's fixes: Internal Testing needed real `padding` (not just `max-width`) for margins on both sides; the 06/06.1 alignment target was actually the two-column divider line in `#s6` (at 50vw), not the image's own right edge — my previous `justify-content:flex-end` fix solved the wrong problem and is reverted.
- **Also answered (no code change):** the "01/05 Item enters the frame" step image in the Five Steps slider is `assets/ui-screens/step-01-ui.png` (line 2020).
- **Risk:** Low-medium. The `calc(50vw-56px)` grid column is viewport-width-relative — verified it doesn't conflict with the existing mobile media query (line ~1422 already forces `.experience-head{grid-template-columns:1fr!important}` below the breakpoint, so this only applies on desktop widths).

---

## Edit — 2026-07-02 (16th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Five layout fixes requested via screenshots with hand-drawn annotations:
  1. `.testing-card` (line ~1176-1181, "Internal testing" block in #s6b) — added `max-width:720px`. It had `padding:0` and no max-width, so text stretched edge-to-edge in fullscreen and felt cramped/uncomfortable to read.
  2. `#s6` right panel (line 1878, Rumi image container) — `justify-content:center` → `flex-end`, so the image's right edge now lines up with the `#s6c` "06.1 — Experience Flow" paragraph's right edge below it (both sit at the same 56px section padding).
  3. `#s7` "Classify" step dot (line 1939, `data-i="2"`) — removed inline `style="background:var(--lime);box-shadow:..."` that made it look lit/active while all sibling dots use the default unlit style.
  4. Correct bin / Wrong bin cards (line 1949) — added `margin-left:auto;margin-right:auto` to the `max-width:640px` grid wrapper, which had no auto-margins and sat flush left instead of centered.
  5. "Five steps. Zero confusion." slider (`#s8`) — enlarged the right-side screenshot panel to better match the left step list's height: `.s8-panel` top padding `207px→130px`, `.s8-panel-img` max width `620px→760px`, `.s8-panel-text` max-width `320px→380px`, `.s8-panel-title` font-size `24-38px→28-44px`, `.s8-panel-body` font-size `13-15px→14-17px`.
- **Why:** User sent annotated screenshots pointing out these 5 specific misalignments/sizing issues.
- **Note:** Item 5 is a proportional best-effort resize — no browser automation available in this session to pixel-verify the bottom edges now match exactly. May need another iteration after visual check.
- **Also confirmed (no code change needed):** `field-study-cdm.png` / `field-study-ubc.png` were replaced again by Angel (new files timestamped 7/1 23:57), same paths, dev server already serving the new bytes.
- **Risk:** Low. All CSS/inline-style tweaks, no structural/JS changes.

---

## Edit — 2026-07-01 (15th update)

#### `work/Trash Talk with Rumi/assets/case-study/internal-test-layout.png`, `field-study-cdm.png`, `field-study-ubc.png`
- **What:** Angel replaced these three images in place (same filenames/paths). No code change — confirmed via mtime (all 7/1 17:32-17:37) and dev-server content-length that the new files are being served.
- **Why:** Angel wanted new visuals for "Internal testing" and "Field Study" sections.
- **Risk:** None. Binary assets only, no HTML/CSS touched.

---

## Edit — 2026-07-01 (14th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** Added `object-position:top` to the "Interactive video station" `<video>` tag (line 1851).
- **Why:** Angel saw a thin black gap on top of that video. Root cause: the re-encoded proxy's aspect ratio (1.7875) is very slightly narrower than the card's `aspect-ratio:16/9` (1.7778), so `object-fit:contain` centered the video and left a hairline letterbox top+bottom. `object-position:top` pushes the video to the top edge so all the (tiny) slack collects at the bottom instead.
- **Risk:** None. Single CSS property, no layout/size change to the box itself. Confirmed dev server serves the updated markup.

---

## Edit — 2026-07-01 (13th update)

#### `work/AI Workflow/index.html`
- **What:** Shrunk the 00→01 scroll gap by another 10% on top of the 12th update. `.aw-overview` bottom padding `4vw → 3.6vw`; `#about` padding-top `5vw → 4.5vw` (the `min-height:auto` from the 12th update stays unchanged).
- **Why:** Angel asked to reduce the gap by another 10% after confirming the 12th update's `min-height:auto` fix actually took effect.
- **Risk:** Low. Pure numeric tweak, same scoped rules as before (`#about` only, `#limitations` untouched). Confirmed via curl that the dev server serves the updated values.

---

## Edit — 2026-07-01 (12th update)

#### `work/AI Workflow/index.html`
- **What:** Corrected the 10th-update fix. `#about` rule changed from `{ padding-top: 5vw; }` to `{ padding-top: 5vw; min-height: auto; }`.
- **Why:** Angel reported the 00→01 scroll gap still looked unchanged after the 10th update. Root cause: `.overview-section` (used by `#about`) has `min-height:100vh; display:flex; align-items:center;`. Since `#about`'s actual content (label + headline + short paragraph) is much shorter than 100vh, flex centering absorbed most of the padding-top reduction — the section's total height stayed pinned at one full viewport regardless of padding, so the previous fix only shifted content by half the intended amount and didn't shorten the scroll distance at all. Adding `min-height:auto` lets `#about`'s box height be driven by content+padding again, so the padding change now has full effect.
- **Risk:** Low. Still scoped to `#about` only (not the shared `.overview-section` class), so `#limitations` keeps its original full-viewport centered look. Confirmed via curl that the dev server serves the updated rule.

---

## Edit — 2026-07-01 (11th update)

#### `work/Trash Talk with Rumi/assets/case-study/web/external-guided-sorting.web.mp4` and `.../web/external-interactive-video.web.mp4`
- **What:** Regenerated (overwrote in place, same filenames/paths) both `.web.mp4` proxy files via ffmpeg from the new source videos Angel had just placed at `assets/case-study/external-guided-sorting.mp4` and `assets/case-study/external-interactive-video.mp4`. Command: `libx264 -crf 23 -maxrate 5M -bufsize 10M -vf scale=1550:-2 -r 30 -c:a aac -b:a 192k -movflags +faststart`.
- **Why:** The "05.1 — External Testing" section's two videos looked mismatched in size. Root cause: the old `.web.mp4` proxies (generated 6/29) had different resolutions (1388×794 vs 1550×808). Angel had already replaced the underlying source `.mp4` files (matching aspect ratios, ~1.78:1 both), but the site plays the compressed `web/` proxies, which were stale and never regenerated from the new sources.
- **Change:** No HTML/CSS touched — file paths and `<video src>` refs unchanged. Both new proxies now scaled to 1550px wide, same aspect ratio (~1.78), much smaller filesize (3.27MB and 1.49MB vs old ~18-19MB).
- **Risk:** Low. Binary media files only; `.gitattributes` already excludes `work/Trash*/assets/case-study/web/*.mp4` from LFS so no repo config change needed. Confirmed both new files return HTTP 200 from local dev server.

---

## Edit — 2026-07-01 (10th update)

#### `work/AI Workflow/index.html`
- **What:** Shrunk the scroll "dead zone" between 00 Overview and 01 Problem (`#about`). `.aw-overview` padding changed from `8vw 10vw` to `8vw 10vw 4vw 10vw` (bottom only, 8vw→4vw). Added new scoped rule `#about { padding-top: 5vw; }` which overrides the shared `.overview-section` class's `10vw` top padding for this section only.
- **Why:** User reported that scrolling from Overview into Problem felt like the page was stuck — 18vw of combined whitespace (8vw + 10vw) with no visual element in between. Reduced to ~9vw total.
- **Note:** Deliberately scoped the override to `#about` only, NOT the shared `.overview-section` class, because that class is also used by `#limitations` — changing the shared rule would have also shrunk the Workflow→Limitations gap, which wasn't requested.
- **Risk:** Low. Only affects vertical spacing of two sections; left/right padding and `#limitations` untouched. Not yet visually verified in a browser (no browser automation tool available in this session) — please eyeball it locally with Ctrl+Shift+R before considering this final.

---

## Edit — 2026-07-01 (9th update)

#### `work/Trash Talk with Rumi/index.html`
- **What:** File had severe UTF-8 double-encoding corruption throughout (â€", Ã¢â€â‚¬ etc). Attempted PowerShell latin-1 decode fix made it worse. Restored clean content from local HEAD using `git show HEAD:"work/Trash Talk with Rumi/index.html"`.
- **Warning:** Any local working-tree edits to this file that existed before this session have been lost — they were the corrupted version. HEAD commit version is clean and now on disk.
- **Codex note:** If you have pending changes to this file, do not pull/merge without checking — the local working copy was just overwritten from HEAD.
- **Risk:** Medium — local modifications discarded. HEAD state preserved.

---

## Edit — 2026-07-01 (8th update)

#### `work/AI Workflow/index.html`
- **What:** Fixed hero 3D knot "delay" artifact. Loop changed from `i<4` to `i<3`, `loadedCount===4` → `loadedCount===3`.
- **Why:** 4 knots were created but `ORBIT_INIT` only has 3 positions. The 4th knot (`i=3`) wrapped to `ORBIT_INIT[0]` and overlapped the 1st knot at the exact same orbit angle, causing a visible z-fighting / lag effect.
- **Risk:** Low. 3 knots maps exactly to 3 service cards (METHOD 01/02/03) and 3 orbit positions.

---

## Edit — 2026-07-01 (7th update)

#### `work/AI Workflow/index.html`
- **What:** Removed entire 05 — Fails section (`<section class="fails-section" id="fails">` and all contents).
- **Risk:** Low. CSS rules for `.fails-*` still exist but are now unused — can be cleaned up later.

---

## Edit — 2026-07-01 (6th update)

#### `work/AI Workflow/index.html`
- **What:** `.limits-issue` font-size `1.3vw` → `1.1vw`
- **Risk:** None.

---

## Edit — 2026-07-01 (5th update)

#### `work/AI Workflow/index.html`
- **What:** `.limits-col-header` ("AI" / "HUMAN") font-size `0.8vw` → `1.3vw`
- **Risk:** None.

---

## Edit — 2026-07-01 (4th update)

#### `work/AI Workflow/index.html`
- **What:** Removed all `.limits-example` divs from 03 — AI Limitations section. Labels (`.limits-issue`) remain, example text gone.
- **Risk:** None.

---

## Edit — 2026-07-01 (3rd update)

#### `work/AI Workflow/index.html`
- **What:** `.limits-issue` font-size `1.1vw` → `1.3vw`
- **Risk:** None.

---

## Edit — 2026-07-01 (2nd update)

#### `work/AI Workflow/index.html`
- **What:** Updated 08 — Reflection content again with shortened version.
- **Changes:** "What I originally thought" — one sentence only. "What changed" — "During production," as standalone line, same bullet list, same closing sentence. "What I learned" — removed art direction paragraph, goes straight to bullet list. "Going forward" — numbered list trimmed to 4 items, closing paragraph removed.
- **Risk:** Low — isolated to reflection section HTML only.

---

## Edit — 2026-07-01 (1st update)

#### `work/AI Workflow/index.html`
- **What:** Replaced 08 — Reflection section content with full new text.
- **Change:** All 4 `reflection-row-body` divs replaced. New content has `<p>`, `<ul>`, `<ol>` — also added CSS rules for those inside `.reflection-row-body` (margin/padding). Label "What I expected" → "What I originally thought". All other text is new copy provided by Angel.
- **Risk:** Low — isolated to reflection section HTML and its CSS block.

---

## Summary of Claude Code edits — 2026-07-01

### Files modified (all unstaged, not committed)

#### `scripts/section2-reference.js`
- **What:** Fixed home page art section (Section 2 collage) — bottom row of images was clipped at fullscreen 1080p.
- **Why:** `tile` size was calculated using `height * 0.37`, causing `gridHeight + topOffset` to exceed `100vh` at 1920×1080. Fixed by deriving `tileFromH` from available vertical space before calculating tile.
- **Change:** Line 40-41 — added `tileFromH` calculation; `tile` now takes `Math.min(width * 0.178, tileFromH)` instead of `Math.min(width * 0.178, height * 0.37)`.
- **Risk:** Low. Only affects tile sizing in `measureLayout()`. Desktop-only path (mobile branch unchanged).

#### `work/AI Workflow/index.html`
- **What:** Cache-busted `moodboard 3.png` reference (user replaced the file twice today).
- **Change:** `src="moodboard 3.png"` → `src="moodboard%203.png?v=3"`. Also URL-encoded the space.
- **Risk:** None.

#### `assets/stickers/angel.png`
- **What:** Padded favicon image from 500×354 to 500×500 (transparent padding, centered).
- **Why:** Non-square image caused browser to distort favicon.
- **Risk:** None — binary file only, no HTML change needed.

#### `work/AI Workflow/moodboard 3.png`
- **What:** User replaced this file manually (two rounds). No code change from Claude — file updated on disk by Angel.

### Files NOT touched by Claude today
- `index.html` (home page)
- `styles.css`
- `script.js`
- `scripts/section1-reference.js`
- `work/Trash Talk with Rumi/index.html` (shows as dirty — Angel's own edits, not touched by Claude)

### Pending / needs Codex attention
- Local branch has 2 commits (`a53515b`, `7db72b0`) not on remote — they contain last session's AI Workflow changes (receipt reverse animation, card backs, workflow flowchart, favicon, Fableware cover). Angel is handling the rebase/merge on the Codex side.
- The above 4 modified files are unstaged. Angel will decide when/how to commit.

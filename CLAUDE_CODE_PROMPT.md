# Prompt For Claude Code

You are co-working with Codex on Angel Yu's portfolio repo.

Before you edit anything:

1. Run `git status --short`.
2. Read `AGENT_HANDOFF.md`.
3. Tell Angel which files you plan to edit.
4. Do not overwrite or revert dirty files unless Angel explicitly asks.

Rules for this repo:

- Never run `git reset --hard`.
- Never run `git checkout -- <file>` unless Angel explicitly asks for that exact revert.
- Never stage everything with `git add .`.
- Stage only your own intended files.
- If you touch video/media routing, check `.gitattributes` and Git LFS behavior.
- GitHub Pages cannot serve Git LFS pointer files as playable videos. Use small non-LFS `.web.mp4` proxy files for browser playback.
- Preserve the portfolio header/footer style unless Angel asks for a page-specific exception.
- Keep homepage Section 1/Section 2 motion untouched unless Angel explicitly asks to tune motion.

Current known Baby Steps fix:

- Animation showcase videos should point to `work/Baby Steps/assets/videos/web/*.web.mp4`.
- The web proxy videos must be excluded from LFS with:
  `work/Baby*/assets/videos/web/*.mp4 -filter -diff -merge -text`
- Leave `assets/videos/iphone-demo.mp4` alone unless Angel asks to optimize that video too.

When you finish:

1. Run `git status --short`.
2. List the files you changed.
3. Say whether anything still needs Codex or Angel to verify.


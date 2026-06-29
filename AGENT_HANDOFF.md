# Agent Handoff

This repo is being edited by both Codex and Claude Code. Treat the working tree as shared space.

## Before Editing

1. Run `git status --short`.
2. Read this file and `CLAUDE_CODE_PROMPT.md`.
3. Identify which files you plan to touch before changing them.
4. Do not run `git reset`, `git checkout --`, or broad cleanup commands unless Angel explicitly asks.

## Current Notes

- The main local workspace may contain uncommitted work from Angel, Codex, and Claude Code.
- Do not assume dirty files are disposable.
- Stage only the files you changed intentionally. Do not use `git add .`.
- If GitHub Pages videos fail, check whether the asset is a Git LFS pointer. Pages will not serve LFS media correctly.

## Baby Steps Video Fix

Baby Steps animation showcase videos should use non-LFS web proxies:

- Source page: `work/Baby Steps/index.html`
- Web video folder: `work/Baby Steps/assets/videos/web/`
- Git attributes exception: `work/Baby*/assets/videos/web/*.mp4 -filter -diff -merge -text`

The `iphone-demo.mp4` file is intentionally left on the original path unless Angel asks to optimize it too.

## Coordination Rules

- Leave a short note here when you make a major change.
- If another agent changed a file since your last read, re-read the file before editing.
- If a change affects routing, GitHub Pages, LFS, or media paths, mention it clearly in your final message.
- Prefer small commits with focused scopes.


# Start here

## Claude Code

```bash
claude plugin marketplace add hora-algebra/interactive-slide
claude plugin install interactive-slide@interactive-slide
```

Open a new session in the folder that holds your talk and try:

```text
/interactive-slide:interactive-slide Convert main.tex into an interactive HTML deck. The two concepts are "play forward" and "analyze backward".
```

Update: `claude plugin update interactive-slide@interactive-slide`. Remove: `claude plugin uninstall interactive-slide@interactive-slide`.

## Codex

```bash
codex plugin marketplace add hora-algebra/interactive-slide --ref main
codex plugin add interactive-slide@interactive-slide
```

Then in a task: `$interactive-slide Convert main.tex into an interactive HTML deck …`. Remove with `codex plugin remove interactive-slide@interactive-slide`.

## Without a plugin system

Copy `plugins/interactive-slide/skills/interactive-slide/` (the folder that contains `SKILL.md`) into the directory your agent loads skills from, or point the agent at that `SKILL.md`.

## Optional tooling for the scripts

```bash
npm i mathjax-full@3            # scripts/tex2svg.mjs
npm i -D playwright && npx playwright install chromium   # scripts/qa-deck.cjs, scripts/svg-label-overlap.cjs
pip install segno               # scripts/qr-svg.py
```

None of these are needed to read the skill or to open the example decks.

## If something fails

Read the error before reinstalling anything. Separate network, permissions, version and marketplace-format problems. Report plugin problems as GitHub issues with the full message minus any secrets.

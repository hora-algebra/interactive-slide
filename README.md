# interactive-slide

An [Agent Skill](https://agentskills.io) that turns a finished talk (Beamer/LaTeX, PDF slides, or an outline) into **one HTML file** the audience can hold in their hands: it fills any screen, works offline, and lets people play with the figures.

日本語の説明は[下](#日本語)にあります。

**Live examples** (real talks, unchanged apart from removing non-redistributable media):

| deck | talk | what to try |
|---|---|---|
| [圏論は(どう)役に立つのか](https://hora-algebra.github.io/interactive-slide/examples/category-theory-night-2026/) | Category-theory night at an academic bar, Tokyo, 2026-09-05 (Japanese) | slide the 15-puzzle, place tiles on the infection board, turn the cube; orange = operation, green = invariant quantity |
| [文字列から現代数学へ](https://hora-algebra.github.io/interactive-slide/examples/math-cafe-2026/) | Math café for high-school students, 2026-09-12 (Japanese) | change n on the first slide, rotate words, sync the three columns; orange = discrete, green = continuous |

Both were built by an AI coding agent following this skill from the speaker's own Beamer sources and notes.

## What the skill enforces

1. **One dichotomy, two colors.** The talk's central contrast gets exactly two accent colors, used for nothing else, in text, formulas, figures and widgets, and checked for color-vision deficiency (`scripts/cvd-check.py`).
2. **The speaker's words only.** The agent converts, cuts and arranges the speaker's own text; it does not write prose.
3. **Playable figures with a mathematical readout,** placed where the speaker would say "try it".
4. **Screen-filling layout** on phones, laptops, projectors and ultrawide screens (stage unit + per-slide fit), dark mode, print.
5. **Minimal navigation that always shows where you are:** top dots grouped by section, section name, `n / N`, keys, swipe, edge click, deep links. No sidebars, no toolbars, no step-by-step reveals by default.
6. **Single self-contained file:** no CDN, no web fonts, TeX rendered to SVG at build time, verified headlessly at five viewports (`scripts/qa-deck.cjs`).

The skill text explains *why* each rule exists so the agent can make judgment calls; the references hold the details (sizes, Beamer mapping, widget rules, QA).

## Install

The skill is plain Markdown plus a few scripts. It contains no hooks, no background processes and no network calls of its own.

**Claude Code**

```bash
claude plugin marketplace add hora-algebra/interactive-slide
claude plugin install interactive-slide@interactive-slide
```

**Codex**

```bash
codex plugin marketplace add hora-algebra/interactive-slide --ref main
codex plugin add interactive-slide@interactive-slide
```

**Any agent that reads `SKILL.md`** (Cursor, Gemini CLI, OpenCode, …): copy or symlink `plugins/interactive-slide/skills/interactive-slide/` into the place your tool loads skills from (for example `~/.claude/skills/`, `~/.codex/skills/`, `.agents/skills/`).

Then ask, for example: *"Convert `talk/main.tex` to an interactive HTML deck with the interactive-slide skill. The two concepts are 'operation' and 'invariant'."*

Optional tools for the scripts: Node 18+ with `mathjax-full` (formulas) and `playwright` (verification); Python 3 with `segno` (QR codes).

## Layout of this repository

```
plugins/interactive-slide/skills/interactive-slide/
  SKILL.md                 the skill (workflow, non-negotiables, file map)
  assets/deck-template.html  starting point: tokens, navigation, screen fit, print, widget guard
  references/              colors-and-words, interactions, layout-and-navigation, workflow-from-beamer, qa
  scripts/                 tex2svg.mjs, qr-svg.py, cvd-check.py, svg-label-overlap.cjs, qa-deck.cjs
examples/                  two complete decks (see examples/README.md for sources and media credits)
```

## License

MIT (see [LICENSE](LICENSE)) for the skill, scripts, template and the example decks' code and text by Ryuya Hora. Third-party media inside `examples/math-cafe-2026/assets/story/` keep their own licenses (CC BY-SA, credited in [examples/README.md](examples/README.md) and in the deck).

## Background

The rules come from preparing two outreach talks in September 2026 with an AI agent, keeping what the audience responded to and what the speaker kept correcting. Feedback that shaped them: an outreach audience takes home one contrast, so show it in color; design for color-vision diversity (a remark by Eugenia Cheng); pick a theme and let color be decided only by mathematical meaning.

---

## 日本語

発表スライド（Beamer/LaTeX、PDF、または構成メモ）を、**1つのHTMLファイル**の「触れるスライド」にするための Agent Skill です。どんな画面にも収まり、オフラインで動き、聴衆が自分のスマホで図を触れます。

上の表の2本（学術バーQの圏論NIGHT、数学カフェ）が実際に使ったdeckで、そのまま例として置いてあります。

skillが守らせること:

1. **二項対立を1つ、色を2つ。** 発表の中心となる対比にアクセント色を2つだけ割り当て、本文・数式・図・操作すべてでその意味にだけ使う。色覚多様性の検査つき。
2. **本文は発表者の言葉だけ。** AIは変換・削除・配置をし、文章を書き足さない。
3. **数学的な読み取り値のある「遊べる図」**を、発表者が「やってみて」と言う場所に置く。
4. スマホ・ノートPC・プロジェクタ・ウルトラワイドで**画面を使い切る**レイアウト、ダークモード、印刷。
5. **最小限のナビで現在地は常に見える**: 上部のドット（章ごとにまとめる）＋章名＋ `n / N`、キー・スワイプ・端クリック・直リンク。サイドバーや下部ツールバー、段階表示は既定で入れない。
6. **完全自己完結の1ファイル**: CDN・Webフォントなし、数式はビルド時にSVG化、5つの画面サイズで機械検査。

導入は上の Install の通り（Claude Code / Codex は plugin、その他のagentは `plugins/interactive-slide/skills/interactive-slide/` をコピー）。ライセンスはMIT。

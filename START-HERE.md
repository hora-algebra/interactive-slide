# Start here

[日本語](#日本語)

Try a deck in your browser before installing the skill. [Category Theory Night](https://hora-algebra.github.io/interactive-slide/examples/category-theory-night-2026/) contains a playable 15-puzzle.

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

## 日本語

まず[圏論NIGHTのスライド](https://hora-algebra.github.io/interactive-slide/examples/category-theory-night-2026/)をブラウザで開くと、15パズルを操作できます。スライドを見るだけならインストールは不要です。

自分の発表を変換する場合は、[Codex](#codex) または [Claude Code](#claude-code) のコマンドで導入し、原稿のあるフォルダで依頼します。

```text
interactive-slide を使い、main.tex をブラウザで開けるHTMLスライドにしてください。
本文は原稿の言葉を使い、発表の中心となる対比を2色で表現してください。
```

プラグイン機能がないツールでは、[interactive-slide フォルダ](plugins/interactive-slide/skills/interactive-slide)ごとツールのスキル置き場にコピーしてください。数式の変換、QRコードの生成、画面サイズの検査に使うツールは[上の手順](#optional-tooling-for-the-scripts)にあります。

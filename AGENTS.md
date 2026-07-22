---
title: AGENTS
---

# AGENTS
<a id="a-agents"></a>[TOC](#toc-agents)

<!-- TOC location -->
## 🔍 Table of Contents
<!-- Maintained by script -->
- [AGENTS](#a-agents) <a id="toc-agents"></a> ^toc-agents
  - [Purpose](#a-purpose) <a id="toc-purpose"></a> ^toc-purpose
  - [Project Scope](#a-projectscope) <a id="toc-projectscope"></a> ^toc-projectscope
  - [Working Rules](#a-workingrules) <a id="toc-workingrules"></a> ^toc-workingrules
  - [Validation](#a-validation) <a id="toc-validation"></a> ^toc-validation
  - [Packaging](#a-packaging) <a id="toc-packaging"></a> ^toc-packaging
  - [Safety](#a-safety) <a id="toc-safety"></a> ^toc-safety
---
## Purpose
<a id="a-purpose"></a>[TOC](#toc-purpose)
This repository contains the CherryPucker VS Code extension.

## Project Scope
<a id="a-projectscope"></a>[TOC](#toc-projectscope)
- Runtime entry: `extension.js`
- Manifest: `package.json`
- User docs: `README.md`

## Working Rules
<a id="a-workingrules"></a>[TOC](#toc-workingrules)
- Keep command IDs and configuration keys stable unless explicitly requested.
- Preserve backward compatibility for existing settings when possible.
- Prefer small, targeted edits over broad refactors.
- Do not remove existing user-facing commands without confirmation.

## Validation
<a id="a-validation"></a>[TOC](#toc-validation)
- Ensure `package.json` remains valid JSON.
- Keep `contributes.commands` and `activationEvents` aligned.
- If dependencies change, update `package-lock.json`.

## Packaging
<a id="a-packaging"></a>[TOC](#toc-packaging)
- Use `npm run package` to build a `.vsix`.
- Keep `files` in `package.json` accurate so published artifacts are minimal.

## Safety
<a id="a-safety"></a>[TOC](#toc-safety)
- Never run destructive git commands (`reset --hard`, forced checkout) unless explicitly requested.
- Do not revert user changes outside the task scope.

---
title: BUILD
---

# BUILD
<a id="a-build"></a>[TOC](#toc-build)

<!-- TOC location -->
## 🔍 Table of Contents
<!-- Maintained by script -->
- [BUILD](#a-build) <a id="toc-build"></a> ^toc-build
  - [📑 AI Primary Files](#a-aiprimaryfiles) <a id="toc-aiprimaryfiles"></a> ^toc-aiprimaryfiles
  - [Go to...](#a-goto) <a id="toc-goto"></a> ^toc-goto
  - [🛠️ Build & Packaging Pipeline](#a-buildpackagingpipeline) <a id="toc-buildpackagingpipeline"></a> ^toc-buildpackagingpipeline
    - [📦 Key Components](#a-keycomponents) <a id="toc-keycomponents"></a> ^toc-keycomponents
  - [🚀 Execution & Packing Commands](#a-executionpackingcommands) <a id="toc-executionpackingcommands"></a> ^toc-executionpackingcommands
  - [Go back to...](#a-gobackto) <a id="toc-gobackto"></a> ^toc-gobackto
---
## 📑 AI Primary Files
<a id="a-aiprimaryfiles"></a>[TOC](#toc-aiprimaryfiles)
- 🔹 [AGENTS.md](../AGENTS.md)
- 🔹 [+ce-cherrypucker.md](+ce-cherrypucker.md)
- 🔹 [ARCHIVE.md](ARCHIVE.md)
- 🔸 [BUILD.md](BUILD.md)
- 🔹 [CODE.md](CODE.md)
- 🔹 [DESIGN.md](DESIGN.md)
- 🔹 [FEATURES.md](FEATURES.md)
- 🔹 [LOG.md](LOG.md)
- 🔹 [MANUAL.md](MANUAL.md)
- 🔹 [README.md](../README.md)
- 🔹 [SPEC.md](SPEC.md)
- 🔹 [TASKS.md](TASKS.md)
- 🔹 [TERMS.md](TERMS.md)
- 🔹 [TESTING.md](TESTING.md)
- 🔹 [VERSIONS.md](VERSIONS.md)


## Go to...
<a id="a-goto"></a>[TOC](#toc-goto)
- ▪️[AGENTS.md](AGENTS.md)
- ▪️[AILOG.md](AILOG.md)
- ▪️[AITASKS.md](AITASKS.md)
- 🔸[BUILD.md](BUILD.md)
- ▪️[CODE.md](CODE.md)
- ▪️[FEATURES.md](FEATURES.md)
- ▪️[MANUAL.md](MANUAL.md)
- ▪️[README.md](README.md)
- ▪️[SPEC.md](SPEC.md)
- ▪️[TESTING.md](TESTING.md)

---

## 🛠️ Build & Packaging Pipeline
<a id="a-buildpackagingpipeline"></a>[TOC](#toc-buildpackagingpipeline)

CherryPucker is written in pure vanilla CommonJS JavaScript (under Node 18+ runtime inside VS Code), which allows it to run without any transpilation overhead. This eliminates potential build-time errors and speeds up development iteration times.

### 📦 Key Components
<a id="a-keycomponents"></a>[TOC](#toc-keycomponents)
- **Primary Runtime Module**: `extension.js`
- **Configuration & Manifest**: `package.json`

---

## 🚀 Execution & Packing Commands
<a id="a-executionpackingcommands"></a>[TOC](#toc-executionpackingcommands)

The extension manifest specifies scripts in `package.json` to verify files and pack the installer package:

1. **Local Install/Dependency Synchronization**:
   ```bash
   npm install
   ```
   This downloads and initializes `@types/node`, `@types/vscode`, and the runtime utility dep `jsonc-parser` in your extension build environment.

2. **Packaging**:
   ```bash
   npm run package
   ```
   This calls `@vscode/vsce package` (under the alias `vsce package`), compiling directories, assets, manifests, and dependencies into an installable `.vsix` binary (e.g., `cherrypucker-0.0.3.vsix`).

3. **Installing Local Extension Binary**:
   ```bash
   code --install-extension cherrypucker-0.0.3.vsix
   ```

---
## Go back to...
<a id="a-gobackto"></a>[TOC](#toc-gobackto)
- ▪️[AGENTS.md](AGENTS.md)
- ▪️[AILOG.md](AILOG.md)
- ▪️[AITASKS.md](AITASKS.md)
- 🔸[BUILD.md](BUILD.md)
- ▪️[CODE.md](CODE.md)
- ▪️[FEATURES.md](FEATURES.md)
- ▪️[MANUAL.md](MANUAL.md)
- ▪️[README.md](README.md)
- ▪️[SPEC.md](SPEC.md)
- ▪️[TESTING.md](TESTING.md)

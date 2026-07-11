---
title: BUILD
---

# BUILD

## Go to...
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

CherryPucker is written in pure vanilla CommonJS JavaScript (under Node 18+ runtime inside VS Code), which allows it to run without any transpilation overhead. This eliminates potential build-time errors and speeds up development iteration times.

### 📦 Key Components
- **Primary Runtime Module**: `extension.js`
- **Configuration & Manifest**: `package.json`

---

## 🚀 Execution & Packing Commands

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

# Spec

This document compiles the user requirements and instructions from `AGENTS.md` and related files and provides detailed documentation of how the extension was architected and built.

---
## Back to...
- ▪️[AGENTS.md](AGENTS.md)
- ▪️[AILOG.md](AILOG.md)
- ▪️[AITASKS.md](AITASKS.md)
- ▪️[BUILD.md](BUILD.md)
- ▪️[CODE.md](CODE.md)
- ▪️[FEATURES.md](FEATURES.md)
- ▪️[MANUAL.md](MANUAL.md)
- ▪️[README.md](README.md)
- 🔸[SPEC.md](SPEC.md)
- ▪️[TESTING.md](TESTING.md)

---

## 📋 Originally Requested Specifications

### 1. Application & Identification
- **Identifier**: `cherrypucker`
- **Prefix**: `cherryPucker`
- **Activation Scope**: `onCommand:cherryPucker.*` (lazy activation for commands).
- **Core Intent**: Enable instant templated clipboard copy operations and lightning-fast nested JSON key/value modifications from under the cursor.

### 2. Configuration Settings Specification
- Provides 10 configurable templates (`cherryPucker.template1` to `cherryPucker.template10`), expecting multiline string text formatted with `${property}` substitution syntax.

### 3. Granular Range & Selection Adjustments
- **Quote Sanitization (Phase 2b)**: Pasting a property name should format it cleanly inside double-quotes. Pasting property values must retain outer quotes if a string, and strip quotes from the clipboard when evaluating target data types.
- **Select Inner content (Phase 2b)**: After running `dupeProperty` or `jumpToPropertyName`, selection ranges must highlight characters exactly *inside* the outer quotes, excluding the quote marks themselves. Deleted properties must fall back to `""` for string parameters, and delete the syntax segment for other types (Phase 2a).
- **Multiple Select Limits (Phase 2b/c)**: When multiple lines are highlighted, actions like `copyPropertyValue`, `pastePropertyValue`, `deletePropertyValue`, `copyProperty` must apply only to the selected lines (or separate lines by newlines).

### 4. Interactive Command Palette Picker
- Suffixes all commands inside a quick picker with their corresponding keyboard shortcut in ghost text `<shortcut keys> :CherryPucker` (e.g. `Copy Object <alt+insert o> :CherryPucker`).

---

## 🛠️ Implementation Details (How We Built It)

### 1. Robust AST Resolution via `jsonc-parser`
To make non-destructive modifications to files containing formatting or comment tags (JSONC), we integrated `jsonc-parser` by Microsoft:
- `jsonc.parseTree` converts raw buffer text directly into AST nodes.
- `jsonc.findNodeAtOffset` identifies the node containing the current cursor offset.
- `jsonc.getNodeValue` safely extracts raw values without discarding block/line comments.

### 2. Regex-Based String Path Resolver (`resolvePath`)
To support nested property lookup in configuration templates:
- Cleans and formats query paths using the regular expression matches: `path.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '')`.
- Traverses nested properties iteratively via `.reduce(...)` to safely return `undefined` on path resolution misses.

### 3. Automating User Keyboard Bindings Setup
To bypass manual copy-pasting of recommended keyboard bindings:
- `readUserKeybindings` scans the OS-specific `%APPDATA%/Code/User/keybindings.json`.
- Compiles a list of missing shortcuts without overriding existing commands, writes additions safely via structural indent checks (`detectIndentFromContent`), and writes conflicts to the global clipboard buffer.

---

## 🎯 Implemented Technical Concerns & Optimization Features

- **AST Fault Tolerance**: The parser configures `jsonc` nodes with `true` parameter passes for error tolerances (`jsonc.findNodeAtOffset(..., true)`), enabling execution inside dirty or incomplete files.
- **Memory Footprint**: Operating purely as an event-driven editor state machine keeps context lookups around $O(1)$ memory usage.
- **Operating-System Agnostic Configurations**: Keyboard bindings and setting pathways adapt natively across Windows, Unix, and macOS layout environments.

---
## Go Back to...
- ▪️[AGENTS.md](AGENTS.md)
- ▪️[AILOG.md](AILOG.md)
- ▪️[AITASKS.md](AITASKS.md)
- ▪️[BUILD.md](BUILD.md)
- ▪️[CODE.md](CODE.md)
- ▪️[FEATURES.md](FEATURES.md)
- ▪️[MANUAL.md](MANUAL.md)
- ▪️[README.md](README.md)
- 🔸[SPEC.md](SPEC.md)
- ▪️[TESTING.md](TESTING.md)

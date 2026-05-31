# Manual

This guide describes the structural architecture, module layout, internal algorithms, optimization behaviors, and technical specifications of the **CherryPucker** codebase.
---
## Back to...
- ▪️[AGENTS.md](AGENTS.md)
- ▪️[AILOG.md](AILOG.md)
- ▪️[AITASKS.md](AITASKS.md)
- ▪️[BUILD.md](BUILD.md)
- ▪️[CODE.md](CODE.md)
- ▪️[FEATURES.md](FEATURES.md)
- 🔸[MANUAL.md](MANUAL.md)
- ▪️[README.md](README.md)
- ▪️[SPEC.md](SPEC.md)
- ▪️[TESTING.md](TESTING.md)


## 🏗️ 1. Architecture Overview

CherryPucker operates inside the VS Code development runtime context. As a pure-JS extension, it integrates directly with the VS Code Extension Host API, relying on `jsonc-parser` to navigate and modify the editor's text buffers without breaking comments, formatting, or indentation rules.

The system workflow can be illustrated as:
- **Command Invoked**: A command is triggered (either through the global palette, a shortcut, or the CherryPucker unified command picker).
- **Target Resolver**: Evaluates the selection/active cursor offset inside the Editor Window, locating the nearest JSON array or object node via the AST (Abstract Syntax Tree).
- **Interactive UI**: If needed, runs a `vscode.window.showQuickPick` interactive dialog offering property lists or matches.
- **AST Inspector**: Determines line bounds, string boundaries (inside quotes), comments, and active formatting rules.
- **Buffer Updater**: Invokes granular `editor.edit` replacements to update property names, keys, insertion points, and cursor positions cleanly.

```
       [User Keyboard Trigger]
                  │
                  ▼
       [Command Dispatcher Module]
                  │
                  ▼
         [AST Parser Engine] ──(reads text buffer)──► [jsonc-parser AST Tree]
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
  [Object Finder]     [Array Finder]
        │                   │
  [Prop Resolver]     [Match Inquirer]
        │                   │
        ▼                   ▼
  [QuickPick List]    [QuickPick List]
        │                   │
        └─────────┬─────────┘
                  │
                  ▼
       [AST Range & Text Editor] ──(granly edits)──► [Active VS Code Buffer]
```


## 🧠 2. Core Modules & Systems

### A. Template Substitution Engine (`substituteTemplate`)
- Parses `${property}` indicators in templates.
- Employs `resolvePath` to extract data fields dynamically using dot notation matching or structural brackets, resolving nested values recursively.
- Formats final output tokens through `formatValue` and places text in the global clipboard buffer.

### B. AST Navigation & Context Core (`findObjectAtCursor` / `findArrayAtCursor`)
- Utilizes the `jsonc-parser` AST scanner to parse JSON/JSONC documents relative to the active selection range offset.
- Resolves nodes upward towards the nearest structural parent boundaries (`object` or `array`).
- Tracks nested element structures to differentiate between localized property key nodes and value structures.

### C. Indent Normalizer & Generator (`getLineIndent` / `getIndentUnit`)
- Queries user-configured document settings (`insertSpaces`, `tabSize`) to resolve standard alignment spacings.
- Inspects preceding line prefixes (`getLineIndent`) to append correctly structured spaces/tabs on insertions, preventing format clutter.

### D. Multi-Object Target Resolver (`getTargetObjectNodes` / `selectedArrayObjectNodes`)
- Detects if an active user selection spans multiple lines.
- Intersects highlighted boundaries against child nodes to implement multiselect macros (restricting array sorts or property paste operations only to the chosen lines).

### E. Struct-Safe Comma Normalizer (`propertySnippetWithComma`)
- When deleting, duplicate, or swapping lines, this engine evaluates character spaces following individual properties.
- Strips or prepends commas depending on line locations to guarantee JSON structure stability.


## 🔎 3. Core Algorithm

### Smart Property Swapping (`movePropertyUp` / `movePropertyDown`)
- **Find Position**: Locates the target property node index inside the parent JSON Object array.
- **Identify Bound**: Computes the exact offset range of the property node, including trailing comments and commas, using `propertySnippetWithComma`.
- **Compute Neighbor**: Finds the index of the upper (`idx - 1`) or lower (`idx + 1`) property sibling line.
- **Swap Buffers**: Replaces the combined span of the two property rows with the swapped text content, ensuring that preceding formatting and trailing commas remain balanced.


## 🛰️ 4. Commands, Keybindings & Context Flags

- **Target When clause**: All JSON commands are scoped to the clause:
  `editorTextFocus && (editorLangId == json || editorLangId == jsonc)`
  This prevents CherryPucker shortcuts from overriding system defaults inside non-JSON documents.
- **Keybindings Controller**: `applySuggestedKeybindings` and `removeSuggestedKeybindings` operate under standard Node filesystem integrations (`fs.writeFileSync`, etc.) to append CherryPucker-specific parameters safely onto `AppData/Roaming/Code/User/keybindings.json`.


## 🔧 5. Workspace Build & Configuration
The build stack is lightweight:
- **Language**: CommonJS Node.js JavaScript module format.
- **Dependency Map**: Leverages `jsonc-parser` for AST evaluations.
- **Pre-publish Validation**: Packages must compile using `@vscode/vsce package` into a deployment-ready `.vsix` file.

---
## Go Back to...
- [AGENTS.md](AGENTS.md)
- [AILOG.md](AILOG.md)
- [AITASKS.md](AITASKS.md)
- [BUILD.md](BUILD.md)
- [CODE.md](CODE.md)
- [FEATURES.md](FEATURES.md)
- [MANUAL.md](MANUAL.md)
- [README.md](README.md)
- [SPEC.md](SPEC.md)
- [TESTING.md](TESTING.md)

---
## Go back to...
- ▪️[AGENTS.md](AGENTS.md)
- ▪️[AILOG.md](AILOG.md)
- ▪️[AITASKS.md](AITASKS.md)
- ▪️[BUILD.md](BUILD.md)
- ▪️[CODE.md](CODE.md)
- ▪️[FEATURES.md](FEATURES.md)
- 🔸[MANUAL.md](MANUAL.md)
- ▪️[README.md](README.md)
- ▪️[SPEC.md](SPEC.md)
- ▪️[TESTING.md](TESTING.md)

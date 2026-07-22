---
title: MANUAL
---

# MANUAL
<a id="a-manual"></a>[TOC](#toc-manual)

<!-- TOC location -->
## 🔍 Table of Contents
<!-- Maintained by script -->
- [MANUAL](#a-manual) <a id="toc-manual"></a> ^toc-manual
  - [📑 AI Primary Files](#a-aiprimaryfiles) <a id="toc-aiprimaryfiles"></a> ^toc-aiprimaryfiles
  - [🏗️ 1. Architecture Overview](#a-1architectureoverview) <a id="toc-1architectureoverview"></a> ^toc-1architectureoverview
  - [🧠 2. Core Modules & Systems](#a-2coremodulessystems) <a id="toc-2coremodulessystems"></a> ^toc-2coremodulessystems
    - [A. Template Substitution Engine (`substituteTemplate`)](#a-atemplatesubstitutionenginesubstitutetemplate) <a id="toc-atemplatesubstitutionenginesubstitutetemplate"></a> ^toc-atemplatesubstitutionenginesubstitutetemplate
    - [B. AST Navigation & Context Core (`findObjectAtCursor` / `findArrayAtCursor`)](#a-bastnavigationcontextcorefindobjectatcursorfindarrayatcursor) <a id="toc-bastnavigationcontextcorefindobjectatcursorfindarrayatcursor"></a> ^toc-bastnavigationcontextcorefindobjectatcursorfindarrayatcursor
    - [C. Indent Normalizer & Generator (`getLineIndent` / `getIndentUnit`)](#a-cindentnormalizergeneratorgetlineindentgetindentunit) <a id="toc-cindentnormalizergeneratorgetlineindentgetindentunit"></a> ^toc-cindentnormalizergeneratorgetlineindentgetindentunit
    - [D. Multi-Object Target Resolver (`getTargetObjectNodes` / `selectedArrayObjectNodes`)](#a-dmultiobjecttargetresolvergettargetobjectnodesselectedarrayobjectnodes) <a id="toc-dmultiobjecttargetresolvergettargetobjectnodesselectedarrayobjectnodes"></a> ^toc-dmultiobjecttargetresolvergettargetobjectnodesselectedarrayobjectnodes
    - [E. Struct-Safe Comma Normalizer (`propertySnippetWithComma`)](#a-estructsafecommanormalizerpropertysnippetwithcomma) <a id="toc-estructsafecommanormalizerpropertysnippetwithcomma"></a> ^toc-estructsafecommanormalizerpropertysnippetwithcomma
  - [🔎 3. Core Algorithm](#a-3corealgorithm) <a id="toc-3corealgorithm"></a> ^toc-3corealgorithm
    - [Smart Property Swapping (`movePropertyUp` / `movePropertyDown`)](#a-smartpropertyswappingmovepropertyupmovepropertydown) <a id="toc-smartpropertyswappingmovepropertyupmovepropertydown"></a> ^toc-smartpropertyswappingmovepropertyupmovepropertydown
  - [🛰️ 4. Commands, Keybindings & Context Flags](#a-4commandskeybindingscontextflags) <a id="toc-4commandskeybindingscontextflags"></a> ^toc-4commandskeybindingscontextflags
  - [🔧 5. Workspace Build & Configuration](#a-5workspacebuildconfiguration) <a id="toc-5workspacebuildconfiguration"></a> ^toc-5workspacebuildconfiguration
  - [Go Back to...](#a-gobackto) <a id="toc-gobackto"></a> ^toc-gobackto
  - [Go back to...](#a-gobackto-1) <a id="toc-gobackto-1"></a> ^toc-gobackto-1
---
## 📑 AI Primary Files
<a id="a-aiprimaryfiles"></a>[TOC](#toc-aiprimaryfiles)
- 🔹 [AGENTS.md](../AGENTS.md)
- 🔹 [+ce-cherrypucker.md](+ce-cherrypucker.md)
- 🔹 [ARCHIVE.md](ARCHIVE.md)
- 🔹 [BUILD.md](BUILD.md)
- 🔹 [CODE.md](CODE.md)
- 🔹 [DESIGN.md](DESIGN.md)
- 🔹 [FEATURES.md](FEATURES.md)
- 🔹 [LOG.md](LOG.md)
- 🔸 [MANUAL.md](MANUAL.md)
- 🔹 [README.md](../README.md)
- 🔹 [SPEC.md](SPEC.md)
- 🔹 [TASKS.md](TASKS.md)
- 🔹 [TERMS.md](TERMS.md)
- 🔹 [TESTING.md](TESTING.md)
- 🔹 [VERSIONS.md](VERSIONS.md)


This guide describes the structural architecture, module layout, internal algorithms, optimization behaviors, and technical specifications of the **CherryPucker** codebase.
---
## 🏗️ 1. Architecture Overview
<a id="a-1architectureoverview"></a>[TOC](#toc-1architectureoverview)

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
<a id="a-2coremodulessystems"></a>[TOC](#toc-2coremodulessystems)

### A. Template Substitution Engine (`substituteTemplate`)
<a id="a-atemplatesubstitutionenginesubstitutetemplate"></a>[TOC](#toc-atemplatesubstitutionenginesubstitutetemplate)
- Parses `${property}` indicators in templates.
- Employs `resolvePath` to extract data fields dynamically using dot notation matching or structural brackets, resolving nested values recursively.
- Formats final output tokens through `formatValue` and places text in the global clipboard buffer.

### B. AST Navigation & Context Core (`findObjectAtCursor` / `findArrayAtCursor`)
<a id="a-bastnavigationcontextcorefindobjectatcursorfindarrayatcursor"></a>[TOC](#toc-bastnavigationcontextcorefindobjectatcursorfindarrayatcursor)
- Utilizes the `jsonc-parser` AST scanner to parse JSON/JSONC documents relative to the active selection range offset.
- Resolves nodes upward towards the nearest structural parent boundaries (`object` or `array`).
- Tracks nested element structures to differentiate between localized property key nodes and value structures.

### C. Indent Normalizer & Generator (`getLineIndent` / `getIndentUnit`)
<a id="a-cindentnormalizergeneratorgetlineindentgetindentunit"></a>[TOC](#toc-cindentnormalizergeneratorgetlineindentgetindentunit)
- Queries user-configured document settings (`insertSpaces`, `tabSize`) to resolve standard alignment spacings.
- Inspects preceding line prefixes (`getLineIndent`) to append correctly structured spaces/tabs on insertions, preventing format clutter.

### D. Multi-Object Target Resolver (`getTargetObjectNodes` / `selectedArrayObjectNodes`)
<a id="a-dmultiobjecttargetresolvergettargetobjectnodesselectedarrayobjectnodes"></a>[TOC](#toc-dmultiobjecttargetresolvergettargetobjectnodesselectedarrayobjectnodes)
- Detects if an active user selection spans multiple lines.
- Intersects highlighted boundaries against child nodes to implement multiselect macros (restricting array sorts or property paste operations only to the chosen lines).

### E. Struct-Safe Comma Normalizer (`propertySnippetWithComma`)
<a id="a-estructsafecommanormalizerpropertysnippetwithcomma"></a>[TOC](#toc-estructsafecommanormalizerpropertysnippetwithcomma)
- When deleting, duplicate, or swapping lines, this engine evaluates character spaces following individual properties.
- Strips or prepends commas depending on line locations to guarantee JSON structure stability.


## 🔎 3. Core Algorithm
<a id="a-3corealgorithm"></a>[TOC](#toc-3corealgorithm)

### Smart Property Swapping (`movePropertyUp` / `movePropertyDown`)
<a id="a-smartpropertyswappingmovepropertyupmovepropertydown"></a>[TOC](#toc-smartpropertyswappingmovepropertyupmovepropertydown)
- **Find Position**: Locates the target property node index inside the parent JSON Object array.
- **Identify Bound**: Computes the exact offset range of the property node, including trailing comments and commas, using `propertySnippetWithComma`.
- **Compute Neighbor**: Finds the index of the upper (`idx - 1`) or lower (`idx + 1`) property sibling line.
- **Swap Buffers**: Replaces the combined span of the two property rows with the swapped text content, ensuring that preceding formatting and trailing commas remain balanced.


## 🛰️ 4. Commands, Keybindings & Context Flags
<a id="a-4commandskeybindingscontextflags"></a>[TOC](#toc-4commandskeybindingscontextflags)

- **Target When clause**: All JSON commands are scoped to the clause:
  `editorTextFocus && (editorLangId == json || editorLangId == jsonc)`
  This prevents CherryPucker shortcuts from overriding system defaults inside non-JSON documents.
- **Keybindings Controller**: `applySuggestedKeybindings` and `removeSuggestedKeybindings` operate under standard Node filesystem integrations (`fs.writeFileSync`, etc.) to append CherryPucker-specific parameters safely onto `AppData/Roaming/Code/User/keybindings.json`.


## 🔧 5. Workspace Build & Configuration
<a id="a-5workspacebuildconfiguration"></a>[TOC](#toc-5workspacebuildconfiguration)
The build stack is lightweight:
- **Language**: CommonJS Node.js JavaScript module format.
- **Dependency Map**: Leverages `jsonc-parser` for AST evaluations.
- **Pre-publish Validation**: Packages must compile using `@vscode/vsce package` into a deployment-ready `.vsix` file.

---
## Go Back to...
<a id="a-gobackto"></a>[TOC](#toc-gobackto)
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
<a id="a-gobackto-1"></a>[TOC](#toc-gobackto-1)
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

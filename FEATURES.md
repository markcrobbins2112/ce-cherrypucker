---
title: FEATURES
---

# FEATURES

---
## Back to...
- ▪️[AGENTS.md](AGENTS.md)
- ▪️[AILOG.md](AILOG.md)
- ▪️[AITASKS.md](AITASKS.md)
- ▪️[BUILD.md](BUILD.md)
- ▪️[CODE.md](CODE.md)
- 🔸[FEATURES.md](FEATURES.md)
- ▪️[MANUAL.md](MANUAL.md)
- ▪️[README.md](README.md)
- ▪️[SPEC.md](SPEC.md)
- ▪️[TESTING.md](TESTING.md)

Welcome to **CherryPucker**!
This guide details all the user-facing capabilities, UI patterns, and command behaviors of the extension for templated data copying and granular JSON/JSONC AST edits.

## Feature Groups

### 📋 1. Configurable Templated Copying
<a id="z1" name="z.1"></a>
Allows developers to quickly extract text from the current active object using configurable templates.
- **[Dynamic Placeholder Substitution](#dynamic-placeholder-substitution)** - Interpolates placeholders like `${name}` with real values from the cursored JSON object.
- **[10 Configuration Templates](#10-configuration-templates)** - User settings map templates to `copyTemplate1` through `copyTemplate10`.

### ⚡ 2. Granular Property Operations
<a id="z2" name="z.2"></a>
Directly interact with JSON properties under the active cursor without manual selection dragging.
- **[Prop Name/Value Extraction](#prop-namevalue-extraction)** - Copy property names, values, or quoted values to the clipboard with automatic notification prompts.
- **[Precise Clipboard Pasting](#precise-clipboard-pasting)** - Paste values/names with strip/retain quotes logic, maintaining correct quote characters.
- **[Interactive Focus/Jumps](#interactive-focusjumps)** - Search and scroll directly to a property name (selecting name contents inside quotes).

### 📐 3. Indentation & Structural Property Control
<a id="z3" name="z.3"></a>
Rearrange, duplicate, or delete property keys in an active JSON object while maintaining structural syntax integrity.
- **[Move/Delete Properties](#movedelete-properties)** - Move keys up/down or delete them, automatically adjusting trailing and preceding commas.
- **[Indent-Aware Property Duplication](#indent-aware-property-duplication)** - Duplicates properties including comment details and auto-selects the inner quotes of the new key.

### 🍱 4. Array Selection & Batch Macro Editing
<a id="z4" name="z.4"></a>
Perform advanced queries across array elements using high-level property matching criteria.
- **[Selected Range Context Limits](#selected-range-context-limits)** - Restricts sorting, copying, or delete operations strictly to highlighted lines when selection is active.
- **[Array Key Sorting & Filtering](#array-key-sorting--filtering)** - Sort object arrays ascending/descending, or execute bulk deletions, copies, and updates by matching target property/values via interactive selectors.

### ⌨️ 5. Shortcut Setup Commands & Unified Picker
<a id="z5" name="z.5"></a>
Ensure friction-free keybinding setup and discovery directly from the workspace.
- **[Command Picker with Shortcut Badging](#command-picker-with-shortcut-badging)** - Open a unified picker showcasing all CherryPucker features with current shortcut key bindings displayed as ghost text templates.
- **[One-Click Keybindings Installation](#one-click-keybindings-installation)** - Install or remove suggested user-level shortcuts safely to `keybindings.json` without overwriting custom bindings.


## All Features

### Dynamic Placeholder Substitution
- Group: [Configurable Templated Copying](#z1)
Evaluates placeholders matching the `${property_name}` format inside a template using properties extracted from the JSON object surrounding the current cursor position. Nested properties can be resolved using standard dot notation or array-indexed brackets.

### 10 Configuration Templates
- Group: [Configurable Templated Copying](#z1)
Binds `cherryPucker.copyTemplate1` through `10` to multiline workspace configuration settings under your User Settings, giving you immediate access to complex text templates.

### Prop Name/Value Extraction
- Group: [Granular Property Operations](#z2)
Runs direct clipboard actions. Allows fetching plain property values, quoted string expressions, or bare property key strings, immediately writing them to the system clipboard and outputting status messages in notifications.

### Precise Clipboard Pasting
- Group: [Granular Property Operations](#z2)
Appends or overrides existing name or value fields. When pasting string items, this feature retains formatting and quotes; it strips surrounding quote frames if pasting string material from clipboard, or injects matching quotes automatically based on type contexts.

### Interactive Focus/Jumps
- Group: [Granular Property Operations](#z2)
Enables quick navigation. Triggering jump-to-property overlays a fast QuickPick finder listing all keys and simple values. Selecting keys immediately focuses and scrolls to the target range on screen, highlighting the characters inside the quotes. Typing Escape restores the original cursor focus.

### Move/Delete Properties
- Group: [Indentation & Structural Property Control](#z3)
Bypasses manual comma syntax debugging. Moving property key-value lines up/down or deleting them entirely automates prepending/appending comma placement, keeping JSON structure completely valid.

### Indent-Aware Property Duplication
- Group: [Indentation & Structural Property Control](#z3)
Duplicates the active property line. Correctly preserves surrounding indentation spaces/tabs and associated comments. After completing duplication, the editor focuses and selects the inner quote contents of the newly-created property name.

### Selected Range Context Limits
- Group: [Array Selection & Batch Macro Editing](#z4)
Ensures granular control. If multiple objects (or lines in an array) are selected on screen, bulk operations like copy property value, sorts, or deletes target ONLY those selected items rather than affecting the entire document scope.

### Array Key Sorting & Filtering
- Group: [Array Selection & Batch Macro Editing](#z4)
Enables bulk manipulations. Sorts document array items by property values ascending/descending, or runs custom batch mutations (e.g. copying matching elements to clipboard, setting/editing keys, or deleting entries) using interactive quick pick screens.

### Command Picker with Shortcut Badging
- Group: [Shortcut Setup Commands & Unified Picker](#z5)
Brings a single hub for commands, accessible via `alt+` f12`. This presents all CherryPucker features, ending each entry with `<shortcut keys> :CherryPucker` in ghost text to facilitate shortcut memorization.

### One-Click Keybindings Installation
- Group: [Shortcut Setup Commands & Unified Picker](#z5)
Automates configuration setup. The system parses the local `keybindings.json` to install custom non-clashing keyboard shortcut routes, outputting conflicted actions to clipboard as a reference, or cleanly deletes all installed keys in one click.

---
## Go Back to...
- ▪️[AGENTS.md](AGENTS.md)
- ▪️[AILOG.md](AILOG.md)
- ▪️[AITASKS.md](AITASKS.md)
- ▪️[BUILD.md](BUILD.md)
- ▪️[CODE.md](CODE.md)
- 🔸[FEATURES.md](FEATURES.md)
- ▪️[MANUAL.md](MANUAL.md)
- ▪️[README.md](README.md)
- ▪️[SPEC.md](SPEC.md)
- ▪️[TESTING.md](TESTING.md)

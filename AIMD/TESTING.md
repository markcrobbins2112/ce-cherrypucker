---
title: TESTING
---

# TESTING
<a id="a-testing"></a>[TOC](#toc-testing)

<!-- TOC location -->
## 🔍 Table of Contents
<!-- Maintained by script -->
- [TESTING](#a-testing) <a id="toc-testing"></a> ^toc-testing
  - [📑 AI Primary Files](#a-aiprimaryfiles) <a id="toc-aiprimaryfiles"></a> ^toc-aiprimaryfiles
  - [🔵 Setup & Environment Check](#a-setupenvironmentcheck) <a id="toc-setupenvironmentcheck"></a> ^toc-setupenvironmentcheck
  - [🟢 Template & Basic Copying Checks](#a-templatebasiccopyingchecks) <a id="toc-templatebasiccopyingchecks"></a> ^toc-templatebasiccopyingchecks
  - [⚡ Granular Property & Line Actions](#a-granularpropertylineactions) <a id="toc-granularpropertylineactions"></a> ^toc-granularpropertylineactions
  - [🕹️ Structural Reordering & Array Edits](#a-structuralreorderingarrayedits) <a id="toc-structuralreorderingarrayedits"></a> ^toc-structuralreorderingarrayedits
  - [🚀 Keybinding Configuration & Picker Tests](#a-keybindingconfigurationpickertests) <a id="toc-keybindingconfigurationpickertests"></a> ^toc-keybindingconfigurationpickertests
  - [Go Back to...](#a-gobackto) <a id="toc-gobackto"></a> ^toc-gobackto
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
- 🔹 [MANUAL.md](MANUAL.md)
- 🔹 [README.md](../README.md)
- 🔹 [SPEC.md](SPEC.md)
- 🔹 [TASKS.md](TASKS.md)
- 🔹 [TERMS.md](TERMS.md)
- 🔸 [TESTING.md](TESTING.md)
- 🔹 [VERSIONS.md](VERSIONS.md)


You can use this interactive test sheet directly with VS Code / Cursor to verify that all systems in **CherryPucker** are fully functional. Put your cursor on these checkbox lines, and mark them done!

---
## 🔵 Setup & Environment Check
<a id="a-setupenvironmentcheck"></a>[TOC](#toc-setupenvironmentcheck)
- [ ] Confirm `package.json` designates `"main": "extension.js"` and has correctly mapped `dependencies`, `activationEvents`, and all registered command definitions.
- [ ] Install package dependencies with `npm install` and verify the package bundles cleanly via `npm run package`.
- [ ] Open a JSON/JSONC text file inside VS Code to trigger extension activation events.

## 🟢 Template & Basic Copying Checks
<a id="a-templatebasiccopyingchecks"></a>[TOC](#toc-templatebasiccopyingchecks)
- [ ] Place the text cursor inside a flat JSON object (e.g. `{"title": "Test Book", "value": 150}`). Trigger command `cherryPucker.copyTemplate1`.
- [ ] Verify template fields interpolate correctly on clipboard: reading `Title: Test Book` and `Value: 150`.
- [ ] Confirm a toast notification shows containing the action name and a truncated slice of the substituted text.
- [ ] Trigger `cherryPucker.copyObjectValue` or `cherryPucker.copyObjectValueQuoted`, pick an object property via QuickPick, and verify that the correct unquoted or quoted value is put on clipboard.

## ⚡ Granular Property & Line Actions
<a id="a-granularpropertylineactions"></a>[TOC](#toc-granularpropertylineactions)
- [ ] Paste a value onto a property using `cherryPucker.pastePropertyValue`. Observe that formatting indentation is preserved and outer string quotes are retained nicely.
- [ ] Execute `cherryPucker.deletePropertyValue` on a string. Confirm the value changes to a blank string `""` with the cursor resting inside the quotes.
- [ ] Trigger property deletion inside non-string properties. Verify the value/element syntax is removed cleanly.
- [ ] Run `cherryPucker.dupeProperty` on a key-value pair. Verify that the line duplicates to the next line with matching indentation, and that the cursor actively highlights/selects the content inside the quote boundaries of the new property name.

## 🕹️ Structural Reordering & Array Edits
<a id="a-structuralreorderingarrayedits"></a>[TOC](#toc-structuralreorderingarrayedits)
- [ ] Place the cursor on a property item and invoke `cherryPucker.movePropertyUp` or `cherryPucker.movePropertyDown`. Confirm lines swap places while adjusting prepended/appended commas perfectly.
- [ ] Highlight multiple objects of an array in an active editor. Trigger `cherryPucker.copyPropertyValue` and select a property key. Confirm that values from *only* the selected objects are copied to clipboard, separated by newlines.
- [ ] Trigger `cherryPucker.sortObjectArrayByPropertyValueAscending` or `cherryPucker.sortObjectArrayByPropertyValueDescending` inside an array with multiple objects. Choose a sorting key and verify item rows reorder cleanly based on nested value properties.

## 🚀 Keybinding Configuration & Picker Tests
<a id="a-keybindingconfigurationpickertests"></a>[TOC](#toc-keybindingconfigurationpickertests)
- [ ] Execute command `cherryPucker.applySuggestedKeybindings`. Review your local `%APPDATA%/Code/User/keybindings.json` and confirm standard key layouts are written correctly.
- [ ] Verify that pre-existing key combinations are skipped/preserved, conflicts are copied onto the clipboard, and a notification summarizes the action.
- [ ] Trigger `cherryPucker.showPickerForAllCommands`. Verify that all commands render in a structured picker menu, each badged with ghost text depicting `<shortcut keys> :CherryPucker` aligned nicely.
- [ ] Execute `cherryPucker.removeSuggestedKeybindings`. Re-inspect `%APPDATA%/Code/User/keybindings.json` to verify that installed bindings are wiped.

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

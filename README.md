---
title: README
---

# CherryPucker
<a id="a-cherrypucker"></a>[TOC](#toc-cherrypucker)

<!-- TOC location -->
## 🔍 Table of Contents
<!-- Maintained by script -->
- [CherryPucker](#a-cherrypucker) <a id="toc-cherrypucker"></a> ^toc-cherrypucker
  - [Installation](#a-installation) <a id="toc-installation"></a> ^toc-installation
  - [Commands](#a-commands) <a id="toc-commands"></a> ^toc-commands
  - [Configuration](#a-configuration) <a id="toc-configuration"></a> ^toc-configuration
  - [Development](#a-development) <a id="toc-development"></a> ^toc-development
  - [Suggested Keybindings](#a-suggestedkeybindings) <a id="toc-suggestedkeybindings"></a> ^toc-suggestedkeybindings
  - [Publishing](#a-publishing) <a id="toc-publishing"></a> ^toc-publishing
  - [License](#a-license) <a id="toc-license"></a> ^toc-license
---
## Installation
<a id="a-installation"></a>[TOC](#toc-installation)

Install from the VS Code Marketplace, or install a local `.vsix` package:

```bash
code --install-extension cherrypucker-0.0.1.vsix
```

## Commands
<a id="a-commands"></a>[TOC](#toc-commands)

Open the Command Palette and run:

- `CherryPucker: Copy Template 1`
- `CherryPucker: Copy Template 2`
- `CherryPucker: Copy Template 3`
- `CherryPucker: Copy Template 4`
- `CherryPucker: Copy Template 5`
- `CherryPucker: Copy Template 6`
- `CherryPucker: Copy Template 7`
- `CherryPucker: Copy Template 8`
- `CherryPucker: Copy Template 9`
- `CherryPucker: Copy Template 10`
- `CherryPucker: Copy Object Value`
- `CherryPucker: Copy Object Value (Quoted)`
- `CherryPucker: Apply Suggested Keybindings`
- `CherryPucker: Remove Suggested Keybindings`

## Configuration
<a id="a-configuration"></a>[TOC](#toc-configuration)

Set template values in `Settings` with these keys:

- `cherryPucker.template1`
- `cherryPucker.template2`
- `cherryPucker.template3`
- `cherryPucker.template4`
- `cherryPucker.template5`
- `cherryPucker.template6`
- `cherryPucker.template7`
- `cherryPucker.template8`
- `cherryPucker.template9`
- `cherryPucker.template10`

Example template:

```json
"cherryPucker.template1": "Title: ${title}\nValue: ${value}"
```

Placeholders are resolved from properties found in the JSON object at your cursor.

## Development
<a id="a-development"></a>[TOC](#toc-development)

```bash
npm install
npm run package
```

The package command generates a `.vsix` using `vsce`.

## Suggested Keybindings
<a id="a-suggestedkeybindings"></a>[TOC](#toc-suggestedkeybindings)

`cherryPucker.copyObject`, `alt+insert o`
`cherryPucker.copyObjectsFromArrayByPropertyValue`, `alt+insert ctrl+v`
`cherryPucker.copyObjectValue`, `insert v`
`cherryPucker.copyObjectValueQuoted`, `insert shift+v`
`cherryPucker.copyProperty`, `alt+insert alt+p`
`cherryPucker.copyPropertyName`, `alt+insert alt+n`
`cherryPucker.copyPropertyValue`, `alt+insert alt+v`
`cherryPucker.copyTemplate1`, `alt+insert shift+1`
`cherryPucker.copyTemplate10`, `alt+insert shift+0`
`cherryPucker.copyTemplate2`, `alt+insert shift+2`
`cherryPucker.copyTemplate3`, `alt+insert shift+3`
`cherryPucker.copyTemplate4`, `alt+insert shift+4`
`cherryPucker.copyTemplate5`, `alt+insert shift+5`
`cherryPucker.copyTemplate6`, `alt+insert shift+6`
`cherryPucker.copyTemplate7`, `alt+insert shift+7`
`cherryPucker.copyTemplate8`, `alt+insert shift+8`
`cherryPucker.copyTemplate9`, `alt+insert shift+9`
`cherryPucker.cutObjectsFromArrayByPropertyValue`, `alt+delete ctrl+x`
`cherryPucker.deleteObjectsFromArrayByPropertyValue`, `alt+delete ctrl+v`
`cherryPucker.deleteProperty`, `alt+delete p`
`cherryPucker.deletePropertyName`, `alt+delete n`
`cherryPucker.deletePropertyValue`, `alt+delete v`
`cherryPucker.dupeObject`, `alt+insert ctrl+d`
`cherryPucker.dupeProperty`, `alt+insert p`
`cherryPucker.jumpToPropertyName`, `insert n`
`cherryPucker.movePropertyDown`, `ctrl+alt+shift+down`
`cherryPucker.movePropertyUp`, `ctrl+alt+shift+up`
`cherryPucker.pastePropertyName`, `alt+insert n`
`cherryPucker.pastePropertyNameAndSelect`, `alt+insert shift+n`
`cherryPucker.pastePropertyValue`, `alt+insert v`
`cherryPucker.pastePropertyValueAndSelect`, `alt+insert shift+v`
`cherryPucker.setObjectsArrayPropertyValue`, `alt+insert ctrl+alt+v`
`cherryPucker.showPickerForAllCommands`, `alt+\` f12`
`cherryPucker.sortObjectArrayByPropertyValueAscending`, `alt+insert ctrl+alt+v`
`cherryPucker.sortObjectArrayByPropertyValueDescending`, `alt+insert ctrl+alt+shift+v`
`cherryPucker.sortObjectProperties`, `alt+insert ctrl+p`
`cherryPucker.sortObjectPropertiesDeep`, `alt+insert ctrl+shift+p`

## Publishing
<a id="a-publishing"></a>[TOC](#toc-publishing)

1. Bump `version` in `package.json`.
2. Run `npm run package`.
3. Publish with your extension publisher credentials.

## License
<a id="a-license"></a>[TOC](#toc-license)

MIT

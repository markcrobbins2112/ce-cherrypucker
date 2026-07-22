---
title: CODE
---

# CODE
<a id="a-code"></a>[TOC](#toc-code)

<!-- TOC location -->
## 🔍 Table of Contents
<!-- Maintained by script -->
- [CODE](#a-code) <a id="toc-code"></a> ^toc-code
  - [📑 AI Primary Files](#a-aiprimaryfiles) <a id="toc-aiprimaryfiles"></a> ^toc-aiprimaryfiles
  - [Go to...](#a-goto) <a id="toc-goto"></a> ^toc-goto
  - [Implementation Guidelines](#a-implementationguidelines) <a id="toc-implementationguidelines"></a> ^toc-implementationguidelines
    - [Markdown](#a-markdown) <a id="toc-markdown"></a> ^toc-markdown
    - [Javascript, Typescript Coding Style](#a-javascripttypescriptcodingstyle) <a id="toc-javascripttypescriptcodingstyle"></a> ^toc-javascripttypescriptcodingstyle
      - [Typescript Code Style](#a-typescriptcodestyle) <a id="toc-typescriptcodestyle"></a> ^toc-typescriptcodestyle
      - [Container Classes](#a-containerclasses) <a id="toc-containerclasses"></a> ^toc-containerclasses
      - [Static methods](#a-staticmethods) <a id="toc-staticmethods"></a> ^toc-staticmethods
      - [Avoid static this references](#a-avoidstaticthisreferences) <a id="toc-avoidstaticthisreferences"></a> ^toc-avoidstaticthisreferences
      - [JsDocs](#a-jsdocs) <a id="toc-jsdocs"></a> ^toc-jsdocs
        - [Use when possible](#a-usewhenpossible) <a id="toc-usewhenpossible"></a> ^toc-usewhenpossible
        - [Types of class members](#a-typesofclassmembers) <a id="toc-typesofclassmembers"></a> ^toc-typesofclassmembers
        - [Type Expressions](#a-typeexpressions) <a id="toc-typeexpressions"></a> ^toc-typeexpressions
        - [JsDoc Layout](#a-jsdoclayout) <a id="toc-jsdoclayout"></a> ^toc-jsdoclayout
      - [Global Function Ordering](#a-globalfunctionordering) <a id="toc-globalfunctionordering"></a> ^toc-globalfunctionordering
    - [Regions](#a-regions) <a id="toc-regions"></a> ^toc-regions
      - [Regions inside classes](#a-regionsinsideclasses) <a id="toc-regionsinsideclasses"></a> ^toc-regionsinsideclasses
  - [Go back to...](#a-gobackto) <a id="toc-gobackto"></a> ^toc-gobackto
---
## 📑 AI Primary Files
<a id="a-aiprimaryfiles"></a>[TOC](#toc-aiprimaryfiles)
- 🔹 [AGENTS.md](../AGENTS.md)
- 🔹 [+ce-cherrypucker.md](+ce-cherrypucker.md)
- 🔹 [ARCHIVE.md](ARCHIVE.md)
- 🔹 [BUILD.md](BUILD.md)
- 🔸 [CODE.md](CODE.md)
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
- ▪️[BUILD.md](BUILD.md)
- 🔸[CODE.md](CODE.md)
- ▪️[FEATURES.md](FEATURES.md)
- ▪️[MANUAL.md](MANUAL.md)
- ▪️[README.md](README.md)
- ▪️[SPEC.md](SPEC.md)
- ▪️[TESTING.md](TESTING.md)

## Implementation Guidelines
<a id="a-implementationguidelines"></a>[TOC](#toc-implementationguidelines)
- **Encoding Safety**: Preserve UTF-8 encoding and avoid bulk read/write rewrites of files that can corrupt emoji/icon literals (mojibake).
- Prefer small targeted patches, and after icon-related edits run lint and quickly verify shared icon constants still render correctly.


### Markdown
<a id="a-markdown"></a>[TOC](#toc-markdown)
- Use dashes instead of asterisks for bullet items
- AGENTS: never ever change an [X], never use an [X] always use lowercase [x] when completing a task
- Always update UPPERCASE.md files (such as AITASKS.md, AILOG.md, etc.) when tasks are completed or work is performed
- Put all chat task requests from the user on AITASKS.md first before working on them
- If the user says 'do tasks', always state what you are going to do and then wait for the user's adjustments and approval before proceeding
- AILOG: The top of AILOG.md should always feature a "Commit Message" section maintained by the AI, which must be cleared whenever the user says they have committed or appended the changes

### Javascript, Typescript Coding Style
<a id="a-javascripttypescriptcodingstyle"></a>[TOC](#toc-javascripttypescriptcodingstyle)
- **Indentation**: Use tabs for indentation.
- **Braces**: Always use braces for control structures (if, for, while, etc.).

#### Typescript Code Style
<a id="a-typescriptcodestyle"></a>[TOC](#toc-typescriptcodestyle)
- use <https://google.github.io/styleguide/tsguide.html#container-classes>
  - except Container Classes - which we want

#### Container Classes
<a id="a-containerclasses"></a>[TOC](#toc-containerclasses)
```js
class TheContainer {
	static const val = 1;
	static fn() {}
}
```
- but no globals
```js
const val = TheContainer.val;
const fn = TheContainer.fn;
```
- use like this
```js
function x() {
	const Tc_ = TheContainer;
	Tc_.fn();
}
```
- not like this
```js
function x() {
	TheContainer.fn();
}
```

#### Static methods
<a id="a-staticmethods"></a>[TOC](#toc-staticmethods)
- Use static methods
```js
class StaticMethods() {
	static method() {}
}
```
- not
```js
StaticMethods.method = function () {}
```

#### Avoid static this references
<a id="a-avoidstaticthisreferences"></a>[TOC](#toc-avoidstaticthisreferences)
- this is fine, allowed

#### JsDocs
<a id="a-jsdocs"></a>[TOC](#toc-jsdocs)

##### Use when possible
<a id="a-usewhenpossible"></a>[TOC](#toc-usewhenpossible)
- @exports
- @imports

- @param
- @returns
- @callback
- @throws

- @enum
- @type
- @typedef

- @global
- @class
- @extends
- @static
- @private
- @protected
- @public
- @override
- @readonly
- @satisfiees
- @template

- @constructor
- @var
- @member
- @memberof
- @property

- @see
- @todo
- @example

##### Types of class members
<a id="a-typesofclassmembers"></a>[TOC](#toc-typesofclassmembers)
- use @var for members that are values
- use @member for members that are functions
- use @property for members that are get/set


##### Type Expressions
<a id="a-typeexpressions"></a>[TOC](#toc-typeexpressions)
- always use type expressions in jsdocs
  - @member {readonly ActionsTargetTypes} allowedTargetTypes

##### JsDoc Layout
<a id="a-jsdoclayout"></a>[TOC](#toc-jsdoclayout)
```js
/** {brief title}
 * {long description}
 * {more}
 * {@example}
 * {@see}
 */
```

#### Global Function Ordering
<a id="a-globalfunctionordering"></a>[TOC](#toc-globalfunctionordering)
- if in a region, order by dependency within the region, meaning a function is listed after the ones it is dependent on
- not in a region, order by dependency
- if no dependencies, order alphabetically

### Regions
<a id="a-regions"></a>[TOC](#toc-regions)
- classes are to be kept in a region named _classes
- classes are to be wrapped in a region named _class_{classname}

#### Regions inside classes
<a id="a-regionsinsideclasses"></a>[TOC](#toc-regionsinsideclasses)
- _class_{classname}_types
- _class_{classname}_vars
- _class_{classname}_properties
- _class_{classname}_members
- _class_{classname}_ctor
- _class_{classname}_functions
---
## Go back to...
<a id="a-gobackto"></a>[TOC](#toc-gobackto)
- ▪️[AGENTS.md](AGENTS.md)
- ▪️[AILOG.md](AILOG.md)
- ▪️[AITASKS.md](AITASKS.md)
- ▪️[BUILD.md](BUILD.md)
- 🔸[CODE.md](CODE.md)
- ▪️[FEATURES.md](FEATURES.md)
- ▪️[MANUAL.md](MANUAL.md)
- ▪️[README.md](README.md)
- ▪️[SPEC.md](SPEC.md)
- ▪️[TESTING.md](TESTING.md)

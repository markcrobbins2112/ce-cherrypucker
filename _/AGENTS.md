---
title: AGENTS
---

<!-- # TEMPLATE: AGENTS.template.md -->
<!-- 
# AGENTS
# Any text bounded by double curly braces {{like this}} is a placeholder for you to fill out.
# Replace those placeholders with real paths, rules, and project constraints.
#
# INSTRUCTIONS FOR THE AI AGENT:
# This file defines your operational boundaries, tools, platforms, and roles.
# Adhere strictly to the boundaries and prompts defined for your assigned persona.
-->

<!-- markdownlint-disable MD013 -->

# AGENTS
<a id="a-agents"></a>[TOC](#toc-agents)

## 📑 AI Primary Files
<a id="a-aiprimaryfiles"></a>[TOC](#toc-aiprimaryfiles)
- 🔸 [AGENTS.md](AGENTS.md)
- 🔹 [ARCHIVE.md](AIMD/ARCHIVE.md)
- 🔹 [BUILD.md](AIMD/BUILD.md)
- 🔹 [CODE.md](AIMD/CODE.md)
- 🔹 [DESIGN.md](AIMD/DESIGN.md)
- 🔹 [FEATURES.md](AIMD/FEATURES.md)
- 🔹 [LOG.md](AIMD/LOG.md)
- 🔹 [MANUAL.md](AIMD/MANUAL.md)
- 🔹 [README.md](README.md)
- 🔹 [SPEC.md](AIMD/SPEC.md)
- 🔹 [TASKS.md](AIMD/TASKS.md)
- 🔹 [TERMS.md](AIMD/TERMS.md)
- 🔹 [TESTING.md](AIMD/TESTING.md)
- 🔹 [VERSIONS.md](AIMD/VERSIONS.md)

<!-- TOC location -->
## 🔍 Table of Contents
<!-- Maintained by script -->
- [AGENTS](#a-agents) <a id="toc-agents"></a> ^toc-agents
  - [📑 AI Primary Files](#a-aiprimaryfiles) <a id="toc-aiprimaryfiles"></a> ^toc-aiprimaryfiles
  - [💻 Application](#a-application) <a id="toc-application"></a> ^toc-application
  - [⚙️ Platform](#a-platform) <a id="toc-platform"></a> ^toc-platform
  - [👥 Core Agent Roster & Personas](#a-coreagentrosterpersonas) <a id="toc-coreagentrosterpersonas"></a> ^toc-coreagentrosterpersonas
    - [1. {{Agent Role Name / e.g., Lead Architect}}](#a-1agentrolenameegleadarchitect) <a id="toc-1agentrolenameegleadarchitect"></a> ^toc-1agentrolenameegleadarchitect
    - [2. {{Agent Role Name / e.g., Quality Assurance Bot}}](#a-2agentrolenameegqualityassurancebot) <a id="toc-2agentrolenameegqualityassurancebot"></a> ^toc-2agentrolenameegqualityassurancebot
  - [🛠️ Global Execution Rules & Governance](#a-globalexecutionrulesgovernance) <a id="toc-globalexecutionrulesgovernance"></a> ^toc-globalexecutionrulesgovernance
  - [🚫 File Restrictions](#a-filerestrictions) <a id="toc-filerestrictions"></a> ^toc-filerestrictions
    - [Do NOT alter Files](#a-donotalterfiles) <a id="toc-donotalterfiles"></a> ^toc-donotalterfiles
    - [Inline Tasks](#a-inlinetasks) <a id="toc-inlinetasks"></a> ^toc-inlinetasks
  - [📂 Project Context](#a-projectcontext) <a id="toc-projectcontext"></a> ^toc-projectcontext
  - [🚦 Interaction Rules & Handoff Protocols](#a-interactionruleshandoffprotocols) <a id="toc-interactionruleshandoffprotocols"></a> ^toc-interactionruleshandoffprotocols
    - [Multi-Agent Communication Style](#a-multiagentcommunicationstyle) <a id="toc-multiagentcommunicationstyle"></a> ^toc-multiagentcommunicationstyle
  - [🏗️ Verification and Architecture Anchors](#a-verificationandarchitectureanchors) <a id="toc-verificationandarchitectureanchors"></a> ^toc-verificationandarchitectureanchors
  - [📦 Build](#a-build) <a id="toc-build"></a> ^toc-build
  - [🎨 Code Styling and Preferences](#a-codestylingandpreferences) <a id="toc-codestylingandpreferences"></a> ^toc-codestylingandpreferences
  - [🚀 Go to...](#a-goto) <a id="toc-goto"></a> ^toc-goto
---
## 💻 Application
<a id="a-application"></a>[TOC](#toc-application)
- {{Describe the core application/extension being built here, e.g., "A background utility extension to streamline cross-platform environment handoffs and directory mapping workflows."}}

<!-- 
  INSTRUCTION: List the environment, target runner, code editors, OS, 
  or platforms where this app compiles and executes.
-->
## ⚙️ Platform
<a id="a-platform"></a>[TOC](#toc-platform)
- {{Specify platforms, e.g., Windows 10, macOS, Cursor, VS Code, Node.js runtime environment, etc.}}

---

## 👥 Core Agent Roster & Personas
<a id="a-coreagentrosterpersonas"></a>[TOC](#toc-coreagentrosterpersonas)

### 1. {{Agent Role Name / e.g., Lead Architect}}
<a id="a-1agentrolenameegleadarchitect"></a>[TOC](#toc-1agentrolenameegleadarchitect)
<!-- AI Purpose: Defines a specific AI persona, its strategic purpose, and operational mindset. -->
- **Persona Archetype:** {{e.g., Pragmatic, pedantic, security-focused expert code optimizer}}
- **Core Responsibility:** {{e.g., Designing system topology, verifying schema migrations, structural layouts}}
- **System Prompt / Identity:**
  ```text
  <!-- AI Format: Insert the exact system prompt block to copy/paste into your initialization context. -->
  You are an expert... Your goal is to... Always prioritize...
  ```

### 2. {{Agent Role Name / e.g., Quality Assurance Bot}}
<a id="a-2agentrolenameegqualityassurancebot"></a>[TOC](#toc-2agentrolenameegqualityassurancebot)
- **Persona Archetype:** {{e.g., Edge-case hunter, test-driven development purist, validation engine}}
- **Core Responsibility:** {{e.g., Writing integration tests, finding runtime edge cases, verifying errors}}
- **System Prompt / Identity:**
  ```text
  You are an automated code auditor... Focus entirely on failure states...
  ```

---

## 🛠️ Global Execution Rules & Governance
<a id="a-globalexecutionrulesgovernance"></a>[TOC](#toc-globalexecutionrulesgovernance)

<!-- 
  INSTRUCTION: Document strict instructions regarding what the AI can and cannot modify.
  This includes package.json rules, read-only third party vendor folders, etc.
-->
## 🚫 File Restrictions
<a id="a-filerestrictions"></a>[TOC](#toc-filerestrictions)
- {{List any strict file edits rules, e.g., "Do not create new files unless requested", "Do not modify dependencies without human approval"}}

### Do NOT alter Files
<a id="a-donotalterfiles"></a>[TOC](#toc-donotalterfiles)
- `!🌐index.md`
- `!🏗️setup.md`
- `.gitignore`
- {{List other critical files, e.g., LICENSE, core infrastructure configuration templates, etc.}}

### Inline Tasks
<a id="a-inlinetasks"></a>[TOC](#toc-inlinetasks)
- {{Specify inline system tasks parser format, e.g., "Comments in the form of `;! {instructions}` or `//! {instructions}` found in source code are active AI Tasks"}}

<!-- 
  INSTRUCTION: Detail the environment context (e.g., test fixtures, sandboxing, 
  permissions, emulator settings, mock data rules).
-->
## 📂 Project Context
<a id="a-projectcontext"></a>[TOC](#toc-projectcontext)
- {{Describe any local development directories or resources, e.g., "The standalone mock database file layout is configured for sandbox execution loops only."}}

---

## 🚦 Interaction Rules & Handoff Protocols
<a id="a-interactionruleshandoffprotocols"></a>[TOC](#toc-interactionruleshandoffprotocols)

### Multi-Agent Communication Style
<a id="a-multiagentcommunicationstyle"></a>[TOC](#toc-multiagentcommunicationstyle)
<!-- AI Purpose: Instructs the AI on how to pass tasks to other top-level signatures or ask for human validation. -->
- **Handoff Phrase:** Use `[HANDOFF -> AgentName]` when a task shifts out of your core responsibility scope.
- **Escalation Trigger:** Stop and request Human-in-the-Loop (`HITL`) confirmation if a proposed change disrupts primary system configurations, engine subkeys, or destructive file purges.

---

## 🏗️ Verification and Architecture Anchors
<a id="a-verificationandarchitectureanchors"></a>[TOC](#toc-verificationandarchitectureanchors)

<!-- 
  INSTRUCTION: List verification rules that MUST happen before complete cycles are closed.
  For example, running 'lint_applet' or 'compile_applet'.
-->
## 📦 Build
<a id="a-build"></a>[TOC](#toc-build)
- **Linter & Verification**: {{Provide check rules, e.g., "Always run compilation checks and execution verification routines before finishing your turn."}}

## 🎨 Code Styling and Preferences
<a id="a-codestylingandpreferences"></a>[TOC](#toc-codestylingandpreferences)
- See [CODE](AIMD/CODE.md)

---
## 🚀 Go to...
<a id="a-goto"></a>[TOC](#toc-goto)
- 🔸 [AGENTS.md](AGENTS.md)
- 🔹 [ARCHIVE.md](AIMD/ARCHIVE.md)
- 🔹 [BUILD.md](AIMD/BUILD.md)
- 🔹 [CODE.md](AIMD/CODE.md)
- 🔹 [DESIGN.md](AIMD/DESIGN.md)
- 🔹 [FEATURES.md](AIMD/FEATURES.md)
- 🔹 [LOG.md](AIMD/LOG.md)
- 🔹 [MANUAL.md](AIMD/MANUAL.md)
- 🔹 [README.md](README.md)
- 🔹 [SPEC.md](AIMD/SPEC.md)
- 🔹 [TASKS.md](AIMD/TASKS.md)
- 🔹 [TERMS.md](AIMD/TERMS.md)
- 🔹 [TESTING.md](AIMD/TESTING.md)
- 🔹 [VERSIONS.md](AIMD/VERSIONS.md)

<!-- # TEMPLATE: AGENTS.template.md -->

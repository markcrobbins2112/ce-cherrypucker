// file: C:\_o\__\ce-cherrypucker\extension.js
const vscode = require('vscode');
const jsonc = require('jsonc-parser');
const fs = require('fs');
const path = require('path');
const JSON_EDITOR_WHEN = 'editorTextFocus && (editorLangId == json || editorLangId == jsonc)';

function resolvePath(obj, path) {
	if (obj == null) return undefined;
	const normalized = path.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');
	return normalized.split('.').reduce((curr, key) => (curr == null ? undefined : curr[key]), obj);
}

function formatValue(value) {
	if (value === undefined || value === null) return '';
	if (typeof value === 'object') return JSON.stringify(value);
	return String(value);
}

function truncateForNotification(text, max = 140) {
	const normalized = (text ?? '').replace(/\s+/g, ' ').trim();
	return normalized.length > max ? `${normalized.slice(0, max)}...` : normalized;
}

function notifyClipboard(action, text) {
	vscode.window.showInformationMessage(`CherryPucker: ${action} -> ${truncateForNotification(text)}`);
}

const SUGGESTED_KEYBINDINGS = [
	{ command: 'cherryPucker.copyObject', key: 'alt+insert o', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.copyObjectsFromArrayByPropertyValue', key: 'alt+insert ctrl+v', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.copyObjectValue', key: 'insert v', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.copyObjectValueQuoted', key: 'insert shift+v', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.copyProperty', key: 'alt+insert alt+p', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.copyPropertyName', key: 'alt+insert alt+n', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.copyPropertyValue', key: 'alt+insert alt+v', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.copyTemplate1', key: 'alt+insert shift+1', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.copyTemplate10', key: 'alt+insert shift+0', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.copyTemplate2', key: 'alt+insert shift+2', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.copyTemplate3', key: 'alt+insert shift+3', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.copyTemplate4', key: 'alt+insert shift+4', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.copyTemplate5', key: 'alt+insert shift+5', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.copyTemplate6', key: 'alt+insert shift+6', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.copyTemplate7', key: 'alt+insert shift+7', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.copyTemplate8', key: 'alt+insert shift+8', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.copyTemplate9', key: 'alt+insert shift+9', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.cutObjectsFromArrayByPropertyValue', key: 'alt+delete ctrl+x', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.deleteObjectsFromArrayByPropertyValue', key: 'alt+delete ctrl+v', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.deleteProperty', key: 'alt+delete p', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.deletePropertyName', key: 'alt+delete n', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.deletePropertyValue', key: 'alt+delete v', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.dupeObject', key: 'alt+insert ctrl+d', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.dupeProperty', key: 'alt+insert p', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.jumpToPropertyName', key: 'insert n', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.movePropertyDown', key: 'ctrl+alt+shift+down', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.movePropertyUp', key: 'ctrl+alt+shift+up', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.pastePropertyName', key: 'alt+insert n', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.pastePropertyNameAndSelect', key: 'alt+insert shift+n', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.pastePropertyValue', key: 'alt+insert v', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.pastePropertyValueAndSelect', key: 'alt+insert shift+v', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.setObjectsArrayPropertyValue', key: 'insert ctrl+alt+v', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.showPickerForAllCommands', key: 'alt+` f12', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.sortObjectArrayByPropertyValueAscending', key: 'alt+insert ctrl+alt+v', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.sortObjectArrayByPropertyValueDescending', key: 'alt+insert ctrl+alt+shift+v', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.sortObjectProperties', key: 'alt+insert ctrl+p', when: JSON_EDITOR_WHEN },
	{ command: 'cherryPucker.sortObjectPropertiesDeep', key: 'alt+insert ctrl+shift+p', when: JSON_EDITOR_WHEN },
];

const COMMAND_TITLE_BY_ID = {
	'cherryPucker.copyTemplate1': 'CherryPucker: Copy Template 1',
	'cherryPucker.copyTemplate2': 'CherryPucker: Copy Template 2',
	'cherryPucker.copyTemplate3': 'CherryPucker: Copy Template 3',
	'cherryPucker.copyTemplate4': 'CherryPucker: Copy Template 4',
	'cherryPucker.copyTemplate5': 'CherryPucker: Copy Template 5',
	'cherryPucker.copyTemplate6': 'CherryPucker: Copy Template 6',
	'cherryPucker.copyTemplate7': 'CherryPucker: Copy Template 7',
	'cherryPucker.copyTemplate8': 'CherryPucker: Copy Template 8',
	'cherryPucker.copyTemplate9': 'CherryPucker: Copy Template 9',
	'cherryPucker.copyTemplate10': 'CherryPucker: Copy Template 10',
	'cherryPucker.copyObjectValue': 'CherryPucker: Copy Object Value',
	'cherryPucker.copyObjectValueQuoted': 'CherryPucker: Copy Object Value (Quoted)',
	'cherryPucker.copyPropertyValue': 'CherryPucker: Copy Property Value',
	'cherryPucker.pastePropertyValue': 'CherryPucker: Paste Property Value',
	'cherryPucker.pastePropertyValueAndSelect': 'CherryPucker: Paste Property Value and Select',
	'cherryPucker.deletePropertyValue': 'CherryPucker: Delete Property Value',
	'cherryPucker.jumpToPropertyName': 'CherryPucker: Jump to Property Name',
	'cherryPucker.copyPropertyName': 'CherryPucker: Copy Property Name',
	'cherryPucker.pastePropertyName': 'CherryPucker: Paste Property Name',
	'cherryPucker.pastePropertyNameAndSelect': 'CherryPucker: Paste Property Name and Select Value',
	'cherryPucker.deletePropertyName': 'CherryPucker: Delete Property Name',
	'cherryPucker.copyProperty': 'CherryPucker: Copy Property',
	'cherryPucker.dupeProperty': 'CherryPucker: Duplicate Property',
	'cherryPucker.copyObject': 'CherryPucker: Copy Object',
	'cherryPucker.dupeObject': 'CherryPucker: Duplicate Object',
	'cherryPucker.sortObjectProperties': 'CherryPucker: Sort Object Properties',
	'cherryPucker.sortObjectPropertiesDeep': 'CherryPucker: Sort Object Properties (Deep)',
	'cherryPucker.movePropertyUp': 'CherryPucker: Move Property Up',
	'cherryPucker.movePropertyDown': 'CherryPucker: Move Property Down',
	'cherryPucker.deleteProperty': 'CherryPucker: Delete Property',
	'cherryPucker.sortObjectArrayByPropertyValueAscending': 'CherryPucker: Sort Object Array by Property Value (Ascending)',
	'cherryPucker.sortObjectArrayByPropertyValueDescending': 'CherryPucker: Sort Object Array by Property Value (Descending)',
	'cherryPucker.deleteObjectsFromArrayByPropertyValue': 'CherryPucker: Delete Objects From Array by Property Value',
	'cherryPucker.copyObjectsFromArrayByPropertyValue': 'CherryPucker: Copy Objects From Array by Property Value',
	'cherryPucker.cutObjectsFromArrayByPropertyValue': 'CherryPucker: Cut Objects From Array by Property Value',
	'cherryPucker.setObjectsArrayPropertyValue': 'CherryPucker: Set Objects Array Property Value',
	'cherryPucker.showPickerForAllCommands': 'CherryPucker: Show Picker for All Commands',
	'cherryPucker.applySuggestedKeybindings': 'CherryPucker: Apply Suggested Keybindings',
	'cherryPucker.removeSuggestedKeybindings': 'CherryPucker: Remove Suggested Keybindings',
};

function getUserKeybindingsPath() {
	// Detect if the active editor app is Cursor or VS Code
	const isCursor = vscode.env.appName && vscode.env.appName.toLowerCase().includes('cursor');

	// Get base platform system directories
	const home = process.env.HOME || process.env.USERPROFILE || '';
	const appData = process.env.APPDATA;
	const folderName = isCursor ? 'Cursor' : 'Code';

	if (process.platform === 'win32') {
		// Windows path fallback
		return path.join(appData || path.join(home, 'AppData', 'Roaming'), folderName, 'User', 'keybindings.json');
	} else if (process.platform === 'darwin') {
		// macOS path location
		return path.join(home, 'Library', 'Application Support', folderName, 'User', 'keybindings.json');
	} else {
		// Linux (.config) path location
		return path.join(home, '.config', folderName, 'User', 'keybindings.json');
	}
}

function readUserKeybindings() {
	const kbPath = getUserKeybindingsPath();

	// If the file doesn't exist yet, return empty data placeholders so we can safely generate it
	if (!fs.existsSync(kbPath)) {
		return { kbPath, bindings: [], raw: '' };
	}

	const raw = fs.readFileSync(kbPath, 'utf8');
	const parsed = jsonc.parse(raw);

	if (parsed !== null && !Array.isArray(parsed)) {
		throw new Error('keybindings.json must contain a JSON array.');
	}

	return { kbPath, bindings: parsed || [], raw };
}

function getEditorIndentFallback() {
	const editorCfg = vscode.workspace.getConfiguration('editor');
	const insertSpaces = editorCfg.get('insertSpaces', true);
	const tabSize = Number(editorCfg.get('tabSize', 4));
	if (!insertSpaces) return '\t';
	return ' '.repeat(Number.isFinite(tabSize) && tabSize > 0 ? tabSize : 4);
}

function detectIndentFromContent(raw) {
	const text = String(raw || '');
	const lines = text.split(/\r?\n/);
	for (const line of lines) {
		const m = line.match(/^(\s+)"[^"]+"\s*:/);
		if (!m) continue;
		const indent = m[1];
		if (indent.includes('\t')) return '\t';
		return indent;
	}
	return null;
}

// 1. CHOOSE STRUCTURAL MUTATION FOR WRITING
function writeUserKeybindings(kbPath, bindings, raw) {
	// Fallback to standard write only if the file is completely new/empty
	if (!raw || raw.trim() === '') {
		const indent = getEditorIndentFallback();
		fs.writeFileSync(kbPath, `${JSON.stringify(bindings, null, indent)}\n`, 'utf8');
		return;
	}

	// If the file already exists, we do NOT use this function to overwrite it anymore.
	// Instead, we use jsonc.applyEdits inside the execution run block below.
}

// 2. UPDATE THE APPLY RUNNER TO USE JSONC EDITS
async function runApplySuggestedBindings() {
	try {
		const { kbPath, bindings, raw } = readUserKeybindings();
		const existing = Array.isArray(bindings) ? [...bindings] : [];
		const applied = [];
		const duplicates = [];

		// Create a mutable text block starting from the original raw file data
		let updatedRawText = raw || '[]';

		for (const suggested of SUGGESTED_KEYBINDINGS) {
			const exactDup = existing.find(
				(b) => String(b.key || '').toLowerCase() === suggested.key.toLowerCase() &&
					String(b.command || '') === suggested.command
			);
			if (exactDup) continue;

			const keyConflict = existing.find(
				(b) => String(b.key || '').toLowerCase() === suggested.key.toLowerCase()
			);
			if (keyConflict) {
				duplicates.push(`Conflict: ${suggested.command} needs "${suggested.key}", but it is already taken by "${keyConflict.command || 'unknown'}"`);
				continue;
			}

			// Calculate a structural insertion edit path at the end of the JSON array
			const jsonFormattingOptions = { insertSpaces: true, tabSize: 4 };
			const edits = jsonc.modify(updatedRawText, [existing.length], suggested, {
				formattingOptions: jsonFormattingOptions
			});

			// Safely stitch the new keybinding item into the raw text string, preserving comments!
			updatedRawText = jsonc.applyEdits(updatedRawText, edits);

			existing.push(suggested);
			applied.push(suggested);
		}

		if (applied.length > 0) {
			const dirPath = path.dirname(kbPath);
			if (!fs.existsSync(dirPath)) {
				fs.mkdirSync(dirPath, { recursive: true });
			}
			fs.writeFileSync(kbPath, updatedRawText, 'utf8');
		}

		if (duplicates.length) {
			await vscode.env.clipboard.writeText(duplicates.join('\n'));
		}

		vscode.window.showInformationMessage(
			`CherryPucker: Applied ${applied.length} keybindings. Conflicts skipped: ${duplicates.length}${duplicates.length ? ' (copied list to clipboard)' : ''}`
		);
	} catch (err) {
		vscode.window.showErrorMessage(`CherryPucker: Failed to apply suggested keybindings: ${err.message}`);
	}
}

async function runRemoveSuggestedBindings() {
	try {
		const { kbPath, bindings, raw } = readUserKeybindings();
		const before = bindings.length;
		const suggestedPairs = new Set(SUGGESTED_KEYBINDINGS.map((s) => `${s.command}@@${s.key.toLowerCase()}`));
		const filtered = bindings.filter((b) => !suggestedPairs.has(`${b.command}@@${String(b.key || '').toLowerCase()}`));
		writeUserKeybindings(kbPath, filtered, raw);
		vscode.window.showInformationMessage(`CherryPucker: Removed ${before - filtered.length} suggested keybindings.`);
	} catch (err) {
		vscode.window.showErrorMessage(`CherryPucker: Failed to remove suggested keybindings: ${err.message}`);
	}
}

function substituteTemplate(template, data) {
	return template.replace(/\$\{([^}]+)\}/g, (_m, key) => {
		const v = resolvePath(data, key.trim());
		return v === undefined ? '' : formatValue(v);
	});
}

function parseTreeWithNodeAtCursor(editor) {
	const document = editor.document;
	const text = document.getText();
	const root = jsonc.parseTree(text);
	if (!root) return null;
	const offset = document.offsetAt(editor.selection.active);

	// FIX: Changed true to false so cursor offset ignores whitespace/comments
	let node = jsonc.findNodeAtOffset(root, offset, false);
	return { document, text, root, offset, node };
}

function findObjectAtCursor(editor) {
	const parsed = parseTreeWithNodeAtCursor(editor);
	if (!parsed || !parsed.node) return null; // FIX: Ensure node exists before processing

	let node = parsed.node;

	// FIX: Explicitly guarantee node is valid during every step of the tree ascent
	while (node && typeof node === 'object' && node.type !== 'object') {
		node = node.parent;
	}

	if (!node || node.type !== 'object') return null;
	return { ...parsed, objectNode: node, objectValue: jsonc.getNodeValue(node) };
}

function offsetToPosition(document, offset) { return document.positionAt(offset); }
function rangeFromOffsets(document, start, end) { return new vscode.Range(document.positionAt(start), document.positionAt(end)); }

function restoreCursor(editor, selection) {
	editor.selection = selection;
	editor.revealRange(selection, vscode.TextEditorRevealType.InCenterIfOutsideViewport);
}

function getIndentUnit(editor) {
	const { insertSpaces, tabSize } = editor.options;
	if (!insertSpaces) return '\t';
	return ' '.repeat(typeof tabSize === 'number' ? tabSize : 2);
}

function getLineIndent(document, offset) {
	const line = document.lineAt(document.positionAt(offset).line).text;
	const m = line.match(/^\s*/);
	return m ? m[0] : '';
}

function getObjectProperties(objectNode) {
	if (!objectNode || !Array.isArray(objectNode.children)) return [];
	return objectNode.children
		// FIX: Added 'n &&' to protect against undefined trailing comma placeholder nodes
		.filter((n) => n && n.type === 'property' && n.children && n.children.length >= 2)
		.map((propNode) => {
			const keyNode = propNode.children[0];
			const valueNode = propNode.children[1];
			const key = jsonc.getNodeValue(keyNode);
			return {
				key,
				propNode,
				keyNode,
				valueNode,
				rawValue: jsonc.getNodeValue(valueNode),
				keyRange: [keyNode.offset, keyNode.offset + keyNode.length],
				valueRange: [valueNode.offset, valueNode.offset + valueNode.length],
				nameInsideQuoteRange: [keyNode.offset + 1, keyNode.offset + keyNode.length - 1],
			};
		});
}

function propertyQuickPickItems(properties) {
	return properties.map((p) => ({ label: p.key, description: truncateForNotification(formatValue(p.rawValue), 100), prop: p }));
}

function isSimpleValue(v) {
	return v == null || ['string', 'number', 'boolean'].includes(typeof v);
}

function parseClipboardForValue(clipboard, targetWasString) {
	if (targetWasString) {
		const t = clipboard.trim();
		if (t.startsWith('"') && t.endsWith('"')) return t;
		return JSON.stringify(clipboard);
	}
	return clipboard;
}

function nodeIntersectsSelection(node, selStart, selEnd) {
	// FIX: Immediately return false if the node is empty, unparsed, or undefined
	if (!node || typeof node !== 'object' || typeof node.offset !== 'number') {
		return false;
	}

	const nStart = node.offset;
	const nEnd = node.offset + node.length;
	return nEnd >= selStart && nStart <= selEnd;
}

function selectedArrayObjectNodes(editor, root) {
	if (!root) return [];
	const out = [];
	const sels = editor.selections.filter((s) => !s.isEmpty);
	if (!sels.length) return out;
	const ranges = sels.map((s) => [editor.document.offsetAt(s.start), editor.document.offsetAt(s.end)]);
	const walk = (node) => {
		if (!node) return;

		// FIX: Use optional chaining (?.) to prevent trying to read .type off an undefined or incomplete parent link
		if (node.type === 'object' && node.parent?.type === 'array') {
			for (const [a, b] of ranges) {
				if (nodeIntersectsSelection(node, a, b)) {
					out.push(node);
					break;
				}
			}
		}
		if (node.children) node.children.forEach(walk);
	};
	walk(root);
	return out;
}


function uniqueByOffset(nodes) {
	if (!Array.isArray(nodes)) return []; // Guard against bad array inputs
	const seen = new Set();
	const out = [];
	for (const n of nodes) {
		// FIX: Skip empty or undefined nodes entirely before checking offsets
		if (!n || typeof n.offset !== 'number') continue;

		const k = `${n.offset}:${n.length}`;
		if (!seen.has(k)) { seen.add(k); out.push(n); }
	}
	return out;
}

function getTargetObjectNodes(editor, parsedAtCursor) {
	if (!editor || !editor.selections || !parsedAtCursor || !parsedAtCursor.root) {
		return [];
	}

	const collectedTargets = [];

	for (const selection of editor.selections) {
		const offset = editor.document.offsetAt(selection.active);

		// Use includeTrivia = true to capture exact positions on whitespaces, colons, and commas
		let node = jsonc.findNodeAtOffset(parsedAtCursor.root, offset, true);
		if (!node) continue;

		// 1. Array Level Traversal
		if (node.type === 'array') {
			if (offset === node.offset) {
				// Directly on the opening '[' bracket
				collectedTargets.push({ type: 'FullArray', node: node });
			} else {
				// Inside the array body text space
				collectedTargets.push({ type: 'ArrayContents', node: node });
			}
			continue;
		}

		// 2. Property & Colon Boundary Logic
		if (node.type === 'property') {
			const keyNode = node.children[0];
			const valueNode = node.children[1];

			// Find the colon's physical character offset position
			const colonOffset = parsedAtCursor.text.indexOf(':', keyNode.offset + keyNode.length);

			if (offset > colonOffset) {
				// Cursor is AFTER the colon -> Grab the assigned value block directly
				if (valueNode) {
					if (valueNode.type === 'array') {
						collectedTargets.push({ type: 'FullArray', node: valueNode });
					} else if (valueNode.type === 'object') {
						collectedTargets.push({ type: 'NakedObject', node: valueNode });
					} else {
						collectedTargets.push({ type: 'PrimitiveValue', node: valueNode });
					}
				}
			} else {
				// Cursor is BEFORE or ON the colon -> Grab the container parent of this property
				let parentContainer = node.parent;
				if (parentContainer && parentContainer.type === 'object') {
					collectedTargets.push({ type: 'NakedObject', node: parentContainer });
				}
			}
			continue;
		}

		// 3. Fallback: Standard container tree climber
		let climbNode = node;
		while (climbNode && climbNode.type !== 'object' && climbNode.type !== 'array') {
			climbNode = climbNode.parent;
		}

		if (climbNode) {
			if (climbNode.type === 'object') {
				collectedTargets.push({ type: 'NakedObject', node: climbNode });
			} else if (climbNode.type === 'array') {
				// If cursor is on a gap or trailing comma inside the array, treat it as array contents
				collectedTargets.push({ type: 'ArrayContents', node: climbNode });
			}
		}
	}

	// Remove structural duplicates
	const seen = new Set();
	return collectedTargets.filter(target => {
		const key = `${target.node.offset}:${target.node.length}:${target.type}`;
		if (!seen.has(key)) {
			seen.add(key);
			return true;
		}
		return false;
	});
}


async function replaceRange(editor, start, end, replacement) {
	return editor.edit((b) => b.replace(rangeFromOffsets(editor.document, start, end), replacement));
}

function asJsonPropertyName(text) { return JSON.stringify(String(text)); }

function propertySnippetWithComma(text, propNode) {
	let start = propNode.offset;
	let end = propNode.offset + propNode.length;
	while (end < text.length && /[ \t]/.test(text[end])) end += 1;
	if (text[end] === ',') end += 1;
	return { start, end, text: text.slice(start, end) };
}

function findPropertyByKey(objectNode, key) {
	return getObjectProperties(objectNode).find((p) => p.key === key) || null;
}

function buildPropertyText(key, rawValueText) {
	return `${JSON.stringify(key)}: ${rawValueText}`;
}

function sortObjectKeys(value, deep) {
	if (Array.isArray(value)) return deep ? value.map((v) => sortObjectKeys(v, true)) : value;
	if (!value || typeof value !== 'object') return value;
	const keys = Object.keys(value).sort((a, b) => a.localeCompare(b));
	const out = {};
	for (const k of keys) out[k] = deep ? sortObjectKeys(value[k], true) : value[k];
	return out;
}

function formatWithBaseIndent(baseIndent, indentUnit, value) {
	const json = JSON.stringify(value, null, indentUnit);
	return json.split('\n').map((line, i) => (i === 0 ? line : `${baseIndent}${line}`)).join('\n');
}

async function runTemplateCommand(index) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) return vscode.window.showWarningMessage('CherryPucker: No active editor.');
	
	const originalSelections = editor.selections;

	// 1. Parse active syntax trees using your core helper
	const parsed = parseTreeWithNodeAtCursor(editor);
	if (!parsed || !parsed.root) {
		return vscode.window.showWarningMessage('CherryPucker: Failed to parse file structure.');
	}

	// 2. SELECTION-AWARE MULTI-OBJECT COLLECTOR
	let targetObjects = [];
	const hasActiveSelection = editor.selections.some(s => !s.isEmpty);

	if (hasActiveSelection) {
		const selectedNodes = uniqueByOffset(selectedArrayObjectNodes(editor, parsed.root));
		if (selectedNodes && selectedNodes.length > 0) {
			targetObjects = selectedNodes.map(node => ({ type: 'NakedObject', node: node }));
		}
	} else {
		targetObjects = getTargetObjectNodes(editor, parsed);
	}

	if (!targetObjects || targetObjects.length === 0) {
		return vscode.window.showWarningMessage('CherryPucker: Place the cursor inside a JSON object or select object data.');
	}

	// 3. REGISTRY DEDUPLICATION: Strict filter to protect against overlapping edit zones
	const finalUniqueTargets = [];
	const uniqueRangeRegistry = new Set();
	for (const target of targetObjects) {
		if (!target || !target.node || typeof target.node.offset !== 'number') continue;
		const rangeKey = `${target.node.offset}:${target.node.length}`;
		if (!uniqueRangeRegistry.has(rangeKey)) {
			uniqueRangeRegistry.add(rangeKey);
			finalUniqueTargets.push(target);
		}
	}

	// Sort targets top-to-bottom so they parse in correct chronological code order
	const sortedTargets = [...finalUniqueTargets].sort((a, b) => a.node.offset - b.node.offset);

	// 4. FETCH USER CONFIGURATION SETTING BLUEPRINT
	const template = vscode.workspace.getConfiguration('cherryPucker').get(`template${index}`, '');
	if (!template || !template.trim()) {
		return vscode.window.showWarningMessage(`CherryPucker: Configuration value for template${index} is empty.`);
	}

	// 5. GENERATION PIPELINE: Loop through objects and gather text blocks
	const generatedBlocks = [];

	for (const target of sortedTargets) {
		const node = target.node;
		const currentObjectValue = jsonc.getNodeValue(node);
		if (!currentObjectValue || typeof currentObjectValue !== 'object' || Array.isArray(currentObjectValue)) continue;

		const substitutedResult = substituteTemplate(template, currentObjectValue);
		if (substitutedResult) {
			generatedBlocks.push(substitutedResult.trim());
		}
	}

	if (generatedBlocks.length === 0) return;

	// FIXED: Always concatenate generated template rows using raw newlines only, completely dropping commas
	const combinedTemplateResult = generatedBlocks.join('\n');

	// 6. ATOMIC OVERWRITE CLIPBOARD
	await vscode.env.clipboard.writeText(combinedTemplateResult);
	notifyClipboard(`Copied Template ${index}`, combinedTemplateResult);

	editor.selections = originalSelections;
}

function buildPropertyQuickPickItems(obj) {
	return Object.keys(obj).map((key) => {
		const value = obj[key];
		const valueString = formatValue(value);
		return { label: key, description: valueString.length > 80 ? `${valueString.slice(0, 80)}...` : valueString, rawValue: value };
	});
}

async function runCopyValueCommand(options) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) return vscode.window.showWarningMessage('CherryPucker: No active editor.');
	const found = findObjectAtCursor(editor);
	if (!found || typeof found.objectValue !== 'object' || Array.isArray(found.objectValue)) return vscode.window.showWarningMessage('CherryPucker: Place the cursor inside a JSON object.');
	const items = buildPropertyQuickPickItems(found.objectValue);
	if (!items.length) return vscode.window.showWarningMessage('CherryPucker: Object has no properties to copy.');
	const picked = await vscode.window.showQuickPick(items, { placeHolder: 'Select a property to copy', matchOnDescription: true });
	if (!picked) return;
	const text = options.quoted ? JSON.stringify(picked.rawValue) : formatValue(picked.rawValue);
	await vscode.env.clipboard.writeText(text);
	notifyClipboard(`Copied ${options.quoted ? 'quoted ' : ''}value for "${picked.label}"`, text);
}

async function pickPropertyFromObjects(editor, objectNodes, placeHolder) {
	const propMap = new Map();
	for (const n of objectNodes) {
		for (const p of getObjectProperties(n)) {
			if (!propMap.has(p.key)) propMap.set(p.key, p.rawValue);
		}
	}
	const items = Array.from(propMap.keys()).sort().map((k) => ({
		label: k,
		description: isSimpleValue(propMap.get(k)) ? truncateForNotification(formatValue(propMap.get(k)), 100) : '(complex value)',
	}));
	if (!items.length) return null;
	const picked = await vscode.window.showQuickPick(items, { placeHolder, matchOnDescription: true });
	return picked ? picked.label : null;
}

async function runJumpToPropertyNameCommand() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) return vscode.window.showWarningMessage('CherryPucker: No active editor.');

	const originalSelections = editor.selections;

	// 1. Gather active context using your standard AST tree parser helper
	const parsedAtCursor = parseTreeWithNodeAtCursor(editor);
	if (!parsedAtCursor || !parsedAtCursor.root) {
		return vscode.window.showWarningMessage('CherryPucker: Failed to parse file structure.');
	}

	// ==========================================
	// CRITICAL FIX: EXPLICIT JUMP TARGET COLLECTOR
	// ==========================================
	let targetObjects = [];
	const hasActiveSelection = editor.selections.some(s => !s.isEmpty);

	if (hasActiveSelection) {
		// If text is highlighted, pull ALL individual object nodes from the selection block
		const selectedNodes = uniqueByOffset(selectedArrayObjectNodes(editor, parsedAtCursor.root));
		if (selectedNodes && selectedNodes.length > 0) {
			targetObjects = selectedNodes.map(node => ({ type: 'NakedObject', node: node }));
		}
	} else {
		// Fall back to your multi-cursor line context tracker if no drag selection is present
		targetObjects = getTargetObjectNodes(editor, parsedAtCursor);
	}

	if (!targetObjects || targetObjects.length === 0) {
		return vscode.window.showWarningMessage('CherryPucker: Place the cursor inside a JSON object or select object data.');
	}

	// 2. Aggregate unique properties across ALL targeted objects
	const combinedPropsMap = new Map();
	for (const target of targetObjects) {
		const objectNode = target.node;
		const objectProps = getObjectProperties(objectNode);

		for (const prop of objectProps) {
			if (!combinedPropsMap.has(prop.key)) {
				combinedPropsMap.set(prop.key, prop);
			}
		}
	}

	const propsList = Array.from(combinedPropsMap.values());
	if (!propsList.length) {
		return vscode.window.showWarningMessage('CherryPucker: Selected object(s) have no properties.');
	}

	// 3. Create and display the interactive QuickPick dropdown menu
	const qp = vscode.window.createQuickPick();
	qp.items = propertyQuickPickItems(propsList);
	qp.placeholder = `Select a property name to jump to across ${targetObjects.length} object(s)`;

	let accepted = false;

	// Real-time Preview: Scrolls your screen view as you arrow through menu options
	qp.onDidChangeActive((items) => {
		if (!items || items.length === 0) return;
		const targetPropName = items[0].label; // Fixed array extraction

		for (const target of targetObjects) {
			const matchingProp = getObjectProperties(target.node).find(p => p.key === targetPropName);
			if (matchingProp) {
				editor.revealRange(
					rangeFromOffsets(editor.document, matchingProp.nameInsideQuoteRange[0], matchingProp.nameInsideQuoteRange[1]),
					vscode.TextEditorRevealType.InCenterIfOutsideViewport
				);
				break;
			}
		}
	});

	// Execution Accept: Fires when you hit Enter on a property option
	qp.onDidAccept(() => {
		const selectedItems = qp.selectedItems;
		if (!selectedItems || selectedItems.length === 0) return;

		// FIXED: Unpack single item safely out of QuickPick selection array context
		const targetPropName = selectedItems[0].label;
		const multiCursorSelections = [];

		// Create a separate cursor selection block for every single object that contains this property
		for (const target of targetObjects) {
			const matchingProp = getObjectProperties(target.node).find(p => p.key === targetPropName);
			if (matchingProp) {
				const startPos = offsetToPosition(editor.document, matchingProp.nameInsideQuoteRange[0]);
				const endPos = offsetToPosition(editor.document, matchingProp.nameInsideQuoteRange[1]);

				// Generate a standard text cursor selection spanning the key name characters
				multiCursorSelections.push(new vscode.Selection(startPos, endPos));
			}
		}

		accepted = true;
		qp.hide();

		if (multiCursorSelections.length > 0) {
			// Clear out the active drag-selection first so the editor drops its selection priority
			editor.selections = [];

			// Force layout engines to drop cursors on an independent thread execution tick
			setTimeout(() => {
				editor.selections = multiCursorSelections;
				if (editor.selections.length > 0) {
					editor.revealRange(editor.selection, vscode.TextEditorRevealType.InCenterIfOutsideViewport);
				}
			}, 20);
		}
	});

	qp.onDidHide(() => {
		qp.dispose();
		if (!accepted) {
			editor.selections = originalSelections;
		}
	});

	qp.show();
}

async function runPropertyCommand(action) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) return vscode.window.showWarningMessage('CherryPucker: No active editor.');

	const original = editor.selection;

	// 1. Gather active context using your standard AST tree parser helper
	const parsed = parseTreeWithNodeAtCursor(editor);
	if (!parsed || !parsed.root) {
		return vscode.window.showWarningMessage('CherryPucker: Failed to parse file structure.');
	}

	// 2. SELECTION-AWARE TARGET OBJECTS COLLECTOR (Matches the Jump Tool architecture)
	let targetObjects = [];
	const hasActiveSelection = editor.selections.some(s => !s.isEmpty);

	if (hasActiveSelection) {
		// If text is highlighted, pull ALL individual object nodes from the selection block
		const selectedNodes = uniqueByOffset(selectedArrayObjectNodes(editor, parsed.root));
		if (selectedNodes && selectedNodes.length > 0) {
			// Map to match the expected node wrapper format
			targetObjects = selectedNodes.map(node => ({ type: 'NakedObject', node: node }));
		}
	} else {
		// Fall back to your multi-cursor line context tracker if no drag selection is present
		targetObjects = getTargetObjectNodes(editor, parsed);
	}

	if (!targetObjects || targetObjects.length === 0) {
		return vscode.window.showWarningMessage('CherryPucker: Place the cursor inside a JSON object or select object data.');
	}

	// Convert targeted wrappers safely back down into plain AST node elements for your existing loops
	const rawObjectNodes = targetObjects.map(t => t.node);

	// 3. Prompt user to select a target property from the active objects group
	const propName = await pickPropertyFromObjects(editor, rawObjectNodes, `Select a property to execute: ${action}`);
	if (!propName) return;

	const clipboard = await vscode.env.clipboard.readText();

	// ========================================================
	// ACTION: MULTI-CURSOR SAFE VALUE EXTRACTIONS
	// ========================================================
	if (action === 'copyPropertyValue' || action === 'copyObjectValue' || action === 'copyObjectValueQuoted') {
		const isQuoted = action === 'copyObjectValueQuoted';
		const extractedLines = [];

		for (const o of rawObjectNodes) {
			const p = findPropertyByKey(o, propName);
			if (p) {
				const val = p.rawValue;
				
				let formattedValue = '';
				if (isQuoted) {
					// Force strict JSON string double-quote wrapping onto every element row
					formattedValue = typeof val === 'string' ? `"${val}"` : JSON.stringify(val);
				} else {
					// Naked sibling: dump unquoted strings or raw object shapes
					formattedValue = typeof val === 'object' ? JSON.stringify(val) : String(val);
				}
				
				extractedLines.push(formattedValue);
			}
		}

		if (extractedLines.length === 0) return;
		
		const finalClipboardText = extractedLines.join('\n');
		
		await vscode.env.clipboard.writeText(finalClipboardText);
		notifyClipboard(`Copied ${extractedLines.length} value(s) for "${propName}"`, finalClipboardText);
		restoreCursor(editor, original);
		return;
	}

	// ========================================================
	// ACTION: PASTE VALUE(S) / DELETE VALUE(S)
	// ========================================================
	if (action === 'pastePropertyValue' || action === 'pastePropertyValueAndSelect' || action === 'deletePropertyValue') {
		const sels = [];

		await editor.edit((b) => {
			for (const o of rawObjectNodes) {
				const p = findPropertyByKey(o, propName);
				if (p) {
					let rep = '';
					const isString = typeof p.rawValue === 'string';

					if (action === 'pastePropertyValue' || action === 'pastePropertyValueAndSelect') {
						rep = parseClipboardForValue(clipboard, isString);
					}
					if (action === 'deletePropertyValue') {
						rep = isString ? '""' : '';
					}

					b.replace(rangeFromOffsets(editor.document, p.valueRange[0], p.valueRange[1]), rep);

					if (action === 'pastePropertyValueAndSelect') {
						sels.push(new vscode.Selection(offsetToPosition(editor.document, p.valueRange[0]), offsetToPosition(editor.document, p.valueRange[0] + rep.length)));
					}
					if (action === 'deletePropertyValue') {
						// FIXED: If we deleted a string value into "", move cursor offset +1 to place it inside the quotes ("|")
						const cursorOffset = isString ? p.valueRange[0] + 1 : p.valueRange[0];
						const targetPos = offsetToPosition(editor.document, cursorOffset);
						sels.push(new vscode.Selection(targetPos, targetPos));
					}
				} else if (action === 'pastePropertyValue' || action === 'pastePropertyValueAndSelect') {
					const ins = o.offset + o.length - 1;
					const hasProps = (o.children || []).length > 0;
					const prefix = hasProps ? ', ' : '';
					const raw = JSON.stringify(clipboard);
					const txt = `${prefix}${buildPropertyText(propName, raw)}`;
					b.insert(offsetToPosition(editor.document, ins), txt);
				}
			}
		});

		if (action === 'pastePropertyValue') restoreCursor(editor, original);
		else if (sels.length) editor.selections = sels;

		vscode.window.showInformationMessage(`CherryPucker: Completed -> ${action}`);
		return;
	}

	// ==========================================
	// ACTION: COPY PROPERTY NAME
	// ==========================================
	if (action === 'copyPropertyName') {
		await vscode.env.clipboard.writeText(propName);
		notifyClipboard(`Copied property name "${propName}"`, propName);
		restoreCursor(editor, original);
		return;
	}

	// ========================================================
	// ACTION: MULTI-CURSOR LAYOUT-SAFE CLIPBOARD PASTING/MERGING
	// ========================================================
	if (action === 'pastePropertyValue' || action === 'pastePropertyValueAndSelect' || action === 'deletePropertyValue') {
		const sels = [];
		const indentUnit = getIndentUnit(editor);

		await editor.edit((b) => {
			for (const o of rawObjectNodes) {
				const p = findPropertyByKey(o, propName);
				if (p) {
					const isString = typeof p.rawValue === 'string';

					if (action === 'deletePropertyValue') {
						const rep = isString ? '""' : '';
						b.replace(rangeFromOffsets(editor.document, p.valueRange, p.valueRange), rep);
						
						// Move cursor offset +1 to place it inside the quotes ("|")
						const cursorOffset = isString ? p.valueRange + 1 : p.valueRange;
						const targetPos = offsetToPosition(editor.document, cursorOffset);
						sels.push(new vscode.Selection(targetPos, targetPos));
					} else {
						// Execute pasting with layout formatting calculations
						const baseIndent = getLineIndent(editor.document, p.valueRange);
						let replacementText = clipboard;

						try {
							const parsedValue = JSON.parse(clipboard);
							if (parsedValue && typeof parsedValue === 'object') {
								replacementText = formatWithBaseIndent(baseIndent, indentUnit, parsedValue);
							}
						} catch (e) {
							if (clipboard.includes('\n')) {
								replacementText = clipboard.split('\n').map((line, idx) => idx === 0 ? line : baseIndent + line).join('\n');
							}
						}

						b.replace(rangeFromOffsets(editor.document, p.valueRange, p.valueRange), replacementText);
						
						if (action === 'pastePropertyValueAndSelect') {
							sels.push(new vscode.Selection(
								offsetToPosition(editor.document, p.valueRange), 
								offsetToPosition(editor.document, p.valueRange + replacementText.length)
							));
						}
					}
				} else if (action === 'pastePropertyValue' || action === 'pastePropertyValueAndSelect') {
					const ins = o.offset + o.length - 1;
					const hasProps = (o.children || []).length > 0;
					const prefix = hasProps ? ', ' : '';
					const raw = JSON.stringify(clipboard);
					const txt = `${prefix}${buildPropertyText(propName, raw)}`;
					b.insert(offsetToPosition(editor.document, ins), txt);
				}
			}
		});
		
		if (action === 'pastePropertyValue') restoreCursor(editor, original);
		else if (sels.length) editor.selections = sels;
		
		vscode.window.showInformationMessage(`CherryPucker: Completed -> ${action}`);
		return;
	}

	// ==========================================
	// ACTION: COPY WHOLE PROPERTY SNIPPET(S)
	// ==========================================
	if (action === 'copyProperty') {
		const lines = [];
		for (const o of rawObjectNodes) {
			const p = findPropertyByKey(o, propName);
			if (!p) continue;
			const snap = propertySnippetWithComma(parsed.text, p.propNode);
			lines.push(snap.text);
		}
		const out = lines.join('\n');
		await vscode.env.clipboard.writeText(out);
		notifyClipboard(`Copied property "${propName}"`, out);
		restoreCursor(editor, original);
		return;
	}

	// ========================================================
	// ACTION: DUPLICATE / MOVE / DELETE ENTIRE PROPERTY ROWS
	// ========================================================
	if (action === 'dupeProperty' || action === 'movePropertyUp' || action === 'movePropertyDown' || action === 'deleteProperty') {
		// Master array tracking where multi-cursors should land after text insertion completes
		const sels = [];

		await editor.edit((b) => {
			for (const o of rawObjectNodes) {
				const props = getObjectProperties(o);
				const idx = props.findIndex((p) => p.key === propName);
				if (idx < 0) continue;
				const p = props[idx];
				const snap = propertySnippetWithComma(parsed.text, p.propNode);

				// ========================================================
				// FIXED: BULK DELETE PROPERTY LINES (CLEARS INDENTATION TABS)
				// ========================================================
				if (action === 'deleteProperty') {
					let deleteStart = snap.start;
					let deleteEnd = snap.end;

					// 1. BACKWARD LOOK: Consume all leading indentation tabs/spaces on this line
					let startSearch = deleteStart - 1;
					while (startSearch >= 0 && (parsed.text[startSearch] === ' ' || parsed.text[startSearch] === '\t')) {
						deleteStart = startSearch;
						startSearch -= 1;
					}

					// 2. FORWARD LOOK: Consume exactly ONE trailing newline sequence right after the comma
					if (deleteEnd < parsed.text.length && (parsed.text[deleteEnd] === '\r' || parsed.text[deleteEnd] === '\n')) {
						if (parsed.text[deleteEnd] === '\r' && parsed.text[deleteEnd + 1] === '\n') {
							deleteEnd += 2; // Windows CRLF (\r\n)
						} else {
							deleteEnd += 1; // Linux/macOS LF (\n)
						}
					} else {
						// Fallback: If it's the final property inside the object, swallow the preceding line break
						if (startSearch >= 0 && (parsed.text[startSearch] === '\n' || parsed.text[startSearch] === '\r')) {
							if (parsed.text[startSearch] === '\n' && parsed.text[startSearch - 1] === '\r') {
								deleteStart = startSearch - 1;
							} else {
								deleteStart = startSearch;
							}
						}
					}

					b.replace(rangeFromOffsets(editor.document, deleteStart, deleteEnd), '');
					continue;
				}

				if (action === 'dupeProperty') {
					const baseIndent = getLineIndent(editor.document, p.propNode.offset);
					let cleanPropSnippet = snap.text.trimEnd();
					if (!cleanPropSnippet.endsWith(',')) {
						cleanPropSnippet += ',';
					}

					const textToInsert = `\n${baseIndent}${cleanPropSnippet}`;
					b.insert(offsetToPosition(editor.document, snap.end), textToInsert);

					// Shifted offsets +1 right to perfectly capture the inner text bounds ("|name")
					const newKeyStartOffset = snap.end + 1 + baseIndent.length + 1 + 1;
					const newKeyEndOffset = newKeyStartOffset + p.key.length;

					sels.push(new vscode.Selection(
						offsetToPosition(editor.document, newKeyStartOffset),
						offsetToPosition(editor.document, newKeyEndOffset)
					));
					continue;
				}

				// ========================================================
				// FIXED: MULTI-LINE & DIRECTION-AWARE COMMA SWAPPING
				// ========================================================
				if (action === 'movePropertyUp' || action === 'movePropertyDown') {
					const isUp = action === 'movePropertyUp';
					const props = getObjectProperties(o);
					
					const idx = props.findIndex((p) => p.key === propName);
					if (idx < 0) continue;

					const swapIdx = isUp ? idx - 1 : idx + 1;
					if (swapIdx < 0 || swapIdx >= props.length) continue;

					const currentProp = props[idx];
					const neighborProp = props[swapIdx];

					// Identify exact line boundaries directly from document positions
					const currentStartLine = editor.document.positionAt(currentProp.propNode.offset).line;
					const currentEndLine = editor.document.positionAt(currentProp.propNode.offset + currentProp.propNode.length).line;

					const neighborStartLine = editor.document.positionAt(neighborProp.propNode.offset).line;
					const neighborEndLine = editor.document.positionAt(neighborProp.propNode.offset + neighborProp.propNode.length).line;

					const currentStartPos = new vscode.Position(currentStartLine, 0);
					const currentEndText = editor.document.lineAt(currentEndLine).text;
					const currentEndPos = new vscode.Position(currentEndLine, currentEndText.length);

					const neighborStartPos = new vscode.Position(neighborStartLine, 0);
					const neighborEndText = editor.document.lineAt(neighborEndLine).text;
					const neighborEndPos = new vscode.Position(neighborEndLine, neighborEndText.length);

					let currentText = editor.document.getText(new vscode.Range(currentStartPos, currentEndPos));
					let neighborText = editor.document.getText(new vscode.Range(neighborStartPos, neighborEndPos));

					// ========================================================
					// COMMA SANITIZATION LIFECYCLE
					// ========================================================
					let cleanCurrent = currentText.trimEnd();
					let cleanNeighbor = neighborText.trimEnd();

					if (isUp) {
						// 1. Current text moves UP into a middle slot -> Must have a comma
						if (!cleanCurrent.endsWith(',')) {
							currentText = currentText.replace(/(\s*)$/, ',$1');
						}

						// 2. Neighbor text moves DOWN to the bottom -> Check if it lands at the final line
						// Check if the current item was originally the absolute last item in the object
						const isCurrentLastItem = (idx === props.length - 1);
						if (isCurrentLastItem && cleanNeighbor.endsWith(',')) {
							// Neighbor is now the last item! Strip its trailing comma cleanly
							neighborText = neighborText.replace(/,(\s*)$/, '$1');
						}
					} else {
						// 1. Neighbor text moves UP into a middle slot -> Must have a comma
						if (!cleanNeighbor.endsWith(',')) {
							neighborText = neighborText.replace(/(\s*)$/, ',$1');
						}

						// 2. Current text moves DOWN to the bottom -> Check if it lands at the final line
						const isNeighborLastItem = (swapIdx === props.length - 1);
						if (isNeighborLastItem && cleanCurrent.endsWith(',')) {
							// Current item is now the last item! Strip its trailing comma cleanly
							currentText = currentText.replace(/,(\s*)$/, '$1');
						}
					}

					// Execute the balanced structural line swapping operation
					if (isUp) {
						const totalRange = new vscode.Range(neighborStartPos, currentEndPos);
						b.replace(totalRange, currentText + '\n' + neighborText);
					} else {
						const totalRange = new vscode.Range(currentStartPos, neighborEndPos);
						b.replace(totalRange, neighborText + '\n' + currentText);
					}
					continue;
				}

			}
		});
		vscode.window.showInformationMessage(`CherryPucker: Completed -> ${action}`);

		// Inject all gathered multi-cursors directly back onto the canvas after the document edit saves
		if (sels.length > 0) {
			editor.selections = sels;
			editor.revealRange(editor.selection, vscode.TextEditorRevealType.InCenterIfOutsideViewport);
		}
		return;
	}
}

function findArrayAtCursor(editor) {
	const parsed = parseTreeWithNodeAtCursor(editor);
	if (!parsed || !parsed.node) return null; // FIX: Safeguard initial parsing bounds

	let node = parsed.node;

	// FIX: Protect the loop from climbing past the file root into undefined space
	while (node && typeof node === 'object' && node.type !== 'array') {
		node = node.parent;
	}

	if (!node || node.type !== 'array') return null;
	return { ...parsed, arrayNode: node, arrayValue: jsonc.getNodeValue(node) };
}

function getSelectedArrayIndices(editor, arrayNode) {
	const sels = editor.selections.filter((s) => !s.isEmpty);
	if (!sels.length) return null;
	const ranges = sels.map((s) => [editor.document.offsetAt(s.start), editor.document.offsetAt(s.end)]);
	const out = [];
	(arrayNode.children || []).forEach((child, idx) => {
		// FIX: Immediately skip if the child array node token is missing/undefined
		if (!child) return;

		for (const [a, b] of ranges) {
			if (nodeIntersectsSelection(child, a, b)) { out.push(idx); break; }
		}
	});
	return out.length ? out : null;
}

async function pickPropertyValueFromObjects(objects) {
	const map = new Map();
	for (const obj of objects) {
		if (!obj || typeof obj !== 'object' || Array.isArray(obj)) continue;
		for (const [k, v] of Object.entries(obj)) {
			if (!isSimpleValue(v)) continue;
			const key = `${k}:::${String(v)}`;
			if (!map.has(key)) map.set(key, { k, v });
		}
	}
	const items = Array.from(map.values()).map((x) => ({ label: x.k, description: String(x.v), detail: `${x.k} = ${String(x.v)}`, k: x.k, v: x.v }));
	if (!items.length) return null;
	const picked = await vscode.window.showQuickPick(items, { placeHolder: 'Select property/value' });
	if (!picked) return null;
	return { key: picked.k, value: picked.v };
}

async function runArrayCommand(action) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) return vscode.window.showWarningMessage('CherryPucker: No active editor.');

	// 1. Context Collection using your custom AST tree parser helper
	const found = findArrayAtCursor(editor);
	if (!found || !Array.isArray(found.arrayValue)) {
		return vscode.window.showWarningMessage('CherryPucker: Place the cursor inside an array.');
	}

	// Calculate target array indices (handles explicit selection highlights vs whole array default fallback)
	const selected = getSelectedArrayIndices(editor, found.arrayNode);
	const idxs = selected || found.arrayValue.map((_, i) => i);

	// Filter down safely to the real JSON objects contained inside the array range
	const objects = idxs
		.map((i) => found.arrayValue[i])
		.filter((v) => v && typeof v === 'object' && !Array.isArray(v));

	if (!objects.length) {
		return vscode.window.showWarningMessage('CherryPucker: No object items in target array range.');
	}

	// 2. Open the property matcher UI
	const picked = await pickPropertyValueFromObjects(objects);
	if (!picked) return;
	const { key, value } = picked;

	// Gather matching array indices based on the selected value criteria
	const matches = idxs.filter((i) => {
		const o = found.arrayValue[i];
		return o && typeof o === 'object' && !Array.isArray(o) && String(o[key]) === String(value);
	});

	if (!matches.length) {
		return vscode.window.showInformationMessage('CherryPucker: No matching objects found.');
	}

	// ==========================================
	// ACTION: COPY MATCHING OBJECTS FROM ARRAY
	// ==========================================
	if (action === 'copyObjectsFromArrayByPropertyValue') {
		const text = matches.map((i) => JSON.stringify(found.arrayValue[i])).join('\n');
		await vscode.env.clipboard.writeText(text);
		notifyClipboard('Copied matching objects', text);
		return;
	}

	let next = [...found.arrayValue];

	// ==========================================
	// ACTION: DELETE / CUT OBJECTS FROM ARRAY
	// ==========================================
	if (action === 'deleteObjectsFromArrayByPropertyValue' || action === 'cutObjectsFromArrayByPropertyValue') {
		if (action === 'cutObjectsFromArrayByPropertyValue') {
			const text = matches.map((i) => JSON.stringify(found.arrayValue[i])).join('\n');
			await vscode.env.clipboard.writeText(text);
			notifyClipboard('Cut matching objects', text);
		}
		// Filter out all matched indices to delete them cleanly
		next = next.filter((_, i) => !matches.includes(i));
	}

	// ==========================================
	// ACTION: BULK SET PROPERTY VALUES IN ARRAY
	// ==========================================
	if (action === 'setObjectsArrayPropertyValue') {
		const clip = await vscode.env.clipboard.readText();
		let parsedClip;
		try {
			parsedClip = JSON.parse(clip);
		} catch {
			parsedClip = clip;
		}
		for (const i of matches) {
			next[i] = { ...next[i], [key]: parsedClip };
		}
	}

	// ==========================================
	// ACTION: SORT ARRAY OBJECTS (ASC / DESC)
	// ==========================================
	if (action === 'sortObjectArrayByPropertyValueAscending' || action === 'sortObjectArrayByPropertyValueDescending') {
		const dir = action.endsWith('Descending') ? -1 : 1;
		const targetSet = new Set(idxs);
		const segment = idxs.map((i) => next[i]);

		segment.sort((a, b) => String(a?.[key] ?? '').localeCompare(String(b?.[key] ?? '')) * dir);

		let p = 0;
		next = next.map((item, i) => (targetSet.has(i) ? segment[p++] : item));
	}

	// 3. Format and replace structural changes cleanly into the file
	const baseIndent = getLineIndent(editor.document, found.arrayNode.offset);
	const indentUnit = getIndentUnit(editor);
	const replacement = formatWithBaseIndent(baseIndent, indentUnit, next);

	await replaceRange(editor, found.arrayNode.offset, found.arrayNode.offset + found.arrayNode.length, replacement);
	vscode.window.showInformationMessage(`CherryPucker: Completed -> ${action}`);
}


async function runShowPickerForAllCommands() {
	const suggestedKeyMap = new Map();
	for (const kb of SUGGESTED_KEYBINDINGS) {
		const keys = suggestedKeyMap.get(kb.command) || [];
		keys.push(kb.key);
		suggestedKeyMap.set(kb.command, keys);
	}
	const items = Object.keys(COMMAND_TITLE_BY_ID).map((command) => {
		const title = COMMAND_TITLE_BY_ID[command].replace(/^CherryPucker:\s*/, '');
		const shortcuts = (suggestedKeyMap.get(command) || []).join(', ');
		return {
			label: title,
			description: `<${shortcuts || 'no shortcut'}> :CherryPucker`,
			command,
		};
	});
	const picked = await vscode.window.showQuickPick(items, { placeHolder: 'Run CherryPucker command' });
	if (!picked) return;
	await vscode.commands.executeCommand(picked.command);
}

async function runObjectCommand(action) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) return vscode.window.showWarningMessage('CherryPucker: No active editor.');

	const original = editor.selection;

	// 1. Gather active context using your standard AST tree parser helper
	const parsedAtCursor = parseTreeWithNodeAtCursor(editor);
	if (!parsedAtCursor || !parsedAtCursor.root) {
		return vscode.window.showWarningMessage('CherryPucker: Failed to parse file structure.');
	}

	// 2. Extract structural target arrays using your smart selector helper
	const targetNodes = getTargetObjectNodes(editor, parsedAtCursor);
	if (!targetNodes || targetNodes.length === 0) {
		return vscode.window.showWarningMessage('CherryPucker: Place the cursor inside a JSON object or select object data.');
	}

	const documentText = editor.document.getText();

	// ========================================================
	// ACTION: ADAPTIVE CONTEXT-AWARE SMART SERIALIZED COPY
	// ========================================================
	if (action === 'copyObject') {
		const indent = getIndentUnit(editor);
		const rawText = editor.document.getText();

		// If we only have exactly 1 target, handle it standalone to avoid any outer array pollution
		if (targetNodes.length === 1) {
			const target = targetNodes[0];
			const nodeVal = jsonc.getNodeValue(target.node);
			let resultText = '';

			if (target.type === 'ArrayContents') {
				// If inside an array, serialize the child elements line-by-line with valid syntax commas
				if (Array.isArray(nodeVal)) {
					resultText = nodeVal.map(item => JSON.stringify(item, null, indent)).join(',\n');
				} else {
					resultText = JSON.stringify(nodeVal, null, indent);
				}
			} else {
				// Full arrays, naked objects, and primitives keep their exact raw JSON format
				resultText = JSON.stringify(nodeVal, null, indent);
			}

			await vscode.env.clipboard.writeText(resultText);
			notifyClipboard('Copied Context Element', resultText);
			restoreCursor(editor, original);
			return;
		}

		// MULTI-CURSOR COMBINATION PIPELINE:
		const finalOutputLines = [];

		for (const target of targetNodes) {
			const nodeVal = jsonc.getNodeValue(target.node);

			if (target.type === 'ArrayContents') {
				if (Array.isArray(nodeVal)) {
					nodeVal.forEach(item => {
						finalOutputLines.push(JSON.stringify(item, null, indent));
					});
				}
			} else {
				finalOutputLines.push(JSON.stringify(nodeVal, null, indent));
			}
		}

		if (finalOutputLines.length === 0) {
			return vscode.window.showWarningMessage('CherryPucker: No copyable JSON elements found at cursor locations.');
		}

		// Join multi-cursor strings or naked items together separated by commas to preserve valid data formatting
		const finalOutputText = finalOutputLines.join(',\n');

		await vscode.env.clipboard.writeText(finalOutputText);
		notifyClipboard(`Copied ${finalOutputLines.length} Custom Context Elements`, finalOutputText);
		restoreCursor(editor, original);
		return;
	}

	// ========================================================
	// ACTION: SMART SCREEN-AWARE SELECTION DUPLICATION
	// ========================================================
	if (action === 'dupeObject') {
		const document = editor.document;
		const selections = editor.selections;

		const hasActiveSelection = selections.some(s => !s.isEmpty);

		if (hasActiveSelection) {
			// WORKFLOW A: USER SELECTION HIGHLIGHT
			const sortedSelections = [...selections]
				.filter(s => !s.isEmpty)
				.sort((a, b) => a.start.line - b.start.line);

			const startLine = sortedSelections[0].start.line;
			let endLine = sortedSelections[sortedSelections.length - 1].end.line;

			// Handle trailing newlines cleanly if selection stops at column 0 of the next line
			if (endLine > startLine && sortedSelections[sortedSelections.length - 1].end.character === 0) {
				endLine -= 1;
			}

			const startPos = new vscode.Position(startLine, 0);
			const endLineText = document.lineAt(endLine).text;
			const endPos = new vscode.Position(endLine, endLineText.length);

			// 1. Read exactly what lines the user highlighted
			const rawSelectedText = document.getText(new vscode.Range(startPos, endPos));

			// 2. SCREEN-AWARE SYNTAX CHECK: Look at the actual line text on the screen
			// Clean up trailing whitespace and comments to see if a comma already exists
			const screenLineClean = endLineText.replace(/\/\/.*$/, '').replace(/\/\*[\s\S]*?\*\//, '').trim();

			// Check if the selection text itself already has a comma inside it
			const selectionLines = rawSelectedText.split(/\r?\n/);
			const selectionEndsWithComma = selectionLines.length > 0 && selectionLines[selectionLines.length - 1].trim().endsWith(',');

			let finalTextToInsert = '';

			// If either the screen line OR your text selection already has a comma, do not inject another one
			if (screenLineClean.endsWith(',') || selectionEndsWithComma) {
				finalTextToInsert = '\n' + rawSelectedText;
			} else {
				// Inject the missing structural comma separator safely
				finalTextToInsert = ',\n' + rawSelectedText;
			}

			// 3. Perform a single atomic text edit block operation
			await editor.edit((b) => {
				b.insert(endPos, finalTextToInsert);
			});

			// Re-anchor the active selection coordinates cleanly below the duplication
			editor.selection = new vscode.Selection(endPos, endPos);
			notifyClipboard(`Duplicated selected block lines (${startLine + 1}-${endLine + 1})`, rawSelectedText);
			return;
		} else {
			// WORKFLOW B: MULTI-CURSOR OR SINGLE BLINKING CARET (FALLBACK)
			const sortedTargets = [...targetNodes]
				.filter(t => t && t.node && typeof t.node.offset === 'number')
				.sort((a, b) => a.node.offset - b.node.offset);

			if (sortedTargets.length === 0) return;

			const firstNode = sortedTargets[0].node;
			const finalNode = sortedTargets[sortedTargets.length - 1].node;

			const startLine = document.positionAt(firstNode.offset).line;
			const endLine = document.positionAt(finalNode.offset + finalNode.length).line;

			const startPos = new vscode.Position(startLine, 0);
			const endLineText = document.lineAt(endLine).text;
			const endPos = new vscode.Position(endLine, endLineText.length);

			let linesText = document.getText(new vscode.Range(startPos, endPos));
			const insideArray = finalNode.parent?.type === 'array';
			let prefix = '\n';

			if (insideArray) {
				const cleanEndText = endLineText.replace(/\/\/.*$/, '').replace(/\/\*[\s\S]*?\*\//, '').trim();
				if (!cleanEndText.endsWith(',')) {
					prefix = ',\n';
					const baseIndent = getLineIndent(document, finalNode.offset);
					linesText = linesText.split('\n').map((line, idx) => {
						if (idx === 0) return baseIndent + line.trimStart();
						return line;
					}).join('\n');
				}
			}

			await editor.edit((b) => {
				b.insert(endPos, prefix + linesText);
			});

			editor.selection = new vscode.Selection(endPos, endPos);
			notifyClipboard(`Duplicated ${sortedTargets.length} context element(s)`, linesText);
			return;
		}
	}

	// ========================================================================
	// ACTION: MULTI-CURSOR LAYOUT-SAFE OBJECT PROPERTIES SORTING (SHALLOW/DEEP)
	// ========================================================================
	if (action === 'sortObjectProperties' || action === 'sortObjectPropertiesDeep') {
		const deep = action === 'sortObjectPropertiesDeep';

		// ==========================================
		// FIXED: GUARANTEED UNIQUE NODE SELECTION
		// ==========================================
		let activeSortNodes = [];
		const hasActiveSelection = editor.selections.some(s => !s.isEmpty);

		if (hasActiveSelection) {
			// If text is highlighted, pull ALL individual object nodes from the selection block
			const selectedNodes = uniqueByOffset(selectedArrayObjectNodes(editor, parsedAtCursor.root));
			if (selectedNodes && selectedNodes.length > 0) {
				activeSortNodes = selectedNodes.map(node => ({ type: 'NakedObject', node: node }));
			}
		} else {
			// Fall back to your multi-cursor line context tracker if no drag selection is present
			activeSortNodes = targetNodes;
		}

		// Double-check global deduplication by structural character offsets to strictly ban any overlapping ranges
		const finalUniqueObjects = [];
		const uniqueRangeRegistry = new Set();

		for (const target of activeSortNodes) {
			if (!target || !target.node || typeof target.node.offset !== 'number') continue;
			
			const rangeKey = `${target.node.offset}:${target.node.length}`;
			if (!uniqueRangeRegistry.has(rangeKey)) {
				uniqueRangeRegistry.add(rangeKey);
				finalUniqueObjects.push(target);
			}
		}

		// Execute edits backwards (descending offset) so prior replacements don't invalidate downstream character boundaries!
		const sortedNodes = [...finalUniqueObjects].sort((a, b) => b.node.offset - a.node.offset);

		let modifiedCount = 0;

		await editor.edit((editBuilder) => {
			for (const target of sortedNodes) {
				const node = target.node;
				const props = getObjectProperties(node);
				if (props.length <= 1) continue; // Skip if object has 0 or 1 keys

				// 1. Gather all individual lines mapping to properties inside this object block
				const propertyLineBlocks = props.map(p => {
					const startLine = editor.document.positionAt(p.propNode.offset).line;
					const endLine = editor.document.positionAt(p.propNode.offset + p.propNode.length).line;
					
					const startPos = new vscode.Position(startLine, 0);
					const endLineText = editor.document.lineAt(endLine).text;
					const endPos = new vscode.Position(endLine, endLineText.length);
					
					return {
						key: p.key,
						startPos,
						endPos,
						rawText: editor.document.getText(new vscode.Range(startPos, endPos))
					};
				});

				// 2. Sort the line blocks alphabetically based on their property key strings
				const originalOrderBlocks = [...propertyLineBlocks];
				propertyLineBlocks.sort((a, b) => a.key.localeCompare(b.key));

				// 3. COMMA SANITIZATION: Rebalance syntax tokens for the new order sequence
				propertyLineBlocks.forEach((block, idx) => {
					let cleanText = block.rawText.trimEnd();
					const isLastItem = (idx === propertyLineBlocks.length - 1);

					if (isLastItem) {
						if (cleanText.endsWith(',')) {
							block.rawText = block.rawText.replace(/,(\s*)$/, '$1');
						}
					} else {
						if (!cleanText.endsWith(',')) {
							block.rawText = block.rawText.replace(/(\s*)$/, ',$1');
						}
					}
				});

				// 4. Fire atomic segment replacements line-by-line mapping from top-to-bottom
				originalOrderBlocks.forEach((origBlock, idx) => {
					const incomingBlockText = propertyLineBlocks[idx].rawText;
					editBuilder.replace(new vscode.Range(origBlock.startPos, origBlock.endPos), incomingBlockText);
				});

				modifiedCount++;
			}
		});
		
		if (modifiedCount > 0) {
			vscode.window.showInformationMessage(`CherryPucker: Sorted properties across ${modifiedCount} object(s)`);
		}
		return;
	}

}

function activate(context) {
	for (let i = 1; i <= 10; i += 1) context.subscriptions.push(vscode.commands.registerCommand(`cherryPucker.copyTemplate${i}`, () => runTemplateCommand(i)));
	const reg = (id, fn) => context.subscriptions.push(vscode.commands.registerCommand(id, fn));
	reg('cherryPucker.copyObjectValue', () => runCopyValueCommand({ quoted: false }));
	reg('cherryPucker.copyObjectValueQuoted', () => runCopyValueCommand({ quoted: true }));
	reg('cherryPucker.copyPropertyValue', () => runPropertyCommand('copyPropertyValue'));
	reg('cherryPucker.pastePropertyValue', () => runPropertyCommand('pastePropertyValue'));
	reg('cherryPucker.pastePropertyValueAndSelect', () => runPropertyCommand('pastePropertyValueAndSelect'));
	reg('cherryPucker.deletePropertyValue', () => runPropertyCommand('deletePropertyValue'));
	reg('cherryPucker.jumpToPropertyName', () => runJumpToPropertyNameCommand());
	reg('cherryPucker.copyPropertyName', () => runPropertyCommand('copyPropertyName'));
	reg('cherryPucker.pastePropertyName', () => runPropertyCommand('pastePropertyName'));
	reg('cherryPucker.pastePropertyNameAndSelect', () => runPropertyCommand('pastePropertyNameAndSelect'));
	reg('cherryPucker.deletePropertyName', () => runPropertyCommand('deletePropertyName'));
	reg('cherryPucker.copyProperty', () => runPropertyCommand('copyProperty'));
	reg('cherryPucker.dupeProperty', () => runPropertyCommand('dupeProperty'));
	reg('cherryPucker.movePropertyUp', () => runPropertyCommand('movePropertyUp'));
	reg('cherryPucker.movePropertyDown', () => runPropertyCommand('movePropertyDown'));
	reg('cherryPucker.deleteProperty', () => runPropertyCommand('deleteProperty'));
	reg('cherryPucker.copyObject', () => runObjectCommand('copyObject'));
	reg('cherryPucker.dupeObject', () => runObjectCommand('dupeObject'));
	reg('cherryPucker.sortObjectProperties', () => runObjectCommand('sortObjectProperties'));
	reg('cherryPucker.sortObjectPropertiesDeep', () => runObjectCommand('sortObjectPropertiesDeep'));
	reg('cherryPucker.sortObjectArrayByPropertyValueAscending', () => runArrayCommand('sortObjectArrayByPropertyValueAscending'));
	reg('cherryPucker.sortObjectArrayByPropertyValueDescending', () => runArrayCommand('sortObjectArrayByPropertyValueDescending'));
	reg('cherryPucker.deleteObjectsFromArrayByPropertyValue', () => runArrayCommand('deleteObjectsFromArrayByPropertyValue'));
	reg('cherryPucker.copyObjectsFromArrayByPropertyValue', () => runArrayCommand('copyObjectsFromArrayByPropertyValue'));
	reg('cherryPucker.cutObjectsFromArrayByPropertyValue', () => runArrayCommand('cutObjectsFromArrayByPropertyValue'));
	reg('cherryPucker.setObjectsArrayPropertyValue', () => runArrayCommand('setObjectsArrayPropertyValue'));
	reg('cherryPucker.showPickerForAllCommands', () => runShowPickerForAllCommands());
	reg('cherryPucker.applySuggestedKeybindings', () => runApplySuggestedBindings());
	reg('cherryPucker.removeSuggestedKeybindings', () => runRemoveSuggestedBindings());
}

function deactivate() { }

module.exports = { activate, deactivate };
// file: C:\_o\__\ce-cherrypucker\extension.js

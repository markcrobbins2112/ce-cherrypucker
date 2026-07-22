const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
	const url = new URL(req.url, `http://${req.headers.host}`);

	// API route for template testing playground
	if (url.pathname === '/api/template-test' && req.method === 'POST') {
		let body = '';
		req.on('data', chunk => { body += chunk; });
		req.on('end', () => {
			try {
				const { template, json } = JSON.parse(body);
				const data = typeof json === 'string' ? JSON.parse(json) : json;

				const resolvePath = (obj, pathStr) => {
					if (obj == null) return undefined;
					const normalized = pathStr.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');
					return normalized.split('.').reduce((curr, key) => (curr == null ? undefined : curr[key]), obj);
				};

				const result = template.replace(/\$\{([^}]+)\}/g, (_m, key) => {
					const v = resolvePath(data, key.trim());
					if (v === undefined || v === null) return '';
					if (typeof v === 'object') return JSON.stringify(v);
					return String(v);
				});

				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ success: true, result }));
			} catch (err) {
				res.writeHead(400, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ success: false, error: err.message }));
			}
		});
		return;
	}

	// Serve icon
	if (url.pathname === '/icon.png') {
		const iconPath = path.join(__dirname, 'icon.png');
		if (fs.existsSync(iconPath)) {
			res.writeHead(200, { 'Content-Type': 'image/png' });
			return fs.createReadStream(iconPath).pipe(res);
		}
	}

	// Main web preview landing page
	res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
	res.end(`<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>CherryPucker - VS Code Extension Workspace</title>
	<style>
		:root {
			--bg: #0f172a;
			--card-bg: #1e293b;
			--accent: #e11d48;
			--accent-hover: #f43f5e;
			--text: #f8fafc;
			--text-muted: #94a3b8;
			--border: #334155;
		}
		* { box-sizing: border-box; margin: 0; padding: 0; }
		body {
			font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
			background: var(--bg);
			color: var(--text);
			line-height: 1.6;
			padding: 2rem;
			max-width: 1200px;
			margin: 0 auto;
		}
		header {
			display: flex;
			align-items: center;
			gap: 1.5rem;
			margin-bottom: 2rem;
			padding-bottom: 1.5rem;
			border-bottom: 1px solid var(--border);
		}
		header img {
			width: 64px;
			height: 64px;
			border-radius: 12px;
		}
		.title-group h1 {
			font-size: 2rem;
			font-weight: 700;
			color: #fff;
		}
		.title-group p {
			color: var(--text-muted);
			font-size: 1.1rem;
		}
		.grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
			gap: 1.5rem;
			margin-bottom: 2rem;
		}
		.card {
			background: var(--card-bg);
			border: 1px solid var(--border);
			border-radius: 12px;
			padding: 1.5rem;
		}
		.card h2 {
			font-size: 1.25rem;
			margin-bottom: 1rem;
			color: #f1f5f9;
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}
		label {
			display: block;
			font-size: 0.875rem;
			color: var(--text-muted);
			margin-bottom: 0.5rem;
		}
		textarea, input {
			width: 100%;
			background: #090d16;
			border: 1px solid var(--border);
			color: #e2e8f0;
			padding: 0.75rem;
			border-radius: 6px;
			font-family: monospace;
			font-size: 0.9rem;
			margin-bottom: 1rem;
		}
		button {
			background: var(--accent);
			color: white;
			border: none;
			padding: 0.75rem 1.5rem;
			border-radius: 6px;
			font-weight: 600;
			cursor: pointer;
			transition: background 0.2s;
		}
		button:hover {
			background: var(--accent-hover);
		}
		.output-box {
			background: #090d16;
			border: 1px solid var(--border);
			padding: 1rem;
			border-radius: 6px;
			font-family: monospace;
			white-space: pre-wrap;
			min-height: 80px;
			color: #38bdf8;
		}
		table {
			width: 100%;
			border-collapse: collapse;
			margin-top: 1rem;
		}
		th, td {
			text-align: left;
			padding: 0.75rem;
			border-bottom: 1px solid var(--border);
			font-size: 0.9rem;
		}
		th {
			color: var(--text-muted);
		}
		code {
			background: #090d16;
			padding: 0.2rem 0.4rem;
			border-radius: 4px;
			color: #f43f5e;
			font-size: 0.85rem;
		}
		.badge {
			display: inline-block;
			background: #e11d4822;
			color: #fb7185;
			border: 1px solid #e11d4844;
			padding: 0.25rem 0.75rem;
			border-radius: 9999px;
			font-size: 0.8rem;
			font-weight: 600;
		}
	</style>
</head>
<body>
	<header>
		<img src="/icon.png" alt="CherryPucker Icon" onerror="this.style.display='none'">
		<div class="title-group">
			<h1>CherryPucker <span class="badge">v0.1.1</span></h1>
			<p>VS Code extension for copying JSON-driven templates and property values from the object your cursor is inside.</p>
		</div>
	</header>

	<div class="grid">
		<div class="card">
			<h2>🧪 Interactive Template Substitution Playground</h2>
			<label for="templateInput">Template String:</label>
			<input type="text" id="templateInput" value="Title: \${person.name} (\${person.id}) | Plan: \${account.plan}">

			<label for="jsonInput">JSON Object Context:</label>
			<textarea id="jsonInput" rows="7">{
  "person": {
    "id": "USR-778",
    "name": "Rin Hart"
  },
  "account": {
    "plan": "enterprise"
  }
}</textarea>

			<button onclick="testTemplate()">Test Substitution</button>

			<label style="margin-top: 1rem;">Substituted Result:</label>
			<div class="output-box" id="output">Result will appear here...</div>
		</div>

		<div class="card">
			<h2>⚡ Features & Command Shortcuts</h2>
			<table>
				<thead>
					<tr>
						<th>Command</th>
						<th>Shortcut</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Copy Object Value</td>
						<td><code>insert v</code></td>
					</tr>
					<tr>
						<td>Copy Object Value (Quoted)</td>
						<td><code>insert shift+v</code></td>
					</tr>
					<tr>
						<td>Copy Template 1..10</td>
						<td><code>alt+insert shift+1..0</code></td>
					</tr>
					<tr>
						<td>Duplicate Property</td>
						<td><code>alt+insert p</code></td>
					</tr>
					<tr>
						<td>Move Property Up / Down</td>
						<td><code>ctrl+alt+shift+up / down</code></td>
					</tr>
					<tr>
						<td>Show Command Picker</td>
						<td><code>alt+\` f12</code></td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<script>
		async function testTemplate() {
			const template = document.getElementById('templateInput').value;
			const jsonStr = document.getElementById('jsonInput').value;
			const output = document.getElementById('output');

			try {
				const json = JSON.parse(jsonStr);
				const res = await fetch('/api/template-test', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ template, json })
				});
				const data = await res.json();
				if (data.success) {
					output.textContent = data.result;
					output.style.color = '#38bdf8';
				} else {
					output.textContent = 'Error: ' + data.error;
					output.style.color = '#f87171';
				}
			} catch (e) {
				output.textContent = 'Invalid JSON: ' + e.message;
				output.style.color = '#f87171';
			}
		}
	</script>
</body>
</html>`);
});

server.listen(PORT, () => {
	console.log(`CherryPucker preview server running on port ${PORT}`);
});

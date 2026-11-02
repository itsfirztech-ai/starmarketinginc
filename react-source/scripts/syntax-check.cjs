const fs = require('node:fs');
const path = require('node:path');
let ts;
try { ts = require('typescript'); }
catch {
  const candidates = [process.env.TYPESCRIPT_PATH, '/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript'].filter(Boolean);
  for (const candidate of candidates) { try { ts = require(candidate); break; } catch {} }
  if (!ts) throw new Error('TypeScript is required. Run npm install first.');
}
const root = path.resolve(__dirname, '..', 'src');
const files = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) files.push(target);
  }
}
walk(root);
const errors = [];
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const result = ts.transpileModule(source, {
    fileName: file,
    reportDiagnostics: true,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX }
  });
  for (const diagnostic of result.diagnostics || []) {
    if (diagnostic.category === ts.DiagnosticCategory.Error) {
      errors.push(`${path.relative(path.dirname(root), file)}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
    }
  }
}
if (errors.length) {
  process.stderr.write(`${errors.join('\n')}\n`);
  process.exit(1);
}
console.log(`TypeScript/TSX syntax check passed for ${files.length} source files (syntax only; full typecheck runs during npm run build).`);

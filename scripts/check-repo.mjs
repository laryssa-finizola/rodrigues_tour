import { execFileSync } from "node:child_process";
import { existsSync, lstatSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const artifactPath = /(^|\/)(node_modules|\.next|out|dist|build|coverage|test-results|playwright-report|blob-report|\.vercel|\.aws|\.ssh|\.codex|\.agents)(\/|$)/;
const sensitiveName = /(^|\/)(\.env(?:\..*)?|\.npmrc|credentials\.json|service-account[^/]*\.json|id_rsa|id_ed25519)$|\.(?:pem|key|p12|pfx|zip|tar|tgz|7z|rar|log|tsbuildinfo)$|(^|\/)next-env\.d\.ts$/i;
const binaryExtension = /\.(?:jpe?g|png|gif|webp|avif|ico|woff2?|ttf|otf|pdf)$/i;
const patterns = [
  ["chave privada", /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY(?: BLOCK)?-----/],
  ["token de provedor", /\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{50,}|npm_[A-Za-z0-9]{36,}|AKIA[A-Z0-9]{16}|ASIA[A-Z0-9]{16}|AIza[A-Za-z0-9_-]{35}|xox[baprs]-[A-Za-z0-9-]{20,}|sk-(?:proj-)?[A-Za-z0-9_-]{32,}|sk_(?:live|test)_[A-Za-z0-9]{20,})\b/],
  ["credencial em URL", /\b(?:https?|postgres(?:ql)?|mongodb(?:\+srv)?|redis):\/\/[^\s/@:]+:[^\s/@]+@/],
  ["credencial literal", /\b(?:api[_-]?key|access[_-]?token|client[_-]?secret|password|passwd|secret[_-]?key)\s*[=:]\s*["'][^"'\r\n]{8,}["']/i],
  ["caminho pessoal", /(?:[A-Z]:\\(?:Users|Documents and Settings)\\[^\\\s`"']+|\/(?:Users|home)\/[^/\s`"']+)/i],
];

function jpegHasPrivateMetadata(buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) return false;
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset++] !== 0xff) return true;
    while (buffer[offset] === 0xff) offset++;
    const marker = buffer[offset++];
    if (marker === 0xda || marker === 0xd9) return false;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (offset + 2 > buffer.length) return true;
    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) return true;
    if ([0xe1, 0xec, 0xed, 0xfe].includes(marker)) return true;
    offset += length;
  }
  return true;
}

export function checkRepository(cwd = process.cwd()) {
  // Include already tracked ignored files: .gitignore alone does not protect them.
  const files = [...new Set(execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], { cwd, encoding: "utf8" }).split("\0").filter(Boolean))];
  const findings = [];
  let checked = 0;
  let bytes = 0;
  const report = (file, reason, line) => findings.push({ file, reason, ...(line ? { line } : {}) });

  for (const file of files) {
    const absolute = resolve(cwd, file);
    if (!existsSync(absolute)) continue; // A removed file is not part of the next snapshot.
    const stat = lstatSync(absolute);
    checked++;
    bytes += stat.size;
    if (artifactPath.test(file) || sensitiveName.test(file)) report(file, "arquivo local, sensível ou gerado entre os candidatos");
    if (stat.isSymbolicLink()) {
      report(file, "link simbólico exige revisão manual");
      continue;
    }
    if (!stat.isFile()) continue;
    const buffer = readFileSync(absolute);
    if (/\.jpe?g$/i.test(file) && jpegHasPrivateMetadata(buffer)) report(file, "JPEG contém metadados pessoais/editoriais ou estrutura inválida");
    if (binaryExtension.test(file) || buffer.includes(0)) continue;
    const lines = buffer.toString("utf8").split(/\r?\n/);
    for (let index = 0; index < lines.length; index++) {
      for (const [reason, pattern] of patterns) {
        if (pattern.test(lines[index])) report(file, reason, index + 1);
      }
    }
  }

  for (const name of ["package.json", "package-lock.json"]) {
    const path = resolve(cwd, name);
    if (!existsSync(path)) continue;
    const manifest = JSON.parse(readFileSync(path, "utf8"));
    const specifications = name === "package.json"
      ? Object.values({ ...manifest.dependencies, ...manifest.devDependencies })
      : Object.values(manifest.packages ?? {}).map((pkg) => pkg.resolved).filter(Boolean);
    if (specifications.some((spec) => /^(?:file:|link:|[A-Z]:[\\/]|\/)/i.test(spec))) report(name, "dependência aponta para arquivo ou caminho local");
  }

  return { checked, bytes, findings };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = checkRepository();
    for (const finding of result.findings) {
      // Never echo matching lines or credential values, even when the check fails.
      console.error(`${finding.file}${finding.line ? `:${finding.line}` : ""}: ${finding.reason}`);
    }
    console.log(`${result.checked} arquivos candidatos verificados (${Math.ceil(result.bytes / 1024)} KiB); ${result.findings.length} ocorrência(s).`);
    console.log("Verificação por padrões; não substitui revisão manual nem inspeciona o histórico Git.");
    process.exitCode = result.findings.length ? 1 : 0;
  } catch {
    console.error("Não foi possível verificar o repositório. Execute na raiz de um checkout Git válido.");
    process.exitCode = 1;
  }
}

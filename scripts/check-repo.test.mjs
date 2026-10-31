import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const checker = fileURLToPath(new URL("./check-repo.mjs", import.meta.url));

function fixture(run) {
  const directory = mkdtempSync(join(tmpdir(), "rodrigues-repo-check-"));
  try {
    execFileSync("git", ["init", "--quiet", directory]);
    const write = (name, contents) => {
      mkdirSync(dirname(join(directory, name)), { recursive: true });
      writeFileSync(join(directory, name), contents);
    };
    const check = () => spawnSync(process.execPath, [checker], { cwd: directory, encoding: "utf8" });
    run({ directory, write, check });
  } finally {
    // Cleanup is restricted to the exact task-owned temporary directory.
    assert.equal(dirname(resolve(directory)), resolve(tmpdir()));
    assert.ok(basename(directory).startsWith("rodrigues-repo-check-"));
    rmSync(directory, { recursive: true, force: true });
  }
}

test("ignored local output is excluded and clean source passes", () => fixture(({ write, check }) => {
  write(".gitignore", "node_modules/\n.next/\n.env*\n");
  write("app/page.tsx", "export default function Page() { return null; }\n");
  write(".env.local", "private fixture data");
  write("node_modules/unused/index.js", "local dependency");
  write(".next/cache/output", "local cache");
  const result = check();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /2 arquivos candidatos/);
}));

test("a force-added environment file is blocked even when ignored", () => fixture(({ directory, write, check }) => {
  write(".gitignore", ".env*\n");
  write(".env.local", "private fixture data");
  execFileSync("git", ["add", "--force", ".env.local"], { cwd: directory });
  const result = check();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /\.env\.local/);
  assert.doesNotMatch(result.stderr, /private fixture data/);
}));

test("credential findings are redacted and untracked secrets are blocked", () => fixture(({ write, check }) => {
  const token = ["ghp_", "a".repeat(36)].join("");
  write("settings.js", `export const credential = '${token}';\n`);
  const result = check();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /settings\.js:1: token de provedor/);
  assert.ok(!`${result.stdout}${result.stderr}`.includes(token));
}));

test("personal paths and local dependencies are rejected", () => fixture(({ write, check }) => {
  const personalPath = ["C:", "Users", "example-person", "workspace"].join("\\");
  write("README.md", personalPath);
  write("package.json", JSON.stringify({ dependencies: { example: ["file:", "../local-package"].join("") } }));
  const result = check();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /caminho pessoal/);
  assert.match(result.stderr, /dependência aponta/);
  assert.ok(!result.stderr.includes("example-person"));
}));

test("archives and generated files are blocked when not ignored", () => fixture(({ write, check }) => {
  write("source.zip", "fixture archive");
  write(".next/output.js", "fixture output");
  const result = check();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /source\.zip/);
  assert.match(result.stderr, /\.next\/output\.js/);
}));

test("camera metadata is rejected without echoing its values", () => fixture(({ write, check }) => {
  const metadata = Buffer.from("Exif\0\0private fixture data");
  const header = Buffer.from([0xff, 0xd8, 0xff, 0xe1, 0, metadata.length + 2]);
  write("photo.jpg", Buffer.concat([header, metadata, Buffer.from([0xff, 0xd9])]));
  const result = check();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /JPEG contém metadados/);
  assert.doesNotMatch(result.stderr, /private fixture data/);
}));

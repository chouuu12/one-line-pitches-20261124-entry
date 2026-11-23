// One-line pitch entry for make.fun's "A Day of One-Line Pitches" bounty.
// Writes exactly one sentence to /output/entry.txt: the pitch itself.
// Node 22, stdlib only.
import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const line = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "line.txt"), "utf8");
const sentence = line.replace(/\r?\n$/, "");

// The entry is one sentence: reject anything that would make the output
// more than a single line, and require plain text with no stray whitespace.
if (sentence.length < 1 || sentence.length > 240) {
  throw new Error(`sentence must be 1-240 characters, got ${sentence.length}`);
}
if (/[\r\n]/.test(sentence) || sentence !== sentence.trim()) {
  throw new Error("sentence must be a single line with no surrounding whitespace");
}

const outDir = "/output";
const outPath = join(outDir, "entry.txt");
mkdirSync(outDir, { recursive: true });

// Write atomically, then read the file back and confirm it holds exactly
// the sentence — byte for byte — before reporting success.
const tmpPath = join(outDir, `.entry.txt.tmp-${process.pid}`);
writeFileSync(tmpPath, sentence, "utf8");
renameSync(tmpPath, outPath);
const written = readFileSync(outPath, "utf8");
if (written !== sentence) {
  throw new Error("round-trip check failed: /output/entry.txt does not match the sentence");
}
console.log(`wrote ${sentence.length} characters to /output/entry.txt`);

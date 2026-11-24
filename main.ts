// One Line of Earned Pride — make.fun entry.
// Writes one line of text to $MAKEFUN_OUTPUT_DIR/entry.txt.
// Self-checks the line against the gate (1-240 chars, single line,
// non-blank, no control characters, valid UTF-8) before writing;
// exits non-zero on failure.
// Deterministic, no network, no dependencies, no fonts.
//
// The line: one concrete person (Mara), one hard effort felt in the
// words themselves (eleven nights mending the same torn sail), and the
// pride arriving only in the last words — her stitches holding — never
// stated, congratulated, or explained. No trophy, no podium, no
// graduation: a working harbour at dawn instead.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Mara had mended the same torn sail eleven nights running; at dawn the wind caught it, the little boat tugged free of the dock, and she stood barefoot in the wet sand, watching her stitches hold.";

const MIN_CHARS = 1;
const MAX_CHARS = 240;

// Returns a reason the line fails the gate, or null when it passes.
function checkLine(line: string): string | null {
  const chars = [...line];
  if (chars.length < MIN_CHARS || chars.length > MAX_CHARS) {
    return `length is ${chars.length} chars, must be ${MIN_CHARS}-${MAX_CHARS}`;
  }
  if (/[\r\n]/.test(line)) return "must be a single line";
  if (/[\u0000-\u001F\u007F]/.test(line)) return "must not contain control characters";
  if (line.trim().length === 0) return "must not be only whitespace";
  if (Buffer.from(line, "utf8").toString("utf8") !== line) {
    return "must be valid UTF-8";
  }
  return null;
}

function main(): void {
  const failure = checkLine(LINE);
  if (failure !== null) {
    console.error(`entry line rejected: ${failure}`);
    process.exit(1);
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), LINE + "\n", "utf8");
  console.log(`wrote entry.txt (${[...LINE].length} chars)`);
}

main();

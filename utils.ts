import { readFileSync } from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const readInput = (url: string) => readFileSync(path.join(dirname(fileURLToPath(url)), "input.txt"), "utf8");

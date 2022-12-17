import { readFileSync } from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const readInput = (url: string, test?: boolean) =>
  readFileSync(path.join(dirname(fileURLToPath(url)), test ? "test_input.txt" : "input.txt"), "utf8");

export const printSolutions = (first: number | string | string[], second: number | string | string[]) => {
  console.log("Part one:", first);
  console.log("Part two:", second);
};

export const sumArray = (numbers: number[]) => numbers.reduce((a, b) => a + b, 0);

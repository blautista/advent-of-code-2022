import { readFileSync } from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const start = performance.now();

export const readInput = (url: string, test?: boolean) =>
  readFileSync(path.join(dirname(fileURLToPath(url)), test ? "test_input.txt" : "input.txt"), "utf8");

export const printSolutions = (first: number | string | string[], second: number | string | string[]) => {
  console.log("Part one:", first);
  console.log("Part two:", second);
  console.log(`Total run time: ${((performance.now() - start) / 1000).toFixed(3)}s`);
};

export const sumArray = (numbers: number[]) => numbers.reduce((a, b) => a + b, 0);

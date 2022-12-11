import { readFileSync } from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const readInput = (url: string) => readFileSync(path.join(dirname(fileURLToPath(url)), "input.txt"), "utf8");

export const printSolutions = (first: number, second: number) => {
  console.log(`Part one: ${first}`);
  console.log(`Part two: ${second}`);
};

export const sumArray = (numbers: number[]) => numbers.reduce((a, b) => a + b, 0);

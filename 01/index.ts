import { printSolutions, readInput } from "../utils.js";
import { EOL } from "node:os";

const input = readInput(import.meta.url);

const getSums = (input: string): number[] => {
  const elvesCalories = input.split(`${EOL}${EOL}`);

  return elvesCalories.map((cals) => {
    return cals.split(EOL).reduce((prev, curr) => prev + Number(curr), 0);
  });
};

printSolutions(
  Math.max(...getSums(input)),
  getSums(input)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((prev, curr) => prev + curr, 0)
);

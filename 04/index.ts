import { EOL } from "os";
import { printSolutions, readInput } from "../utils.js";

const input = readInput(import.meta.url)
  .split(EOL)
  .map((e) => e.split(",").map((e) => e.split("-").map((e) => Number(e)))) as [number, number][][];

const isIncluded = ([a, b]: [number, number][]) => {
  return (a[0] >= b[0] && a[1] <= b[1]) || (b[0] >= a[0] && b[1] <= a[1]);
};

const isOverlapped = ([a, b]: [number, number][]) => {
  return a[0] <= b[1] && a[1] >= b[0];
};

const getRanges = (input: [number, number][][]) => {
  let inclusionCounter = 0;
  let overlappedCounter = 0;
  for (const pair of input) {
    if (isOverlapped(pair)) overlappedCounter++;
    if (isIncluded(pair)) inclusionCounter++;
  }
  return { inclusionCounter, overlappedCounter };
};

const { inclusionCounter, overlappedCounter } = getRanges(input);

const firstSolution = inclusionCounter;
const secondSolution = overlappedCounter;

printSolutions(firstSolution, secondSolution);

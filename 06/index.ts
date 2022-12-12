import { printSolutions, readInput } from "../utils.js";

const input = readInput(import.meta.url).split("");

const areDifferent = (arr: string[]) => [...new Set(arr)].length === arr.length;

const getStartOfPacketMarker = (sequenceLength: number): number => {
  for (let i = 0; i < input.length; i++) {
    if (areDifferent(input.slice(i, sequenceLength + i))) return sequenceLength + i;
  }

  throw new Error("Couldn't find the start-of-packet marker");
};

const firstSolution = getStartOfPacketMarker(4);
const secondSolution = getStartOfPacketMarker(14);

printSolutions(firstSolution, secondSolution);

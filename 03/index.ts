import { EOL } from "os";
import { printSolutions, readInput, sumArray } from "../utils.js";

const input = readInput(import.meta.url).split(EOL) as string[];

const toPriority = (c: string) => {
  if (c >= "a" && c <= "z") {
    return c.charCodeAt(0) - 96;
  }

  return c.charCodeAt(0) - 65 + 27;
};

const getPriorities = (rucksacks: string[]) => {
  return rucksacks.map((rucksack) => {
    const length = rucksack.length;
    const [firstCompartment, secondCompartment] = [rucksack.slice(0, length / 2), rucksack.slice(length / 2)];

    for (const item of firstCompartment.split("")) {
      if (secondCompartment.includes(item)) return toPriority(item);
    }

    throw new Error("Invalid input");
  });
};

const GROUP_SIZE = 3;

const getPrioritiesByGroup = (rucksacks: string[]) => {
  const priorities: number[] = [];
  for (let i = 0; i < rucksacks.length; i += GROUP_SIZE) {
    const [a, b, c] = [rucksacks[i], rucksacks[i + 1], rucksacks[i + 2]];

    for (const item of a) {
      if (b.includes(item) && c.includes(item)) {
        priorities.push(toPriority(item));
        break;
      }
    }
  }
  return priorities;
};

const firstSolution = sumArray(getPriorities(input));
const secondSolution = sumArray(getPrioritiesByGroup(input));

printSolutions(firstSolution, secondSolution);

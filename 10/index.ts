import { EOL } from "os";
import { printSolutions, readInput } from "../utils.js";

const input: (["addx", number] | ["noop"])[] = readInput(import.meta.url)
  .split(EOL)
  .map((e) => {
    const [instruction, value] = e.split(" ");
    if (instruction === "addx") {
      return ["addx", Number(value)];
    }
    return ["noop"];
  });

const forEachStartOfCycle = (callback: (x: number, cycle: number) => void, totalCycles: number) => {
  let awaitedValue: { value: number; cyclesLeft: number } | null = null;
  let x = 1;
  let instructionIndex = 0;

  for (let cycle = 1; cycle <= totalCycles; cycle++) {
    callback(x, cycle);

    if (awaitedValue && --awaitedValue.cyclesLeft === 0) {
      x += awaitedValue.value;
      awaitedValue = null;
    } else {
      const [instruction, value] = input[instructionIndex++];

      if (instruction === "addx") {
        awaitedValue = { value, cyclesLeft: 1 };
      }
    }
  }
};

const getSignalStrenths = () => {
  const signalStrengths: number[] = [];
  const relevantCycles = [20, 60, 100, 140, 180, 220];

  forEachStartOfCycle((x, cycle) => {
    if (relevantCycles.includes(cycle)) {
      signalStrengths.push(x * cycle);
    }
  }, 220);

  return signalStrengths;
};

const getCRTImage = () => {
  const screenWidth = 40;
  const screenHeight = 6;
  const screenOutput: ("#" | ".")[][] = Array(screenHeight)
    .fill(".")
    .map(() => Array(screenWidth).fill("."));

  forEachStartOfCycle((x, cycle) => {
    const i = Math.floor((cycle - 1) / screenWidth);
    const j = (cycle - 1) % screenWidth;

    if ([x, x + 1, x + 2].includes(j + 1)) {
      screenOutput[i][j] = "#";
    }
  }, 240);

  return screenOutput.map((e) => e.join(""));
};

const firstSolution = getSignalStrenths().reduce((a, b) => a + b, 0);
const secondSolution = getCRTImage();

printSolutions(firstSolution, secondSolution);

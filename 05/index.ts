import { EOL } from "os";
import { printSolutions, readInput } from "../utils.js";

const input = readInput(import.meta.url);

const [inputStacks, inputMoves] = input.split(`${EOL}${EOL}`);

type Stacks = Map<number, string[]>;
type Moves = { amount: number; from: number; to: number }[];
type CrateMoverVersion = 9000 | 9001;

const parseInputStacks = () => {
  const rows = inputStacks.split(EOL);
  const rowMap: Stacks = new Map();

  const numbersRow = rows[rows.length - 1];

  for (let i = 1; i < numbersRow.length; i += 4) {
    rowMap.set(Number(numbersRow[i]), []);
  }

  rows.pop();

  for (const row of rows) {
    for (let i = 1; i < row.length; i += 4) {
      const rowNumber = (i - 1) / 4 + 1;
      if (row[i] !== " ") rowMap.set(rowNumber, [row[i], ...(rowMap.get(rowNumber) as string[])]);
    }
  }

  return rowMap;
};

const parseInputMoves = (): Moves => {
  const rows = inputMoves.split(EOL).map((e) => e.split(" "));
  return rows.map((row) => ({ amount: Number(row[1]), from: Number(row[3]), to: Number(row[5]) }));
};

const playMoves = (crateMoverVersion: CrateMoverVersion) => {
  const stacks = parseInputStacks();
  const moves = parseInputMoves();
  const lastRemainingThings = [];

  for (const move of moves) {
    const { amount, from, to } = move;

    const fromStack = stacks.get(Number(from)) as string[];
    const toStack = stacks.get(Number(to)) as string[];

    const items = fromStack.splice(fromStack.length - amount, amount);

    toStack.push(...(crateMoverVersion === 9000 ? items.reverse() : items));
  }

  for (const [, value] of stacks.entries()) {
    const a = value.at(-1);
    if (a) {
      lastRemainingThings.push(a);
    }
  }

  return lastRemainingThings.join("");
};

const firstSolution = playMoves(9000);
const secondSolution = playMoves(9001);

printSolutions(firstSolution, secondSolution);

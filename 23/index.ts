import { EOL } from "os";
import { printSolutions, readInput } from "../utils.js";
import { appendFileSync, createWriteStream, writeFileSync } from "fs";

const toKey = (i: number, j: number) => `${i},${j}`;
const toCoords = (s: string) => s.split(",").map((e) => +e) as [number, number];

const input = readInput(import.meta.url);

const parseInput = () => {
  const elves = new Map<string, null>();
  const rows = input.split(EOL);

  rows.forEach((row, i) => {
    const cells = row.split("");
    cells.forEach((cell, j) => {
      if (cell === "#") {
        elves.set(toKey(i, j), null);
      }
    });
  });

  return elves;
};

type Elves = Map<string, null>;
type Direction = "north" | "east" | "south" | "west";
type Edges = { minX: number; minY: number; maxX: number; maxY: number };

const getElfMove = (elves: Elves, key: string, direction: Direction | "allround") => {
  const coords = toCoords(key);

  let startX = -1;
  let startY = -1;
  let endX = 1;
  let endY = 1;

  const [i, j] = coords;

  switch (direction) {
    case "north":
    case "south":
      startX = -1;
      endX = 1;
      startY = endY = direction === "north" ? -1 : 1;
      coords[0] = i + startY;
      break;
    case "east":
    case "west":
      startX = endX = direction === "west" ? -1 : 1;
      startY = -1;
      endY = 1;
      coords[1] = j + startX;
      break;
    case "allround":
      startX = -1;
      endX = 1;
      startY = -1;
      endY = 1;
      break;
  }

  const destinationAsKey = toKey(...coords);
  let hasAdjacentElf = false;

  for (let x = startX + j; x <= endX + j; x++) {
    for (let y = startY + i; y <= endY + i; y++) {
      const currKey = toKey(y, x);
      if (key === currKey) continue;
      if (elves.has(currKey)) hasAdjacentElf = true;
    }
  }

  if (hasAdjacentElf) {
    return null;
  }

  return destinationAsKey;
};

const solve = (numberOfRounds = 10) => {
  const elves = parseInput();
  const directionConsiderations: Direction[] = ["north", "south", "west", "east"];

  for (let round = 1; round <= numberOfRounds; round++) {
    const moves = new Map<string, string>();
    const deniedMoves = new Set();

    for (const [elfPosition] of elves.entries()) {
      if (getElfMove(elves, elfPosition, "allround")) continue;

      for (const direction of directionConsiderations) {
        const destination = getElfMove(elves, elfPosition, direction);

        if (!destination) continue;

        if (deniedMoves.has(destination)) break;
        if (moves.has(destination)) {
          moves.delete(destination);
          deniedMoves.add(destination);
        } else {
          moves.set(destination, elfPosition);
        }
        break;
      }
    }

    if (moves.size === 0) {
      printElfPositions(elves, getEdges(elves));
      return round;
    }

    for (const [destination, elfPosition] of moves) {
      elves.delete(elfPosition);
      elves.set(destination, null);
    }

    directionConsiderations.push(directionConsiderations.shift() as Direction);
  }

  return calculateEmptyGroundTiles(elves, getEdges(elves));
};

function printElfPositions(elves: Elves, edges: Edges) {
  const { minY, minX, maxX, maxY } = edges;
  const stream = createWriteStream("./23/finalPosition.txt", { flags: "w" });
  for (let i = minY; i <= maxY; i++) {
    let str = "";
    for (let j = minX; j <= maxX; j++) {
      str += elves.has(toKey(i, j)) ? "#" : ".";
    }
    stream.write(str + EOL);
  }
  stream.end();
}

function calculateEmptyGroundTiles(elves: Elves, edges: Edges) {
  const { minY, minX, maxX, maxY } = edges;

  return (maxX - minX + 1) * (maxY - minY + 1) - elves.size;
}

function getEdges(elves: Elves): Edges {
  const all = Array.from(elves.entries());
  const allXPositions: number[] = [];
  const allYPositions: number[] = [];

  for (const [position] of all) {
    const [y, x] = toCoords(position);
    allYPositions.push(y);
    allXPositions.push(x);
  }

  const minX = Math.min(...allXPositions);
  const maxX = Math.max(...allXPositions);
  const minY = Math.min(...allYPositions);
  const maxY = Math.max(...allYPositions);

  return { minX, minY, maxX, maxY };
}

const firstSolution = solve(10);
const secondSolution = solve(Infinity);

printSolutions(firstSolution, secondSolution);

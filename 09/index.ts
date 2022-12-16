import { EOL } from "node:os";
import { printSolutions, readInput } from "../utils.js";

const input: [string, number][] = readInput(import.meta.url)
  .split(EOL)
  .map((e) => {
    const [direction, amount] = e.split(" ");
    return [direction, Number(amount)];
  });

type Coord = { x: number; y: number };

const getCoordAsKey = ({ x, y }: Coord) => `${x}-${y}`;

const modifyTailPosition = (tailPosition: Coord, headPosition: Coord) => {
  const dx = headPosition.x - tailPosition.x;
  const dy = headPosition.y - tailPosition.y;

  //if its adjacent
  if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) return;

  if (dy > 0) tailPosition.y++;
  else if (dy < 0) tailPosition.y--;

  if (dx > 0) tailPosition.x++;
  else if (dx < 0) tailPosition.x--;
};

const getCoordinatesVisitedByTail = (lengthOfRope: number): Set<string> => {
  const snekPositions = Array(lengthOfRope)
    .fill(0)
    .map(() => ({ x: 0, y: 0 }));

  const coordinatesVisited = new Set([getCoordAsKey({ x: 0, y: 0 })]);

  for (const move of input) {
    const [direction, amount] = move;

    switch (direction) {
      case "U":
        snekPositions[0].y += amount;
        break;
      case "D":
        snekPositions[0].y -= amount;
        break;
      case "L":
        snekPositions[0].x -= amount;
        break;
      case "R":
        snekPositions[0].x += amount;
        break;
    }

    for (let i = 0; i < amount; i++) {
      for (let j = 0; j < lengthOfRope - 1; j++) {
        modifyTailPosition(snekPositions[j + 1], snekPositions[j]);
      }

      coordinatesVisited.add(getCoordAsKey(snekPositions[lengthOfRope - 1]));
    }
  }

  return coordinatesVisited;
};

const firstSolution = getCoordinatesVisitedByTail(2).size;
const secondSolution = getCoordinatesVisitedByTail(10).size;

printSolutions(firstSolution, secondSolution);

import { EOL } from "node:os";
import { printSolutions, readInput } from "../utils.js";

const input = readInput(import.meta.url);

const parseInput = () => input.split(EOL).map((e) => e.split("").map((e) => Number(e)));

const solve = () => {
  const input = parseInput();
  let visible = 0;
  let maxScenicScore: number = Number.MIN_SAFE_INTEGER;

  input.forEach((row, ci) => {
    row.forEach((cell, cj) => {
      const isInEdge = cj === 0 || ci === 0 || cj === row.length - 1 || ci === input.length - 1;
      if (isInEdge) {
        visible++;
      } else {
        const visibilities: boolean[] = Array(4).fill(true);
        const scenicScores: number[] = Array(4).fill(0);

        for (let i = ci - 1; i >= 0; i--) {
          scenicScores[0]++;
          if (input[i][cj] >= cell) {
            visibilities[0] = false;
            break;
          }
        }

        for (let i = ci + 1; i < row.length; i++) {
          scenicScores[1]++;
          if (input[i][cj] >= cell) {
            visibilities[1] = false;
            break;
          }
        }

        for (let i = cj - 1; i >= 0; i--) {
          scenicScores[2]++;
          if (input[ci][i] >= cell) {
            visibilities[2] = false;
            break;
          }
        }

        for (let i = cj + 1; i < input.length; i++) {
          scenicScores[3]++;
          if (input[ci][i] >= cell) {
            visibilities[3] = false;
            break;
          }
        }

        const scenicScore = scenicScores.reduce((a, b) => a * b, 1);

        if (scenicScore > maxScenicScore) maxScenicScore = scenicScore;

        if (visibilities.includes(true)) {
          visible++;
        }
      }
    });
  });

  return { visible, maxScenicScore };
};

const { visible, maxScenicScore } = solve();

const firstSolution = visible;
const secondSolution = maxScenicScore;

printSolutions(firstSolution, secondSolution);

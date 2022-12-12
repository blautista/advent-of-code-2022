import fs from "node:fs";
import os from "node:os";
import path, { dirname } from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const __dirname = dirname(fileURLToPath(import.meta.url));

const getFolderPath = (day: string) => path.join(__dirname, "..", day);

rl.question("Enter day ", (day) => {
  const num = Number(day);
  if (num < 1 || num > 25) throw new Error("invalid day");

  if (num < 10) day = `0${num}`;

  const folderPath = getFolderPath(day);

  fs.mkdirSync(folderPath, { recursive: true });

  fs.writeFileSync(
    path.join(folderPath, "index.ts"),
    `import { printSolutions, readInput } from "../utils.js";

const input = readInput(import.meta.url);

const firstSolution = 0;
const secondSolution = 0;

printSolutions(firstSolution, secondSolution);`,
    { flag: "ax" }
  );

  fs.writeFileSync(path.join(folderPath, `input.txt`), "INPUT HERE", { flag: "ax" });

  rl.close();
});

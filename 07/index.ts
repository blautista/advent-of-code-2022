import { writeFileSync } from "node:fs";
import { EOL } from "os";
import { printSolutions, readInput } from "../utils.js";

type File = {
  size?: number;
  name: string;
  extension?: string;
  children?: { [x: string]: File };
  parent?: File | null;
};

const input = readInput(import.meta.url).split(EOL);

type Command =
  | {
      command: { type: "cd"; to: string };
      output: null;
    }
  | {
      command: { type: "ls" };
      output: { type: "dir" | "file"; name: string; size?: number; extension?: string }[];
    };

const parseInput = () => {
  const commands: Command[] = [];

  for (const row of input) {
    if (row[0] === "$") {
      const command = row.slice(2, 4);
      commands.push(
        command === "cd"
          ? { command: { type: "cd", to: row.slice(5) }, output: null }
          : { command: { type: "ls" }, output: [] }
      );
    } else {
      const [first, second] = row.split(" ");

      commands
        .at(-1)
        ?.output?.push(
          first === "dir"
            ? { type: "dir", name: second }
            : { type: "file", size: Number(first), name: second, extension: second.split(".")[1] }
        );
    }
  }

  return commands;
};

parseInput();

const getFilesTree = () => {
  const commands = parseInput();

  const files: File = {
    name: "/",
    parent: null,
  };

  let currentFile = files;

  for (const { command, output } of commands) {
    if (command.type === "ls") {
      if (!output) continue;

      for (const item of output) {
        const newItem =
          item.type === "dir"
            ? {
                name: item.name,
                parent: currentFile,
              }
            : {
                name: item.name,
                extension: item.extension,
                size: item.size,
              };

        if (currentFile?.children) {
          currentFile.children[item.name] = newItem;
        } else {
          currentFile.children = { [item.name]: newItem };
        }
      }
    }

    if (command.type === "cd") {
      switch (command.to) {
        case "..":
          currentFile = currentFile.parent ?? files;
          break;
        case "/":
          currentFile = files;
          break;
        default:
          if (currentFile?.children) {
            currentFile = currentFile.children[command.to];
          }
          break;
      }
    }
  }

  const clonedFiles = { ...files };

  addSizeRecursively(files);
  addSizeRecursively(clonedFiles);

  removeParentsForPrinting(clonedFiles);

  writeFileSync("./07/files.json", JSON.stringify(clonedFiles, undefined, 2));

  return files;
};

const getDirectorySizeToFreeSpace = (node: File, sizeToClear: number): number => {
  if (node?.children) {
    let sizes = [];
    const { size = 0 } = node;
    for (const childNode of Object.values(node.children)) {
      sizes.push(getDirectorySizeToFreeSpace(childNode, sizeToClear));
    }

    const sizesBigEnough = sizes.filter((e) => e > sizeToClear);

    if (sizesBigEnough.length > 0) {
      return Math.min(...sizesBigEnough);
    } else {
      if (size > sizeToClear) {
        return size;
      }
    }
  }

  return 0;
};

const calculateSizes = (node: File) => {
  if (node?.children) {
    const { size = 0 } = node;

    let total = 0;

    for (const childNode of Object.values(node.children)) {
      total += calculateSizes(childNode);
    }

    if (size < 100000) {
      return size + total;
    }
    return total;
  }

  return 0;
};

const addSizeRecursively = (node: File) => {
  if (node?.children) {
    let sizeSum = 0;
    for (const childNode of Object.values(node.children)) {
      sizeSum += addSizeRecursively(childNode);
    }
    node.size = sizeSum;
  }

  return node.size as number;
};

function removeParentsForPrinting(node: File | null, printed = new Set()) {
  if (node === null) return;
  if (printed.has(node)) return;

  printed.add(node);

  if (node?.parent) {
    delete node.parent;
  }

  if (node?.children) {
    for (const childNode of Object.values(node.children)) {
      removeParentsForPrinting(childNode, printed);
    }
  }
}

const files = getFilesTree();

const firstSolution = calculateSizes(files);
const secondSolution = getDirectorySizeToFreeSpace(files, (files.size as number) + 30000000 - 70000000);

printSolutions(firstSolution, secondSolution);

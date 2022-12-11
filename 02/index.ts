import { EOL } from "node:os";
import { printSolutions, readInput, sumArray } from "../utils.js";

enum MOVES {
  ROCK,
  PAPER,
  SCISSORS,
}

enum OPPONENT_MOVES {
  ROCK = "A",
  PAPER = "B",
  SCISSORS = "C",
}

enum PLAYER_MOVES {
  ROCK = "X",
  PAPER = "Y",
  SCISSORS = "Z",
}

enum RESULT_SCORES {
  LOSS = 0,
  DRAW = 3,
  WIN = 6,
}

type PlayerMove = `${PLAYER_MOVES}`;
type OpponentMove = `${OPPONENT_MOVES}`;

const TO_STANDARDIZED = {
  [OPPONENT_MOVES.ROCK]: MOVES.ROCK,
  [PLAYER_MOVES.ROCK]: MOVES.ROCK,
  [OPPONENT_MOVES.PAPER]: MOVES.PAPER,
  [PLAYER_MOVES.PAPER]: MOVES.PAPER,
  [OPPONENT_MOVES.SCISSORS]: MOVES.SCISSORS,
  [PLAYER_MOVES.SCISSORS]: MOVES.SCISSORS,
} as const;

const MOVE_SCORES = {
  [MOVES.ROCK]: 1,
  [MOVES.PAPER]: 2,
  [MOVES.SCISSORS]: 3,
};

const winningOrder = [MOVES.ROCK, MOVES.PAPER, MOVES.SCISSORS];

const getRoundScoreWithRoundResult = (opponentPick: OpponentMove, result: PlayerMove): number => {
  const opponentMove = TO_STANDARDIZED[opponentPick];
  const opIndex = winningOrder.indexOf(opponentMove);

  let playerMoveIndex: number;
  let score: number;

  if (result === PLAYER_MOVES.ROCK) {
    score = RESULT_SCORES.LOSS;
    playerMoveIndex = opIndex - 1 < 0 ? winningOrder.length - 1 : opIndex - 1;
  } else if (result === PLAYER_MOVES.SCISSORS) {
    score = RESULT_SCORES.WIN;
    playerMoveIndex = opIndex + 1 > winningOrder.length - 1 ? 0 : opIndex + 1;
  } else {
    score = RESULT_SCORES.DRAW;
    playerMoveIndex = opIndex;
  }

  return score + MOVE_SCORES[winningOrder[playerMoveIndex]];
};

const getRoundScoreWithPlayerPick = (opponentPick: OpponentMove, playerPick: PlayerMove) => {
  const [opponentMove, playerMove] = [TO_STANDARDIZED[opponentPick], TO_STANDARDIZED[playerPick]];

  const opIndex = winningOrder.indexOf(opponentMove);
  const playerIndex = winningOrder.indexOf(playerMove);
  const moveScore = MOVE_SCORES[playerMove];

  if (playerIndex + 1 === opIndex || (opIndex === 0 && playerIndex === winningOrder.length - 1)) {
    return moveScore + RESULT_SCORES.LOSS;
  }

  if (opIndex === playerIndex) {
    return moveScore + RESULT_SCORES.DRAW;
  }

  return moveScore + RESULT_SCORES.WIN;
};

type Game = [OpponentMove, PlayerMove][];

const input = readInput(import.meta.url);

const parseInput = (input: string) => input.split(EOL).map((e) => e.split(" ")) as Game;

const game = parseInput(input);

printSolutions(
  game.reduce((prev, curr) => prev + getRoundScoreWithPlayerPick(...curr), 0),
  game.reduce((prev, curr) => prev + getRoundScoreWithRoundResult(...curr), 0)
);

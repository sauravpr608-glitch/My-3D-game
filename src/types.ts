export type Player = 'X' | 'O';

export type CellValue = Player | null;

export type BoardState = CellValue[];

export interface Scores {
  xWins: number;
  oWins: number;
  draws: number;
}

export type GameStatus = 'playing' | 'win_X' | 'win_O' | 'draw';

export interface WinInfo {
  indices: number[];
  winner: Player;
}

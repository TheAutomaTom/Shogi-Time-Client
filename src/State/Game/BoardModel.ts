import { AttackModel } from "./Movement/AttackModel";
import { PieceModel } from "./Pieces/PieceModel";
import { GameSquareModel } from "./Squares/GameSquareModel";

export class BoardModel {
  Id: string;
  CurrentPlayer: number;
  Squares:    Array<GameSquareModel>;
  CapturesP1: Array<PieceModel>;
  CapturesP2: Array<PieceModel>;
  Pins: AttackModel[];

  // Drops could possibly break IsBoardCheck
  IsBoardCheck: number = 0;
  IsCheckmate:  number = 0;

  constructor(
    id: string,
    currentPlayer: number,
    squares:    Array<GameSquareModel>,
    capturesP1: Array<PieceModel>,
    capturesP2: Array<PieceModel>,
    attacks:    AttackModel[] = []
  ) {
    this.Id = id;
    this.CurrentPlayer = currentPlayer;
    this.Squares = squares;
    this.CapturesP1 = capturesP1;
    this.CapturesP2 = capturesP2;
    this.Pins = attacks
    
  }
}
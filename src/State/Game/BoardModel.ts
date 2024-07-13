import { PieceModel } from "./Pieces/PieceModel";
import { SquareModel } from "./SquareModel";

export class BoardModel {
  Id: string;
  CurrentPlayer: number;
  Squares:    Array<SquareModel>;
  CapturesP1: Array<PieceModel>;
  CapturesP2: Array<PieceModel>;

  constructor(
    id: string,
    currentPlayer: number,
    squares:    Array<SquareModel>,
    capturesP1: Array<PieceModel>,
    capturesP2: Array<PieceModel>
  ) {
    this.Id = id;
    this.CurrentPlayer = currentPlayer;
    this.Squares = squares;
    this.CapturesP1 = capturesP1;
    this.CapturesP2 = capturesP2;
    
  }
}
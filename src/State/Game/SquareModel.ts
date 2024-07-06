import { PieceModel } from "./Pieces/PieceModel";

export class SquareModel {
  Id: string;
  X: number;
  Y: number;
  PromotionZone: number;
  Piece: PieceModel;

  constructor(x: number, y: number, promotes: number = 0, piece: PieceModel = new PieceModel()) {
    this.Id = `Square-${x}${y}`;
    this.X= x;
    this.Y= y;
    this.PromotionZone = promotes;
    this.Piece = piece;
  }
}

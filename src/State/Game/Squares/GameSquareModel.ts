import { BaseSquareModel } from "./BaseSquareModel";
import { PieceModel } from "../Pieces/PieceModel";

export class GameSquareModel extends BaseSquareModel {
  PromotionZoneFor: number;
  Piece: PieceModel;

  constructor(x: number, y: number, promotes: number = 0, piece: PieceModel = new PieceModel()) {
    super(x, y);
    this.PromotionZoneFor = promotes;
    this.Piece = piece;
  }
}

import { BaseSquareModel } from "./BaseSquareModel";
import { PieceModel } from "../Pieces/PieceModel";
import { TargetStatus } from "./TargetStatus";

export class TargetSquareModel extends BaseSquareModel {
  Status: TargetStatus;
  Piece: PieceModel;

  constructor(x: number, y: number, status: TargetStatus, piece: PieceModel = new PieceModel()) {
    super(x, y);
    this.Status = status;
    this.Piece = piece;
  }
}

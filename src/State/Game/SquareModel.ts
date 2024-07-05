import { Coordinate } from "./Movement/Coordinate";
import { GamePieceModel } from "./Pieces/PieceModel";

export class SquareModel {
  Id: string;
  Coordinate: Coordinate;  
  PromotionZone: number;
  Piece: GamePieceModel;

  constructor(x: number, y: number, promotes: number = 0, piece: GamePieceModel = new GamePieceModel()) {
    this.Id = `Square-${x}${y}`;
    this.Coordinate = {X: x, Y: y };
    this.PromotionZone = promotes;
    this.Piece = piece;
  }
}

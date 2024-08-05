import { AttackModel } from "./Movement/AttackModel";
import { PieceModel } from "./Pieces/PieceModel";
import { GameSquareModel } from "./Squares/GameSquareModel";
import { TargetSquareModel } from "./Squares/TargetSquareModel";

export class BoardModel {
  Id: string;
  CurrentPlayer: number;
  Squares:    Array<GameSquareModel>;
  CapturesP1: Array<PieceModel>;
  CapturesP2: Array<PieceModel>;
  Pins: AttackModel[];
  
  ToBlockP1: Array<TargetSquareModel>;
  ToKillP1: Array<TargetSquareModel>;
  ToBlockP2: Array<TargetSquareModel>;
  ToKillP2: Array<TargetSquareModel>;
  
  IsMateBeforeDropsP1: boolean = false;  // Drops could possibly break IsBoardCheck
  IsMateBeforeDropsP2: boolean = false;  // Drops could possibly break IsBoardCheck
  IsInMate:  number = 0;

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
    this.Pins = attacks;

    this.ToBlockP1 = [];
    this.ToKillP1 = [];

    this.ToBlockP2 = [];
    this.ToKillP2 = [];
    
  }
}

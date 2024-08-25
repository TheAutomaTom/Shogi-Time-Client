import { AttackModel } from "./Movement/AttackModel";
import { PieceModel } from "./Pieces/PieceModel";
import { GameSquareModel } from "./Squares/GameSquareModel";
import { TargetSquareModel } from "./Squares/TargetSquareModel";

export class BoardModel {
  Id: string;
  CurrentPlayer: number;
  Squares:    Array<GameSquareModel>;
  P1Captures: Array<PieceModel>;
  P2Captures: Array<PieceModel>;
  Pins: AttackModel[];  
  
  P1ToBlock: Array<TargetSquareModel>;
  P1ToKill: Array<TargetSquareModel>;
  // P1KingCannotKill: Array<TargetSquareModel>;  // nyi
  P1HasOpenFiles: boolean;
  
  P2ToBlock: Array<TargetSquareModel>;
  P2ToKill: Array<TargetSquareModel>;
  // P2KingCannotKill: Array<TargetSquareModel>; // nyi
  P2HasOpenFiles: boolean;
  
  P1IsMateBeforeDrops: boolean = false;  // Drops could possibly break IsBoardCheck
  P2IsMateBeforeDrops: boolean = false;  // Drops could possibly break IsBoardCheck
  IsInMate:  number = 0;

  constructor(
    id: string,
    currentPlayer: number,
    squares:    Array<GameSquareModel>,
    p1Captures: Array<PieceModel>,
    p2Captures: Array<PieceModel>,
    attacks:    AttackModel[] = [],
    p1HasOpenFiles: boolean = false,
    p2HasOpenFiles: boolean = false
  ) {
    this.Id = id;
    this.CurrentPlayer = currentPlayer;
    this.Squares = squares;

    this.P1Captures = p1Captures;
    this.P2Captures = p2Captures;
    this.P1HasOpenFiles = p1HasOpenFiles;
    this.P2HasOpenFiles = p2HasOpenFiles;
    this.Pins = attacks;

    this.P1ToBlock = [];
    this.P1ToKill = [];
    // this.P1KingCannotKill = [];
    
    this.P2ToBlock = [];
    this.P2ToKill = [];
    // this.P2KingCannotKill = [];
    
  }
}

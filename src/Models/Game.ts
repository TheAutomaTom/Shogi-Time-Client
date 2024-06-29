export type GameBoardModel = {
  Id: string;
  Squares: Array<GameSquareModel>;
  
};

export class GameSquareModel {
  Id: string;
  IsFocus: boolean;
  X: number;
  Y: number;
  Piece?: GamePieceModel;
  
  constructor(x: number, y: number, isFocus: boolean = false, piece?: GamePieceModel ) {
    this.Id = `Square-${x}${y}`;
    this.X = x;
    this.Y = y;
    this.IsFocus = isFocus;
    if(piece != undefined){
      this.Piece = piece;
    }
  }
};

export class GamePieceModel {
  Type: GamePieceType;
  Player: number;
  Icon: string;
  IsFocus: boolean;
  Id: string;
  
  constructor(player: number, type: GamePieceType, startingPos: string, icon: string, isFocus: boolean = false) {
    this.Id = `Piece-${player}-${type}-${startingPos}`;
    this.Type = type;
    this.Player = player;
    this.Icon = icon;    
    this.IsFocus = isFocus;
  }
};

export enum GamePieceType{
  KingVictor,
  KingChallenger,
  Rook,
  RookPro,
  Bishop,
  BishopPro,
  Gold,
  Silver,
  SilverPro,
  Knight,
  KnightPro,
  Lance,
  LancePro,
  Pawn,
  PawnPro

}


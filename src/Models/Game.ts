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
  Id: string;
  
  constructor(player: number, type: GamePieceType, startingPos: string, icon: string) {
    this.Id = `Player${player}-${type.toString()}-${startingPos}`;
    this.Type = type;
    this.Player = player;
    this.Icon = icon;
  };
};

export enum GamePieceType{
  KingVictor = "KingVictor",
  KingChallenger = "KingChallenger",
  Rook = "Rook",
  RookPro = "RookPro",
  Bishop = "Bishop",
  BishopPro = "BishopPro",
  Gold = "Gold",
  Silver = "Silver",
  SilverPro = "SilverPro",
  Knight = "Knight",
  KnightPro = "KnightPro",
  Lance = "Lance",
  LancePro = "LancePro",
  Pawn = "Pawn",
  PawnPro = "PawnPro"

}


export type GameBoardModel = {
  Id: string;
  Squares: Array<GameSquareModel>;
  
};

export class GameSquareModel {
  Id: string;
  X: number;
  Y: number;
  Piece: GamePieceModel;
  
  constructor(x: number, y: number, piece: GamePieceModel) {
    this.Id = `Square-${x}${y}`;
    this.X = x;
    this.Y = y;
    this.Piece = piece;
  }
};

export class GamePieceModel {
  Type: GamePieceType;
  Player: number;
  Icon: string;
  Id: string;
  IsFacingDefault: boolean
  
  constructor(player: number = 0, type: GamePieceType = GamePieceType.None, startingPos: string = "X", icon: string = "", isFacingDefault = true) {
    this.Id = `Player${player}-${type.toString()}-${startingPos}`;
    this.Type = type;
    this.Player = player;
    this.Icon = icon;
    this.IsFacingDefault = isFacingDefault;
  };
};

export enum GamePieceType{
  None = "None",
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


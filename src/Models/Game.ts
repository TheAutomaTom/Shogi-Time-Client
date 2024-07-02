export type GameBoardModel = {
  Id: string;
  CurrentPlayer: number;
  Squares: Array<GameSquareModel>;
  
};

export class GameSquareModel {
  Id: string;
  X: number;
  Y: number;
  PromotionZone: number;
  Piece: GamePieceModel;
  
  constructor(x: number, y: number, promotes: number = 0, piece: GamePieceModel = new GamePieceModel( )) {
    this.Id = `Square-${x}${y}`;
    this.X = x;
    this.Y = y;
    this.PromotionZone = promotes;
    this.Piece = piece;
  }
};

export class GamePieceModel {
  Type: GamePieceType;
  StartingPos: string;
  Player: number;
  Icon: string;
  Id: string;
  IsFacingDefault: boolean
  
  constructor(player: number = 0, type: GamePieceType = GamePieceType.None, startingPos: string = "X", icon: string = "", isFacingDefault = true) {
    this.Id = `Player${player}-${type.toString()}-${startingPos}`;
    this.Type = type;
    this.StartingPos = startingPos;
    this.Player = player;
    this.Icon = icon;
    this.IsFacingDefault = isFacingDefault;
  };

  Promote =(): GamePieceModel=>{
    // Icons prefixed with 1 face down (for player 2)
    this.Icon = this.Player == 1 ? "0" : "1";

    switch (this.Type) {
      case GamePieceType.Bishop:
        this.Type = GamePieceType.BishopPro;
        this.Icon += "UM"
        break;
      case GamePieceType.Knight:
        this.Type = GamePieceType.KnightPro;
        this.Icon += "NK"
        break;
      case GamePieceType.Lance:
        this.Type = GamePieceType.LancePro;
        this.Icon += "NY"
        break;
      case GamePieceType.Rook:
        this.Type = GamePieceType.RookPro;
        this.Icon += "RY"
        break;
      case GamePieceType.Silver:
        this.Type = GamePieceType.SilverPro;
        this.Icon += "NG"
        break;
      case GamePieceType.Pawn:
        this.Type = GamePieceType.PawnPro;
        this.Icon += "TO"
        break;
      default:
        this.Type = GamePieceType.None;
        this.Icon += ""
        break;
    }
    return new GamePieceModel(this.Player, this.Type, this.StartingPos, this.Icon, this.IsFacingDefault);
  }
  Demote =()=>{

    // Icons prefixed with 1 face down (for player 2)
    this.Icon = this.Player == 1 ? "0" : "1";

    switch (this.Type) {
      case GamePieceType.BishopPro:
        this.Type = GamePieceType.Bishop;
        this.Icon += "KA"
        break;
      case GamePieceType.KnightPro:
        this.Type = GamePieceType.Knight;
        this.Icon += "KE"
        break;
      case GamePieceType.LancePro:
        this.Type = GamePieceType.Lance;
        this.Icon += "KY"
        break;
      case GamePieceType.RookPro:
        this.Type = GamePieceType.Rook;
        this.Icon += "HI"
        break;
      case GamePieceType.SilverPro:
        this.Type = GamePieceType.Silver;
        this.Icon += "GI"
        break;
      case GamePieceType.PawnPro:
        this.Type = GamePieceType.Pawn;
        this.Icon += "TO"
        break;
      default:
        this.Type = GamePieceType.None;
        this.Icon += ""
        break;
    }
  }
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

};

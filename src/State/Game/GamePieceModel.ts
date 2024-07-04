import { GamePieceType } from "./GamePieceType";

export class GamePieceModel {
  Type: GamePieceType;
  StartingPos: string;
  Player: number;
  Id: string;
  IsFacingDefault: boolean;
  Icon: string;

  // Why does `private get iconPrefix` cause compile errors?
  public get iconPrefix() {
    if(this.Player == 1){ return this.IsFacingDefault == true ? "0" : "1"; }
    if(this.Player == 2){ return this.IsFacingDefault == true ? "1" : "0"; }
    // Player = 0...
    return "";
  }

  public get IconPath() {
    return this.iconPrefix + this.Icon;
  }

  constructor(player: number = 0, type: GamePieceType = GamePieceType.None, startingPos: string = "X", icon: string = "", isFacingDefault = true) {
    this.Id = `Player${player}-${type.toString()}-${startingPos}`;
    this.Type = type;
    this.StartingPos = startingPos;
    this.Player = player;

    this.Icon = icon;

    this.IsFacingDefault = isFacingDefault;
  };

  Promote = (): GamePieceModel => {
    switch (this.Type) {
      case GamePieceType.Bishop:
        this.Type = GamePieceType.BishopPro;
        this.Icon = "UM";
        break;
      case GamePieceType.Knight:
        this.Type = GamePieceType.KnightPro;
        this.Icon = "NK";
        break;
      case GamePieceType.Lance:
        this.Type = GamePieceType.LancePro;
        this.Icon = "NY";
        break;
      case GamePieceType.Rook:
        this.Type = GamePieceType.RookPro;
        this.Icon = "RY";
        break;
      case GamePieceType.Silver:
        this.Type = GamePieceType.SilverPro;
        this.Icon = "NG";
        break;
      case GamePieceType.Pawn:
        this.Type = GamePieceType.PawnPro;
        this.Icon = "TO";
        break;
      default:
        this.Type = this.Type;
        this.Icon = this.Icon;
        break;
    }
    return new GamePieceModel(this.Player, this.Type, this.StartingPos, this.Icon, this.IsFacingDefault);
  };
  
  Demote = (): GamePieceModel => {
    switch (this.Type) {
      case GamePieceType.BishopPro:
        this.Type = GamePieceType.Bishop;
        this.Icon = "KA";
        break;
      case GamePieceType.KnightPro:
        this.Type = GamePieceType.Knight;
        this.Icon = "KE";
        break;
      case GamePieceType.LancePro:
        this.Type = GamePieceType.Lance;
        this.Icon = "KY";
        break;
      case GamePieceType.RookPro:
        this.Type = GamePieceType.Rook;
        this.Icon = "HI";
        break;
      case GamePieceType.SilverPro:
        this.Type = GamePieceType.Silver;
        this.Icon = "GI";
        break;
      case GamePieceType.PawnPro:
        this.Type = GamePieceType.Pawn;
        this.Icon = "FU";
        break;
      default:
        this.Type = this.Type;
        this.Icon = this.Icon;
        break;
    }
    return new GamePieceModel(this.Player, this.Type, this.StartingPos, this.Icon, this.IsFacingDefault);
  };
}

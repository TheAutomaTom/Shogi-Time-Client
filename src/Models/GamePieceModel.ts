import { GamePieceType } from "./GamePieceType";


export class GamePieceModel {
  Type: GamePieceType;
  StartingPos: string;
  Player: number;
  Id: string;
  IsFacingDefault: boolean;

  // TODO: Why can't `_icon` be private setter? 
  // It's only referenced within this file, 
  // but `private set` causes compile errors 
  // when using the class as a param.
  _icon: string;

  public get iconPrefix() {
    return this.Player == 1 ? "0" : "1";
  }

  public get IconPath() {
    return this.iconPrefix + this._icon;
  }

  constructor(player: number = 0, type: GamePieceType = GamePieceType.None, startingPos: string = "X", icon: string = "", isFacingDefault = true) {
    this.Id = `Player${player}-${type.toString()}-${startingPos}`;
    this.Type = type;
    this.StartingPos = startingPos;
    this.Player = player;

    this._icon = icon;

    this.IsFacingDefault = isFacingDefault;
  };

  Promote = (): GamePieceModel => {

    switch (this.Type) {
      case GamePieceType.Bishop:
        this.Type = GamePieceType.BishopPro;
        this._icon = "UM";
        break;
      case GamePieceType.Knight:
        this.Type = GamePieceType.KnightPro;
        this._icon = "NK";
        break;
      case GamePieceType.Lance:
        this.Type = GamePieceType.LancePro;
        this._icon = "NY";
        break;
      case GamePieceType.Rook:
        this.Type = GamePieceType.RookPro;
        this._icon = "RY";
        break;
      case GamePieceType.Silver:
        this.Type = GamePieceType.SilverPro;
        this._icon = "NG";
        break;
      case GamePieceType.Pawn:
        this.Type = GamePieceType.PawnPro;
        this._icon = "TO";
        break;
      default:
        this.Type = this.Type;
        this._icon = this._icon;
        break;
    }
    return new GamePieceModel(this.Player, this.Type, this.StartingPos, this._icon, this.IsFacingDefault);
  };
  
  Demote = (): GamePieceModel => {
    switch (this.Type) {
      case GamePieceType.BishopPro:
        this.Type = GamePieceType.Bishop;
        this._icon = "KA";
        break;
      case GamePieceType.KnightPro:
        this.Type = GamePieceType.Knight;
        this._icon = "KE";
        break;
      case GamePieceType.LancePro:
        this.Type = GamePieceType.Lance;
        this._icon = "KY";
        break;
      case GamePieceType.RookPro:
        this.Type = GamePieceType.Rook;
        this._icon = "HI";
        break;
      case GamePieceType.SilverPro:
        this.Type = GamePieceType.Silver;
        this._icon = "GI";
        break;
      case GamePieceType.PawnPro:
        this.Type = GamePieceType.Pawn;
        this._icon = "TO";
        break;
      default:
        this.Type = this.Type;
        this._icon = this._icon;
        break;
    }
    return new GamePieceModel(this.Player, this.Type, this.StartingPos, this._icon, this.IsFacingDefault);
  };
}

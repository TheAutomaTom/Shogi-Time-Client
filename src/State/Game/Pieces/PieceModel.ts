import { GamePieceType } from "./GamePieceType";
import { PotentialRange } from "./PotentialRange";

export class GamePieceModel {
  Type: GamePieceType;
  StartingPos: string;
  Player: number;
  Id: string;
  IsFacingDefault: boolean;
  Icon: string;
  PotentialRange: PotentialRange;

  constructor(player: number = 0, type: GamePieceType = GamePieceType.None, startingPos: string = "X", icon: string = "", isFacingDefault = true) {
    this.Id = `Player${player}-${type.toString()}-${startingPos}`;
    this.Type = type;
    this.StartingPos = startingPos;
    this.Player = player;

    this.Icon = icon;

    this.IsFacingDefault = isFacingDefault;
    this.PotentialRange = this.setRange();
  };

  // Why does `private get iconPrefix` cause compile errors?
  public get iconPrefix() {
    if(this.Player == 1){ return this.IsFacingDefault == true ? "0" : "1"; }
    if(this.Player == 2){ return this.IsFacingDefault == true ? "1" : "0"; }
    // Player = 0...
    return "";
  }

  public get IconPath() { return this.iconPrefix + this.Icon; }

  setRange = (): PotentialRange =>{
    switch (this.Type) {
      case GamePieceType.KingVictor: 
        return {
          N:  1,
          S:  1,
          E:  1,
          W:  1,
          NE: 1,
          SE: 1,
          SW: 1,
          NW: 1,
          K:  0
        } as PotentialRange;
    
      case GamePieceType.KingChallenger: 
        return {
          N:  1,
          S:  1,
          E:  1,
          W:  1,
          NE: 1,
          SE: 1,
          SW: 1,
          NW: 1,
          K:  0
        } as PotentialRange;
    
      case GamePieceType.Rook: 
        return {
          N:  8,
          S:  8,
          E:  8,
          W:  8,
          NE: 0,
          SE: 0,
          SW: 0,
          NW: 0,
          K:  0
        } as PotentialRange;
    
      case GamePieceType.RookPro: 
        return {
          N:  8,
          S:  8,
          E:  8,
          W:  8,
          NE: 1,
          SE: 1,
          SW: 1,
          NW: 1,
          K:  0
        } as PotentialRange;
    
      case GamePieceType.Bishop: 
        return {
          N:  0,
          S:  0,
          E:  0,
          W:  0,
          NE: 8,
          SE: 8,
          SW: 8,
          NW: 8,
          K:  0
        } as PotentialRange;
    
      case GamePieceType.BishopPro: 
        return {
          N:  1,
          S:  1,
          E:  1,
          W:  1,
          NE: 8,
          SE: 8,
          SW: 8,
          NW: 8,
          K:  0
        } as PotentialRange;
    
      case GamePieceType.Gold: 
        return {
          N:  1,
          S:  1,
          E:  1,
          W:  1,
          NE: 1,
          SE: 0,
          SW: 0,
          NW: 1,
          K:  0
        } as PotentialRange;
    
      case GamePieceType.Silver: 
        return {
          N:  1,
          S:  0,
          E:  0,
          W:  0,
          NE: 1,
          SE: 1,
          SW: 1,
          NW: 1,
          K:  0
        } as PotentialRange;
    
      case GamePieceType.SilverPro: 
        return {
          N:  1,
          S:  1,
          E:  1,
          W:  1,
          NE: 1,
          SE: 0,
          SW: 0,
          NW: 1,
          K:  0
        } as PotentialRange;
    
      case GamePieceType.Knight: 
        return {
          N:  0,
          S:  0,
          E:  0,
          W:  0,
          NE: 0,
          SE: 0,
          SW: 0,
          NW: 0,
          K:  1
        } as PotentialRange;
    
      case GamePieceType.KnightPro: 
        return {
          N:  1,
          S:  1,
          E:  1,
          W:  1,
          NE: 1,
          SE: 0,
          SW: 0,
          NW: 1,
          K:  0
        } as PotentialRange;
    
      case GamePieceType.Lance: 
        return {
          N:  8,
          S:  0,
          E:  0,
          W:  0,
          NE: 0,
          SE: 0,
          SW: 0,
          NW: 0,
          K:  0
        } as PotentialRange;
    
      case GamePieceType.LancePro: 
        return {
          N:  1,
          S:  1,
          E:  1,
          W:  1,
          NE: 1,
          SE: 0,
          SW: 0,
          NW: 1,
          K:  0
        } as PotentialRange;
    
      case GamePieceType.Pawn: 
        return {
          N:  1,
          S:  0,
          E:  0,
          W:  0,
          NE: 0,
          SE: 0,
          SW: 0,
          NW: 0,
          K:  0
        } as PotentialRange;
    
      case GamePieceType.PawnPro: 
        return {
          N:  1,
          S:  1,
          E:  1,
          W:  1,
          NE: 1,
          SE: 0,
          SW: 0,
          NW: 1,
          K:  0
        } as PotentialRange;
    
      default: //GamePieceType.None: 
      return {
        N:  0,
        S:  0,
        E:  0,
        W:  0,
        NE: 0,
        SE: 0,
        SW: 0,
        NW: 0,
        K:  0
      } as PotentialRange;
    };
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

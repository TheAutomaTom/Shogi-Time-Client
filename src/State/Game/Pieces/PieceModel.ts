import { PieceType } from "./PieceType";
import { PieceRange } from "./PieceRange";

export class GamePieceModel {
  Player: number;
  Type: PieceType;
  StartingPosition: string;
  IsFacingDefault: boolean;
  Icon: string;
  PotentialRange: PieceRange;

  constructor(player: number = 0, type: PieceType = PieceType.None, startingPos: string = "X", icon: string = "", isFacingDefault = true) {
    
    this.Type = type;
    this.StartingPosition = startingPos;
    this.Player = player;

    this.Icon = icon;

    this.IsFacingDefault = isFacingDefault;
    this.PotentialRange = this.setRange();
  };

  public get Id() { return `Player${this.Player}-${this.Type.toString()}-${this.StartingPosition}`; };

  // Why does `private get iconPrefix` cause compile errors?
  public get iconPrefix() {
    if(this.Player == 1){ return this.IsFacingDefault == true ? "0" : "1"; }
    if(this.Player == 2){ return this.IsFacingDefault == true ? "1" : "0"; }
    // Player = 0...
    return "";
  };

  public get IconPath() { return this.iconPrefix + this.Icon; }

  setRange = (): PieceRange =>{
    switch (this.Type) {
      case PieceType.KingVictor: 
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
        } as PieceRange;
    
      case PieceType.KingChallenger: 
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
        } as PieceRange;
    
      case PieceType.Rook: 
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
        } as PieceRange;
    
      case PieceType.RookPro: 
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
        } as PieceRange;
    
      case PieceType.Bishop: 
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
        } as PieceRange;
    
      case PieceType.BishopPro: 
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
        } as PieceRange;
    
      case PieceType.Gold: 
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
        } as PieceRange;
    
      case PieceType.Silver: 
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
        } as PieceRange;
    
      case PieceType.SilverPro: 
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
        } as PieceRange;
    
      case PieceType.Knight: 
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
        } as PieceRange;
    
      case PieceType.KnightPro: 
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
        } as PieceRange;
    
      case PieceType.Lance: 
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
        } as PieceRange;
    
      case PieceType.LancePro: 
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
        } as PieceRange;
    
      case PieceType.Pawn: 
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
        } as PieceRange;
    
      case PieceType.PawnPro: 
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
        } as PieceRange;
    
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
      } as PieceRange;
    };
  };

  Promote = (): GamePieceModel => {
    switch (this.Type) {
      case PieceType.Bishop:
        this.Type = PieceType.BishopPro;
        this.Icon = "UM";
        break;
      case PieceType.Knight:
        this.Type = PieceType.KnightPro;
        this.Icon = "NK";
        break;
      case PieceType.Lance:
        this.Type = PieceType.LancePro;
        this.Icon = "NY";
        break;
      case PieceType.Rook:
        this.Type = PieceType.RookPro;
        this.Icon = "RY";
        break;
      case PieceType.Silver:
        this.Type = PieceType.SilverPro;
        this.Icon = "NG";
        break;
      case PieceType.Pawn:
        this.Type = PieceType.PawnPro;
        this.Icon = "TO";
        break;
      default:
        this.Type = this.Type;
        this.Icon = this.Icon;
        break;
    }
    return new GamePieceModel(this.Player, this.Type, this.StartingPosition, this.Icon, this.IsFacingDefault);
  };
  
  Demote = (): GamePieceModel => {
    switch (this.Type) {
      case PieceType.BishopPro:
        this.Type = PieceType.Bishop;
        this.Icon = "KA";
        break;
      case PieceType.KnightPro:
        this.Type = PieceType.Knight;
        this.Icon = "KE";
        break;
      case PieceType.LancePro:
        this.Type = PieceType.Lance;
        this.Icon = "KY";
        break;
      case PieceType.RookPro:
        this.Type = PieceType.Rook;
        this.Icon = "HI";
        break;
      case PieceType.SilverPro:
        this.Type = PieceType.Silver;
        this.Icon = "GI";
        break;
      case PieceType.PawnPro:
        this.Type = PieceType.Pawn;
        this.Icon = "FU";
        break;
      default:
        this.Type = this.Type;
        this.Icon = this.Icon;
        break;
    }
    return new GamePieceModel(this.Player, this.Type, this.StartingPosition, this.Icon, this.IsFacingDefault);
  };
  
}

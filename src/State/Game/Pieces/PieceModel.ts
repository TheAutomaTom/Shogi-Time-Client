import { PieceType } from "./PieceType";
import { Mobility } from "../Movement/Mobility";

export class PieceModel {
  Player: number;
  Type: PieceType;
  StartingPosition: string;  
  Icon: string;
    
  Mobility: Mobility;
  public get Id() { return `P${this.Player}-${this.Type.toString()}-${this.StartingPosition}`; };

  constructor(player: number = 0, type: PieceType = PieceType.None, startingPos: string = "X", icon: string = "", mobility: Mobility | null = null) {
    
    this.Player = player;
    
    if(player != 0){
      this.Type = type;
      this.StartingPosition = startingPos;
      this.Icon = icon;
      
      if(mobility != null){
        
        this.Mobility = mobility;
        // this.Mobility = new Mobility(type, mobility.IsFacingDefault, mobility.Map, mobility.PinnedTo);
      } else {
        this.Mobility = new Mobility(type);
      }

    } else {
      this.Type = PieceType.None;
      this.StartingPosition = "_" ;
      this.Icon = "";
      this.Mobility = new Mobility(type);
    }
    
    // if(type == PieceType.Bishop) console.log(`PieceModel ctor: ${type} Mobility...`);
    // if(type == PieceType.Bishop) console.dir(m.Vectors);
    // if(type == PieceType.Bishop) console.dir(this.Mobility);
    // if(type == PieceType.Bishop) console.dir(m.Vectors);
    // if(type == PieceType.Bishop) console.dir(this.Mobility.Vectors);

  };

  
  Reset(): boolean {
    this.Mobility = new Mobility(this.Type);
    return true;
  }


  // Why does `private get iconPrefix` cause compile errors?
  public get iconPrefix() {
    if(this.Player == 1){ return this.Mobility.IsFacingDefault == true ? "0" : "1"; }
    if(this.Player == 2){ return this.Mobility.IsFacingDefault == true ? "1" : "0"; }
    // Player = 0...
    return "";
  };

  public get IconPath() { return this.iconPrefix + this.Icon; }


  Promote = (): PieceModel => {
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
    return new PieceModel(this.Player, this.Type, this.StartingPosition, this.Icon, this.Mobility);
  };
  
  Demote = (): PieceModel => {
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
    return new PieceModel(this.Player, this.Type, this.StartingPosition, this.Icon);
  };

  
}

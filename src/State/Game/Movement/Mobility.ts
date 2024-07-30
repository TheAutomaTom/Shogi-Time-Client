import { BaseSquareModel } from './../Bases/BaseSquareModel';
import { PieceType } from "../Pieces/PieceType";
import { Vector } from "./Vector";
import { VectorName } from "./VectorName";
import { VectorRangeSet } from "./VectorRangeSet";

export class Mobility {

  Vectors:  Vector[];
  IsFacingDefault: boolean;
  Map: BaseSquareModel[];
  // Constrains a piece to vector where an attacker would otherwise gain a check condition.
  PinnedTo: VectorName;

  constructor(piece: PieceType, isFacingDefault: boolean = true, pinnedTo: VectorName = VectorName.None) {
    
    this.Vectors = [];

    if(pinnedTo == VectorName.None){
      const ranges = this.setRanges(piece);
      if(ranges.N  > 0) this.Vectors.push( new Vector( VectorName.N,  ranges.N,   0,  1 ) );
      if(ranges.S  > 0) this.Vectors.push( new Vector( VectorName.S,  ranges.S,   0, -1 ) );
      if(ranges.E  > 0) this.Vectors.push( new Vector( VectorName.E,  ranges.E,  -1,  0 ) );
      if(ranges.W  > 0) this.Vectors.push( new Vector( VectorName.W,  ranges.W,   1,  0 ) );
      if(ranges.NE > 0) this.Vectors.push( new Vector( VectorName.NE, ranges.NE, -1,  1 ) );
      if(ranges.SE > 0) this.Vectors.push( new Vector( VectorName.SE, ranges.SE, -1, -1 ) );
      if(ranges.SW > 0) this.Vectors.push( new Vector( VectorName.SW, ranges.SW,  1, -1 ) );
      if(ranges.NW > 0) this.Vectors.push( new Vector( VectorName.NW, ranges.NW,  1,  1 ) );
      if(ranges.K  > 0) this.Vectors.push( new Vector( VectorName.K,  ranges.K,   1,  2 ) );
    } else {
      
    }
    
    
    this.IsFacingDefault = isFacingDefault;

    this.Map = [];
    this.PinnedTo = pinnedTo;
  }
  
  setRanges = (piece: PieceType): VectorRangeSet =>{
    switch (piece) {
      case PieceType.King: 
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
        };
    
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
        };
    
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
        };
    
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
        };
    
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
        };
    
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
        };
    
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
        };
    
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
        };
    
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
        };
    
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
        };
    
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
        };
    
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
        };
    
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
        };
    
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
        };
    
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
      };
    };
  };



}

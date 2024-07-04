import { GamePieceType } from "@/Models/GamePieceType";
import { PotentialRange } from "./PotentialRange";

export class MovementRule {
  Piece: GamePieceType;
  Range: PotentialRange;
  
  constructor(piece: GamePieceType) {  
    this.Piece = piece;
    switch (piece) {
      case GamePieceType.KingVictor: 
        this.Range = {
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
        break;
    
      case GamePieceType.KingChallenger: 
        this.Range = {
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
        break;
    
      case GamePieceType.Rook: 
        this.Range = {
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
        break;
    
      case GamePieceType.RookPro: 
        this.Range = {
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
        break;
    
      case GamePieceType.Bishop: 
        this.Range = {
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
        break;
    
      case GamePieceType.BishopPro: 
        this.Range = {
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
        break;
    
      case GamePieceType.Gold: 
        this.Range = {
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
        break;
    
      case GamePieceType.Silver: 
        this.Range = {
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
        break;
    
      case GamePieceType.SilverPro: 
        this.Range = {
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
        break;
    
      case GamePieceType.Knight: 
        this.Range = {
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
        break;
    
      case GamePieceType.KnightPro: 
        this.Range = {
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
        break;
    
      case GamePieceType.Lance: 
        this.Range = {
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
        break;
    
      case GamePieceType.LancePro: 
        this.Range = {
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
        break;
    
      case GamePieceType.Pawn: 
        this.Range = {
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
        break;
    
      case GamePieceType.PawnPro: 
        this.Range = {
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
        break;
    
      default: //GamePieceType.None: 
      this.Range = {
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
        break;
    };
      
  }

};

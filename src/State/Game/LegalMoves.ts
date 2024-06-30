import { GamePieceType } from "@/Models/Game";

type Mobility = {
  N: number,
  S: number,
  E: number,
  W: number,
  NE: number,
  SE: number,
  SW: number,
  NW: number,
  K: boolean
};

export type Coordinate = {
  X: number,
  Y: number
};

export class MovementRule {
  PieceType: GamePieceType;
  Mobility: Mobility;

  // None: Mobility;
  // KingVictor: Mobility;
  // KingChallenger: Mobility;
  // Rook: Mobility;
  // RookPro: Mobility;
  // Bishop: Mobility;
  // BishopPro: Mobility;
  // Gold: Mobility;
  // Silver: Mobility;
  // SilverPro: Mobility;
  // Knight: Mobility;
  // KnightPro: Mobility;
  // Lance: Mobility;
  // LancePro: Mobility;
  // Pawn: Mobility;
  // PawnPro: Mobility;
  
  constructor(pieceType: GamePieceType) {  
    this.PieceType = pieceType;
    switch (pieceType) {
      case GamePieceType.KingVictor: 
        this.Mobility = {
          N:  1,
          S:  1,
          E:  1,
          W:  1,
          NE: 1,
          SE: 1,
          SW: 1,
          NW: 1,
          K:  false
        } as Mobility;
        break;
    
      case GamePieceType.KingChallenger: 
        this.Mobility = {
          N:  1,
          S:  1,
          E:  1,
          W:  1,
          NE: 1,
          SE: 1,
          SW: 1,
          NW: 1,
          K:  false
        } as Mobility;
        break;
    
      case GamePieceType.Rook: 
        this.Mobility = {
          N:  8,
          S:  8,
          E:  8,
          W:  8,
          NE: 0,
          SE: 0,
          SW: 0,
          NW: 0,
          K:  false
        } as Mobility;
        break;
    
      case GamePieceType.RookPro: 
        this.Mobility = {
          N:  8,
          S:  8,
          E:  8,
          W:  8,
          NE: 1,
          SE: 1,
          SW: 1,
          NW: 1,
          K:  false
        } as Mobility;
        break;
    
      case GamePieceType.Bishop: 
        this.Mobility = {
          N:  0,
          S:  0,
          E:  0,
          W:  0,
          NE: 8,
          SE: 8,
          SW: 8,
          NW: 8,
          K:  false
        } as Mobility;
        break;
    
      case GamePieceType.BishopPro: 
        this.Mobility = {
          N:  1,
          S:  1,
          E:  1,
          W:  1,
          NE: 8,
          SE: 8,
          SW: 8,
          NW: 8,
          K:  false
        } as Mobility;
        break;
    
      case GamePieceType.Gold: 
        this.Mobility = {
          N:  1,
          S:  1,
          E:  1,
          W:  1,
          NE: 1,
          SE: 0,
          SW: 0,
          NW: 1,
          K:  false
        } as Mobility;
        break;
    
      case GamePieceType.Silver: 
        this.Mobility = {
          N:  1,
          S:  1,
          E:  0,
          W:  0,
          NE: 1,
          SE: 0,
          SW: 0,
          NW: 1,
          K:  false
        } as Mobility;
        break;
    
      case GamePieceType.SilverPro: 
        this.Mobility = {
          N:  1,
          S:  1,
          E:  1,
          W:  1,
          NE: 1,
          SE: 0,
          SW: 0,
          NW: 1,
          K:  false
        } as Mobility;
        break;
    
      case GamePieceType.Knight: 
        this.Mobility = {
          N:  0,
          S:  0,
          E:  0,
          W:  0,
          NE: 0,
          SE: 0,
          SW: 0,
          NW: 0,
          K:  true
        } as Mobility;
        break;
    
      case GamePieceType.KnightPro: 
        this.Mobility = {
          N:  1,
          S:  1,
          E:  1,
          W:  1,
          NE: 1,
          SE: 0,
          SW: 0,
          NW: 1,
          K:  false
        } as Mobility;
        break;
    
      case GamePieceType.Lance: 
        this.Mobility = {
          N:  8,
          S:  0,
          E:  0,
          W:  0,
          NE: 0,
          SE: 0,
          SW: 0,
          NW: 0,
          K:  false
        } as Mobility;
        break;
    
      case GamePieceType.LancePro: 
        this.Mobility = {
          N:  1,
          S:  1,
          E:  1,
          W:  1,
          NE: 1,
          SE: 0,
          SW: 0,
          NW: 1,
          K:  false
        } as Mobility;
        break;
    
      case GamePieceType.Pawn: 
        this.Mobility = {
          N:  1,
          S:  0,
          E:  0,
          W:  0,
          NE: 0,
          SE: 0,
          SW: 0,
          NW: 0,
          K:  false
        } as Mobility;
        break;
    
      case GamePieceType.PawnPro: 
        this.Mobility = {
          N:  1,
          S:  1,
          E:  1,
          W:  1,
          NE: 1,
          SE: 0,
          SW: 0,
          NW: 1,
          K:  false
        } as Mobility;
        break;
    
      default: //GamePieceType.None: 
      this.Mobility = {
        N:  0,
        S:  0,
        E:  0,
        W:  0,
        NE: 0,
        SE: 0,
        SW: 0,
        NW: 0,
        K:  false
      } as Mobility;
        break;
    };
      
  }

};

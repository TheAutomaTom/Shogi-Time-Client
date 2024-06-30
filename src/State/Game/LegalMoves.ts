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
}

export class LegalMoves {
  
  None: Mobility;
  KingVictor: Mobility;
  KingChallenger: Mobility;
  Rook: Mobility;
  RookPro: Mobility;
  Bishop: Mobility;
  BishopPro: Mobility;
  Gold: Mobility;
  Silver: Mobility;
  SilverPro: Mobility;
  Knight: Mobility;
  KnightPro: Mobility;
  Lance: Mobility;
  LancePro: Mobility;
  Pawn: Mobility;
  PawnPro: Mobility;
  
  constructor() {  

    this.None = {
      N:  0,
      S:  0,
      E:  0,
      W:  0,
      NE: 0,
      SE: 0,
      SW: 0,
      NW: 0,
      K:  false

    };
    
    this.KingVictor = {
      N:  1,
      S:  1,
      E:  1,
      W:  1,
      NE: 1,
      SE: 1,
      SW: 1,
      NW: 1,
      K:  false

    };

    this.KingChallenger = {
      N:  1,
      S:  1,
      E:  1,
      W:  1,
      NE: 1,
      SE: 1,
      SW: 1,
      NW: 1,
      K:  false

    };

    this.Rook = {
      N:  8,
      S:  8,
      E:  8,
      W:  8,
      NE: 0,
      SE: 0,
      SW: 0,
      NW: 0,
      K:  false

    };

    this.RookPro = {
      N:  8,
      S:  8,
      E:  8,
      W:  8,
      NE: 1,
      SE: 1,
      SW: 1,
      NW: 1,
      K:  false

    };

    this.Bishop = {
      N:  0,
      S:  0,
      E:  0,
      W:  0,
      NE: 8,
      SE: 8,
      SW: 8,
      NW: 8,
      K:  false

    };

    this.BishopPro = {
      N:  1,
      S:  1,
      E:  1,
      W:  1,
      NE: 8,
      SE: 8,
      SW: 8,
      NW: 8,
      K:  false

    };

    this.Gold = {
      N:  1,
      S:  1,
      E:  1,
      W:  1,
      NE: 1,
      SE: 0,
      SW: 0,
      NW: 1,
      K:  false

    };

    this.Silver = {
      N:  1,
      S:  1,
      E:  0,
      W:  0,
      NE: 1,
      SE: 0,
      SW: 0,
      NW: 1,
      K:  false

    };

    this.SilverPro = {
      N:  1,
      S:  1,
      E:  1,
      W:  1,
      NE: 1,
      SE: 0,
      SW: 0,
      NW: 1,
      K:  false

    };

    this.Knight = {
      N:  1,
      S:  0,
      E:  0,
      W:  0,
      NE: 0,
      SE: 0,
      SW: 0,
      NW: 0,
      K:  true

    };

    this.KnightPro = {
      N:  1,
      S:  1,
      E:  1,
      W:  1,
      NE: 1,
      SE: 0,
      SW: 0,
      NW: 1,
      K:  false

    };

    this.Lance = {
      N:  8,
      S:  0,
      E:  0,
      W:  0,
      NE: 0,
      SE: 0,
      SW: 0,
      NW: 0,
      K:  false

    };

    this.LancePro = {
      N:  1,
      S:  1,
      E:  1,
      W:  1,
      NE: 1,
      SE: 0,
      SW: 0,
      NW: 1,
      K:  false

    };

    this.Pawn = {
      N:  1,
      S:  0,
      E:  0,
      W:  0,
      NE: 0,
      SE: 0,
      SW: 0,
      NW: 0,
      K:  false

    };

    this.PawnPro = {
      N:  1,
      S:  1,
      E:  1,
      W:  1,
      NE: 1,
      SE: 0,
      SW: 0,
      NW: 1,
      K:  false

    };
      
  }

}



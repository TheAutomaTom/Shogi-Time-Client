import { BoardModel } from "../BoardModel";
import { SquareModel } from "../SquareModel";
import { PieceRangeSet } from "../Pieces/PieceRange";
import { TargetStatus } from "./TargetStatus";
import { VectorSet } from "./VectorSet";
import { TargetSquare } from "./TargetSquare";

export class MobilityEngine {
  
  logEnabled = false;

  Rebuild = ( board: BoardModel ): SquareModel[] =>{
    if(this.logEnabled){ console.error(`MobilityEngine.Rebuild()`); }

    // First iterations establishes all possible move range and tracks obstacles.
    board.Squares.forEach( square => {
      if(square.Piece.Player != 0){
        square.Piece.VectorSet = this.evaluateVectors(          
          board, 
          square.X, 
          square.Y,
          square.Piece.Range,
          this.setPieceIsFacing(square.Piece.Player, square.Piece.IsFacingDefault)
        )
      }      
    });

    // Create flat maps for each piece 
    // so squares know where to highlight valid moves.
    board.Squares.forEach( square => {
      if(square.Piece.Player != 0){
        square.Piece.MovementMap.push( ...this.FlattenMap(square) );
      }
    });
    
    return board.Squares;
  };

  
  FlattenMap = (square: SquareModel): TargetSquare[] => {
    let map = [] as TargetSquare[];
    
    square.Piece.VectorSet.N.forEach(target => {
      map.push(target);
    });    
  
    square.Piece.VectorSet.S.forEach(target => {
      map.push(target);
    });
  
    square.Piece.VectorSet.E.forEach(target => {
      map.push(target);
    });
    
    square.Piece.VectorSet.W.forEach(target => {
      map.push(target);
    });
    
    square.Piece.VectorSet.NE.forEach(target => {
      map.push(target);
    });
    
    square.Piece.VectorSet.NW.forEach(target => {
      map.push(target);
    });
    
    square.Piece.VectorSet.SE.forEach(target => {
      map.push(target);
    });
    
    square.Piece.VectorSet.SW.forEach(target => {
      map.push(target);
    });
    
    return map;
  };
  
  setPieceIsFacing = (player: number, isDefault: boolean): number =>{
    if(isDefault){
      return player == 1 ? -1 : 1;
    }
    return player == 1 ? 1 : -1;
  };

  evaluateVector = ( 
    board: BoardModel, targetX: number, targetY: number, debug: boolean = false
  ): TargetSquare =>{

    if(targetX >= 1 && targetX <= 9 && targetY >= 1 && targetY <= 9){
          
      // Find the target square
      const s = board.Squares.find( s => s.X == targetX && s.Y == targetY );

      if(s == undefined) return new TargetSquare(11, 11, TargetStatus.Na );

      switch (s?.Piece.Player) {
        case 0:
          const result = new TargetSquare(s.X, s.Y, TargetStatus.Open );
          if(debug){console.log(`2A. evaluateVector: ${targetX},${targetY}: ${TargetStatus.Open}`);}
          // console.dir(result);
          return result;

        case board.CurrentPlayer:
          if(this.logEnabled){ console.log(`${targetX}, ${targetY}: Ally`); }
          if(debug){console.log(`2C. evaluateVector: ${targetX},${targetY}: ${TargetStatus.Ally}`);}
          return new TargetSquare(s.X, s.Y, TargetStatus.Ally );
      
        default: 
          if(this.logEnabled){ console.log(`${targetX}, ${targetY}: Enemy`); }
          if(debug){console.log(`2B. evaluateVector: ${targetX},${targetY}: ${TargetStatus.Enemy}`);}
          return new TargetSquare(s.X, s.Y, TargetStatus.Enemy );
      }

    };
    return new TargetSquare(10, 10, TargetStatus.OutOfRange );
  }

  evaluateVectors = (
    board: BoardModel, originX: number, originY: number, rangeSet: PieceRangeSet, facing: number
  ): VectorSet => {
    
      let mobility = {} as VectorSet;

      // Process North ===============================================
      mobility.N=[];
      if(rangeSet.N > 0){

        // Iterate each coordinate along one path (ex: north)...
        for (let i = 1; i <= rangeSet.N; i++) {

          let x = originX;
          let y = originY + i * facing 
          
          const s = this.evaluateVector( board, x, y );
          if(s.Status != TargetStatus.Open || TargetStatus.Na){
            mobility.N.push(s);
          }
        }
      }
      
      // Process South ===============================================
      mobility.S=[];
      if(rangeSet.S > 0){
        for (let i = 1; i <= rangeSet.S; i++) {
          if(this.logEnabled){ console.warn(`Range ${rangeSet.S}`); }
          let x = originX;
          let y = originY - i * facing;
          const s = this.evaluateVector( board, x, y );        
          if(s.Status != TargetStatus.Open || TargetStatus.Na){
            mobility.S.push(s);
          }
        }
      }

      // Process East ================================================
      mobility.E=[];
      if(rangeSet.E > 0){
      for (let i = 1; i <= rangeSet.E; i++) {    
          if(this.logEnabled){ console.warn(`Range ${rangeSet.E}`); }
            let x = originX - i * facing;
            let y = originY;
            const s = this.evaluateVector( board, x, y );
            if(s.Status != TargetStatus.Open || TargetStatus.Na){
              mobility.E.push(s);
            }
        }
      }
        
      // Process West ================================================
      mobility.W=[];
      if(rangeSet.W > 0){
        for (let i = 1; i <= rangeSet.W; i++) { 
          if(this.logEnabled){ console.warn(`Range ${rangeSet.W}`); }
            let x = originX + i * facing;
            let y = originY;
            const s = this.evaluateVector( board, x, y );
            if(s.Status != TargetStatus.Open || TargetStatus.Na){
              mobility.W.push(s);
            }
        }
      }
        
      // Process North-West ==========================================
      mobility.NW=[];
      if(rangeSet.NW > 0){
      for (let i = 1; i <= rangeSet.NW; i++) {  
        if(this.logEnabled){ console.warn(`Range ${rangeSet.NW}`); }
          let x = originX + i * facing;
          let y = originY + i * facing;
          const s = this.evaluateVector( board, x, y );
          if(s.Status != TargetStatus.Open || TargetStatus.Na){
            mobility.NW.push(s);
          }
        }
      }
        
      // Process North-East ==========================================
      mobility.NE=[];
      if(rangeSet.NE > 0){
        for (let i = 1; i <= rangeSet.NE; i++) {    
          if(this.logEnabled){ console.warn(`Range ${rangeSet.NE}`); }
            let x = originX - i * facing;
            let y = originY + i * facing;
            const s = this.evaluateVector( board, x, y );
            if(s.Status != TargetStatus.Open || TargetStatus.Na){
              mobility.NE.push(s);
            }
        }
      }
          
      // Process South-East =========================================
      mobility.SE=[];
      if(rangeSet.SE > 0){
        for (let i = 1; i <= rangeSet.SE; i++) {   
          if(this.logEnabled){ console.warn(`Range ${rangeSet.SE}`); }
            let x = originX - i * facing;
            let y = originY - i * facing; 
            const s = this.evaluateVector( board, x, y );
            if(s.Status != TargetStatus.Open || TargetStatus.Na){
              mobility.SE.push(s);
            }
        }
      }
        
      // Process South-West ==========================================
      mobility.SW=[];
      if(rangeSet.SW > 0){
        for (let i = 1; i <= rangeSet.SW; i++) {  
          if(this.logEnabled){ console.warn(`Range ${rangeSet.SW}`); }
            let x = originX + i * facing;
            let y = originY - i * facing; 
            const s = this.evaluateVector( board, x, y );
            if(s.Status != TargetStatus.Open || TargetStatus.Na){
              mobility.SW.push(s);
            }
        }
      }
          
      // Process Knight ==============================================
      mobility.K=[];
      if(rangeSet.K > 0){
        if(this.logEnabled){ console.warn(`Range ${rangeSet.K}`); }
        
          let targetX = originX + 1 * facing;
          let targetY = originY + 2 * facing;

        if( targetX > 0 && targetX < 10 && targetY > 0 && targetY < 10 ){
          board.Squares.forEach( square => {
            if(square.X == targetX && square.Y == targetY){
              const s = this.evaluateVector( board, targetX, targetY );              
              if(s.Status != TargetStatus.Open || TargetStatus.Na){
                mobility.N.push(s);
              }
            }
          });
        }

        targetX = originX + -1 * facing;
        targetY = originY + 2 * facing;

        if( targetX > 0 && targetX < 10 && targetY > 0 && targetY < 10 ){
          board.Squares.forEach( square => {
            if(square.X == targetX && square.Y == targetY){
              const s = this.evaluateVector( board, targetX, targetY );              
              if(s.Status != TargetStatus.Open || TargetStatus.Na){
                mobility.N.push(s);
              }
            }
          });
        }
      }
      
      return mobility;
    };
  }



import { BoardModel } from "../BoardModel";
import { SquareModel } from "../SquareModel";
import { PieceRange } from "../Pieces/PieceRange";
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
    
    if( square.Piece.VectorSet.N != undefined){
      square.Piece.VectorSet.N.forEach(target => {
        map.push(target);
      });
    }

    return map;
  };


  
  setPieceIsFacing = (player: number, isDefault: boolean): number =>{
    if(isDefault){
      return player == 1 ? -1 : 1;
    }
    return player == 1 ? 1 : -1;
  };

  evaluateVector = ( 
    board: BoardModel, targetX: number, targetY: number, 
  ): TargetSquare[] =>{
    
    let result = [] as TargetSquare[];

    // All coordinate locations are to be between 1 and 9
    // if(target.X < 1 && target.X > 9 && target.Y < 1 && target.Y > 9){
    if(targetX >= 1 && targetX <= 9 && targetY >= 1 && targetY <= 9){
          
      // Find the target square
      board.Squares.forEach( s => {
        if(s.X == targetX && s.Y == targetY){
          

          // Found ally
          if( s.Piece.Player == board.CurrentPlayer ){
            if(this.logEnabled){ console.log(`${targetX}, ${targetY}: Ally`); }
            result.push( new TargetSquare(s.X, s.Y, TargetStatus.Ally ));
          }
          // Found enemy
          if( s.Piece.Player != board.CurrentPlayer && s.Piece.Player != 0 ){
            if(this.logEnabled){ console.log(`${targetX}, ${targetY}: Enemy`); }
            result.push( new TargetSquare(s.X, s.Y, TargetStatus.Enemy ));
          }
          // Found open square
            result.push( new TargetSquare(s.X, s.Y, TargetStatus.Open ));
        }
      });
    }
    return result;

  };

  evaluateVectors = (
    board: BoardModel, originX: number, originY: number, range: PieceRange, facing: number
  ): VectorSet => {

    if(this.logEnabled){ console.warn(`EvaluateVectors ${originX}, ${originY}`); }
    
    let mobility = {} as VectorSet;
    
    // Process North ===============================================
    for (let i = 1; i <= range.N; i++) {
      if(this.logEnabled){ console.warn(`Range ${range.N}`);  }     
        let x = originX;
        let y = originY + i * facing 
      mobility.N = this.evaluateVector( board, x, y );
    }
    
    // Process South ===============================================
    for (let i = 1; i <= range.S; i++) {
      if(this.logEnabled){ console.warn(`Range ${range.S}`); }
        let x = originX;
        let y = originY - i * facing;
      mobility.S = this.evaluateVector( board, x, y );
    }

    // Process East ================================================
    for (let i = 1; i <= range.E; i++) {    
      if(this.logEnabled){ console.warn(`Range ${range.E}`); }
        let x = originX - i * facing;
        let y = originY;
      mobility.E = this.evaluateVector( board, x, y );
    }
      
    // Process West ================================================
    for (let i = 1; i <= range.W; i++) { 
      if(this.logEnabled){ console.warn(`Range ${range.W}`); }
        let x = originX + i * facing;
        let y = originY;
      mobility.W = this.evaluateVector( board, x, y );
    }
      
    // Process North-West ==========================================
    for (let i = 1; i <= range.NW; i++) {  
      if(this.logEnabled){ console.warn(`Range ${range.NW}`); }
        let x = originX + i * facing;
        let y = originY + i * facing;
      mobility.NW = this.evaluateVector( board, x, y );
    }
      
    // Process North-East ==========================================
    for (let i = 1; i <= range.NE; i++) {    
      if(this.logEnabled){ console.warn(`Range ${range.NE}`); }
        let x = originX - i * facing;
        let y = originY + i * facing;
      mobility.NE = this.evaluateVector( board, x, y );
    }
      
    // Process South-East =========================================
    for (let i = 1; i <= range.SE; i++) {   
      if(this.logEnabled){ console.warn(`Range ${range.SE}`); }
        let x = originX - i * facing;
        let y = originY - i * facing; 
      mobility.SE = this.evaluateVector( board, x, y );
    }
      
    // Process South-West ==========================================
    for (let i = 1; i <= range.SW; i++) {  
      if(this.logEnabled){ console.warn(`Range ${range.SW}`); }
        let x = originX + i * facing;
        let y = originY - i * facing; 
      mobility.SW = this.evaluateVector( board, x, y );
    }
      
    // Process Knight ==============================================
    if(range.K){
      if(this.logEnabled){ console.warn(`Range ${range.K}`); }
      
        let targetX = originX + 1 * facing;
        let targetY = originY + 2 * facing;

      if( targetX > 0 && targetX < 10 && targetY > 0 && targetY < 10 ){
        board.Squares.forEach( s => {
          if(s.X == targetX && s.Y == targetY)
            mobility.K = this.evaluateVector( board, targetX, targetY );
        });
      }

      targetX = originX + -1 * facing;
      targetY = originY + 2 * facing;

      if( targetX > 0 && targetX < 10 && targetY > 0 && targetY < 10 ){
        board.Squares.forEach( s => {
          if(s.X == targetX && s.Y == targetY)
            mobility.K = this.evaluateVector( board, targetX, targetY );
        });
      }
    }

    return mobility;
  };


}

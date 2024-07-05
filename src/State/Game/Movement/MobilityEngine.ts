import { Coordinate } from "./Coordinate";
import { BoardModel } from "../BoardModel";
import { SquareModel } from "../SquareModel";
import { PieceRange } from "../Pieces/PieceRange";
import { TargetSquare } from "./TargetSquare";
import { TargetStatus } from "./TargetStatus";
import { VectorSet } from "./VectorSet";

export class MobilityEngine {
  
  Rebuild = ( player: number, board: BoardModel ): SquareModel[] =>{
    console.error(`MobilityEngine.Rebuild()`);

    // First iterations establishes all possible move range and tracks obstacles.
    board.Squares.forEach( square => {
      if(square.Piece.Player != 0){
        square.Piece.VectorSet = this.evaluateVectors(
          player,
          board, 
          { X: square.Coordinate.X, Y: square.Coordinate.Y } as Coordinate,
          square.Piece.Range,
          this.setPieceIsFacing(square.Piece.Player, square.Piece.IsFacingDefault)
        )
      }      
    });
    return board.Squares;
  };
    
  setPieceIsFacing = (player: number, isDefault: boolean): number =>{
    if(isDefault){
      return player == 1 ? -1 : 1;
    }
    return player == 1 ? 1 : -1;
  };

  evaluateVector = ( 
    player: number, board: BoardModel, target: Coordinate 
  ): TargetSquare[] =>{
    
    let result = [] as TargetSquare[];

    // All coordinate locations are to be between 1 and 9
    // if(target.X < 1 && target.X > 9 && target.Y < 1 && target.Y > 9){
    if(target.X >= 1 && target.X <= 9 && target.Y >= 1 && target.Y <= 9){
          
      // Find the target square
      board.Squares.forEach( s => {
        if(s.Coordinate.X == target.X && s.Coordinate.Y == target.Y){
          

          // Found ally
          if( s.Piece.Player == player ){
            console.log(`${target.X}, ${target.Y}: Ally`);
            result.push( new TargetSquare(s.Coordinate.X, s.Coordinate.Y, TargetStatus.Ally ));
          }
          // Found enemy
          if( s.Piece.Player != player && s.Piece.Player != 0 ){
            console.log(`${target.X}, ${target.Y}: Enemy`);
            result.push( new TargetSquare(s.Coordinate.X, s.Coordinate.Y, TargetStatus.Enemy ));
          }
          // Found open square
            result.push( new TargetSquare(s.Coordinate.X, s.Coordinate.Y, TargetStatus.Open ));
        }
      });
    }
    return result;

  };

  evaluateVectors = (
    player: number, board: BoardModel, origin: Coordinate, range: PieceRange, facing: number
  ): VectorSet => {

    console.warn(`EvaluateVectors ${origin.X}, ${origin.Y}`);
    
    let mobility = {} as VectorSet;
    
    // Process North ===============================================
    for (let i = 1; i <= range.N; i++) {
      console.warn(`Range ${range.N}`);
      let target = { 
        X: origin.X ,
        Y: origin.Y + i * facing  
      } as Coordinate;
      mobility.N = this.evaluateVector( player, board, target );
    }
    
    // Process South ===============================================
    for (let i = 1; i <= range.S; i++) {
      console.warn(`Range ${range.S}`);
      let target = { 
        X: origin.X ,
        Y: origin.Y - i * facing
      } as Coordinate;
      mobility.S = this.evaluateVector( player, board, target );
    }

    // Process East ================================================
    for (let i = 1; i <= range.E; i++) {    
      console.warn(`Range ${range.E}`);  
      let target = { 
        X: origin.X - i * facing ,
        Y: origin.Y
      } as Coordinate;
      mobility.E = this.evaluateVector( player, board, target );
    }
      
    // Process West ================================================
    for (let i = 1; i <= range.W; i++) { 
      console.warn(`Range ${range.W}`);     
      let target = { 
        X: origin.X + i * facing ,
        Y: origin.Y
      } as Coordinate;
      mobility.W = this.evaluateVector( player, board, target );
    }
      
    // Process North-West ==========================================
    for (let i = 1; i <= range.NW; i++) {  
      console.warn(`Range ${range.NW}`);    
      let target = { 
        X: origin.X + i * facing ,
        Y: origin.Y + i * facing 
      } as Coordinate;
      mobility.NW = this.evaluateVector( player, board, target );
    }
      
    // Process North-East ==========================================
    for (let i = 1; i <= range.NE; i++) {    
      console.warn(`Range ${range.NE}`);  
      let target = { 
        X: origin.X - i * facing ,
        Y: origin.Y + i * facing 
      } as Coordinate;
      mobility.NE = this.evaluateVector( player, board, target );
    }
      
    // Process South-East =========================================
    for (let i = 1; i <= range.SE; i++) {   
      console.warn(`Range ${range.SE}`);   
      let target = { 
        X: origin.X - i * facing ,
        Y: origin.Y - i * facing 
      } as Coordinate;
      mobility.SE = this.evaluateVector( player, board, target );
    }
      
    // Process South-West ==========================================
    for (let i = 1; i <= range.SW; i++) {  
      console.warn(`Range ${range.SW}`);    
      let target = { 
        X: origin.X + i * facing ,
        Y: origin.Y - i * facing 
      } as Coordinate;
      mobility.SW = this.evaluateVector( player, board, target );
    }
      
    // Process Knight ==============================================
    if(range.K){
      console.warn(`Range ${range.K}`);
      let target = { 
        X: origin.X + 1 * facing,
        Y: origin.Y + 2 * facing
      } as Coordinate;

      if(target.X > 0 && target.X < 10 && target.Y > 0 && target.Y < 10){
        board.Squares.forEach( s => {
          if(s.Coordinate.X == target.X && s.Coordinate.Y == target.Y)
            mobility.K = this.evaluateVector( player, board, target );
        });
      }

      target = { 
        X: origin.X + -1 * facing,
        Y: origin.Y + 2 * facing
      } as Coordinate;

      if(target.X > 0 && target.X < 10 && target.Y > 0 && target.Y < 10){
        board.Squares.forEach( s => {
          if(s.Coordinate.X == target.X && s.Coordinate.Y == target.Y)
            mobility.K = this.evaluateVector( player, board, target );
        });
      }
    }

    return mobility;
  };


}

import { Coordinate } from "./Coordinate";
import { BoardModel } from "../BoardModel";
import { SquareModel } from "../SquareModel";
import { PieceRange } from "../Pieces/PieceRange";
import { PieceMobility } from "../Pieces/PieceMobility";
import { MoveStatus } from "./MoveStatus";

export class MobilityEngine {
  
  rebuild = async ( player: number, board: BoardModel ): Promise<BoardModel> =>{

    let squares = [] as SquareModel[];

    // First iterations establishes all possible moves, and tracks obstacles.
    board.Squares.forEach( async square => {
      if(square.Piece.Player != 0){
        square.Piece.Mobility = await this.evaluateVectors(
          player,
          board, 
          { X: square.Coordinate.X, Y: square.Coordinate.Y } as Coordinate,
          square.Piece.Range,
          this.setPieceIsFacing(square.Piece.Player, square.Piece.IsFacingDefault)
        )
      }      
    });

    let result = {
      Id: board.Id,
      CurrentPlayer: board.CurrentPlayer,
      Squares: squares
    } as BoardModel;
    
    return result;
  };
    
  setPieceIsFacing = (player: number, isDefault: boolean): number =>{
    if(isDefault){
      return player == 1 ? -1 : 1;
    }
    return player == 1 ? 1 : -1;
  };

  evaluateVector = async ( 
    player: number, board: BoardModel, target: Coordinate 
  ): Promise<PieceMobility> =>{
    
    // All coordinate locations are to be between 1 and 9
    // if(target.X < 1 && target.X > 9 && target.Y < 1 && target.Y > 9){
    if(target.X >= 1 && target.X <= 9 && target.Y >= 1 && target.Y <= 9){
          
      // Find the target square
      board.Squares.forEach( s => {
        if(s.Coordinate.X == target.X && s.Coordinate.Y == target.Y){
          
          // Found ally
          if( s.Piece.Player == player ){
            // console.warn(`Hit Ally @ ${s.Id} (${target.X}:${target.Y})`);
            return new PieceMobility(s.Coordinate.X, s.Coordinate.Y, MoveStatus.Ally);
          }
          // Found enemy
          if( s.Piece.Player != player && s.Piece.Player != 0 ){
            // console.warn(`Hit Enemy @ ${s.Id} (${target.X}:${target.Y})`);
            return new PieceMobility(s.Coordinate.X, s.Coordinate.Y, MoveStatus.Enemy);
          }
          // Found open square
          return new PieceMobility(s.Coordinate.X, s.Coordinate.Y, MoveStatus.Open);
        }
      });
    }    
    // console.warn(`Hit off the map @ ${target.X}:${target.Y}... return 8`);
    return new PieceMobility(0, 0, MoveStatus.OutOfRange);

  };

  evaluateVectors = async (
    player: number, board: BoardModel, origin: Coordinate, range: PieceRange, facing: number
  ): Promise<PieceMobility[]> => {

    let mobility = [] as PieceMobility[];
    
    // Process North ===============================================
    for (let i = 1; i <= range.N; i++) {      
      let target = { 
        X: origin.X ,
        Y: origin.Y + i * facing  
      } as Coordinate;
      mobility.push(await this.evaluateVector( player, board, target ));
    }
    
    // Process South ===============================================
    for (let i = 1; i <= range.S; i++) {      
      let target = { 
        X: origin.X ,
        Y: origin.Y - i * facing
      } as Coordinate;
      mobility.push(await this.evaluateVector( player, board, target ));
    }

    // Process East ================================================
    for (let i = 1; i <= range.E; i++) {      
      let target = { 
        X: origin.X - i * facing ,
        Y: origin.Y
      } as Coordinate;
      mobility.push(await this.evaluateVector( player, board, target ));
    }
      
    // Process West ================================================
    for (let i = 1; i <= range.W; i++) {      
      let target = { 
        X: origin.X + i * facing ,
        Y: origin.Y
      } as Coordinate;
      mobility.push(await this.evaluateVector( player, board, target ));
    }
      
    // Process North-West ==========================================
    for (let i = 1; i <= range.NW; i++) {      
      let target = { 
        X: origin.X + i * facing ,
        Y: origin.Y + i * facing 
      } as Coordinate;
      mobility.push(await this.evaluateVector( player, board, target ));
    }
      
    // Process North-East ==========================================
    for (let i = 1; i <= range.NE; i++) {      
      let target = { 
        X: origin.X - i * facing ,
        Y: origin.Y + i * facing 
      } as Coordinate;
      mobility.push(await this.evaluateVector( player, board, target ));
    }
      
    // Process South-East =========================================
    for (let i = 1; i <= range.SE; i++) {      
      let target = { 
        X: origin.X - i * facing ,
        Y: origin.Y - i * facing 
      } as Coordinate;
      mobility.push(await this.evaluateVector( player, board, target ));
    }
      
    // Process South-West ==========================================
    for (let i = 1; i <= range.SW; i++) {      
      let target = { 
        X: origin.X + i * facing ,
        Y: origin.Y - i * facing 
      } as Coordinate;
      mobility.push(await this.evaluateVector( player, board, target ));
    }
      
    // Process Knight ==============================================
    if(range.K){
      let target = { 
        X: origin.X + 1 * facing,
        Y: origin.Y + 2 * facing
      } as Coordinate;

      if(target.X > 0 && target.X < 10 && target.Y > 0 && target.Y < 10){
        board.Squares.forEach( async s => {
          if(s.Coordinate.X == target.X && s.Coordinate.Y == target.Y)
            mobility.push(await this.evaluateVector( player, board, target ));
        });
      }

      target = { 
        X: origin.X + -1 * facing,
        Y: origin.Y + 2 * facing
      } as Coordinate;

      if(target.X > 0 && target.X < 10 && target.Y > 0 && target.Y < 10){
        board.Squares.forEach( async s => {
          if(s.Coordinate.X == target.X && s.Coordinate.Y == target.Y)
            mobility.push(await this.evaluateVector( player, board, target ));
        });
      }
    }
    return mobility;
  };


}

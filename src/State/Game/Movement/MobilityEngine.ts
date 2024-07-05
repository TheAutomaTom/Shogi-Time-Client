import { Coordinate } from "./Coordinate";
import { BoardModel } from "../BoardModel";
import { SquareModel } from "../SquareModel";
import { GamePieceModel } from "../Pieces/PieceModel";
import { PieceRange } from "../Pieces/PieceRange";

export class MobilityEngine {
  
  rebuild =( input: BoardModel ): BoardModel =>{

    let squares = [] as SquareModel[];

    // First iterations establishes all possible moves, and tracks obstacles.
    input.Squares.forEach( square => {
      if(square.Piece.Player != 0){
        


      }
      
    });


    let result = {
      Id: input.Id,
      CurrentPlayer: input.CurrentPlayer,
      Squares: squares
    } as BoardModel;
    
    return result;

  };

  
  evaluateRangeOfMovement = async (
    board: BoardModel, origin: Coordinate, rangeOfMovement: PieceRange, facing: number
  ): Promise<SquareModel[]> => {
    
    // Process North ===============================================
    let hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.N; i++) {
      
      let target = { 
        X: origin.X ,
        Y: origin.Y + i * facing  
      } as Coordinate;
      hitObstacle = validateMoveCoordinate(target);
    }
    
    // Process South ===============================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.S; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: origin.X ,
        Y: origin.Y - i * facing
      } as Coordinate;
      hitObstacle = validateMoveCoordinate(target);
    }

    // Process East ================================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.E; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: origin.X - i * facing ,
        Y: origin.Y
      } as Coordinate;
      hitObstacle = validateMoveCoordinate(target);
    }
    
    // Process West ================================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.W; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: origin.X + i * facing ,
        Y: origin.Y

      } as Coordinate;
      hitObstacle = validateMoveCoordinate(target);
    }

    // Process North-West ==========================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.NW; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: origin.X + i * facing ,
        Y: origin.Y + i * facing 

      } as Coordinate;
      hitObstacle = validateMoveCoordinate(target);
    }

    // Process North-East ==========================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.NE; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: origin.X - i * facing ,
        Y: origin.Y + i * facing 

      } as Coordinate;
      hitObstacle = validateMoveCoordinate(target);
    }

    // Process South-East =========================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.SE; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: origin.X - i * facing ,
        Y: origin.Y - i * facing 

      } as Coordinate;
      hitObstacle = validateMoveCoordinate(target);
    }

    // Process South-West ==========================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.SW; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: origin.X + i * facing ,
        Y: origin.Y - i * facing 

      } as Coordinate;
      hitObstacle = validateMoveCoordinate(target);
    }

    // Process Knight ==============================================
    if(rangeOfMovement.K){
      let target = { 
        X: origin.X + 1 * facing,
        Y: origin.Y + 2 * facing
      } as Coordinate;

      if(target.X > 0 && target.X < 10 && target.Y > 0 && target.Y < 10){
        board.Squares.forEach( s => {
          if(s.X == target.X && s.Y == target.Y)
            PotentialDestinations.value.push(s.Id);
        });
      }

      target = { 
        X: origin.X + -1 * facing,
        Y: origin.Y + 2 * facing
      } as Coordinate;

      if(target.X > 0 && target.X < 10 && target.Y > 0 && target.Y < 10){
        board.Squares.forEach( s => {
          if(s.X == target.X && s.Y == target.Y)
            PotentialDestinations.value.push(s.Id);
        });
      }
    }
  };

  validateMoveCoordinate = async ( player: number, board: BoardModel, target: Coordinate ): Promise<SquareModel[]> =>{
    let hit = 0;
    // All coordinate locations are to be between 1 and 9
    if(target.X < 1 && target.X > 9 && target.Y < 1 && target.Y > 9){
      // console.warn(`Hit off the map @ ${target.X}:${target.Y}... return 8`);
      return 8;
    }
    // Find the target square
    board.Squares.forEach( s => {
      if(s.X == target.X && s.Y == target.Y){

        // Found ally
        if( s.Piece.Player == player ){
          // console.warn(`Hit Ally @ ${s.Id} (${target.X}:${target.Y})... return 1`);
          hit++;
        }

        // Found enemy (only add first found)
        else if( hit == 0 
          && s.Piece.Player > 0 && s.Piece.Player != player ){

            PotentialDestinations.value.push(s.Id);
            // console.warn(`Hit Enemy@ ${s.Id} (${target.X}:${target.Y})... return 1`);
            hit++;
        }

        // Found empty space
        else if(s.Piece.Player == 0){
          PotentialDestinations.value.push(s.Id);
        }
      }
    });    
    return hit;
  };



}

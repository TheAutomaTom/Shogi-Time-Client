import {  
  GameBoardModel,
  GameSquareModel,
  GamePieceModel
} from "../Models/Game";
import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import { DefaultNewGameLayout } from "@/State/Game/DefaultNewGameLayout";
import { GameMode } from "./Game/GameMode";
import { Coordinate, MovementRule } from './Game/LegalMoves';

export const useGameState = defineStore("GameState", () => {
  
  const GameBoardModel = ref({  Id:"111-zzz",
                                Squares: new DefaultNewGameLayout().Squares
                             } as GameBoardModel);

  const Mode = ref(GameMode.TurnStart);
  const CurrentPlayer = ref(1);
  const PieceToBeMoved = ref({} as (GamePieceModel | null));
  const SquareStartingFrom = ref({} as GameSquareModel);
  const SquareMovesPotential = ref([""] as string[]);

  //== Movement: Start =====================================================
  const MoveStart = async  (piece: GamePieceModel) => {
    
    Mode.value = GameMode.MoveStart;
    
    // Bookmark the piece in focus.
    PieceToBeMoved.value = piece;   

    // Find the starting square based on the id of the piece it contains.
    GameBoardModel.value.Squares.forEach( square => {
      if(square.Piece.Id == piece.Id){
        SquareStartingFrom.value = square;
      }
    });

    // Highlight potential move squares
    SquareMovesPotential.value = [""]; // reset prior
    const rangeOfMovement = (new MovementRule(piece.Type)).Mobility;
    const facing = setPieceIsFacing(piece.IsFacingDefault);

    // Process North ===============================================
    let hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.N; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: SquareStartingFrom.value.X ,
        Y: SquareStartingFrom.value.Y + i * facing

      } as Coordinate;
      hitObstacle = validateMovement(target);
    }
    
    // Process South ===============================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.S; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: SquareStartingFrom.value.X ,
        Y: SquareStartingFrom.value.Y - i * facing

      } as Coordinate;
      hitObstacle = validateMovement(target);
    }

    // Process East ================================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.E; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: SquareStartingFrom.value.X - i * facing ,
        Y: SquareStartingFrom.value.Y

      } as Coordinate;
      hitObstacle = validateMovement(target);
    }
    
    // Process West ================================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.W; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: SquareStartingFrom.value.X + i * facing ,
        Y: SquareStartingFrom.value.Y

      } as Coordinate;
      hitObstacle = validateMovement(target);
    }

    // Process North-West ==========================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.NW; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: SquareStartingFrom.value.X + i * facing ,
        Y: SquareStartingFrom.value.Y + i * facing 

      } as Coordinate;
      hitObstacle = validateMovement(target);
    }

    // Process North-East ==========================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.NE; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: SquareStartingFrom.value.X - i * facing ,
        Y: SquareStartingFrom.value.Y + i * facing 

      } as Coordinate;
      hitObstacle = validateMovement(target);
    }

    // Process South-East =========================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.SE; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: SquareStartingFrom.value.X - i * facing ,
        Y: SquareStartingFrom.value.Y - i * facing 

      } as Coordinate;
      hitObstacle = validateMovement(target);
    }

    // Process South-West ==========================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.SW; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: SquareStartingFrom.value.X + i * facing ,
        Y: SquareStartingFrom.value.Y - i * facing 

      } as Coordinate;
      hitObstacle = validateMovement(target);
    }

    // Process Knight ==============================================
    if(rangeOfMovement.K){
      let target = { 
        X: SquareStartingFrom.value.X + 1 * facing,
        Y: SquareStartingFrom.value.Y + 2 * facing
      } as Coordinate;

      if(target.X > 0 && target.X < 10 && target.Y > 0 && target.Y < 10){
        GameBoardModel.value.Squares.forEach( s => {
          if(s.X == target.X && s.Y == target.Y)
            SquareMovesPotential.value.push(s.Id);
        });
      }

      target = { 
        X: SquareStartingFrom.value.X + -1 * facing,
        Y: SquareStartingFrom.value.Y + 2 * facing
      } as Coordinate;

      if(target.X > 0 && target.X < 10 && target.Y > 0 && target.Y < 10){
        GameBoardModel.value.Squares.forEach( s => {
          if(s.X == target.X && s.Y == target.Y)
            SquareMovesPotential.value.push(s.Id);
        });
      }      
    }

  };


  const setPieceIsFacing = (pieceIsFacingDefault: boolean) =>{

    if(pieceIsFacingDefault){
      return CurrentPlayer.value == 1 ? -1 : 1;
    }
    return CurrentPlayer.value == 1 ? 1 : -1;
  }


  //== Movement: Move ======================================================
  const TryMove = async (square: GameSquareModel)=>{    

    GameBoardModel.value.Squares.map( s =>{
      // Find the square that was clicked and check if it's in the rules
      if(s.Id == square.Id && SquareMovesPotential.value.includes(square.Id)){
      

        // Create the new piece in that spot
        s.Piece = new GamePieceModel(CurrentPlayer.value, PieceToBeMoved.value!.Type, getStartPositionFromId(PieceToBeMoved.value!.Id), PieceToBeMoved.value!.Icon);

        // Replace old spots with empty pieces
        PieceToBeMoved.value = new GamePieceModel( );
        SquareStartingFrom.value.Piece = new GamePieceModel( );
        
        SquareMovesPotential.value = [""];
        Mode.value = GameMode.TurnStart;

      }
    });
  }

  //== Ancillary ===========================================================
  const getStartPositionFromId=(id: string): string =>{
    const start = id.lastIndexOf("-")
    const result = id.substring(start +1);
    return result;

  };

  const validateMovement = (target: Coordinate):number =>{
    let hit = 0;
    // All coordinate locations are to be between 1 and 9
    if(target.X < 1 && target.X > 9 && target.Y < 1 && target.Y > 9){
      console.warn(`Hit off the map @ ${target.X}:${target.Y}... return 8`);
      return 8;
    }
    // Find the target square
    GameBoardModel.value.Squares.forEach( s => {      
      if(s.X == target.X && s.Y == target.Y){                  
        // Found ally
        if( s.Piece.Player == CurrentPlayer.value ){
          console.warn(`Hit Ally @ ${s.Id} (${target.X}:${target.Y})... return 1`);
          hit++;
        }        
        // Found enemy (only add first found)
        else if( hit == 0 
          && s.Piece.Player > 0 && s.Piece.Player != CurrentPlayer.value ){
            SquareMovesPotential.value.push(s.Id);
            console.warn(`Hit Enemy@ ${s.Id} (${target.X}:${target.Y})... return 1`);
            hit++;
        }
        // Found empty space
        else if(s.Piece.Player == 0){
          SquareMovesPotential.value.push(s.Id);
            
        }
      }      
    });
    
    return hit;
  }
  

  
  return {
    GameBoardModel,
    CurrentPlayer,
    Mode,    
    PieceToBeMoved,
    SquareStartingFrom,
    MoveStart,
    TryMove,
    SquareMovesPotential

  };
});

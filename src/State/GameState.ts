import {  
  GameBoardModel,
  GameSquareModel,
  GamePieceModel
} from "../Models/Game";
import { ref } from "vue";
import { defineStore } from "pinia";
import { DefaultNewGameLayout } from "@/State/Game/DefaultNewGameLayout";
import { GameMode } from "./Game/GameMode";
import { Coordinate, MovementRule } from './Game/LegalMoves';

export const useGameState = defineStore("GameState", () => {
  
  const GameBoardModel = ref({  Id:"111-zzz",
                                CurrentPlayer:1,
                                Squares: new DefaultNewGameLayout().Squares
                             } as GameBoardModel);

  const Mode = ref(GameMode.TurnStart);
  const CurrentPlayer = ref(GameBoardModel.value.CurrentPlayer);
  const MovingPiece = ref({} as (GamePieceModel));
  const MoveOrigin = ref({} as GameSquareModel);
  const PotentialDestinations = ref([""] as string[]);
  const DestinationId = ref("");

  const CapturesP1 = ref([] as GamePieceModel[]);
  const CapturesP2 = ref([] as GamePieceModel[]);

  //== Movement: Start =====================================================
  const MoveBegin = async  (piece: GamePieceModel) => {
    
    Mode.value = GameMode.MoveBegin;
    
    // Bookmark the piece in focus.
    MovingPiece.value = piece;   

    // Find the starting square based on the id of the piece it contains.
    GameBoardModel.value.Squares.forEach( square => {
      if(square.Piece.Id == piece.Id){
        MoveOrigin.value = square;
      }
    });

    // Highlight potential move squares
    PotentialDestinations.value = [""]; // reset prior
    const rangeOfMovement = (new MovementRule(piece.Type)).Mobility;
    const facing = setPieceIsFacing(piece.IsFacingDefault);

    // Process North ===============================================
    let hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.N; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: MoveOrigin.value.X ,
        Y: MoveOrigin.value.Y + i * facing

      } as Coordinate;
      hitObstacle = findValidMoves(target);
    }
    
    // Process South ===============================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.S; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: MoveOrigin.value.X ,
        Y: MoveOrigin.value.Y - i * facing

      } as Coordinate;
      hitObstacle = findValidMoves(target);
    }

    // Process East ================================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.E; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: MoveOrigin.value.X - i * facing ,
        Y: MoveOrigin.value.Y

      } as Coordinate;
      hitObstacle = findValidMoves(target);
    }
    
    // Process West ================================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.W; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: MoveOrigin.value.X + i * facing ,
        Y: MoveOrigin.value.Y

      } as Coordinate;
      hitObstacle = findValidMoves(target);
    }

    // Process North-West ==========================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.NW; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: MoveOrigin.value.X + i * facing ,
        Y: MoveOrigin.value.Y + i * facing 

      } as Coordinate;
      hitObstacle = findValidMoves(target);
    }

    // Process North-East ==========================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.NE; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: MoveOrigin.value.X - i * facing ,
        Y: MoveOrigin.value.Y + i * facing 

      } as Coordinate;
      hitObstacle = findValidMoves(target);
    }

    // Process South-East =========================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.SE; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: MoveOrigin.value.X - i * facing ,
        Y: MoveOrigin.value.Y - i * facing 

      } as Coordinate;
      hitObstacle = findValidMoves(target);
    }

    // Process South-West ==========================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.SW; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: MoveOrigin.value.X + i * facing ,
        Y: MoveOrigin.value.Y - i * facing 

      } as Coordinate;
      hitObstacle = findValidMoves(target);
    }

    // Process Knight ==============================================
    if(rangeOfMovement.K){
      let target = { 
        X: MoveOrigin.value.X + 1 * facing,
        Y: MoveOrigin.value.Y + 2 * facing
      } as Coordinate;

      if(target.X > 0 && target.X < 10 && target.Y > 0 && target.Y < 10){
        GameBoardModel.value.Squares.forEach( s => {
          if(s.X == target.X && s.Y == target.Y)
            PotentialDestinations.value.push(s.Id);
        });
      }

      target = { 
        X: MoveOrigin.value.X + -1 * facing,
        Y: MoveOrigin.value.Y + 2 * facing
      } as Coordinate;

      if(target.X > 0 && target.X < 10 && target.Y > 0 && target.Y < 10){
        GameBoardModel.value.Squares.forEach( s => {
          if(s.X == target.X && s.Y == target.Y)
            PotentialDestinations.value.push(s.Id);
        });
      }      
    }

  };



  //== Movement: Move ======================================================
  const MoveAttempt = async (square: GameSquareModel)=>{    

    GameBoardModel.value.Squares.map( s =>{

      // Find the square that was clicked and check if it's in the movement rules.
      if(s.Id == square.Id && PotentialDestinations.value.includes(square.Id)){      

        // If a piece exists there, move it to the in-hand box.
        if(s.Piece.Player != 0){
          if(CurrentPlayer.value == 1){
            CapturesP1.value.push(
              new GamePieceModel(
                s.Piece.Player, s.Piece.Type, getStartPositionFromId(s.Piece.Id),s.Piece.Icon
              ));
      
          }
          if(CurrentPlayer.value == 2){
            CapturesP2.value.push(
              new GamePieceModel(
                s.Piece.Player, s.Piece.Type, getStartPositionFromId(s.Piece.Id),s.Piece.Icon
              ));
          }
        }

        // Create the moved piece in that spot.
        s.Piece = new GamePieceModel(CurrentPlayer.value, MovingPiece.value!.Type, getStartPositionFromId(MovingPiece.value!.Id), MovingPiece.value!.Icon);

        // Replace origin with empty piece.
        DestinationId.value = s.Id;
        
      }
    });

    CompleteMove();
  };
  

  //== Ancillary ===========================================================

  // Note: CompleteMove can be called by PromoteModal
  const CompleteMove =()=> {
    MovingPiece.value = new GamePieceModel( );
    MoveOrigin.value.Piece = new GamePieceModel( );
    PotentialDestinations.value = [""];

    if(CurrentPlayer.value == 1){
      CurrentPlayer.value = 2;
    } else {
      CurrentPlayer.value = 1;
    }
    Mode.value = GameMode.TurnStart;
  };

  const getStartPositionFromId=(id: string): string =>{
    const start = id.lastIndexOf("-")
    const result = id.substring(start +1);
    return result;

  };

  const findValidMoves = (target: Coordinate):number =>{
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
            PotentialDestinations.value.push(s.Id);
            console.warn(`Hit Enemy@ ${s.Id} (${target.X}:${target.Y})... return 1`);
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

  const setPieceIsFacing = (pieceIsFacingDefault: boolean) =>{

    if(pieceIsFacingDefault){
      return CurrentPlayer.value == 1 ? -1 : 1;
    }
    return CurrentPlayer.value == 1 ? 1 : -1;
  };
  

  
  return {
    GameBoardModel,
    CurrentPlayer,
    Mode,    
    MovingPiece,
    MoveOrigin,
    MoveBegin,
    MoveAttempt,
    PotentialDestinations,
    DestinationId,
    CapturesP1,
    CapturesP2

  };
});

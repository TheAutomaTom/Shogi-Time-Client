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
                                Squares: new DefaultNewGameLayout().Squares
                             } as GameBoardModel);

  const Mode = ref(GameMode.TurnStart);
  const PlayerTurn = ref(1);
  const PieceToBeMoved = ref({} as (GamePieceModel | null));
  const SquareStartingFrom = ref({} as GameSquareModel);
  const SquareMovesPotential = ref([] as string[]);

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
    SquareMovesPotential.value = []; // reset prior
    const rangeOfMovement = (new MovementRule(piece.Type)).Mobility;
    let target = { 
      X: SquareStartingFrom.value.X ,
      Y: SquareStartingFrom.value.Y + rangeOfMovement.N
    } as Coordinate;

    if(target.X > 0 && target.X < 10 && target.Y > 0 && target.Y < 10){
      GameBoardModel.value.Squares.forEach( s => {
        if(s.X == target.X && s.Y == target.Y)
          SquareMovesPotential.value.push(s.Id);
      });

    }    
  };


  //== Movement: Move ======================================================
  const TryMove = async (square: GameSquareModel)=>{    

    GameBoardModel.value.Squares.map( s =>{
      // Find the square that was clicked...
      if(s.Id == square.Id){

        // Create the new piece in that spot
        s.Piece = new GamePieceModel(PlayerTurn.value, PieceToBeMoved.value!.Type, getStartPositionFromId(PieceToBeMoved.value!.Id), PieceToBeMoved.value!.Icon);

        // Replace old spots with empty pieces
        PieceToBeMoved.value = new GamePieceModel( );
        SquareStartingFrom.value.Piece = new GamePieceModel( );

      }
    });
    Mode.value = GameMode.TurnStart;
  }

  //== Ancillary ===========================================================
  const getStartPositionFromId=(id: string): string =>{
    const start = id.lastIndexOf("-")
    const result = id.substring(start +1);
    console.log(`StartPos: ${result}`)
    return result;

  };

  

  
  return {
    GameBoardModel,
    PlayerTurn,
    Mode,    
    PieceToBeMoved,
    SquareStartingFrom,
    MoveStart,
    TryMove,
    SquareMovesPotential

  };
});

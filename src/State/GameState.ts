import {  
  GameBoardModel,
  GameSquareModel,
  GamePieceModel
} from "../Models/Game";
import { ref } from "vue";
import { defineStore } from "pinia";
import { DefaultNewGameLayout } from "@/State/Game/DefaultNewGameLayout";
import { GameMode } from "./Game/GameMode";

export const useGameState = defineStore("GameState", () => {
  
  const GameBoardModel = ref({  Id:"111-zzz",
                                Squares: new DefaultNewGameLayout().Squares
                             } as GameBoardModel);

  const Mode = ref(GameMode.TurnStart);
  const PlayerTurn = ref(1);
  const PieceMoveStart = ref({} as (GamePieceModel | null));
  const SquareMoveStart = ref({} as GameSquareModel);
  const SquareMovesPotential = ref([] as GameSquareModel[]);

  //== Movement ============================================================
  const MoveStart = async  (piece: GamePieceModel) => {
    console.log(`2.MoveStart( piece.Id:${piece.Id})`);
    Mode.value = GameMode.MoveStart;
    
    PieceMoveStart.value = piece;
    console.log(`2B.PieceMoveStart=( ${PieceMoveStart.value.Id})`);

    GameBoardModel.value.Squares.forEach( square => {
      if(square.Piece.Id == piece.Id){
        SquareMoveStart.value = square;
      }
    });
    
  };

  const TryMove = async (square: GameSquareModel)=>{    

    GameBoardModel.value.Squares.map( s =>{
      // Find the square that was clicked...
      if(s.Id == square.Id){

        // Create the new piece in that spot
        const startingPosBegins = PieceMoveStart.value!.Id.indexOf("-")
        const startingPos = PieceMoveStart.value!.Id.substring(startingPosBegins +1);
        s.Piece = new GamePieceModel(PlayerTurn.value, PieceMoveStart.value!.Type, startingPos, PieceMoveStart.value!.Icon);

        // Put empty pieces in the old spot
        PieceMoveStart.value = new GamePieceModel( );
        SquareMoveStart.value.Piece = new GamePieceModel( );

      }
    });
    Mode.value = GameMode.TurnStart;

  }

  
  return {
    GameBoardModel,
    PlayerTurn,
    Mode,    
    PieceMoveStart,
    SquareMoveStart,
    MoveStart,
    TryMove,
    SquareMovesPotential

  };
});

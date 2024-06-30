import { GamePieceType } from '@/Models/Game';
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

  const getLegalMoves = (type: GamePieceType, player:number, x: number, y: number) =>{
    

  }

  const TryMove = async (square: GameSquareModel)=>{    

    GameBoardModel.value.Squares.map( s =>{
      // Find the square that was clicked...
      if(s.Id == square.Id){

        // Create the new piece in that spot
        s.Piece = new GamePieceModel(PlayerTurn.value, PieceMoveStart.value!.Type, getStartPositionFromId(PieceMoveStart.value!.Id), PieceMoveStart.value!.Icon);

        // Replace old spots with empty pieces
        PieceMoveStart.value = new GamePieceModel( );
        SquareMoveStart.value.Piece = new GamePieceModel( );

      }
    });
    Mode.value = GameMode.TurnStart;
  }

  //== Ancillary ===========================================================
  const getStartPositionFromId=(id: string): string =>{
    const begins = id.indexOf("-")
    return id.substring(begins +1);

  };

  
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

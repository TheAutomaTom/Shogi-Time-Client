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
  const PieceMoveStart = ref({} as (GamePieceModel));
  const SquareMoveStart = ref({} as GameSquareModel);
  const SquareMovesPotential = ref([] as GameSquareModel[]);

  //== Movement ============================================================
  const MoveStart = async  (piece: GamePieceModel) => {
    console.log(`2.MoveStart( piece.Id:${piece.Id})`);
    Mode.value = GameMode.MoveStart;
    
    PieceMoveStart.value = piece;
    console.log(`2B.PieceMoveStart=( ${PieceMoveStart.value.Id})`);

    GameBoardModel.value.Squares.forEach( square => {
      if(square.Piece?.Id == piece.Id){
        SquareMoveStart.value = square;
      }
    });
    
  };

  const TryMove = async (square: GameSquareModel)=>{
    GameBoardModel.value.Squares.map( s =>{
      if(s.Id == square.Id){

        console.log(`4A.PieceMoveStart.value.Id: ${PieceMoveStart.value.Id}`);
        const startingPosBegins = PieceMoveStart.value.Id.indexOf("-")
        console.log(`4B.startingPosBegins: ${startingPosBegins}`);
        const startingPos = PieceMoveStart.value.Id.substring(startingPosBegins +1);
        console.log(`4C.startingPos: ${startingPos}`);

        s.Piece = new GamePieceModel(PlayerTurn.value, PieceMoveStart.value.Type, startingPos, PieceMoveStart.value.Icon);
        PieceMoveStart.value = {} as GamePieceModel;
        SquareMoveStart.value.Piece = {} as GamePieceModel;

      }
    })
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

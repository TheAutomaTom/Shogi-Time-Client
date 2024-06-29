import {  
  GameBoardModel,
  GameSquareModel,
  GamePieceModel
} from "../Models/Game";
import { ref } from "vue";
import { defineStore } from "pinia";
import { DefaultNewGameLayout } from "@/State/Game/DefaultNewGameLayout";

export const useGameState = defineStore("GameState", () => {
  
  const GameBoardModel = ref({
    Id:"111-zzz",
    Squares: new DefaultNewGameLayout().Squares
  } as GameBoardModel);

  const focussedPiece = ref({} as GamePieceModel);
  const FocussedSquare = ref({} as GameSquareModel);
  const movementRules = ref([""] as string[]);
  
  const FocusSquare = (pieceId: string, squareId: string) => {
    console.log(`FocusSquare( pieceId:${pieceId}, squareId:${squareId})`);
    
    GameBoardModel.value.Squares.map((s)=> {
      s.IsFocus == false;
      s.Piece?.IsFocus == false;

      // if(s.x == x && s.y == y){
      //   s.IsFocus == true;
      //   s.Piece?.IsFocus == true;
        
      //   if(s.Piece){
      //     focussedPiece.value = s.Piece;
      //     console.log(`FocusSquare/Piece: ${focussedPiece.value.id}`)

      //   }
      //   FocussedSquare.value = s;
      //   console.log(`FocussedSquare.value = ${FocussedSquare.value.x}, ${FocussedSquare.value.y}`);

      // }

    })

  };

  const getMovementRules = () => {
    // if()

  };


  const MovePiece = (piece: GamePieceModel) => {

  };

  
  return {
    GameBoardModel,
    FocussedSquare,
    FocusSquare,
    MovePiece

  };
});

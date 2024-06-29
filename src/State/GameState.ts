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
  // const movementRules = ref([""] as string[]);
  
  const FocusSquare = (piece: GamePieceModel, square: GameSquareModel) => {
    console.log(`FocusSquare( pieceId:${piece.Id}, squareId:${square.Id})`);
    
    GameBoardModel.value.Squares.map((s)=> {
      // Clean old values
      s.IsFocus == false;
      s.Piece?.IsFocus == false;

      // Set new values
      if(s.X == square.X && s.Y == square.Y){
        s.IsFocus == true;
        s.Piece?.IsFocus == true;
        
        if(s.Piece){
          focussedPiece.value = s.Piece;
          console.log(`FocusSquare/Piece: ${focussedPiece.value.Id}`)

        }
        FocussedSquare.value = s;
        console.log(`FocussedSquare.value = ${FocussedSquare.value.X}, ${FocussedSquare.value.Y}`);

      }

    })

  };

  // const getMovementRules = () => {
  //   // if()

  // };


  const MovePiece = (piece: GamePieceModel) => {

  };

  
  return {
    GameBoardModel,
    FocussedSquare,
    FocusSquare,
    MovePiece

  };
});

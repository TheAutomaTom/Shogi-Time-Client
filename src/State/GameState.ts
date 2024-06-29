import {  
  GameBoardModel,
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

  const FocussedPiece = ref({} as GamePieceModel);
  
  const movePiece = (GamePieceModel) => {

  }

  const focusPiece = () => {

  }
  
  return {
    GameBoardModel
  };
});

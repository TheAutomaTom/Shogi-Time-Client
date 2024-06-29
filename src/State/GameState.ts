import {  
  GameBoardModel
} from "../Models/Game";
import { ref } from "vue";
import { defineStore } from "pinia";

export const useGameState = defineStore("GameState", () => {
  
  const GameBoardModel = ref({} as GameBoardModel);
  
  return {
    GameBoardModel
  };
});

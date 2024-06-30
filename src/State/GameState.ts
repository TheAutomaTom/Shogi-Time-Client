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
  
  const GameBoardModel = ref({
    Id:"111-zzz",
    Squares: new DefaultNewGameLayout().Squares
  } as GameBoardModel);

  const Mode = ref(GameMode.StandBy)
  const focussedPiece = ref({} as GamePieceModel);
  const SquareToMoveFrom = ref({} as GameSquareModel);
    
  const MoveStart = (piece: GamePieceModel, square: GameSquareModel) => {
    Mode.value = GameMode.MoveStart;

    console.log(`MoveStart( pieceId:${piece.Id}, squareId:${square.Id})`);

    focussedPiece.value = piece;
    SquareToMoveFrom.value = square;
    
    GameBoardModel.value.Squares.map( s => {
      
      if(s.X == square.X && s.Y == square.Y){

        console.log(`3.MoveStart.focussedPiece: ${focussedPiece.value.Id}`);
        console.dir(focussedPiece.value);

        focussedPiece.value = s.Piece!;
        
        s.Piece == undefined;
        SquareToMoveFrom.value = s;

        console.log(`FocusSquare/Piece: ${focussedPiece.value.Id}`)        
        console.log(`FocussedSquare.value = ${SquareToMoveFrom.value.X}, ${SquareToMoveFrom.value.Y}`);
      }

    });
  };

  const MoveEnd = (square: GameSquareModel) => {

    GameBoardModel.value.Squares.map( s => {
      
      if(s.Id == square.Id){
        console.log(`4.MoveEnd matched ${s.Id}`);

        const startingPosBegins = focussedPiece.value.Id.lastIndexOf("-")
        const startingPos = focussedPiece.value.Id.substring(startingPosBegins +1);
        s.Piece = new GamePieceModel( focussedPiece.value.Player, focussedPiece.value.Type, startingPos, focussedPiece.value.Icon)

        console.log(`${s.Id} contains: ${s.Piece.Id}`);

      }
    });


    Mode.value = GameMode.MoveEnd;
    
  }

  // const getMovementRules = () => {
  //   // if()

  // };



  
  return {
    GameBoardModel,
    GameMode: Mode,
    SquareToMoveFrom,
    MoveStart,
    MoveEnd

  };
});

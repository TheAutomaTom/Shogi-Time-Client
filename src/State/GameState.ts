import {  
  GameBoardModel,
  GameSquareModel,
  GamePieceModel,
  GamePieceType
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
  const SquareToMoveFrom = ref({} as GameSquareModel);

  // const movementRules = ref([""] as string[]);
  
  const MoveStart = (piece: GamePieceModel, square: GameSquareModel) => {
    console.log(`FocusSquare( pieceId:${piece.Id}, squareId:${square.Id})`);
    SquareToMoveFrom.value = square;
    
    GameBoardModel.value.Squares.map( s => {
      // Clean old values
      s.IsFocus == false;

      // Set new values
      if(s.X == square.X && s.Y == square.Y){
        console.log(`3.MoveStart.focussedPiece: ${focussedPiece.value.Id}`);
        console.dir(focussedPiece.value);
        focussedPiece.value = s.Piece!;
        s.IsFocus == true;
        s.Piece == undefined;        
        SquareToMoveFrom.value = s;
        console.log(`FocusSquare/Piece: ${focussedPiece.value.Id}`)        
        console.log(`FocussedSquare.value = ${SquareToMoveFrom.value.X}, ${SquareToMoveFrom.value.Y}`);
      }

    });
  };

  const MoveEnd = (squareId: string) => {

    GameBoardModel.value.Squares.map( s => {
      
      if(s.Id == squareId){
        console.log(`4.MoveEnd matched ${s.Id}`);

        console.log(`focussedPiece.value.Id: ${focussedPiece.value.Id}`);
        const startingPosBegins = focussedPiece.value.Id.indexOf("-")
        console.log(`startingPosBegins: ${startingPosBegins}`);
        const startingPos = focussedPiece.value.Id.substring(startingPosBegins +1);
        console.log(`startingPos: ${startingPos}`);

        s.Piece = new GamePieceModel( focussedPiece.value.Player, focussedPiece.value.Type, startingPos, focussedPiece.value.Icon)

        console.log(`${s.Id} contains: ${s.Piece.Id}`);

      }
    });
    
  }

  // const getMovementRules = () => {
  //   // if()

  // };



  
  return {
    GameBoardModel,
    SquareToMoveFrom,
    MoveStart,
    MoveEnd

  };
});

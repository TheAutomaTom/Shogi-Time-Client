<template>

  <div 
    :id="square.Id"
    :style="getPosition()"
    class="game-square"
    :class="getGameSquareClass()"
    @drop="drop($event)" 
    @dragover="dragOver($event)"
  >

    <div 
      class="game-square-label"
      :class="getSquareLabelClass('y')"
    >{{ getSquareLabelText('y') }}</div>

    <div 
      class="game-square-label"
      :class="getSquareLabelClass('x')"
    >{{ getSquareLabelText('x') }}</div>

    <!-- 
    <div class="info-box">
      <span 
      v-if="piece != undefined"
      class="info-text">{{ piece?.Type.toString() }}</span>
    </div> 
    -->

    <div class="game-square-piece" >      
      <game-piece 
        v-if="piece != undefined"
        :piece="piece"
        @handle-click="handleClick"
      ></game-piece>
    </div>

  </div>

</template>

<!--  -->
<script setup lang="ts">
import { defineProps, ref } from 'vue';
import type { GamePieceModel, GameSquareModel } from '@/Models/Game';
import GamePiece from "./GamePiece.vue";
import { useGameState } from '@/State/GameState';
const game$ = useGameState();
const props = defineProps({
  square: {
    type: Object as () => GameSquareModel,
    required: true
  }
});

const piece = ref(props.square?.Piece as GamePieceModel);

const drop = (ev: any) => {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));    
};

const dragOver = (ev: any) => {
  ev.preventDefault();
}; 

const getPosition = () => {
  return `grid-row:${props.square.Y}; grid-column:${props.square.X};`
};

const handleClick = (piece: GamePieceModel) => {
  console.log(`2.GameSquare.focusPiece: ${piece.Id}`);
  game$.FocusSquare(piece, props.square);

};

const getSquareLabelText = (xy: string):string => {    
  if(xy == "x" && props.square.X == 9){    
    return (props.square.Y + 9).toString(36);
  }
  if(xy == "y" && props.square.Y == 1){
    console.log(props.square.X);
    return (Math.abs(props.square.X - 10).toString());
  }  
  return "";
};

const getSquareLabelClass = (xy: string): string =>{
  if(xy == "x" && props.square.X == 9){    
    return "game-square-label-right";  
  }
  if(xy == "y" && props.square.Y == 1){
    return "game-square-label-top";
  }
  return "";
};

const getGameSquareClass = () => {
  if(game$.FocussedSquare.X == props.square.X && game$.FocussedSquare.Y == props.square.Y)
  return "focussed-square-start";
  // if(game$.FocussedSquare.X == props.square.X && game$.FocussedSquare.y == props.square.Y)
  // return "focussed-square-kill";
  // if(game$.FocussedSquare.X == props.square.X && game$.FocussedSquare.y == props.square.Y)
  // return "focussed-square-move";

};

</script>

<!--  -->
<style lang="scss">

  .game-square{
    position: relative;
    box-sizing: content-box;
    border: 1px solid #2a0e04;
    
  }
  .game-square-piece{
    display: flex;
    align-items: center;
    justify-content: center;
    
  }

  .game-square-label{
    position: absolute;
    font-size: x-small;
    color: #2a0e04;

  }
  .game-square-label-top{
    top:0;
    right:50%;
  }
  .game-square-label-right{    
    top:50%;
    right:0;
    
  }
  .focussed-square-start{
    background-color: yellow;
  }
  .focussed-square-move{
    background-color: green;
  }
  .focussed-square-kill{
    background-color: red;
  }

// .info-box {
//   position: relative;
//   // display: inline-block;    
// }

// .info-box .info-text {
//   visibility: hidden;
//   background-color: black;
//   color: goldenrod;
//   text-align: center;
//   padding: 2px 2px;
//   border-radius: 3px;

//   position: absolute;
//   top:20%;
//   margin:1%;
  
//   z-index: 101;
//   opacity: 50%;
//   font-size: xx-small;
// }

// .game-square:hover .info-box .info-text {
//   visibility: visible;
// }

</style>

<template>

  <div 
    class="game-square"
    :class="getCurrentClass()"
    :id="square.Id"
    :style="setPosition()"
    @drop="drop($event)" 
    @dragover="dragOver($event)"
  >

    <div 
      class="board-notation"
      :class="getNotationStyle('y')"
    >{{ getNotationText('y') }}</div>

    <div 
      class="board-notation"
      :class="getNotationStyle('x')"
    >{{ getNotationText('x') }}</div>

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

//=== Setup ======================================================
const game$ = useGameState();
const props = defineProps({
  square: {
    type: Object as () => GameSquareModel,
    required: true
  }
});
const setPosition = () => {
  return `grid-row:${props.square.Y}; grid-column:${props.square.X};`
};

const piece = ref(props.square?.Piece as GamePieceModel);

const getNotationText = (xy: string):string => {
  if(xy == "x" && props.square.X == 9){    
    return (props.square.Y + 9).toString(36);
  }
  if(xy == "y" && props.square.Y == 1){
    return (Math.abs(props.square.X - 10).toString());
  }  
  return "";
};

const getNotationStyle = (xy: string): string =>{
  if(xy == "x" && props.square.X == 9){    
    return "board-notation-right";  
  }
  if(xy == "y" && props.square.Y == 1){
    return "board-notation-top";
  }
  return "";
};

//=== Events =====================================================
const drop = (ev: any) => {
  console.log( `drop: ${(((ev as DragEvent).target) as HTMLElement).id}` );

  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));

  game$.MoveEnd((((ev as DragEvent).target) as HTMLElement).id)
  
};

const dragOver = (ev: any) => {
  console.log( `dragOver: ${(((ev as DragEvent).target) as HTMLElement).id}` );
  ev.preventDefault();
}; 

const handleClick = ( piece: GamePieceModel ) => {
  console.log(`2.GameSquare.handleClick: ${props.square.Id}`);
  game$.MoveStart(piece, props.square)
};

const getCurrentClass = () => {
  if(game$.SquareToMoveFrom.X == props.square.X && game$.SquareToMoveFrom.Y == props.square.Y)
  return "focussed-square-start";
  // if(game$.SquareToMoveFrom.X == props.square.X && game$.SquareToMoveFrom.y == props.square.Y)
  // return "focussed-square-kill";
  // if(game$.SquareToMoveFrom.X == props.square.X && game$.SquareToMoveFrom.y == props.square.Y)
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

  .board-notation{
    position: absolute;
    font-size: x-small;
    color: #2a0e04;

  }
  .board-notation-top{
    top:0;
    right:50%;
  }
  .board-notation-right{    
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

<template>

  <div 
    class="game-square"
    :id="input.Id"
    :style="setGridPosition()"
  >
    <!-- :class="getCurrentClass()" -->
    <!-- @click="handleClickSquare" -->
    <!-- @drop="drop($event)"  -->
    <!-- @dragover="dragOver($event)" -->

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
        v-if="myself.Piece != undefined"
        :input="myself.Piece"
      ></game-piece>
    </div>

  </div>

</template>

<!--  -->
<script setup lang="ts">
import { defineProps, nextTick, reactive } from 'vue';
import type { GameSquareModel } from '@/Models/Game';
import GamePiece from "./GamePiece.vue";
import { useGameState } from '@/State/GameState';
import { GameMode } from '@/State/Game/GameMode';

//=== Setup ======================================================
const game$ = useGameState();
const props = defineProps({
  input: {
    type: Object as () => GameSquareModel,
    required: true
  }
});
const myself = reactive(props.input as GameSquareModel);

const setGridPosition = () => {
  return `grid-row:${myself.Y}; grid-column:${myself.X};`
};

const getNotationText = (xy: string):string => {
  if(xy == "x" && myself.X == 9){    
    return (myself.Y + 9).toString(36);
  }
  if(xy == "y" && myself.Y == 1){
    return (Math.abs(myself.X - 10).toString());
  }  
  return "";
};

const getNotationStyle = (xy: string): string =>{
  if(xy == "x" && myself.X == 9){    
    return "board-notation-right";  
  }
  if(xy == "y" && myself.Y == 1){
    return "board-notation-top";
  }
  return "";
};

//=== Events =====================================================
// const drop = (ev: any) => {
//   console.log( `drop: ${(((ev as DragEvent).target) as HTMLElement).id}` );

//   ev.preventDefault();
//   var data = ev.dataTransfer.getData("text");
//   ev.target.appendChild(document.getElementById(data));

//   game$.MoveEnd((((ev as DragEvent).target) as HTMLElement).id)
  
// };

// const dragOver = (ev: any) => {
//   console.log( `dragOver: ${(((ev as DragEvent).target) as HTMLElement).id}` );
//   ev.preventDefault();
// }; 


// const handleClickSquare = () => {

//   // if(game$.GameMode == GameMode.MoveStart){
//     console.log(`1B.GameSquare.handleClickSquare: ${myself.Id}`);
//     game$.MoveEnd(myself);
//   // }
// };

// const getCurrentClass = async () => {

//   console.warn(`game$.SquareToMoveFrom.Id= ${game$.SquareToMoveFrom.Id} : myself.Id= ${myself.Id}`);
//   if(game$.SquareToMoveFrom.Id == myself.Id){
//     console.warn(`GamePiece.getCurrentClass= "focussed-square-start"`);
//     return await nextTick(()=>"focussed-square-start");
//     // return "focussed-square-start";
//   }
  
// };

</script>

<!--  -->
<style scoped lang="scss">

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
  // .focussed-square-start{
  //   background-color: yellow !important;
  //   color:yellow !important;
  // }

  // .focussed-square-move{
  //   background-color: green;
  // }

  // .focussed-square-kill{
  //   background-color: red;
  // }

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

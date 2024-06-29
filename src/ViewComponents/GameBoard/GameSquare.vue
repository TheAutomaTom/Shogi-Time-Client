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
      v-if="getSquareLabelText('y') != ''"
      class="game-square-label"
      :class="getSquareLabelClass('y')"
    >{{ getSquareLabelText('y') }}</div>

    <div 
      v-if="getSquareLabelText('x') != ''"
      class="game-square-label"
      :class="getSquareLabelClass('x')"
    >{{ getSquareLabelText('x') }}</div>

    <div class="game-square-piece" >      
      <game-piece 
        v-if="piece != undefined"
        :piece="piece"
        @focus-piece="focusPiece"
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

// (props.square as GameSquareModel).id = `Square-${props.square.x}${props.square.y}`;
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

const focusPiece = (id: string) => {
  console.log(`2.GameSquare.focusPiece: ${id}`);
  game$.FocusSquare(id, props.square.Id);

};

const getSquareLabelText = (xy: string):string => {
    
  if(xy == "x" && props.square.Y == 9){    
    return (props.square.Y + 9).toString(36);
  }
  if(xy == "y" && props.square.Y == 1){
    return ( Math.abs(props.square.X - 10)).toString();
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
  if(game$.FocussedSquare.X == props.square.X && game$.FocussedSquare.y == props.square.Y)
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

</style>

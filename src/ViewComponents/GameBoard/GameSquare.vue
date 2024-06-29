<template>

  <div 
    :id="`s${props.x}${props.y}`"
    :style="getPosition()"
    class="game-square"
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

    <div
      class="game-square-piece" 
    >
      <game-piece v-if="piece"
      :player="piece.player"
      :name="piece.name"
      :img="piece.img"
      ></game-piece>
    </div>

  </div>

</template>

<!--  -->
<script setup lang="ts">
import { defineProps, ref } from 'vue';
import type { GamePieceModel } from '@/Models/Game';
import GamePiece from "./GamePiece.vue";
const props = defineProps({
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  pieceLoaded: {
    type: Object as () => GamePieceModel,
    required: false
  }
});

const piece = ref(props.pieceLoaded as GamePieceModel);

const drop = (ev: any) => {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));    
};

const dragOver = (ev: any) => {
  ev.preventDefault();
}; 

const getPosition = () => {
  return `grid-row:${props.y}; grid-column:${props.x};`
};

const getSquareLabelText = (xy: string):string => {
    
  if(xy == "x" && props.x == 9){    
    return (props.y + 9).toString(36);
  }
  if(xy == "y" && props.y == 1){
    return ( Math.abs(props.x - 10)).toString();
  }
  return "";



};

const getSquareLabelClass = (xy: string): string =>{
  if(xy == "x" && props.x == 9){    
    return "game-square-label-right";  
  }
  if(xy == "y" && props.y == 1){
    return "game-square-label-top";
  }
  return "";
};

</script>

<!--  -->
<style lang="scss">

  .game-square{
    position: relative;
    box-sizing: content-box;
    border: 1px dotted grey;
    
  }
  .game-square-piece{
    display: flex;
    align-items: center;
    justify-content: center;
    
  }

  .game-square-label{
    position: absolute;
    font-size: x-small;
    color: grey;

  }
  .game-square-label-top{
    top:0;
    right:50%;
  }
  .game-square-label-right{    
    top:50%;
    right:0;
    
  }

</style>

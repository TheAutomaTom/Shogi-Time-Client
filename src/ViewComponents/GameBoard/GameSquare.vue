<template>

  <div 
    class="game-square "
    :id="input.Id"
    :style="setGridPosition()"
    :class="currentClass"
    @click="handleClickSquare"
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
      class="info-text">{{ piece.Type.toString() }}</span>
    </div> 
    -->

    <div 
      class="game-square-piece"
    >   
      <game-piece 
        v-show="props.input.Piece.Player != 0"
        :input="props.input.Piece"
      ></game-piece>
    </div>

  </div>

</template>

<!--  -->
<script setup lang="ts">
import { defineProps,  ref, watch } from 'vue';
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
const currentClass = ref(game$.SquareMovesPotential.includes( props.input.Id) ? "game-square-potential-move" : "");

const setGridPosition = () => {
  return `grid-row:${props.input.Y}; grid-column:${props.input.X};`
};

const getNotationText = (xy: string):string => {
  if(xy == "x" && props.input.X == 9){ return (props.input.Y + 9).toString(36); }
  if(xy == "y" && props.input.Y == 1){ return (Math.abs(props.input.X - 10).toString()); }  
  return "";
};

const getNotationStyle = (xy: string): string =>{
  if(xy == "x" && props.input.X == 9){ return "board-notation-right";  }
  if(xy == "y" && props.input.Y == 1){ return "board-notation-top";    }
  return "";
};


//=== Events =====================================================
watch( // Update highlight
  () => game$.SquareMovesPotential,
  () => {

    if(game$.SquareMovesPotential.includes(props.input.Id)){
      // console.log(`9. SquareMovesPotential.includes ${props.input.Id}`)
      currentClass.value = "game-square-potential-move";
    }
    else {
      currentClass.value = "";
    }
  }
);

watch( // Update Piece movement
  () => game$.GameBoardModel.Squares.filter(s => s.Id == props.input.Id),
() => {
    props.input.Piece = (game$.GameBoardModel.Squares.filter(s => s.Id == props.input.Id))[0].Piece
  }
);



const handleClickSquare = () => {
  
  if( game$.Mode == GameMode.MoveStart && game$.SquareStartingFrom.Id != props.input.Id){
    
        console.log(`3.GameSquare.handleClickSquare: ${props.input.Id}`);
        game$.TryMove(props.input);
    }
};

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

  .game-square-potential-move{
    background-color: greenyellow;
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

<template>

  <div 
    class="game-square"
    :id="input.Id"
    :style="setGridPosition()"
    :class="currentClass"
    @click="handleClickSquare"
  >
    <div 
      class="board-notation"
      :class="getNotationStyle('y')"
    >{{ getNotationText('y') }}</div>

<!--  -->
    <div>
      <!-- v-if="input.Piece.Player != 0" -->
    <span
      class="board-notation board-notation-debug"
    >{{ input.X }}{{ input.Y }} {{ input.Piece.Player != 0 ? input.Piece.Id : "" }}
    </span>
    </div>
<!--  -->

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
import { ref, watch } from 'vue';
import type { GameSquareModel } from "@/State/Game/Squares/GameSquareModel";
import GamePiece from "./GamePiece.vue";
import { useGameState } from '@/State/GameState';
import { GamePhase } from '@/State/Game/GamePhase';
import { TargetStatus } from '@/State/Game/Squares/TargetStatus';
import { TargetSquareModel } from '@/State/Game/Squares/TargetSquareModel';

//=== Setup ======================================================
const game$ = useGameState();
const props = defineProps({
  input: {
    type: Object as () => GameSquareModel,
    required: true
  }
});

const currentClass = ref("");


// TODO: Move to mounted()...
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

// watch( // Update Piece movement
//   () => game$.Board.Squares.filter(s => s.Id == props.input.Id),
//   () => {
//     props.input.Piece = (game$.Board.Squares.filter(s => s.Id == props.input.Id))[0].Piece
//   }
// );


const isValidTarget = ref({} as TargetSquareModel);

watch( // Update highlight class
  () => game$.PieceInHand.Mobility.Map,
  () => {
    isValidTarget.value = 
      game$.PieceInHand.Mobility.Map.find( s => s.X == props.input.X && s.Y == props.input.Y)!
      || new TargetSquareModel(0,0,TargetStatus.Na);

    switch (isValidTarget.value.Status) {
      case TargetStatus.Open:
        currentClass.value = "game-square-potential-kill";
        // console.log(`${props.input.Id}: ${currentClass.value}`);
        break;
        case TargetStatus.Enemy:
        currentClass.value = "game-square-potential-move";
        // console.log(`${props.input.Id}: ${currentClass.value}`);
        break;
        case TargetStatus.Check:
        currentClass.value = "game-square-potential-check";
        // console.log(`${props.input.Id}: ${currentClass.value}`);
        break;
      default:
        currentClass.value = "";
        // console.log(`${props.input.Id}: "" (watch MovementMap)`);
        break;
    }
  }
);

watch(
  () => game$.Destination,
  () => {
    if ( game$.Phase == GamePhase.PromoteOption && game$.Destination.Id == props.input.Id
    ) {
      currentClass.value = "game-piece-promotion-option";
      // console.log(`${props.input.Id}: ${currentClass.value}`);
    } else {
      currentClass.value = "";
      // console.log(`${props.input.Id}: "" (watch Destination)`);
    }    
  }
);

const handleClickSquare = () => {

  if( isValidTarget.value.Status != TargetStatus.Na ){
    
    if( game$.Origin.Id != props.input.Id ){
      switch (game$.Phase) {
        case GamePhase.MoveStart:
          game$.MoveAttempt(props.input);
          break;       
          
        default: // case GamePhase.DropStart:
          game$.DropAttempt(props.input);
          break;
      }
    }    
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
    color: #000000;

  }
  .board-notation-top{
    top:2px;
    right:50%;
  }
  .board-notation-right{
    top:50%;
    right:4px;    
  }
  .board-notation-debug{
    left:0;
    bottom:0;
    
    z-index: 1000000;
    color:white;
    background-color: black;
  }

  .game-square-potential-move{
    // background-color: #431706;
    background-color: #9b0000b4;
  }
  .game-square-potential-kill{
    // background-color: #431706;
    background-color: #7e0b0b64;
  }
  .game-square-potential-check{
    // background-color: #431706;
    background-color: #ff1616;
  }
  .game-piece-promotion-option{
    background-color: lightseagreen;
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

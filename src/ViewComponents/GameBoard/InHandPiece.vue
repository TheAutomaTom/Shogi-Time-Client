<template>
  <button
    :disabled="game$.Board.CurrentPlayer != input.Player"
    class="in-hand-button"
    :class="currentClass"
    @click="handleClickPieceInHand()"
  >
    <img 
      class="game-piece-in-hand"
      :src="`pieces/Shogi_FCZ/${input.IconPath}.svg`"
      :id="input.Id"
    />
  </button> 
</template>

<script setup lang="ts">
import { GamePhase } from '@/State/Game/GamePhase';
import { PieceModel } from '@/State/Game/Pieces/PieceModel';
import { useGameState } from '@/State/GameState';
import { ref, watch } from 'vue';

  const game$ = useGameState();
  const props = defineProps({
    input: {
      type: Object as () => PieceModel,
      required: true
    }
  });

  const currentClass = ref([""]);

  const handleClickPieceInHand = async () => {
    console.log("\r\nInHandPiece.handleClickPieceInHand();");
    console.log(`props.input...\r
                \tPlayer: ${props.input.Player}\r
                \tId: ${props.input.Id}\r
                \tStartingPos: ${props.input.StartingPosition}\r
                \tIcon: ${props.input.IconPath}\r
                \tType: ${props.input.Type}\r
                `);    

    console.log(`${ game$.Board.CurrentPlayer == props.input.Player}: game$.CurrentPlayer == props.input.Player`);
    console.log(`${game$.Phase == GamePhase.TurnStart || game$.Phase == GamePhase.MoveStart}: game$.Mode == GamePhase.TurnStart || game$.Mode == GamePhase.MoveStart`);
    console.log(`${game$.PieceInHand.Id != props.input.Id}: game$.PieceInHand.Id != props.input.Id`);
    
    if( game$.Board.CurrentPlayer == props.input.Player
        && (game$.Phase == GamePhase.TurnStart || game$.Phase == GamePhase.MoveStart || game$.Phase == GamePhase.DropStart)
        && (game$.PieceInHand.Id != props.input.Id || game$.PieceInHand.Id != props.input.Id)
  ){
      console.log(`\r\nInHandPiece calls game$.DropBegin(${props.input})`);
      /*
      *
      *
      *
      *
      *
      // game$.DropBegin(props.input);
      *
      *
      *
      *
      *
      *
      *
      */
    }
  };

watch(
  () => (game$.PieceInHand, game$.Phase),
  () => {
    if ( game$.PieceInHand.Id == props.input.Id && game$.Phase == GamePhase.MoveEnd) {
      currentClass.value.push("current-player-in-hand-button-active");

    } else if (currentClass.value.includes("current-player-in-hand-button-active")) {
      currentClass.value = currentClass.value.filter( c => c != "current-player-in-hand-button-active");

    }
  }
);


</script>
<style lang="scss">

.game-piece-in-hand{
  height:3em;
  // transform: rotate(180deg);

}

.in-hand-button{
  background-color: transparent;
  border: none;  
}
.current-player-in-hand-button:hover {
  background-color: goldenrod;
}
.current-player-in-hand-button:active {
  background-color: green;
}
.current-player-in-hand-button-disabled {
  background-color: red;
}
.current-player-in-hand-button-active {
  background-color: green;
}
</style>
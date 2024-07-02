<template>
  <button
    class="in-hand-button"
    :class="currentClass"
    @click="handleClickPieceInHand()"
  >
    <img 
      class="game-piece-in-hand"
      :src="`pieces/Shogi_FCZ/${input.Icon}.svg`"
      :id="input.Id"
    />
  </button> 
</template>

<script setup lang="ts">
import { GamePieceModel } from '@/Models/Game';
import { GameMode } from '@/State/Game/GameMode';
import { useGameState } from '@/State/GameState';
import { ref, watch } from 'vue';

  const game$ = useGameState();
  const props = defineProps({
      input: {
      type: Object as () => GamePieceModel,
      required: true
    }
  });

  const currentClass = ref(game$.PieceMoving!.Id == props.input.Id ? "in-hand-button-active" : "");

  const handleClickPieceInHand = async () => {
    console.log("\r\nInHandPiece.handleClickPieceInHand();");

    console.log(`props.input...\r
                \tPlayer: ${props.input.Player}\r
                \tId: ${props.input.Id}\r
                \tStartingPos: ${props.input.StartingPos}\r
                \tIcon: ${props.input.Icon}\r
                \tType: ${props.input.Type}\r
                `);
    

    console.log(`${ game$.CurrentPlayer == props.input.Player}: game$.CurrentPlayer == props.input.Player`);
    console.log(`${game$.Mode == GameMode.TurnStart 
        || game$.Mode == GameMode.MoveBegin}: game$.Mode == GameMode.TurnStart 
        || game$.Mode == GameMode.MoveBegin`);
    console.log(`${game$.PieceMoving.Id != props.input.Id}: game$.PieceMoving.Id != props.input.Id`);
    
    if( game$.CurrentPlayer == props.input.Player 
    && (game$.Mode == GameMode.TurnStart 
        || game$.Mode == GameMode.MoveBegin)
    && game$.PieceMoving.Id != props.input.Id
  ){
      console.log(`\r\nInHandPiece calls game$.DropBegin(${props.input})`);
      game$.DropBegin(props.input);
    }
  };

watch(
  () => game$.PieceInHand,
  () => {
    if ( game$.PieceInHand.Id == props.input.Id
    ) {
      console.warn("in-hand-button-active");
      currentClass.value = "in-hand-button-active";
    }
  }
);

</script>
<style lang="scss">

.game-piece-in-hand{
  height:3em;
  transform: rotate(180deg);

}

.in-hand-button{
  background-color: transparent;
  border: none;
  
}
.in-hand-button:hover {
  background-color: goldenrod;

}
.in-hand-button:active {
  background-color: green;
}
.in-hand-button-active {
  background-color: green;
}
</style>
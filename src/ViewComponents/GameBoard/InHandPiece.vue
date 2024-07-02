<template>
  <button
    class="in-hand-button"
    :class="currentClass"
    @click="handleClickPieceInHand(input)"
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
import { useGameState } from '@/State/GameState';
import { ref, watch } from 'vue';

const game$ = useGameState();
const props = defineProps({
    input: {
    type: Object as () => GamePieceModel,
    required: true
  }
});

const handleClickPieceInHand =(piece: GamePieceModel)=> {
  console.log(`handleClickPieceInHand ${piece}`);
  game$.InHand = piece;

}
const currentClass = ref(game$.MovingPiece!.Id == props.input.Id ? "in-hand-button-active" : "");

watch(
  () => game$.InHand,
  () => {
    if ( game$.InHand.Id == props.input.Id
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
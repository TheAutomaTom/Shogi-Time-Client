<template>
  <img 
    class="game-piece"
    :class="currentClass"
    @click="handleClickPiece"
    :src="`pieces/Shogi_FCZ/${input.IconPath}.svg`"
    :id="input.Id"
    draggable="true" 
    >
  </img>
</template>

<!--  -->
<script setup lang="ts">

  import { GamePhase } from '@/State/Game/GamePhase';
  import { PieceModel } from '@/State/Game/Pieces/PieceModel';
  import { useGameState } from '@/State/GameState';
  import { ref, watch } from 'vue';

  //=== Setup ======================================================
  const game$ = useGameState();
  const props = defineProps({
      input: {
      type: Object as () => PieceModel,
      required: true
    }
  });

  const currentClass = ref("");

  //=== Events =====================================================  
  watch(
    () => game$.PieceInHand,
    () => {
      if (game$.PieceInHand.Id == props.input.Id) {
        currentClass.value = "game-piece-move-start";
      }
      else {
        currentClass.value = "";
      }
    }
  );

  const handleClickPiece = () => {
    // console.log(`GamePiece.handleClickPiece `)
    // game$.logPieceDetails("GamePiece.handleClickPiece", props.input);

    if( game$.Board.CurrentPlayer == props.input.Player // It's your turn
        && (game$.Phase == GamePhase.TurnStart || game$.Phase == GamePhase.MoveStart || game$.Phase == GamePhase.DropStart)
      ){
        game$.MoveStart(props.input);
    }
    // TODO: Deselect piece when clicked a second time
  };

  
</script>

<!--  -->
<style scoped lang="scss">
  .game-piece{
    z-index:10;
    width:100%;
    height:100%;
    object-fit:contain;
    cursor:grab;
    
  }
  .game-piece-move-start{
    // background-color: green;
    box-sizing: border-box;
    border: 1px dashed yellow;
    
  }
</style>

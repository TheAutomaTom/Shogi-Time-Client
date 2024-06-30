<template>
  <img 
    class="game-piece"
    :class="currentClass"
    @click="handleClickPiece"
    :src="`public/pieces/Shogi_FCZ/${input.Icon}.svg`"
    :id="input.Id"
    draggable="true" 
    >
  </img>
</template>

<!--  -->
<script setup lang="ts">

  import { GamePieceModel } from '@/Models/Game';
  import { GameMode } from '@/State/Game/GameMode';
  import { useGameState } from '@/State/GameState';
  import { defineProps, reactive, ref, watch } from 'vue';

  //=== Setup ======================================================
  const game$ = useGameState();
  const props = defineProps({
      input: {
      type: Object as () => GamePieceModel,
      required: true
    }
  });
  const myself = reactive(props.input as GamePieceModel);
  const currentClass = ref(game$.PieceMoveStart!.Id == myself.Id ? "game-piece-move-start" : "");

  //=== Events =====================================================  
  watch(
    () => game$.PieceMoveStart!.Id,
    () => {
      if (game$.PieceMoveStart!.Id == myself.Id) {
        currentClass.value = "game-piece-move-start";
      }
      else {
        currentClass.value = "";
      }
    }
  );

  const handleClickPiece = async () => {
    
    if( game$.PlayerTurn == myself.Player 
      && (game$.Mode == GameMode.TurnStart || game$.Mode == GameMode.MoveStart)
      ){
        console.log(`\r\n1A.GamePiece.handleClickPiece: ${myself.Id}`);
        game$.MoveStart(myself);
    }
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
    background-color: green;
  }
</style>

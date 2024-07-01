<template>
  <img 
    class="game-piece"
    :class="currentClass"
    @click="handleClickPiece"
    :src="`pieces/Shogi_FCZ/${input.Icon}.svg`"
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
  import { ref, watch } from 'vue';

  //=== Setup ======================================================
  const game$ = useGameState();
  const props = defineProps({
      input: {
      type: Object as () => GamePieceModel,
      required: true
    }
  });
  const currentClass = ref(game$.MovingPiece!.Id == props.input.Id ? "game-piece-move-start" : "");

  //=== Events =====================================================  
  watch(
    () => game$.MovingPiece!.Id,
    () => {
      if (game$.MovingPiece!.Id == props.input.Id) {
        currentClass.value = "game-piece-move-start";
      }
      else {
        currentClass.value = "";
      }
    }
  );

  const handleClickPiece = async () => {  
    if( game$.CurrentPlayer == props.input.Player 
      && (game$.Mode == GameMode.TurnStart || game$.Mode == GameMode.MoveBegin)
      && game$.MovingPiece.Id != props.input.Id
      ){
        game$.MoveBegin(props.input);
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

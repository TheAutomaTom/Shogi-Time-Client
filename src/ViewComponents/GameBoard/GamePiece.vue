<template>
  <img 
    :id="`${piece.player}-${piece.name}`"
    :src="`public/pieces/Shogi_FCZ/${piece.img}.svg`"
    
    draggable="true" 
    @dragstart="dragStart($event)"
    @click="focusPiece()"
    class="game-piece"
  /> 
</template>

<!--  -->
<script setup lang="ts">

  import { GamePieceModel } from '@/Models/Game';
import { defineProps } from 'vue';

  const props = defineProps({
    piece: {
    type: Object as () => GamePieceModel,
    required: true
  }
  });

  import { defineEmits } from 'vue';

  const emits = defineEmits(['focus-piece']);


  const dragStart = (ev: any) => {
    // trackedPiece.value = (((ev as DragEvent).target) as HTMLElement).id;
    ev.dataTransfer.setData("text", ev.target.id);
    
    // trackedStart.value = (((((ev as DragEvent).target) as HTMLElement).parentElement) as HTMLElement).id;
  };

  const focusPiece = () => {

    emits("focus-piece", props.piece.name);
  };

</script>

<!--  -->
<style lang="scss">

  .game-piece{
    z-index:10;
    width:100%;
    height:100%;
    object-fit:scale-down;
    cursor:grab;
    
  }


</style>
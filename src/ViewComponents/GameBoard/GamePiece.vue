<template>
  <img 
    :id="piece.id"
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

  (props.piece as GamePieceModel).id  = `Player${props.piece.player}-${props.piece.name}`;
  const emits = defineEmits(['focus-piece']);


  const dragStart = (ev: any) => {
    // trackedPiece.value = (((ev as DragEvent).target) as HTMLElement).id;
    ev.dataTransfer.setData("text", ev.target.id);
    
    // trackedStart.value = (((((ev as DragEvent).target) as HTMLElement).parentElement) as HTMLElement).id;
  };

  const focusPiece = () => {
    console.log(`1.GamePiece.focusPiece: ${props.piece.id}`);
    emits("focus-piece", props.piece.id);
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
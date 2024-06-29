<template>
  <img 
    :id="piece.Id"
    :src="`public/pieces/Shogi_FCZ/${piece.Icon}.svg`"
    
    draggable="true" 
    @dragstart="dragStart($event)"
    @click="handleClick()"
    @mousedown="handleClick()"
    class="game-piece"
    
  >
  </img>
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

  const emits = defineEmits(['handle-click']);


  const dragStart = (ev: any) => {
    // trackedPiece.value = (((ev as DragEvent).target) as HTMLElement).id;
    ev.dataTransfer.setData("text", ev.target.id);
    
    // trackedStart.value = (((((ev as DragEvent).target) as HTMLElement).parentElement) as HTMLElement).id;
  };

  const handleClick = () => {
    console.log(`1.GamePiece.handleClick: ${props.piece.Id}`);
    emits("handle-click", props.piece);
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

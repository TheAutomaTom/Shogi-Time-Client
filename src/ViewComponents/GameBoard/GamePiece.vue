<template>
  <img 
    :id="`${player}-${name}`"
    :src="`public/pieces/Shogi_FCZ/${img}.svg`"
    
    draggable="true" 
    @dragstart="dragStart($event)"
    class="game-piece"
  /> 
</template>

<!--  -->
<script setup lang="ts">

import { defineProps } from 'vue';

const props = defineProps({
  player: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  }
});


const dragStart = (ev: any) => {
    // trackedPiece.value = (((ev as DragEvent).target) as HTMLElement).id;
    ev.dataTransfer.setData("text", ev.target.id);
    
    // trackedStart.value = (((((ev as DragEvent).target) as HTMLElement).parentElement) as HTMLElement).id;
  }

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
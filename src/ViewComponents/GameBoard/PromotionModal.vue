<template>
<div   
  v-show="true"
  class="promotion-window"
>
  <p>
    Promote?
  </p>
  <div>
    <button @click="game$.PromotePiece(true)">Y</button>
    <button @click="game$.PromotePiece(false)">N</button>
  </div>
</div>
</template>
<script setup lang="ts">
import { GameMode } from '@/State/Game/GameMode';
import { useGameState } from '@/State/GameState';
import { ref, watch } from 'vue';

const game$ = useGameState();

const toShow = ref(true);

// watch( // Update highlight
//   () => game$.Mode,
//   () => {

//     if(game$.Mode == GameMode.PromoteOption){
//       toShow.value = true;
//     }
//     else {
//       toShow.value = false;
//     }
//   }
// );

</script>


<style lang="scss">
.visible{

}
.promotion-window{
  
  
  position: absolute;
  z-index: 50;
  height: 100vh;
  width:100%;
  
  overflow: hidden;

  transition: 150ms;
  transition-timing-function: ease-out;

  background-color: black;
  opacity: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  font-size: xx-large;
  vertical-align:baseline;
}
</style>
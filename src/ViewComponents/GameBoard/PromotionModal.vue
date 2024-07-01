<template>
<div   
  v-show="toShow"
  class="promotion-window"
>
<div class="modal-info">
    Promote?
  </div>
  <div class="modal-choice">
    <button class="drawer-button" @click="game$.PromotePiece(true)">Yes</button>
    <button class="drawer-button" @click="game$.PromotePiece(false)">No</button>
  </div>
</div>
</template>
<script setup lang="ts">
import { GameMode } from '@/State/Game/GameMode';
import { useGameState } from '@/State/GameState';
import { ref, watch } from 'vue';

const game$ = useGameState();

const toShow = ref(false);

watch( // Update highlight
  () => game$.Mode,
  () => {
    if(game$.Mode == GameMode.PromoteOption){
      toShow.value = true;
    }
    else {
      toShow.value = false;
    }
  }
);

</script>


<style scoped lang="scss">
.promotion-window{
  position: absolute;
  
  z-index: 50;
  height: 100vh;
  width:100%;
  left:0;
  
  overflow: hidden;
  
  transition: 150ms;
  transition-timing-function: ease-out;
  
  opacity: 50%;
  
  font-size: xx-large;
  // vertical-align:baseline;
  
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction:column;
}


.modal-info{
  width:100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom:0.5em;
}
.modal-choice{
  
  display: flex;
  align-items: center;
  justify-content: center;
  width:100%;
  height:2em;

}

// ========================
.drawer-button{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction:column;
  height:100%;
  font-size:large;
  border: none;
  color: white;
  background-color: inherit;
  // padding-left:1.5em;
  margin-bottom:0.75em;
  cursor: pointer;
  text-decoration: none;
  background-color: black;

  width:20%;
}
.drawer-button:hover{
  color: black;
  background-color: goldenrod;
}
.drawer-button:active{
  color: gold;
  background-color: black;
}

</style>
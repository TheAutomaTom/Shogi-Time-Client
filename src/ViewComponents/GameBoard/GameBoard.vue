<template>
  <div class="game-board">
    
    <game-square 
      v-for="square in Model.Squares"
      :input="square"
    />

  </div>
</template>
<!-- =============================================== -->
<script setup lang="ts">
import {useAppState} from "@/State/AppState";
import GameSquare from "./GameSquare.vue";
import { ref } from "vue";

const app$ = useAppState();
const Model = ref(app$.Game$.GameBoardModel);

</script>
<!-- =============================================== -->
<style scoped lang="scss">

.game-board{
    position: absolute;
    overflow:hidden;
    
    display: grid;
    grid-template-rows: repeat(9, 3em);
    grid-template-columns: repeat(9, 3em);
    
    // Reference: https://codepen.io/melissamcewen/pen/EPBPbv
    background-size: 200px 20px, 20px 5px, 90px 10px;
    background-image: 
      linear-gradient(70deg, rgba(91,33,5,.1) 0%,
                             rgba(83,29,4,0.32) 23%,
                             rgba(74,24,3,.41) 47%,
                             rgba(80,27,5,0.44) 70%,
                             rgba(81,27,5,0.59) 74%,
                             rgba(93,33,4,0.2) 83%,
                             rgba(115,43,3,.5) 100%),
      linear-gradient(120deg, #541c09 50%, transparent 50%),
      linear-gradient(80deg, #3f1506 50%, #632401 50%);

    border-left: 6px solid #3f1506;
    border-top: 4px solid #5a2a01;
    border-right: 6px solid #893000;
    border-bottom: 8px solid #250c04;
    border-radius: 4px;
  }



</style>

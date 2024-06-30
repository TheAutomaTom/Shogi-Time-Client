<template>
  <div>
    <div class="game-header">CurrentPlayer: {{ game$.CurrentPlayer }}</div>
    <div class="piece-box-p2">xxx</div>
    <game-board></game-board>
    <div class="piece-box-p1">xxx</div>
    <div class="ad-space">Advertising Space</div>
  </div>
</template>

<!-- =============================================== -->
<script setup lang="ts">
import GameBoard from "@/ViewComponents/GameBoard/GameBoard.vue";
// import {useAppState} from "@/State/AppState";
import { useGameState } from "@/State/GameState";

// const app$ = useAppState();
const game$ = useGameState();


</script>

<!-- =============================================== -->
<style scoped lang="scss">
.game-header{
  padding:3px;
}

.piece-box-p2{
  height:2.5em;
  margin:0.5em 0;
  background-color: black;

  display: flex;
  align-items: center;
}
  
.piece-box-p1{
  height:2.5em;
  margin:0.5em 0;
  background-color: black;

  display: flex;
  align-items: center;
}

.ad-space{
  position: absolute;
  background-color: indigo;
  height: 5em;
  width: 100%;
  bottom:0;
  left:0;
  z-index: 300;

  display: flex;
  align-items: center;
  justify-content: center;
  font-variant: small-caps;
}



</style>

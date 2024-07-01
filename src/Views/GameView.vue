<template>
  <div>
    <div class="game-header">CurrentPlayer: {{ game$.CurrentPlayer }}</div>
    <div class="piece-box-p2">xxx</div>
    <game-board></game-board>
    <div class="piece-box-p1">xxx</div>
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

</style>

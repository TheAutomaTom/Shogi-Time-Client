<template>
  <div><span>CurrentPlayer: {{ game$.CurrentPlayer }}</span></div>
  <game-board></game-board>
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




</style>

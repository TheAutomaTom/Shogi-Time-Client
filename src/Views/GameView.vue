<template>
  GameView.vue
  <game-board></game-board>
</template>

<!-- =============================================== -->
<script setup lang="ts">
import GameBoard from "@/ViewComponents/GameBoard/GameBoard.vue";
import {useAppState} from "@/State/AppState";

const app$ = useAppState();


</script>

<!-- =============================================== -->
<style scoped lang="scss">




</style>

<template>
  <div>

    <promotion-modal></promotion-modal>

    <div class="game-header">
      <span>Player: {{ game$.CurrentPlayer }}</span>
      <span>&nbsp;/&nbsp;</span>
      <span>Mode: {{ game$.Mode }}</span>
      <button style="margin:10px;font-size: xx-small;">Build GameModel</button>
    </div>

    <div class="captures-p2">
      <in-hand-piece
        v-for="piece in game$.CapturesP2"
        :input="piece"
      ></in-hand-piece>
    </div>

    <game-board></game-board>

    <div class="captures-p1">
      <in-hand-piece
        v-for="piece in game$.CapturesP1"
        :input="piece"
      ></in-hand-piece>
    </div>
    
  </div>
</template>

<!-- =============================================== -->
<script setup lang="ts">
import GameBoard from "@/ViewComponents/GameBoard/GameBoard.vue";
import InHandPiece from "@/ViewComponents/GameBoard/InHandPiece.vue";
import PromotionModal from "@/ViewComponents/GameBoard/PromotionModal.vue";
import { useGameState } from "@/State/GameState";

const game$ = useGameState();

</script>

<!-- =============================================== -->
<style scoped lang="scss">
.game-header{
  padding:3px;
  color: grey;
  font-size:xx-small;
}

.captures-p2{
  height:2.5em;
  margin:0.5em 0;
  background-color: #0f0f0f;

  display: flex;
  align-items: center;
}
  
.captures-p1{
  height:2.5em;
  margin:0.5em 0;
  background-color: #0f0f0f;

  display: flex;
  align-items: center;
}

</style>

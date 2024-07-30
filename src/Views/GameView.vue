<template>
  <div>

    <promotion-modal></promotion-modal>
    <game-over-modal></game-over-modal>

    <div class="game-header">
      <span>Player: {{ game$.Board.CurrentPlayer }}</span>
      <span>&nbsp;/&nbsp;</span>
      <span
        :style="game$.Phase == GamePhase.GameOver ? 'color:yellow' : ''"
      >Game Phase: {{ game$.Phase }}</span>
      <span>&nbsp;/&nbsp;</span>
<!-- 
      <span
        :style="game$.Board.InCheck.X != 0 ? 'color:yellow' : ''"
      >Is Check: {{ game$.Board.InCheck.X != 0 }}</span> 
-->
    <span
      :style="game$.Board.Checks.length > 0 ? 'color:yellow' : ''"
    >Is Check: {{ game$.Board.Checks.length != 0 }}</span>

    </div>

    <div class="captures-p2">
      <in-hand-piece
        v-for="piece in game$.Board.CapturesP2"
        :input="piece"
      ></in-hand-piece>
    </div>

    <game-board></game-board>

    <div class="captures-p1">
      <in-hand-piece
        v-for="piece in game$.Board.CapturesP1"
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
import GameOverModal from "@/ViewComponents/GameBoard/GameOverModal.vue";
import { useGameState } from "@/State/GameState";
import { GamePhase } from "@/State/Game/GamePhase";

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

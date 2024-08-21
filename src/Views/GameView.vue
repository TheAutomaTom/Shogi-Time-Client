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
    <!-- <span
      :style="game$.Board.Checks.length > 0 ? 'color:yellow' : ''"
    >Is Check: {{ game$.Board.Checks.length != 0 }}</span> -->

    </div>

    <div class="captures-box">
      <captured-piece
        v-for="piece in game$.Board.P2Captures"
        :input="piece"
        :style="piece.Type == PieceType.Pawn && game$.Board.P2HasOpenFiles == false ? 'opacity:0.3' : 'opacity:1'"
      ></captured-piece>
    </div>

    <game-board></game-board>

    <div class="captures-box">
      <captured-piece
        v-for="piece in game$.Board.P1Captures"
        :input="piece"
        :style="piece.Type == PieceType.Pawn && game$.Board.P1HasOpenFiles == false ? 'opacity:0.3' : 'opacity:1'"
      ></captured-piece>
    </div>
    
  </div>
</template>

<!-- =============================================== -->
<script setup lang="ts">
import GameBoard from "@/ViewComponents/GameBoard/GameBoard.vue";
import CapturedPiece from "@/ViewComponents/GameBoard/CapturedPiece.vue";
import PromotionModal from "@/ViewComponents/GameBoard/PromotionModal.vue";
import GameOverModal from "@/ViewComponents/GameBoard/GameOverModal.vue";
import { useGameState } from "@/State/GameState";
import { GamePhase } from "@/State/Game/GamePhase";
import { PieceType } from "@/State/Game/Pieces/PieceType";

const game$ = useGameState();

</script>

<!-- =============================================== -->
<style scoped lang="scss">
.game-header{
  padding:3px;
  color: grey;
  font-size:xx-small;
}

.captures-box{
  height:2.5em;
  margin:0.5em 0;
  background-color: #0f0f0f;

  display: flex;
  align-items: center;
}
  

</style>

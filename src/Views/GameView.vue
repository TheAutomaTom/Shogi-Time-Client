<template>
  <div>
    <div class="game-header">CurrentPlayer: {{ game$.CurrentPlayer }}</div>
    <div class="piece-box-p2">
      <img 
        v-for="piece in game$.PieceBoxP2"
        class="game-piece-in-hand"
        @click="handleClickPieceInHand"
        :src="`pieces/Shogi_FCZ/${piece.Icon}.svg`"
        :id="piece.Id" 
        >
      </img>
    </div>
    <game-board></game-board>
    <div class="piece-box-p1">
      <img 
        v-for="piece in game$.PieceBoxP1"
        class="game-piece-in-hand"
        @click="handleClickPieceInHand"
        :src="`pieces/Shogi_FCZ/${piece.Icon}.svg`"
        :id="piece.Id" 
        >
      </img>
    </div>
  </div>
</template>

<!-- =============================================== -->
<script setup lang="ts">
import GameBoard from "@/ViewComponents/GameBoard/GameBoard.vue";
import { useGameState } from "@/State/GameState";

const game$ = useGameState();

const handleClickPieceInHand =()=> {

}

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

.game-piece-in-hand{
  height:3em;
  transform: rotate(180deg);
  
}
</style>

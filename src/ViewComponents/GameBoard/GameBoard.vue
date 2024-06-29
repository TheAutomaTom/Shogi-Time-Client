<template>
  <div class="game-board">
    
    <game-square v-for="square in Model.Squares"
      :x="square.x"
      :y="square.y"
      :pieceLoaded="square.Piece"
    />

  </div>
</template>
<!-- =============================================== -->
<script setup lang="ts">
import { GameBoardModel } from "@/Models/Game";
import {useAppState} from "@/State/AppState";
import GameSquare from "./GameSquare.vue";
import { ref } from "vue";

const Model = ref({
  Id: "test-111",
  Squares:[

  // Player 1: Back Row /==================
    {
      x:1,
      y:9,
      Piece:{
        player: 1,
        name:"Lance-Right",
        img:"0KY"
      }
    },
    {
      x:2,
      y:9,
      Piece:{
        player: 1,
        name:"Knight-Right",
        img:"0KE"
      }
    },
    {
      x:3,
      y:9,
      Piece:{
        player: 1,
        name:"Silver-Right",
        img:"0GI"
      }
    },
    {
      x:4,
      y:9,
      Piece:{
        player: 1,
        name:"Gold-Right",
        img:"0KI"
      }
    },
    {
      x:5,
      y:9,
      Piece:{
        player: 1,
        name:"King-Center",
        img:"0OU"
      }
    },
    {
      x:6,
      y:9,
      Piece:{
        player: 1,
        name:"Gold-Left",
        img:"0KI"
      }
    },
    {
      x:7,
      y:9,
      Piece:{
        player: 1,
        name:"Silver-Left",
        img:"0GI"
      }
    },
    {
      x:8,
      y:9,
      Piece:{
        player: 1,
        name:"Knight-Left",
        img:"0KE"
      }
    },
    {
      x:9,
      y:9,
      Piece:{
        player: 1,
        name:"Lance-Left",
        img:"0KY"
      }
    },

  // Player 1: Mid Row /==================
    {
      x:1,
      y:8,
    },
    {
      x:2,
      y:8,
      Piece:{
        player: 1,
        name:"Rook-Right",
        img:"0HI"
      }
    },
    {
      x:3,
      y:8,
    },
    {
      x:4,
      y:8,
    },
    {
      x:5,
      y:8,
    },
    {
      x:6,
      y:8,
    },
    {
      x:7,
      y:8,
    },
    {
      x:8,
      y:8,
      Piece:{
        player: 1,
        name:"Bishop-Left",
        img:"0KA"
      }
    },
    {
      x:9,
      y:8,
    },


  // Player 1: Pawn Row /==================
  {
      x:1,
      y:7,
      Piece:{
        player: 1,
        name:"Pawn-A",
        img:"0FU"
      }
    },
    {
      x:2,
      y:7,
      Piece:{
        player: 1,
        name:"Pawn-B",
        img:"0FU"
      }
    },
    {
      x:3,
      y:7,
      Piece:{
        player: 1,
        name:"Pawn-C",
        img:"0FU"
      }
    },
    {
      x:4,
      y:7,
      Piece:{
        player: 1,
        name:"Pawn-D",
        img:"0FU"
      }
    },
    {
      x:5,
      y:7,
      Piece:{
        player: 1,
        name:"Pawn-E",
        img:"0FU"
      }
    },
    {
      x:6,
      y:7,
      Piece:{
        player: 1,
        name:"Pawn-F",
        img:"0FU"
      }
    },
    {
      x:7,
      y:7,
      Piece:{
        player: 1,
        name:"Pawn-G",
        img:"0FU"
      }
    },
    {
      x:8,
      y:7,
      Piece:{
        player: 1,
        name:"Pawn-H",
        img:"0FU"
      }
    },
    {
      x:9,
      y:7,
      Piece:{
        player: 1,
        name:"Pawn-I",
        img:"0FU"
      }
    },

  // Row F /==================
    {
      x:1,
      y:6,
    },
    {
      x:2,
      y:6,
    },
    {
      x:3,
      y:6,
    },
    {
      x:4,
      y:6,
    },
    {
      x:5,
      y:6,
    },
    {
      x:6,
      y:6,
    },
    {
      x:7,
      y:6,
    },
    {
      x:8,
      y:6,
    },
    {
      x:9,
      y:6,
    },
    
  // Row E /==================
    {
      x:1,
      y:5,
    },
    {
      x:2,
      y:5,
    },
    {
      x:3,
      y:5,
    },
    {
      x:4,
      y:5,
    },
    {
      x:5,
      y:5,
    },
    {
      x:6,
      y:5,
    },
    {
      x:7,
      y:5,
    },
    {
      x:8,
      y:5,
    },
    {
      x:9,
      y:5,
    },

  // Row D /==================
    {
      x:1,
      y:4,
    },
    {
      x:2,
      y:4,
    },
    {
      x:3,
      y:4,
    },
    {
      x:4,
      y:4,
    },
    {
      x:5,
      y:4,
    },
    {
      x:6,
      y:4,
    },
    {
      x:7,
      y:4,
    },
    {
      x:8,
      y:4,
    },
    {
      x:9,
      y:4,
    },


  // Player 2: Pawn Row /==================
  {
      x:1,
      y:3,
      Piece:{
        player: 2,
        name:"Pawn-A",
        img:"1FU"
      }
    },
    {
      x:2,
      y:3,
      Piece:{
        player: 2,
        name:"Pawn-B",
        img:"1FU"
      }
    },
    {
      x:3,
      y:3,
      Piece:{
        player: 2,
        name:"Pawn-C",
        img:"1FU"
      }
    },
    {
      x:4,
      y:3,
      Piece:{
        player: 2,
        name:"Pawn-D",
        img:"1FU"
      }
    },
    {
      x:5,
      y:3,
      Piece:{
        player: 2,
        name:"Pawn-E",
        img:"1FU"
      }
    },
    {
      x:6,
      y:3,
      Piece:{
        player: 2,
        name:"Pawn-F",
        img:"1FU"
      }
    },
    {
      x:7,
      y:3,
      Piece:{
        player: 2,
        name:"Pawn-G",
        img:"1FU"
      }
    },
    {
      x:8,
      y:3,
      Piece:{
        player: 2,
        name:"Pawn-H",
        img:"1FU"
      }
    },
    {
      x:9,
      y:3,
      Piece:{
        player: 2,
        name:"Pawn-I",
        img:"1FU"
      }
    },





  // Player 2: Mid Row /==================
  {
      x:1,
      y:2,
    },
    {
      x:2,
      y:2,
      Piece:{
        player: 2,
        name:"Rook-Right",
        img:"1HI"
      }
    },
    {
      x:3,
      y:2,
    },
    {
      x:4,
      y:2,
    },
    {
      x:5,
      y:2,
    },
    {
      x:6,
      y:2,
    },
    {
      x:7,
      y:2,
    },
    {
      x:8,
      y:2,
      Piece:{
        player: 2,
        name:"Bishop-Left",
        img:"1KA"
      }
    },
    {
      x:9,
      y:2,
    },




  // Player 2: Back Row /==================
    {
      x:1,
      y:1,
      Piece:{
        player: 2,
        name:"Lance-Right",
        img:"1KY"
      }
    },
    {
      x:2,
      y:1,
      Piece:{
        player: 2,
        name:"Knight-Right",
        img:"1KE"
      }
    },
    {
      x:3,
      y:1,
      Piece:{
        player: 2,
        name:"Silver-Right",
        img:"1GI"
      }
    },
    {
      x:4,
      y:1,
      Piece:{
        player: 2,
        name:"Gold-Right",
        img:"1KI"
      }
    },
    {
      x:5,
      y:1,
      Piece:{
        player: 2,
        name:"King-Center",
        img:"1OU"
      }
    },
    {
      x:6,
      y:1,
      Piece:{
        player: 2,
        name:"Gold-Left",
        img:"1KI"
      }
    },
    {
      x:7,
      y:1,
      Piece:{
        player: 2,
        name:"Silver-Left",
        img:"1GI"
      }
    },
    {
      x:8,
      y:1,
      Piece:{
        player: 2,
        name:"Knight-Left",
        img:"1KE"
      }
    },
    {
      x:9,
      y:1,
      Piece:{
        player: 2,
        name:"Lance-Left",
        img:"1KY"
      }
    },









  ] // ...Squares


} as GameBoardModel);





const app$ = useAppState();
</script>
<!-- =============================================== -->
<style scoped lang="scss">

.game-board{
    position: absolute;
    overflow:hidden;
    
    display: grid;
    grid-template-rows: repeat(9, 3em);
    grid-template-columns: repeat(9, 3em);
    
    background-color:tan;
  }


</style>

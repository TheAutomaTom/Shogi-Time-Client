<template>
  <img 
    class="game-piece"    
    :class="currentClass"
    @click="handleClickPiece"
    :src="`public/pieces/Shogi_FCZ/${input.Icon}.svg`"
    :id="input.Id"
    draggable="true" 
    >
    <!-- @mousedown="handleClick()" -->
    <!-- @dragstart="dragStart($event)" -->
  </img>
</template>

<!--  -->
<script setup lang="ts">

  import { GamePieceModel } from '@/Models/Game';
  import { GameMode } from '@/State/Game/GameMode';
  import { useGameState } from '@/State/GameState';
  import { defineProps, nextTick, reactive, ref, watch } from 'vue';
  import { defineEmits } from 'vue';

  //=== Setup ======================================================
  const game$ = useGameState();
  const props = defineProps({
      input: {
      type: Object as () => GamePieceModel,
      required: true
    }
  });
  // const emits = defineEmits(['handle-click']);
  const myself = reactive(props.input as GamePieceModel);
  const currentClass = ref(game$.PieceMoveStart.Id == myself.Id ? "game-piece-move-start" : "");

  //=== Events =====================================================
  watch(game$.PieceMoveStart, (newX) => {
    console.log(`x is ${newX}`)
  })
  
  watch(
    () => game$.PieceMoveStart.Id,
    () => {
      if (game$.PieceMoveStart.Id == myself.Id) {
        currentClass.value = "game-piece-move-start";
      }
      else {
        currentClass.value = "";
      }
    }
  );


  const handleClickPiece = async () => {
    console.log("");
    console.log(`1A.GameSquare.handleClickPiece: ${myself.Id}`);
    // if(game$.Mode == GameMode.TurnStart || game$.Mode == GameMode.MoveStart){

      game$.MoveStart(myself);

    // }
  };

  // const getCurrentClass = async () => {

  //   if(game$.PieceMoveStart.Id == myself.Id){
  //     console.warn(`(game$.PieceMoveStart.Id(${game$.PieceMoveStart.Id}) == myself.Id${myself.Id}) => "game-piece-move-start"`);
  //     // return await nextTick(()=>"game-piece-move-start");
  //     return "game-piece-move-start";
  //   }
    
  // };

  // const dragStart = (ev: any) => {
  //   // trackedPiece.value = (((ev as DragEvent).target) as HTMLElement).id;
  //   ev.dataTransfer.setData("text", ev.target.id);
    
  //   // trackedStart.value = (((((ev as DragEvent).target) as HTMLElement).parentElement) as HTMLElement).id;
  // };

  // const handleClick = () => {
  //   console.log(`1.GamePiece.handleClick: ${props.piece.Id}`);
  //   emits("handle-click", props.piece);
  // };
  
</script>

<!--  -->
<style scoped lang="scss">
  .game-piece{
    z-index:10;
    width:100%;
    height:100%;
    object-fit:contain;
    cursor:grab;
    
  }
  .game-piece-move-start{
    background-color: green;
  }
</style>

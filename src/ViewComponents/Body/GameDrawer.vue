<script setup lang="ts">
import LogoButton from "@Components/LogoButton.vue";
import { useAppState } from "../../State/AppState";
import { useGameState } from "@/State/GameState";

const app$ = useAppState();
const game$ = useGameState();

const getDrawerClass = () => {
  return app$.Layout$.GameDrawerIsOpen ? 'drawer-open' : 'drawer-shut';
}

const toggleDrawer=()=>{
  app$.Layout$.ToggleGameDrawer();
}

const concede=()=>{
  const winner = game$.Board.CurrentPlayer == 1 ? 2 : 1;
  app$.Layout$.ToggleGameDrawer();
  game$.GameOver(winner);
}
</script>

<template>
  <Transition class="drawer-transition">
  <div 
    class="drawer"
    :class="getDrawerClass()"
  >
    <div 
      class="drawer-header"
      @click="toggleDrawer()"
    >
      <div 
        class="drawer-header-pre"
      ></div>
      <logo-button
        class="drawer-header-logo"
      ></logo-button>
    </div>

    <div class="drawer-content">
      <div class="drawer-content-top">

        <!-- Game -->
        <button 
          class="drawer-button"
          @click="concede()"
        ><span>👎 Concede</span></button>
        
      </div>
      
      <div class="drawer-content-bottom">
        <button 
          @click="toggleDrawer()"
          class="drawer-button"><span>👈 Close</span>
        </button>
      </div>
    </div>

  </div>
</Transition>
</template>

<style scoped lang="scss">

.drawer-transition{
  transition: 300ms;
}

.drawer{
  position: absolute;
  z-index: 100;
  overflow: hidden;
  top:0;
  bottom:0;
  width:100%;
  max-width:250px;
  display: grid;
  grid-template-rows: 0em 2.5em 1fr 2.5em 0em;
  grid-template-columns: 0em 2.5em 1fr;
  background-color: #1F1F1F;
  border-right: 4px double grey !important;
}

.drawer-open{
}

.drawer-shut{
  width:0%;
  border-right: none;
  margin-left:-250px;
}

.drawer-header{  
  grid-row:1/2;
  grid-column: 2/4;
  display: flex;
  // margin-left: 1em;
  cursor: pointer;
  
  display: grid;
  grid-template-columns: 2.5em 1fr;
}
.drawer-header-pre{
  grid-row:2;
  grid-column: 1;
}
.drawer-header-logo{
  grid-row:2;
  grid-column:2/4;
}
.drawer-content{
  grid-row:3;
  grid-column:2/4;
  
}
.drawer-content-top{
  display: flex;
  flex-direction: column;
  height:100%;
}
.drawer-content-bottom{
  display: flex;
  flex-direction: column-reverse;
}

// ========================
.drawer-button{
  display: flex;
  font-size:large;
  border: none;
  color: white;
  background-color: inherit;
  padding-left:1.5em;
  margin-bottom:0.75em;
  cursor: pointer;
  text-decoration: none;
}
.drawer-button:hover{
  color: goldenrod;
  background-color: black;
}
.drawer-button:active{
  color: gold;
  background-color: black;
}
.drawer-button-disabled:hover{
text-decoration: line-through;
}
.drawer-button-disabled{
  display: flex;
  font-size:large;
  border: none;
  color: grey;
  width:100% ;
  background-color: inherit;
  padding-left:1.5em;
  padding-bottom:0.5em;
}

</style>
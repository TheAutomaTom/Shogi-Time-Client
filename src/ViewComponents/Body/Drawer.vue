<script setup lang="ts">
import LogoButton from "@Components/LogoButton.vue";
import { useAppState } from "../../State/AppState";
import { ModalContentType } from "@/State/Layout/ModalContentType";

const app$ = useAppState();

const getDrawerClass = () => {
  console.log(app$.Layout$.DrawerIsOpen ? 'drawer-open' : 'drawer-shut');
  return app$.Layout$.DrawerIsOpen ? 'drawer-open' : 'drawer-shut';
}

const toggleDrawer=()=>{
  console.log(`Drawer.logo-button clicked: toggleDrawer()`);
  app$.Layout$.ToggleDrawer();
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

        <!-- Player -->
        <div
          class="drawer-button"
          @click="app$.Layout$.ToggleModal(ModalContentType.Account)"
        >🫵&nbsp;Player</div>

        <!-- Dashboard -->
        <router-link :to="'/'"
          class="drawer-button"
          @click="toggleDrawer()"
        >
        📈&nbsp;Dashboard
        </router-link>
        
        <!-- Test Board -->
        <router-link :to="'/game'"
          class="drawer-button"
          @click="toggleDrawer()"
        >
        🧪Test&nbsp;Board
        </router-link>
        
        <!-- w.i.p. -->
        <button class="drawer-button-disabled"><span>♟️ Games</span></button>
        <button class="drawer-button-disabled"><span>🎖️ Rank</span></button>
        
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
  font-size:x-large;
  border: none;
  color: white;
  width:100% ;
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
  font-size:x-large;
  border: none;
  color: grey;
  width:100% ;
  background-color: inherit;
  padding-left:1.5em;
  padding-bottom:0.5em;
}

</style>
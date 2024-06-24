<script setup lang="ts">
import LogoButton from "@Components/LogoButton.vue";
import { useAppState } from "../../State/AppState";

const app$ = useAppState();

const getDrawerClass = () => {
  console.log(app$.Layout.DrawerIsOpen ? 'drawer-open' : 'drawer-shut');
  return app$.Layout.DrawerIsOpen ? 'drawer-open' : 'drawer-shut';
}

const toggleDrawer=()=>{
  console.log(`Drawer.logo-button clicked: toggleDrawer()`);
  app$.Layout.ToggleDrawer();
}

</script>

<template>
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
        <div></div>
        <button 
          @click="app$.Layout.ToggleModal()"
          class="drawer-button"><span>🫵 Player</span>
        </button>
        
        <button class="drawer-button-disabled"><span>🫡 Two</span></button>
        
        <button class="drawer-button-disabled"><span>🎼 Three</span></button>
        
        <button class="drawer-button-disabled"><span>🎠 Four</span></button>
      </div>
      
      <div class="drawer-content-bottom">
        <button 
          @click="toggleDrawer()"
          class="drawer-button"><span>👈 Close</span>
        </button>
      </div>
    </div>

  </div>
</template>

<style lang="scss">

.drawer{
  position: absolute;
  z-index: 10;
  overflow: hidden;
  top:0;
  bottom:0;
  width:100%;
  max-width:250px;
  display: grid;
  grid-template-rows: 0em 2.5em 1fr 2.5em 0em;
  grid-template-columns: 0em 2.5em 1fr;
  
  transition: 300ms;
  transition-timing-function: ease-out;
  background-color: #1F1F1F;
  border-right: 4px double grey !important;

}

.drawer-open{
  // width:100%;
}

.drawer-shut{
  width:0%;
  border-right: none;
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
  cursor: pointer;
}
.drawer-button:hover{
  color: goldenrod;
  background-color: black;
}
.drawer-button:active{
  color: gold;
  background-color: black;
}
.drawer-button-disabled{
  display: flex;
  font-size:x-large;
  border: none;
  color: grey;
  width:100% ;
  background-color: inherit;
  padding-left:1.5em;
}


</style>
<script setup lang="ts">
import LogoButton from "./LogoButton.vue";
import { useAppState } from "../../State/AppState";

const app$ = useAppState();

const getDrawerClass = () => {
  console.log(app$.Layout.DrawerIsOpen ? 'drawer-open' : 'drawer-shut');
  return app$.Layout.DrawerIsOpen ? 'drawer-open' : 'drawer-shut';
}

</script>

<template>
  <div 
    class="drawer"
    :class="getDrawerClass"
  >
    <div class="drawer-header">
      <logo-button
        @click="app$.Layout.ToggleDrawer()"
      ></logo-button>
    </div>

    <div class="drawer-content">
      <button class="drawer-button"><span>🫵 One</span></button>
      <button class="drawer-button"><span>🫡 Two</span></button>
      <button class="drawer-button"><span>🎼 Three</span></button>
      <button class="drawer-button"><span>🎠 Four</span></button>
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
  max-width:250px;
  display: grid;
  grid-template-rows: 0em 2.5em 1fr 2.5em 0em;
  grid-template-columns: 0em 2.5em 1fr;
  
  transition: 150ms;
  transition-timing-function: ease-out;
  background-color: black;
}

.drawer-open{
  width:100%;
  border-right: 4px double grey;
}

.drawer-shut{
  width:0%;
  border-right: none;
}

.drawer-header{  
  grid-row:2;
  grid-column: 3;
  display: flex;
  // margin-left: 1em;
}

.drawer-content{
  grid-row:3;
  grid-column: 3;
  max-width:250px;  
}

// ========================
.drawer-button{
  font-size:x-large;
  border: none;
  color: white;
  width:100% ;
  background-color: inherit;
}
.drawer-button:hover{
  color: goldenrod;  
}
.drawer-button:active{
  color: gold;
}


</style>
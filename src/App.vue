<script setup lang="ts">
import Header from "@Components/Body/Header.vue";
import Drawer from "@Components/Body/Drawer.vue";
import Modal from '@Components/Body/Modal.vue'
import { useAppState } from "./State/AppState";

const app$ = useAppState();

const getModalClass = () => {
  console.log(app$.Layout.ModalIsOpen ? 'modal-open' : 'modal-shut');
  return app$.Layout.ModalIsOpen ? 'modal-open' : 'modal-shut';
}

</script>

<template>
  
  <modal 
    v-show="app$.Layout.ModalIsOpen"
    class="modal-container"
    :class="getModalClass()"
  />
  
  <drawer v-show="app$.Layout.DrawerIsOpen"></drawer>
  
  <div id="root" class="app-container">

    <div 
      style="grid-row:2;grid-column:2;cursor:pointer;"
      @click="app$.Layout.ToggleDrawer()"
    >
    </div> 

    <div style="grid-row:3/5;grid-column:2;">
    </div> 
    
    <Header
      v-show="!app$.Layout.DrawerIsOpen"
    ></Header>

    <div class="content-wrapper">
      <div>Content</div>
    </div>
    
     <div style="grid-row:4;grid-column:3/4">
    </div>

    <div style="grid-row:2/5;grid-column:4">
    </div>

    <div style="grid-row:1/6;grid-column:5">
    </div>

    <div style="grid-row:5;grid-column:2/5;background-color: purple;">
    </div> 

  </div>

</template>

<style scoped lang="scss">

.modal-container{
  position: absolute;
  z-index: 30;
  height: 100vh;
  width:100%;
  display: grid;
  overflow: hidden;

  grid-template-rows: 0em 2.5em 1fr 2.5em 0em;
  grid-template-columns: 0em 2.5em 1fr 2.5em 0em;

  transition: 150ms;
  transition-timing-function: ease-out;
}

.app-container {
  z-index: 0;
  height: 100vh;
  width:100%;
  display: grid;
  overflow: hidden;

  grid-template-rows: 0em 2.5em 1fr 2.5em 0em;
  grid-template-columns: 0em 2.5em 1fr 2.5em 0em;

  transition: 150ms;
  transition-timing-function: ease-out;
}

.content-wrapper{
  grid-row:3/4;
  grid-column:3;
  
  @apply w-full flex justify-center;


}

</style>

<script setup lang="ts">
import { useAppState } from "../../State/AppState.ts";
import LogoButton from "@Components/LogoButton.vue";

const app$ = useAppState();

const clickAtGameMenu = () =>{

};

</script>
<template>
  
  <div class="modal-header">

    <div class="header-left">
      <logo-button
        @click="app$.Layout$.ToggleDrawer()"
      ></logo-button>
    </div>

    <div 
      class="header-right"
      v-if="$route.fullPath == '/game'"
    >
      <button 
        class="icon-button ghost-button" 
        @click="app$.Layout$.ToggleGameDrawer()"
      >⚙️</button>
    </div>

  </div>
</template>
<style scoped lang="scss">

.modal-header{  
  grid-row:2;
  grid-column:3;
  display: flex;
  cursor: pointer;
}

.header-left{  
  grid-row:2;
  display: flex;
}

.header-right{
  height:100%;
  width:100%;
  display: flex;
  flex-direction: row-reverse;
  align-items:center;
}

.header-button{
  height:100%;  
}

</style>

<script setup lang="ts">
import { useAppState } from "../../State/AppState.ts";
import LogoButton from "./LogoButton.vue";
const app$ = useAppState();
</script>
<template>
  
  <div class="header">

    <div class="header-left">
      <logo-button
        @click="app$.Layout.ToggleDrawer()"
      ></logo-button>

    </div>

    <div class="header-right debug-border">
      <button class="icon-button ghost-button" disabled>...</button>
      <button class="icon-button ghost-button" >...</button>
      <button class="icon-button ghost-button" >...</button>
    </div>

  </div>
</template>
<style scoped lang="scss">

.header{  
  grid-row:2;
  grid-column:3;
  display: flex;
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

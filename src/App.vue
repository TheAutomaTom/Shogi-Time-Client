<script setup lang="ts">
import Header from "@Components/Body/Header.vue";
import Drawer from "@Components/Body/Drawer.vue";
import { useAppState } from "./State/AppState";

const app$ = useAppState();
</script>

<template>
  <drawer v-show="app$.Layout.DrawerIsOpen"></drawer>
  <div id="root" class="app-container">

    <!--==== Header Ad ==================================================-->
    <div style="grid-row:1;grid-column:2/5">
    <!-- ;background-color: purple;"> -->
    </div>

    <div style="grid-row:1/6;grid-column:1;">
    <!-- ;background-color: magenta;"> -->
    </div>

    <div style="grid-row:2/5;grid-column:2">
    <!-- ;background-color: blue;"> -->
    </div>
    
    <!--==== Header =====================================================-->
    <Header></Header>

    <!--==== Content ====================================================-->

    <div class="content-wrapper debug-border">
      <div>Content</div>
    </div>
    
    <!--==== ======= ====================================================-->

    <div style="grid-row:4;grid-column:3/4">
    <!-- ;background-color: lightblue;"> -->
    </div>

    <div style="grid-row:2/5;grid-column:4">
    <!-- ;background-color: blue;"> -->
    </div>

    <div style="grid-row:1/6;grid-column:5">
    <!-- ;background-color: magenta;"> -->
    </div>

    <!--==== Footer Ad ==================================================-->
    <div style="grid-row:5;grid-column:2/5;background-color: purple;">
    </div>

  </div>

</template>

<style scoped lang="scss">

.app-container {
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

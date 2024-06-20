<script setup lang="ts">
import Header from "@Components/Body/Header.vue";
import Content from "./ViewComponents/Body/Content.vue";
import Footer from "./ViewComponents/Body/Footer.vue";

</script>

<template>

  <div id="root" class="app-container"
      style="background-color:grey"
    >

    <div style="grid-row:1;grid-column:2/5;background-color: purple;">
    </div>


    <div style="grid-row:1/6;grid-column:1;background-color: magenta;">
    </div>

    <div style="grid-row:2/5;grid-column:2;background-color: blue;">
    </div>

    <div style="grid-row:2;grid-column:3/4;background-color: lightblue;">
    </div>

    <div style="grid-row:3/4;grid-column:3;background-color: green;">
      Content
    </div>
    
    <div style="grid-row:4;grid-column:3/4;background-color: lightblue;">
    </div>

    <div style="grid-row:2/5;grid-column:4;background-color: blue;">
    </div>

    <div style="grid-row:1/6;grid-column:5;background-color: magenta;">
    </div>

    <div style="grid-row:5;grid-column:2/5;background-color: purple;">
    </div>

  </div>
  
</template>

<style scoped lang="scss">
.app-container {
  height: 100vh;
  display: grid;
  overflow: hidden;

  grid-template-rows: 1em 2.5em 1fr 2.5em 1em;
  grid-template-columns: 1em 2.5em 1fr 2.5em 1em;

  transition: 150ms;
  transition-timing-function: ease-out;
}
.buffer-header {
  @apply w-full;
}
$footer-height: 15em;
.content-wrapper {
  @apply w-full flex justify-center;
  padding-bottom: $footer-height;
  background-color:lightblue;
}
.content {
  @apply w-full max-w-2xl flex;
}
.footer-wrapper {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: $footer-height;
}
</style>

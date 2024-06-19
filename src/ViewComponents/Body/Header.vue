<template>
  <header :class="app$.IsScrolled ? 'shadow' : ''">
    <div class="header-wrapper">
      <!--=== Left Aligned ===---------------------------->
      <div class="header-left">
        <img
          alt="Logo"
          :src="'../../assets/vue.svg'"
          :class="'h-8'"
        />
      </div>

      <div class="flex items-center">
        <router-link class="px-3" :to="'/'"> Page-1 </router-link>
        <span class="color-secondary">|</span>
        <router-link class="px-3" :to="'/'"> Page-2 </router-link>
        <span class="color-secondary">|</span>
        <!-- <router-link class="px-3" :to="'FilePickers'"> -->
      </div>

      <!--=== Right Aligned ===---------------------------->
      <div class="header-right">
        <select-language />
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
import { useAppState } from "../../State/AppState.ts";

const app$ = useAppState();

</script>
<style scoped lang="scss">
header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  @apply w-full h-12
          flex justify-center items-center
          bg-white;
}
.header-wrapper {
  @apply w-full max-w-7xl flex px-1;
}
.header-left {
  @apply flex flex-col justify-center;
}
.header-right {
  @apply flex flex-grow flex-row-reverse;
}
</style>

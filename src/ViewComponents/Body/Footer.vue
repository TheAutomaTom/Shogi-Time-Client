<template>

  <div class="contact-div">
    <p>contact-div-1</p>
    <p>contact-div-2</p>
      <p class="p-2">
      
        <span>
        <a>Span-1 </a>,
      </span>
      
      <span>        
        <a>Span-2</a>,
      </span>

      <span>        
        <a>Span-3</a>
      </span>
      
      <p class="p-2">
        <button
          style="display: inline-block"
          class="mb-4 px-1 text-blue-500 font-medium text-sm flex justify-center items-center"
          @click=""
        >
          <p>Button</p>
        </button>
      </p>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useAppState } from "../../State/AppState.ts";
const app$ = useAppState();
</script>
<style scoped lang="scss">
// @use '../../styles/dynamic.scss' as *;
.contact-div {
  // @extend .font-primary;
  @apply w-full text-center mt-8 text-sm pb-32;
}

</style>

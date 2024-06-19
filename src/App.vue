<script setup lang="ts">
</script>

<template>
  <div id="root" class="app-wrapper"
      style="background-color:orange"
    >

    <!-- Header ------------------------------------------------------>
    <Header 
      style="background-color:orange"
    />
    <div class="grid grid-rows-2" style="grid-template-rows: 3em 1fr">
      <div class="buffer-header"></div>

      <!-- Content ------------------------------------------------------>
      <div 
        class="content-wrapper"
        style="background-color:yellow"    
      >
        <Content 
          class="content"
          style="background-color:orange"
        >
          <template v-slot:content>
            <router-view />
          </template>
        </Content>
      </div>
    </div>

    <!-- Footer ------------------------------------------------------>
    <Footer 
      style="background-color:goldenrod"
      class="footer-wrapper" 
    />
  </div>
  
</template>

<style scoped lang="scss">
.app-wrapper {
  @apply w-full;
}
.buffer-header {
  @apply w-full;
}
$footer-height: 15em;
.content-wrapper {
  @apply w-full flex justify-center;
  padding-bottom: $footer-height;
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

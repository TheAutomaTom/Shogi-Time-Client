<script setup lang="ts">
import Header from "@Components/Body/Header.vue";
import Drawer from "@Components/Body/Drawer.vue";
import Modal from '@Components/Body/Modal.vue'
import { useAppState } from "./State/AppState";
import { computed } from "vue";

const app$ = useAppState();

const isUnfocussed = computed(() => {
  return app$.Layout$.IsLoading ? "unfocussed" : "";
})

</script>
  <template>  
  <div 
    class="loading-screen"
    v-show="app$.Layout$.IsLoading == true"  
  >
    "Loading..."
  </div>
    <modal 
      v-show="app$.Layout$.ModalIsOpen"
      class="modal-container"
      :class="isUnfocussed"
    />
      <drawer></drawer>
    <div 
      id="root" 
      class="app-container"
      :class="isUnfocussed"
    >

      <div 
        style="grid-row:2;grid-column:2;cursor:pointer;"
        @click="app$.Layout$.ToggleDrawer()"
      >
      </div> 

      <div style="grid-row:3/5;grid-column:2;">
      </div> 
      
      <Header
        v-show="!app$.Layout$.DrawerIsOpen"
      ></Header>

      <div class="content-wrapper">
        <router-view />
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

.loading-screen{
  position: absolute;
  z-index: 50;
  height: 100vh;
  width:100%;
  
  overflow: hidden;

  transition: 150ms;
  transition-timing-function: ease-out;

  background-color: black;
  opacity: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  font-size: xx-large;
  vertical-align:baseline;

}


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

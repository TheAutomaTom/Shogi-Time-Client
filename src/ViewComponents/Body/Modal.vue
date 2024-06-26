<script setup lang="ts">
import { useAppState } from '@/State/AppState';
import InactiveHeader from "../Modals/InactiveHeader.vue"
import AccountModal from "../Modals/AccountModal.vue"
import { ref } from 'vue';
import { ModalContentType } from '@/State/Layout/ModalContentType';

const app$ = useAppState();

const current = ref(app$.Layout$.ModalContent);

</script>
<template>
<div>
  
  <div
    class="modal-mask"
  >
  </div>

  <inactive-header 
    class="inactive-header"
  ></inactive-header>

  <div 
    class="black-out"
    style="grid-row:2/5;grid-column:4;"
  ></div>
  
  <!--==== Content... ====================================================-->
  <div class="modal-window">
    <account-modal 
      v-if="current == ModalContentType.Account"

    ></account-modal>
  </div>  
  <!--==== ...content ====================================================-->

  <div 
    class="black-out"
    style="grid-row:2/5;grid-column:2;"
  >   </div>
  
  
  <div 
    class="black-out"
    style="grid-row:4;grid-column:3/4;"
  >   </div>


</div>

</template>

<style lang="scss">
.black-out{
  background-color: black;
}

.inactive-header{
  grid-column:1/5;
}

.modal-mask{
  
  z-index: inherit;
  grid-row:1/5;
  grid-column:1/5;
  
  box-sizing: border-box;
  
  color:blue;

}

.modal-window{
  z-index: inherit;
  grid-row:3;
  grid-column:3;

  box-sizing: border-box;

  border: 4px double grey !important;
  border-radius: 3px;
  
  background-color: #1F1F1F;
}

</style>

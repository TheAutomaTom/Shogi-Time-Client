import { defineStore } from "pinia";
import { ref } from "vue";

export const useLayoutState = defineStore("LayoutState", () => {  

  const DrawerIsOpen = ref(false);
  const ToggleDrawer = () => {
    DrawerIsOpen.value = !DrawerIsOpen.value;
    console.log(`ToggleDrawer: ${DrawerIsOpen.value}`);
  }
  
  const ModalIsOpen = ref(false);
  const ToggleModal = () => {
    ModalIsOpen.value = !ModalIsOpen.value;
    if(ModalIsOpen.value == true){
      DrawerIsOpen.value = false;
    }
    console.log(`ToggleDrawer: ${ModalIsOpen.value}`);
  }

  return {
    DrawerIsOpen,
    ToggleDrawer,
    ModalIsOpen,
    ToggleModal

  };
});


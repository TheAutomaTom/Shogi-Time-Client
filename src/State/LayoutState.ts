import { defineStore } from "pinia";
import { ref } from "vue";
import { ModalContentType } from "./Layout/ModalContentType";

export const useLayoutState = defineStore("LayoutState", () => {  

  const IsLoading = ref(false);
  const DrawerIsOpen = ref(false);
  const ToggleDrawer = () => {
    DrawerIsOpen.value = !DrawerIsOpen.value;
    console.log(`ToggleDrawer: ${DrawerIsOpen.value}`);
  }
  
  const ModalIsOpen = ref(false);
  const ToggleModal = (modal: ModalContentType = ModalContentType.None) => {
    
    if(modal == ModalContentType.None){
      ModalIsOpen.value = false;
    }
    else {
      ModalIsOpen.value = !ModalIsOpen.value;
    }

    if(ModalIsOpen.value == true){
      DrawerIsOpen.value = false;
      console.log(`${modal} ${ModalIsOpen.value} called ToggleDrawer`);
    }

  }
  const ModalContent = ref(ModalContentType.Account)

  return {
    IsLoading,
    DrawerIsOpen,
    ToggleDrawer,
    ModalIsOpen,
    ToggleModal,
    ModalContent

  };
});

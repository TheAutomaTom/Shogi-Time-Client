import { defineStore } from "pinia";
import { ref } from "vue";

export const useLayoutState = defineStore("LayoutState", () => {  

  const DrawerIsOpen = ref(false);


  const ToggleDrawer = () => {    
    DrawerIsOpen.value = !DrawerIsOpen.value;
  }

  return {
    DrawerIsOpen,
    ToggleDrawer    

  };
});


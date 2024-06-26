import { EnvironmentService } from "../Services/EnvironmentService";
import { defineStore } from "pinia";
import { useLayoutState } from './LayoutState';
import { useAccountState } from './AccountState';

export const useAppState = defineStore("AppState", () => {
  const Layout$ = useLayoutState();
  const Account$ = useAccountState();
  
  const EnvService = new EnvironmentService();



  // const IsLoading = ref(true);

  return {
    Account$,
    Layout$,
    EnvService,

  };
});


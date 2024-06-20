import { ApiClient } from '../Services/ApiClient';
import { EnvironmentService } from "../Services/EnvironmentService";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useLayoutState } from './LayoutState';

export const useAppState = defineStore("AppState", () => {
  const Layout = useLayoutState();
  
  const Client = new ApiClient();
  const EnvService = new EnvironmentService();



  const IsLoading = ref(true);

  return {
    Layout,
    Client,
    EnvService,

  };
});


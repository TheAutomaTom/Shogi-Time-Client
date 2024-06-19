// import { ModalSpecification, ModalType } from "./../models/modals";
import { ref } from "vue";
import { defineStore } from "pinia";
// import { ApiClient } from "../services/apiClient";
import { EnvironmentService } from "../Services/EnvironmentService";

export const useAppState = defineStore("AppState", () => {
  const Client = new ApiClient();
  const EnvService = new EnvironmentService();

  const IsLoading = ref(true);
  const IsScrolled = ref(false);
  const Lang = ref(languageService.Detect());
  const Modals = ref([
    {
      type: ModalType.TermsAndConditions,
      isVisible: false,
      payload: false,
    } as ModalSpecification,
  ]);
  //=== MODALS =================================================//
  const SetModalVisible = (modal: ModalType) => {
    Modals.value.find((m) => m.type === modal)!.isVisible = true;
  };
  const SetModalBoolean = (modal: ModalType, choice: boolean) => {
    const m = Modals.value.find((m) => m.type === modal)!;
    m.payload = choice;
    m.isVisible = false;
  };

  //============================================================//

  return {
    Client,
    EnvService,
    IsLoading,
    IsScrolled,
    Lang,
    Modals,
    SetModalBoolean,
    SetModalVisible,
  };
});

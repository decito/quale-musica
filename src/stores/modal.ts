import { defineStore } from "pinia";
import { ref } from "vue";

export const useModalStore = defineStore("modal", () => {
  const isOpen = ref(false);

  const setIsOpen = () => {
    isOpen.value = !isOpen.value;
  };

  return { isOpen, setIsOpen };
});

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
  const isOpen = ref(false)

  const hiddenClass = computed(() => (!isOpen.value ? 'hidden' : ''))

  return { isOpen, hiddenClass }
})

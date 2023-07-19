import {ref} from 'vue'

const active = ref(false)

export const useSidebar = () => {
  const openSidebar = () => {
    active.value = true
  }
  const closeSidebar = () => {
    active.value = false
  }

  return { active, openSidebar, closeSidebar }
}

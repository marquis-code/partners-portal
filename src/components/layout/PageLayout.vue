<template>
  <div class="bg-gray-50 w-full min-h-screen overflow-x-hidden">
    <div>
      <div class="w-full pt-2 bg-white">
        <div
          class="px-3 md:px-7 top-part flex flex-row justify-between items-center py-3"
        >
          <div class="dashboard-name text-xl font-medium flex items-center gap-4">
            <img @click="openSidebar" class="flex md:hidden" src="@/assets/images/toggle.svg" alt="">
            {{ pageTitle }}
          </div>
          <div class="py-3 px-5 text-black rounded-lg font-medium flex items-center gap-4">
            <router-link to="/faq" class="w-fit mx-auto text-sm py-2 px-3 hidden md:flex items-center gap-2 text-[#0DAC5C] rounded-lg font-medium">
              <img src="@/assets/images/faqs/question_mark.svg" alt="">
              Go to FAQ
            </router-link>
            {{companyName}}
          </div>
        </div>
        <slot name="breadcrumbs"></slot>
        <hr class="mt-5 mb-0 hidden" />
        <div class="bottom-part">
          <div class="px-3 md:px-7">
            <slot name="actionsPane"></slot>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full h-full scroll-px-60 space-y-6 py-7 px-6">
      <div :key="$route.path">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, withDefaults, computed } from "vue";
import { useStore } from "vuex";
import {axiosInstance as axios} from '@/plugins/axios';
import router from "@/router";
import {useSidebar} from '@/composables/sidebar'

const { openSidebar } = useSidebar()
const store = useStore()
export interface Props {
  pageTitle: string
  hasTabs?: boolean
  hasBreadCrumbs?: boolean
}

withDefaults(defineProps<Props>(), {
  hasTabs: false,
  hasBreadCrumbs: false
})

const userSessionData = computed(() => store.getters['auth/userSessionData'])

const companyName = computed(() => {
  const x = userSessionData.value.activeContext.partner.company_name
  if (x.length > 15) {
    return `${x.slice(0, 15)}...`
  } else {
    return x
  }
})

const logout = async () => {
  // TODO: block UI with overlay while logout api is called
  try {
    window.$zoho.salesiq.reset();
    await axios.delete("/logout");
  } catch (e) {
    console.info("An error occurred while logging out");
  } finally {
    await store.dispatch("auth/clearSessionData");
    await router.push("/login");
  }
}

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease-in;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

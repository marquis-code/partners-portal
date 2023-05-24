<template>
  <div class="bg-gray-50 w-full min-h-screen overflow-x-hidden">
    <div>
      <div class="w-full pt-2 bg-white">
        <div
          class="px-3 md:px-7 top-part flex flex-row justify-between items-center py-3"
        >
          <div class="dashboard-name text-xl font-medium">
            {{ pageTitle }}
          </div>
          <div class="py-3 px-5 text-black rounded-lg font-medium">{{companyName}}</div>
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

<!-- <script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "PageLayout",
  props: {
    pageTitle: String,
    hasTabs: {
      type: Boolean,
      default: false,
    },
    hasBreadCrumbs: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      userSessionData: 'auth/userSessionData',
    })
  },
  data () {
    return { companyName: '' }
  },
  created () {
    this.setCompany()
  },
  methods: {
    setCompany() {
      this.companyName = this.userSessionData.activeContext.partner.company_name.slice(0, 15)
    },
    async logout() {
      // TODO: block UI with overlay while logout api is called
      try {
        window.$zoho.salesiq.reset();
        await this.$axios.delete("/logout");
      } catch (e) {
        console.info("An error occurred while logging out");
      } finally {
        await this.$store.dispatch("auth/clearSessionData");
        await this.$router.push("/login");
      }
    },
  },
});
</script> -->

<script setup lang="ts">
import { ref, defineProps, withDefaults, computed } from "vue";
import { useStore } from "vuex";
import {axiosInstance as axios} from '@/plugins/axios';
import router from "@/router";

const store = useStore()
const companyName = ref('')
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
const setCompany = () => {
  companyName.value = userSessionData.value.activeContext.partner.company_name.slice(0, 15)
}

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

setCompany()
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

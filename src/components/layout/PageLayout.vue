<template>
  <div class="bg-gray-50 w-full min-h-screen">
    <div>
      <div class="w-full px-3 md:px-7 py-2 bg-white">
        <div class="top-part flex flex-row justify-between items-center py-3">
          <div class="dashboard-name text-xl font-medium">
            {{ pageTitle }}
          </div>
        </div>
        <slot name="breadcrumbs"></slot>
        <hr class="mt-5 mb-0 hidden" />
        <div class="bottom-part">
          <slot name="actionsPane"></slot>
        </div>
      </div>
    </div>
    <div class="w-full h-full scroll-px-60 space-y-6 py-7 px-6">
      <transition name="fade" mode="out-in" appear>
        <div :key="$route.path">
          <slot />
        </div>
      </transition>
      <!-- <transition name="fade" mode="out-in">
          <slot></slot>
      </transition> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageLayout',
  props: {
    pageTitle: String,
    hasTabs: {
      type: Boolean,
      default: false
    },
    hasBreadCrumbs: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async logout() {
      // TODO: block UI with overlay while logout api is called
      try {
        await this.$axios.delete('/logout');
      } catch (e) {
        console.info('An error occurred while logging out');
      } finally {
        await this.$store.dispatch('auth/clearSessionData');
        await this.$router.push('/login');
      }
    }
  }
});
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

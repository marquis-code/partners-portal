<template>
  <div class="bg-gray-50 w-full min-h-screen">
    <div>
      <div class="w-full px-3 md:px-7 py-2 bg-white">
        <!--  <dynamic-tabs></dynamic-tabs>-->
        <div class="top-part flex flex-row justify-between items-center py-3">
          <div class="dashboard-name text-xl font-medium">
            {{ pageTitle }}
          </div>
          <div class="header-buttons flex flex-row">
<!--            Placeholder for organization selection-->
            <!--        <select class="bg-sh-green-100 py-1 md:py-2 px-1 md:px-3 rounded-lg border-2 border-sh-green-700" name="" id="">-->
            <!--          <option>Jiggy Motors</option>-->
            <!--          <option>Daniel's Org</option>-->
            <!--        </select>-->
<!--            <button class="px-4 bg-sh-green-500 text-grays-black-3 text-sm font-medium" >Logout</button>-->
            <img class="ml-2 md:ml-9" src="@/assets/images/notification-present.svg" @click="logout()">
          </div>
        </div>
        <hr class="mt-5 mb-0 hidden">
        <div class="bottom-part">
<!--          <Breadcrumbs :activeSection="activeSection"/>-->
          <slot name="actionsPane"></slot>
        </div>
      </div>
    </div>
    <div class="w-full h-full scroll-px-60 space-y-6 py-7 px-6">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "PageLayout",
  props: {
    pageTitle: String,
    hasTabs: {
      type: Boolean,
      default: false
    },
    hasBreadCrumbs: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    async logout () {
      // TODO: block UI with overlay while logout api is called
      try {
        await this.$axios.delete("/logout");
      } catch (e) {
        console.info("An error occurred while logging out");
      } finally {
        await this.$store.dispatch("auth/clearSessionData");
        await this.$router.push("/login");
      }
    }
  },
})
</script>

<style scoped>

</style>

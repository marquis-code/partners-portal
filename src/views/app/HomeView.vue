<template>
  <div class="home flex flex-row">
    <sidebar @sideBarNavigationClicked="changeNavigation"/>
    <div class="w-full">
      <AppHeader :activeSection="activeSection"/>
      <app-body>
        <router-view/>
        <button class="px-4 bg-sh-green-500 text-grays-black-3 text-sm font-medium" @click="logout()">Logout</button>
      </app-body>
    </div>
</div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import Sidebar from "./Sidebar.vue";
import AppHeader from "./AppHeader.vue";
import AppBody from "./AppBody.vue";

export default defineComponent({
  name: "Home",
  data() {
    return {
      activeSection: "View All"
    }
  },
  methods: {
    async logout() {
      // TODO: block UI with overlay while logout api is called
      try {
        await this.$axios.delete("/logout");
      } catch (e) {
        console.info("An error occurred while logging out");
      } finally {
        await this.$store.dispatch("auth/clearSessionData");
        await this.$router.push("/login");
      }
    },
    changeNavigation(activeSection: string) {
      this.activeSection = activeSection;
      this.$router.push(`/${activeSection.toLowerCase()}`)
    }
  },
  components: { Sidebar, AppHeader, AppBody }
})
</script>

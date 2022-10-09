<template>
  <div class="home bg-gray-100 flex flex-row">
    <sidebar/>
    <div>Navbar
      <button class="px-4 bg-sh-green-500 text-grays-black-3 text-sm font-medium" @click="logout()">Logout</button>
      <router-view/>
    </div>
</div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import Sidebar from "./Sidebar.vue";

export default defineComponent({
  name: "Home",
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
    }
  },
  components: { Sidebar }
})
</script>

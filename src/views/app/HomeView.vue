<template>
  <div class="home bg-gray-100 flex flex-row">
    <div class="w-64 h-screen py-9 px-4 bg-white">
      <div class="flex flex-row justify-between mb-9">
        <img src="@/assets/logo.png" class="h-6">
        <img src="@/assets/images/toggle.svg">
      </div>
      <div class="side-bar-item">
        <div class="item">
          <div>
            <img src="@/assets/images/side-bar.svg">
          </div>
        </div>
      </div>
    </div>
    <div>Navbar
      <button class="px-4 bg-sh-green-500 text-grays-black-3 text-sm font-medium" @click="logout()">Logout</button>
      <router-view/>
    </div>
</div>
</template>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: 'Home',
  methods: {
    async logout () {
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
})
</script>

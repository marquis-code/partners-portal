<template>
  <main>
    <router-view />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Earnings',
  components: {},
})
</script>

<style scoped>
.action {
  color:'red',
}
</style>

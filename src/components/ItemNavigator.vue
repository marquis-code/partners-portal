<template>
  <router-link
    :to="link"
    class="text-[14px] text-[#4848ED] underline"
  >{{title}}</router-link>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: [
    'title',
    'link'
  ],
  mounted() {
    console.log(this.$props);
  }
})
</script>

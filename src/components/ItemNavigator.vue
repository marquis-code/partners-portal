<template>
  <router-link
    :to="link"
    class="text-[14px] text-[#4848ED] underline"
  >{{title}}</router-link>
</template>

<!-- <script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: [
    'title',
    'link'
  ],
})
</script> -->

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  title: string
  link: string
}>()

</script>

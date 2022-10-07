<template>
  <div class="p-10">
    <ImageUpload :field="'nin'"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ImageUpload from '@/components/ImageUpload.vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    ImageUpload
  }
})
</script>

<style lang="scss" scoped>

</style>

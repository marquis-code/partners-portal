<template>
  <div
    class="
      w-11/12
      lg:w-6/12
      rounded-md
      py-8
      mx-auto
      flex
      justify-center
      items-center
      flex-col
      space-y-8
      mt-6
    "
    :class="hasRing ? 'ring-1 ring-gray-300' : ''"
  >
    <slot></slot>
  </div>
</template>

<!-- <script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FormContainer',
  components: {},
  props: {
    hasRing: Boolean,
    extraClass: String
  }
});
</script> -->

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  hasRing?: boolean
  extraClass?: string
}>()

</script>

<style lang="scss" scoped>
</style>

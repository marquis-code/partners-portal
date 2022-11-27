<template>
  <transition name="fade" mode="out-in" v-bind="$attrs">
    <main
      class="
        min-h-screen
        w-screen
        flex
        justify-center
        items-center
        flex-col
        space-y-6
      "
    >
      <slot></slot>
    </main>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false,
  name: 'OnboardingLayout',
  components: {}
});
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

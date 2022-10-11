<template>
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
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'OnboardingLayout',
  components: {

  }
})
</script>

<style lang="scss" scoped>

</style>

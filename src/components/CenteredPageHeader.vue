<template>
  <div class="flex flex-col text-center mx-auto space-y-3">
    <img class="mx-auto h-10" src="@/assets/logo.png" alt="shuttlers banner" />
    <h2 class="text-sh-grey-900 font-bold text-2xl">{{ title }}</h2>
    <p class="text-grays-black-5 font-light">{{ description }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core"

export default defineComponent({
  name: "onboardingHeader",
  props: {
    title: String,
    description: String,
  },
});
</script>

<style scoped></style>

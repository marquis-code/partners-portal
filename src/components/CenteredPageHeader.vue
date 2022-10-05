<template>
  <div class="flex flex-col text-center mx-auto">
    <img class="mx-auto" src="@/assets/logo.png" alt="shuttlers banner" />
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
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

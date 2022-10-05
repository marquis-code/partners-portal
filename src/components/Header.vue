<template>
  <div class="flex flex-col text-center mx-auto">
    <img
      class="mx-auto"
      src="@/assets/images/shuttlers-banner.svg"
      alt="shuttlers banner"
    />
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
  </div>
</template>

<script>
export default {
  name: "onboardingHeader",
  props: {
    title: String,
    description: String,
  },
};
</script>

<style scoped></style>

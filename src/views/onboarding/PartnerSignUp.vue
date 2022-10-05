<template>
  <Header
    :title="'Create a partner account'"
    :description="'Select a category to sign up as'"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from "../../components/CenteredPageHeader.vue";

export default defineComponent({
  name: "PartnerSignUp",
  components: {
    Header,
  },
});
</script>

<style lang="scss" scoped></style>

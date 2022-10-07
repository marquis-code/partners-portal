<template>
    <span class="flex flex-row align-middle">
      <span class=".text-value bg-black text-white p-3 rounded-lg">
        {{value}}
      </span>
      <img @click="$emit('deleteThisItem')" class="w-5 h-5" src="@/assets/images/cancel.svg">
    </span>
</template>

<script>
export default {
  name: "SelectedCityBadge",
  props: {
    value: String
  }
}
</script>
<style scoped>
</style>

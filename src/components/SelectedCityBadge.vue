<template>
    <span class="flex flex-row align-middle items-center mb-2">
      <span class=".text-value bg-black text-white p-3 rounded-lg">
        {{value.city.name}}
      </span>
      <img @click="$emit('removeCity', value)" class="w-5 h-5 ml-1" src="@/assets/images/cancel.svg">
    </span>
</template>

<!-- <script>
export default {
  name: "SelectedCityBadge",
  props: {
    value: Object
  }
}
</script> -->

<script setup lang="ts">
import {defineProps} from 'vue'

defineProps<{
  value: any
}>()

</script>

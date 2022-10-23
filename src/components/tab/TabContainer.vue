<template>
    <span class="tab-container flex flex-row w-max">
      <slot/>
    </span>
</template>

<script>
import TabItem from '@/components/tab/TabItem.vue'
export default {
  components: {
    // TabItem
  },
  // data() {
  //   return {
  //     titles: ['Profile Information', 'Company Information', 'Settlement Accoount']
  //   }
  // }
};
</script>

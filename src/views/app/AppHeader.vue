<template>
  <div class="w-full px-3 md:px-7 py-5 bg-white">
    <div class="top-part flex flex-row justify-between items-center">
      <div class="dashboard-name text-xl font-medium">
        Dashboard
      </div>
      <div class="header-buttons flex flex-row">
        <img class="ml-2 md:ml-9" src="@/assets/images/notification-present.svg">
      </div>
    </div>
    <hr class="mt-5 mb-0 hidden">
    <div class="bottom-part hidden">
      <Breadcrumbs :activeSection="activeSection"/>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue';
import Breadcrumbs from './Breadcrumbs.vue';
export default defineComponent({
  name: "AppHeader",
  props: {
    activeSection: String
  },
  data () {
    return {
    };
  },
  methods: {},
  components: { Breadcrumbs }
})
</script>

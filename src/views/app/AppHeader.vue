<template>
  <div class="w-full px-3 md:px-7 py-5 bg-white">
    <div class="top-part flex flex-row justify-between items-center">
      <div class="dashboard-name text-xl font-medium">
        Dashboard
      </div>
    </div>
    <hr class="mt-5 mb-0 hidden">
    <div class="bottom-part hidden">
      <Breadcrumbs :activeSection="activeSection"/>
    </div>
  </div>
</template>

<!-- <script lang="ts">
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
</script> -->

<script setup lang="ts">
import { defineProps} from 'vue';
import Breadcrumbs from './Breadcrumbs.vue';

defineProps<{
  activeSection?: string
}>()
</script>

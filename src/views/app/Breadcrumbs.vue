<template>
  <div>
    <nav class="rounded-md w-full pb-3">
      <ol class="list-reset flex">
        <li><a href="#" class="text-gray-200">Dashboard</a></li>
        <span class="material-icons text-gray-200">
          navigate_next
        </span>
          <span v-if="activeSection" class="flex flex-row">
            <li><a href="#" class="text-black">{{activeSection}}</a></li>
          </span>
      </ol>
    </nav>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue';
export default defineComponent({
  name: "Breadcrumbs",
  props: {
    activeSection: String
  },
  data() {
    return {
    }
  },
  methods: {

  }
})
</script>

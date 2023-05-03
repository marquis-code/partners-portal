<template>
  <div v-if="showNotification" class="mb-6 bg-sh-purple-700 p-3 rounded-xl flex flex-row items-center justify-between">
    <div class="flex flex-row items-center">
      <img v-if="type === 'action'" class="mr-4" src="@/assets/icons/doc-to-upload.svg">
      <img v-else class="mr-4" src="@/assets/icons/wait.svg">
      <p class="text-white text-xs md:text-base">{{message}} </p>
    </div>
    <div class=" flex flex-row items-center">
      <button v-if="actionRequired" @click="uploadDocument" class="p-4 p-2 bg-gray-100 rounded-lg font-medium mr-2 text-xs md:text-base">
        Upload vehicle document
      </button>
      <img src="@/assets/icons/white-cancel.svg">
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from '@vue/runtime-core';

export default defineComponent({
  name: "Notification",
  props: {
    message: String,
    type: String,
    actionRequired: String
  },
  data () {
    return {
      showNotification: true
    }
  },
  methods: {
    closeNotificaition () {
      this.showNotification = false
    },
  }
});
</script>

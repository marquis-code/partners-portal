<template>
  <main class="space-y-2">
    <small class="font-medium text-xs text-gray-500"
      >{{ documentTitle }} (pdf, jpg, png)</small
    >
    <main
      class="
        ring-1 ring-gray-200
        rounded-md
        flex
        lg:w-4/12
        justify-between
        p-3
        space-x-3
        items-center
      "
    >
      <div class="">
        <img
          class="rounded-full"
          src="@/assets/images/pdfIcon.svg"
          v-if="fileType == 'png'"
          id="file_type"
        />
        <img
          class="rounded-full"
          src="@/assets/images/pdfIcon.svg"
          v-if="fileType == 'jpg'"
          id="file_type"
        />
        <img
          class="rounded-full"
          src="@/assets/images/pdfIcon.svg"
          v-if="fileType == 'pdf'"
          id="file_type"
        />
      </div>
      <div class="space-y-2">
        <p id="file_name" class="text-sm font-medium">{{ fileName }}</p>
        <small class="text-xs text-gray-400">{{ fileSize }}</small>
        <img src="@/assets/images/progress.svg" id="delete_icon" />
      </div>
      <div class="space-y-5">
        <img src="@/assets/images/delete.svg" id="delete_icon" />
        <p class="font-medium text-xs" id="progress_value">
          {{ uploadProgress }}%
        </p>
      </div>
    </main>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'FileUpload',
  props: {
    fileType: String,
    fileName: String,
    fileSize: String,
    uploadProgress: Number,
    documentTitle: String
  }
});
</script>

<style>
</style>

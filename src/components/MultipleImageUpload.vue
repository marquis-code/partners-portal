<template>
  <div>
    <form class="" ref="avatar-upload-form">
      <input
        type="file"
        accept="image/*,.pdf"
        ref="avatar"
        @change="uploadFiles"
        class="hidden"
        multiple
      />
    </form>
    <div v-if="!filesUploaded" class="space-y-2 w-full relative">
      <div
        class="
          py-8
          ring-1 ring-gray-300
          w-full
          flex flex-col
          rounded-md
          items-center
          cursor-pointer
        "
        @click="avatar.click()"
      >
        <img src="@/assets/images/upload.svg" />
        <p class="text-sm text-green-400">Click to upload</p>
        <p class="text-xs text-gray-400">or drag and drop</p>
      </div>
    </div>
    <div
      v-else
      class="
        p-4
        flex flex-row
        justify-left
        rounded-md
        items-center
        cursor-pointer
        h-24
        space-x-4
      "
      @click="removeFile"
    >
      <div class="flex flex-row w-full">
        <img class="w-20 h-20 mr-4 rounded-lg ring-1 ring-sh-green-500" v-for="(url, index) in imageUrls" :key="index" :src="url">
      </div>
    </div>
    <div class="flex flex-row">
      <p
        v-if="filesUploaded"
        @click="avatar.click()"
        class="text-sh-purple-700 font-medium text-sm mb- flex flex-row items-center mr-4"
      >
        <span
          class="material-icons"
        >add</span>
        Add Document
      </p>

      <p
        v-if="filesUploaded"
        @click="$emit('fileRemoved')"
        class="text-red-500 font-medium text-sm mb- flex flex-row items-center"
      >
        <span
          class="material-icons"
        >delete</span>
        Clear all
      </p>
  </div>
  </div>
</template>

<!-- <script lang="ts">

import { defineComponent } from '@vue/runtime-core';

interface UploadOptions {
  mimeTypes: string; // e.g *, image/jpg, pdf ...
  multiple: boolean; // component should support multiple uploads
  sizeLimit: number;
}

export default defineComponent({
  name: 'MultipleImageUpload',
  props: {
    field: String,
    imageUrls: Array
  },
  data () {
    return {
      selectedFile: {},
      filesUploaded: false,
      fileName: '',
      fileSize: '',
      uploadType: 'image',
    };
  },
  methods: {
    uploadFiles (event: any) {
      const objectContainingFiles = event.target.files;
      this.checkAllFilesSize(objectContainingFiles);
      this.filesUploaded = true;
      this.$emit('filesSelected', objectContainingFiles);
    },
    checkAllFilesSize(objectContainingFiles: any) {
      for (const key in objectContainingFiles) {
        if (!this.isFileSizeOk(objectContainingFiles[key].size)) {
          this.$toast.warning('Each file you select must be less than 10MB')
        }
      }
    },
    isFileSizeOk (fileSizeInBytes: number): boolean {
      if (fileSizeInBytes > 10000000) {
        return false;
      } else return true;
    },
    removeFile () {
      this.selectedFile = {};
      this.filesUploaded = false;
      this.fileName = '';
      this.fileSize = '';
      this.$emit('fileRemoved');
    }
  }
});
</script> -->

<script setup lang="ts">
import { ref, Ref, defineProps, defineEmits } from 'vue';
import {useToast} from 'vue-toast-notification';

interface UploadOptions {
  mimeTypes: string; // e.g *, image/jpg, pdf ...
  multiple: boolean; // component should support multiple uploads
  sizeLimit: number;
}

defineProps<{
  field?: string
  imageUrls: any[]
}>()
const toast = useToast();
const emit = defineEmits(['filesSelected', 'fileRemoved'])
const avatar = ref() as Ref<any>
const selectedFile = ref({})
const filesUploaded = ref(false)
const fileName = ref('')
const fileSize = ref('')
const uploadType = ref('image')

const uploadFiles = (event: any) => {
  const objectContainingFiles = event.target.files;
  checkAllFilesSize(objectContainingFiles);
  filesUploaded.value = true;
  emit('filesSelected', objectContainingFiles)
  // this.$emit('filesSelected', objectContainingFiles);
}

const checkAllFilesSize = (objectContainingFiles: any) => {
  for (const key in objectContainingFiles) {
    if (!isFileSizeOk(objectContainingFiles[key].size)) {
      toast.warning('Each file you select must be less than 10MB')
    }
  }
}

const isFileSizeOk = (fileSizeInBytes: number): boolean => {
  if (fileSizeInBytes > 10000000) {
    return false;
  } else return true;
}

const removeFile = () => {
  selectedFile.value = {};
  filesUploaded.value = false;
  fileName.value = '';
  fileSize.value = '';
  emit('fileRemoved')
  // this.$emit('fileRemoved');
}

</script>

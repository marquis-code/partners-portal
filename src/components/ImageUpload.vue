<template>
  <div>
    <form class="" ref="avatar-upload-form">
      <input
        type="file"
        accept="image/*,.pdf"
        ref="avatar"
        @change="uploadFile"
        class="hidden"
      />
    </form>

    <!-- This shows when a file is yet to be uploaded -->
    <div v-if="!fileUploaded && !uploading" class="space-y-2 w-full relative">
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
        @click="$refs.avatar.click()"
      >
        <img src="@/assets/images/upload.svg" />
        <p class="text-sm text-green-400">Click to upload</p>
        <p class="text-xs text-gray-400">or drag and drop</p>
      </div>
    </div>
    <!-- This shows when a file has been uploaded -->
    <div
      v-if="fileUploaded && !uploading"
      class="
        p-4
        ring-1 ring-gray-300
        flex flex-row
        justify-left
        rounded-md
        items-center
        cursor-pointer
        w-full
        md:w-1/2
        h-24
        space-x-4
      "
      @click="removeFile"
    >
      <img v-if="uploadType === 'pdf'" src="@/assets/images/pdfUploaded.svg" />
      <img v-else src="@/assets/images/imageUploaded.svg" />
      <div class="flex flex-col w-full">
        <div class="doc-info-and-delete flex flex-row justify-between">
          <div>
            <p class="text-sm text-black">{{ fileName }}</p>
            <p class="text-sm text-gray-400">{{ fileSize }} MB</p>
          </div>
          <img src="@/assets/images/bin.svg" />
        </div>
        <div
          class="doc-info-and-delete flex flex-row justify-between items-center"
        >
          <div class="bg-green-500 w-10/12 h-2 rounded-2xl"></div>
          <p class="w-2/12 text-right">100%</p>
        </div>
      </div>
    </div>
    <p
      v-if="fileUploaded && !uploading"
      @click="$refs.avatar.click()"
      class="text-sh-purple-700 font-medium text-sm mb-4"
    >
      Change Document
    </p>
    <!-- This shows in the process of uploading the image to s3 -->
    <div v-if="uploading">
      <Spinner/>
    </div>
  </div>
</template>
<script lang="ts">
import Spinner from './layout/Spinner.vue';
import { defineComponent } from '@vue/runtime-core';
interface UploadOptions {
  mimeTypes: string; // e.g *, image/jpg, pdf ...
  multiple: boolean; // component should support multiple uploads
  sizeLimit: number;
}
export default defineComponent({
  name: "ImageUpload",
  props: {
    field: String,
    uploading: Boolean
  },
  data () {
    return {
      selectedFile: {},
      fileUploaded: false,
      fileName: "",
      fileSize: "",
      uploadType: "image"
    };
  },
  methods: {
    uploadFile (event: any) {
      console.log("working")
      if (this.isFileSizeOk(event.target.files[0].size)) {
        this.selectedFile = event.target.files[0];
        this.fileSize = (event.target.files[0].size / 1000000)
          .toFixed(1)
          .toString();
        this.fileUploaded = true;
        this.fileName = event.target.files[0].name;
        if (event.target.files[0].type === "application/pdf") {
          this.uploadType = "pdf";
        } else { this.uploadType = "image"; }
        this.$emit("fileSelected", this.selectedFile);
      } else { this.$toast.warning("File must be less than 10 MB"); }
    },
    isFileSizeOk (fileSizeInBytes: number): boolean {
      if (fileSizeInBytes > 10000000) {
        return false;
      } else { return true; }
    },
    removeFile () {
      this.selectedFile = {};
      this.fileUploaded = false;
      this.fileName = "";
      this.fileSize = "";
      this.$emit("fileRemoved");
    }
  },
  components: { Spinner }
});
</script>
<style scoped>
</style>

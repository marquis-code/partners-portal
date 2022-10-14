<template>
  <div class="p-10 space-y-5">
    <file-upload
      :fileType="fileType"
      :fileName="fileName"
      :uploadProgress="uploadProgress"
      :fileSize="fileSize"
      :documentTitle="documentTitle"
    ></file-upload>
    <image-upload-preview :images="images"></image-upload-preview>
  </div>
</template>

<script lang="ts">
import ImageUploadPreview from '../../components/Uploads/ImageUploadPreview.vue';
import FileUpload from '../../components/Uploads/FileUpload.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Vehicles',
  components: {
    FileUpload,
    ImageUploadPreview
  },
  data () {
    return {
      fileType: 'png',
      fileName: 'file_001.pdf',
      uploadProgress: 100,
      fileSize: '1MB',
      documentTitle: 'Upload vehicle license document',
      images: [
        {
          image: require('@/assets/images/vehicleInteriors.svg')
        },
        {
          image: require('@/assets/images/vehicleInteriors.svg')
        },
        {
          image: require('@/assets/images/vehicleInteriors.svg')
        },
        {
          image: require('@/assets/images/vehicleInteriors.svg')
        }
      ]
    };
  }
});
</script>

<style lang="scss" scoped>
</style>

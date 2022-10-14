<template>
  <main class="lg:w-6/12">
    <div class="grid grid-cols-6 gap-5">
      <div v-for="(item, index) in images" :key="index" class="">
        <img :src="item.image" />
      </div>
    </div>
    <div class="space-y-3">
      <input type="file" id="file" @change="onFileChanged" />
      <label
        for="file"
        @click="onUpload"
        class="
          flex
          items-center
          justify-start
          space-x-2
          font-medium
          text-indigo-600
        "
      >
        <img src="@/assets/images/add.svg" />
        <p class="text-indigo-500 font-medium text-sm">Add another image</p>
      </label>
    </div>
  </main>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'ImageUploadPreview',
  props: {
    images: Array
  },
  data () {
    return {
      selectedImage: ''
    };
  },
  methods: {
    handleImageUpload () {
      // this.uploadedImages.push(this.selectedImage);
    },
    onFileChanged (event) {
      this.selectedImage = event.target.files[0];
      // this.images.push({ image: this.selectedImage });
    },
    onUpload () {
      // TODO: Impl this
    }
  }
});
</script>

<style>
input[type='file'] {
  display: none;
}
</style>

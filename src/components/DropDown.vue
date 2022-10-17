<template>
  <div class="menu-item mx-auto" @click="isOpen = !isOpen">
    <span class="material-icons ">
     more_vert
    </span>
    <transition name="fade" appear>
      <div class="drop-shadow-sm rounded-2xl p-5 absolute bg-white -translate-x-2/4 w-min" v-if="isOpen">
        <div @click="previewDocument" class="p-2 rounded-lg menu-item text-black hover:text-white hover:bg-black">
          <a>View</a>
        </div>
        <div @click="goToUpdateDocumentView" class="p-2 rounded-lg menu-item text-black hover:text-white hover:bg-black">
          <a>Update</a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {defineComponent} from "vue";
export default defineComponent({
  name: 'DropDown',
  props: ['docId', 'docUrl'],
  data () {
    return {
      isOpen: false
    }
  },
  methods: {
    previewDocument() {
      console.log(this.docUrl);
    },
    goToUpdateDocumentView() {
      console.log(this.docId)
    }
  }
})
</script>

<style>
</style>

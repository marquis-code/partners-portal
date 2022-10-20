<template>
  <div class="menu-item mx-auto relative" @click="isOpen = !isOpen">
    <span class="material-icons ">
     more_vert
    </span>
    <transition name="fade" appear>
      <div class="drop-shadow-sm rounded-2xl p-5 absolute z-10 bg-white -translate-x-2/4 w-min" v-if="isOpen">
        <div @click="previewDocument" class="p-2 rounded-lg menu-item text-black hover:text-white hover:bg-black">
          <a>View</a>
        </div>
        <div @click="goToUpdateDocumentView" class="p-2 rounded-lg menu-item text-black hover:text-white hover:bg-black">
          <a>Update</a>
        </div>
      </div>
    </transition>
    <vue-easy-lightbox
      :visible="visibleRef"
      :imgs="imgsRef"
      :index="indexRef"
      @hide="onHide"
    ></vue-easy-lightbox>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import { mapGetters } from "vuex";
export default defineComponent({
  name: 'DropDown',
  props: ['docId', 'docUrl', 'selectedDropDown'],
  data () {
    return {
      isOpen: false,
      visibleRef: false,
      indexRef: 0,
      imgsRef: [] as Array<string>,
    }
  },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext',
      vehicleData: 'vehicle/getVehicleData',
      isLoading: 'vehicle/getVehicleLoading'
    })
  },
  methods: {
    previewDocument() {
      this.imgsRef = [this.docUrl]
      this.onShow()
    },
    goToUpdateDocumentView() {
      this.$router.push({
        name: 'EditVehicleDocument',
        params: {vehicleId: this.vehicleData.id}
      })
    },
    onShow() {
      if (this.selectedDropDown === this.docId) {
        this.visibleRef = true;
      } else {
        this.visibleRef = false;
      }
    },
    onHide() {
      this.visibleRef = false;
    },
  }
})
</script>

<style>
</style>

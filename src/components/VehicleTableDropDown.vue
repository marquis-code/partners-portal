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

<!-- <script lang="ts">
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
        params: {
          vehicleId: this.vehicleData.id,
          documentId: this.docId
        }
      })
    },
    onShow() {
      console.log(this.selectedDropDown, this.docId)
      if (this.selectedDropDown === this.docId) {
        console.log("ture")
        this.visibleRef = true;
      } else {
        console.log("false")
        this.visibleRef = false;
      }
    },
    onHide() {
      this.visibleRef = false;
    },
  }
})
</script> -->

<script setup lang="ts">
import {ref, Ref, defineProps, computed} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const router = useRouter()
const store = useStore()
const props = defineProps<{
  docId: any
  docUrl: string
  selectedDropDown: any
}>()
const isOpen = ref(false)
const visibleRef = ref(false)
const indexRef = ref(0)
const imgsRef = ref([]) as Ref<string[]>

const partnerContext:any = computed(() => store.getters['auth/activeContext'])
const vehicleData:any = computed(() => store.getters['vehicle/getVehicleData'])
const isLoading:any = computed(() => store.getters['vehicle/getVehicleLoading'])

const previewDocument = () => {
  imgsRef.value = [props.docUrl]
  onShow()
}
const goToUpdateDocumentView = () => {
  router.push({
    name: 'EditVehicleDocument',
    params: {
      vehicleId: vehicleData.value.id,
      documentId: props.docId
    }
  })
}
const onShow = () => {
  console.log(props.selectedDropDown, props.docId)
  if (props.selectedDropDown === props.docId) {
    console.log("ture")
    visibleRef.value = true;
  } else {
    console.log("false")
    visibleRef.value = false;
  }
}
const onHide = () => {
  visibleRef.value = false;
}

</script>

<style>
</style>

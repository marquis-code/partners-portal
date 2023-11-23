<template>
<div class="relative">
  <div class="w-full relative rounded-sm shadow-sm">
    <single-vehicle :singleVehicleData="vehicleData" class="absolute"></single-vehicle>
  </div>
</div>
</template>

<!-- <script lang="ts">
import {defineComponent} from "vue";
import {extractErrorMessage} from "@/utils/helper";
import SingleVehicle from "@/views/app/vehicles/components/SingleVehicle.vue";
import {mapGetters} from "vuex";

export default defineComponent({
  name: "VehicleInfo",
  components: {
    SingleVehicle,
  },
  data () {
    return {
      vehicleInformation: null,
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      vehicleData: 'vehicle/getVehicleData',
      isLoading: 'vehicle/getVehicleLoading'
    })
  },
  methods: {
    getVehicleData () {
      this.$store.dispatch('vehicle/getVehicleInfo')
        .catch((e) => {
          this.$toast.error(extractErrorMessage(e));
        });
    }
  }
})
</script> -->

<script setup lang="ts">
import {ref, Ref, computed} from "vue";
import {extractErrorMessage} from "@/utils/helper";
import SingleVehicle from "@/views/app/vehicles/components/SingleVehicle.vue";
import {useStore} from "vuex";
import {useToast} from 'vue-toast-notification';

const toast = useToast()
const store = useStore()
const vehicleInformation = ref(null) as Ref<any>
const loading = ref(false)

const vehicleData:any = computed(() => store.getters['vehicle/getVehicleData'])
const isLoading:any = computed(() => store.getters['vehicle/getVehicleLoading'])

const getVehicleData = () => {
  store.dispatch('vehicle/getVehicleInfo')
    .catch((e) => {
      toast.error(extractErrorMessage(e), { position: 'top-right' });
    });
}
</script>

<template>
  <div class="relative">
    <div class="w-full relative rounded-sm shadow-sm">
      <single-driver
        @AssignVehicleToDriver="$emit('AssignVehicleToDriver')"
        :driver-data="driverData"
        class="absolute"
      ></single-driver>
    </div>
  </div>
</template>

<!-- <script lang="ts">
import { defineComponent } from 'vue';
import { extractErrorMessage } from '@/utils/helper';
import SingleDriver from '@/views/app/drivers/components/SingleDriver.vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'VehicleInfo',
  components: {
    SingleDriver
  },
  emits: ['AssignVehicleToDriver'],
  data() {
    return {
      driverInformation: null,
      loading: false
    };
  },
  computed: {
    ...mapGetters({
      driverData: 'driver/getDriverData',
      isLoading: 'driver/getDriverLoading'
    })
  },
  methods: {
    getDriverData() {
      this.$store.dispatch('driver/getDriverInfo').catch((e) => {
        this.$toast.error(extractErrorMessage(e));
      });
    }
  }
});
</script> -->

<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue';
import { extractErrorMessage } from '@/utils/helper';
import SingleDriver from '@/views/app/drivers/components/SingleDriver.vue';
import { useStore } from 'vuex';
import {useToast} from 'vue-toast-notification';

const toast = useToast()
const store = useStore()
const emit = defineEmits(['AssignVehicleToDriver'])
const driverInformation = ref(null)
const loading = ref(false)

const driverData:any = computed(() => store.getters['driver/getDriverData'])
const isLoading:any = computed(() => store.getters['driver/getDriverLoading'])

const getDriverData = () => {
  store.dispatch('driver/getDriverInfo').catch((e) => {
    toast.error(extractErrorMessage(e));
  });
}
</script>

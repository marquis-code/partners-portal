<template>
  <page-layout
    :page-title="
      !loading && !isLoading && vehicleData && vehicleData.brand
        ? `${vehicleData.brand} ${vehicleData.name}`
        : 'Vehicle Information'
    "
  >
    <template #breadcrumbs>
      <div v-if="vehicleData && !isLoading && !loading" class="flex items-center space-x-3 py-3 ml-[28px]">
        <router-link :to="'/vehicles'"  class="text-gray-400 text-sm hover:text-gray-900">Vehicles</router-link>
        <img src="@/assets/images/breadcrumbs.svg" />
        <p class="text-gray-900 text-sm">
          {{ vehicleData.brand }} {{ vehicleData.name }}
        </p>
      </div>
    </template>
    <template #actionsPane>
      <page-action-header>
        <template #action>
          <button
            @click="toggleDropdown"
            class="
              bg-sh-green-500
              font-medium
              border-none
              outline-none
              px-4
              py-2
              rounded-md
              text-sm
              flex
              justify-center
              items-center
              w-full
            "
          >
            <span>Actions</span>
            <span class="material-icons"> expand_more </span>
          </button>
          <div
            v-if="showDropdown"
            class="
              absolute
              top-36
              bottom-0
              right-7
              h-36
              w-44
              z-50
              rounded-md
              shadow-md
              flex flex-col
              bg-white
              px-5
            "
          >
            <a
              href.prevent="#"
              @click="editVehicle"
              class="
                text-gray-500
                cursor-pointer
                hover:bg-black hover:text-white
                rounded-md
                p-2
                pl-2
                mt-3
              "
              >Edit</a
            >
            <a
              v-if="!vehicleData.driver"
              href.prevent="#"
              @click="assignDriver(vehicleData)"
              class="
                text-gray-500
                cursor-pointer
                hover:bg-black hover:text-white
                rounded-md
                p-2
                pl-2
              "
              >Assign Driver</a
            >
            <a
              v-else
              href.prevent="#"
              @click="unassignDriver(vehicleData)"
              class="
                text-gray-500
                cursor-pointer
                hover:bg-black hover:text-white
                rounded-md
                p-2
                pl-2
              "
              >Unassign Driver</a
            >
            <a
              href.prevent="#"
              @click="removeVehicle(vehicleData)"
              class="
                text-red-500
                cursor-pointer
                hover:bg-red-500 hover:text-white
                rounded-md
                p-2
                pl-2
              "
              >Remove</a
            >
          </div>
        </template>

        <template #tabs>
          <TabContainer>
            <TabItem
              :title="'Vehicle information'"
              :to="{ name: 'vehicle.detail.info' }"
            />
            <TabItem :title="'Trips'" :to="{ name: 'vehicle.detail.trips' }" />
            <TabItem
              :title="'Vehicle documents'"
              :to="{ name: 'vehicle.detail.documents' }"
            />
          </TabContainer>
        </template>
      </page-action-header>
    </template>
    <div v-if="loading || isLoading">
      <spinner></spinner>
    </div>
    <template v-else>
      <router-view></router-view>
    </template>
  </page-layout>
</template>

<!-- <script>
import PageLayout from '../../../../components/layout/PageLayout';
import { mapGetters } from 'vuex';
import Spinner from '../../../../components/layout/Spinner';
import PageActionHeader from '../../../../components/PageActionHeader';
import emitter from '@/libs/emitter';
import TabContainer from '@/components/tab/TabContainer.vue';
import TabItem from '@/components/tab/TabItem.vue';
export default {
  name: 'VehicleDetailsIndex',
  components: {
    PageActionHeader,
    Spinner,
    PageLayout,
    TabItem,
    TabContainer
  },
  computed: {
    ...mapGetters({
      vehicleData: 'vehicle/getVehicleData',
      isLoading: 'vehicle/getVehicleLoading'
    })
  },
  data() {
    return {
      loading: true,
      showDropdown: false
    };
  },
  created() {
    this.$store
      .dispatch('vehicle/fetchVehicleInfo', this.$attrs.vehicleId)
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    editVehicle() {
      emitter.emit('vehicles:edit-vehicle');
      this.showDropdown = false;
    },
    assignDriver(item) {
      emitter.emit('vehicles:assign-driver', item?.id);
      this.showDropdown = false;
    },
    unassignDriver(item) {
      emitter.emit('vehicles:unassign-driver', item?.id);
      this.showDropdown = false;
    },
    removeVehicle(item) {
      console.log(item);
      this.showDropdown = false;
    }
  }
};
</script> -->

<script setup lang="ts">
import PageLayout from '../../../../components/layout/PageLayout.vue';
import { useStore } from 'vuex';
import Spinner from '../../../../components/layout/Spinner.vue';
import PageActionHeader from '../../../../components/PageActionHeader.vue';
import emitter from '@/libs/emitter';
import TabContainer from '@/components/tab/TabContainer.vue';
import TabItem from '@/components/tab/TabItem.vue';
import {ref, Ref, computed, useAttrs} from 'vue'

const store = useStore()
const attrs = useAttrs()
const vehicleData:any = computed(() => store.getters['vehicle/getVehicleData'])
const isLoading:any = computed(() => store.getters['vehicle/getVehicleLoading'])
const loading = ref(true)
const showDropdown = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
}
const editVehicle = () => {
  emitter.emit('vehicles:edit-vehicle' as any);
  showDropdown.value = false;
}
const assignDriver = (item:any) => {
  emitter.emit('vehicles:assign-driver', item?.id);
  showDropdown.value = false;
}
const unassignDriver = (item:any) => {
  emitter.emit('vehicles:unassign-driver', item?.id);
  showDropdown.value = false;
}
const removeVehicle = (item:any) => {
  console.log(item);
  showDropdown.value = false;
}

store
  .dispatch('vehicle/fetchVehicleInfo', attrs.vehicleId)
  .finally(() => {
    loading.value = false;
  })
</script>

<style scoped>
</style>

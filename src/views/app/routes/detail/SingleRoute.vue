<template>
  <page-layout
    :page-title="`${routeDetails?.route?.pickup || ''} to ${
      routeDetails?.route?.destination || ''
    }`"
  >
    <template #actionsPane>
      <page-action-header>
        <template #breadcrumbs>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2 py-3">
              <a
                :to="{
                  name: 'trips.list'
                }"
                class="text-gray-400 text-sm hover:text-gray-900"
                >Routes</a
              >
              <img src="@/assets/images/breadcrumbs.svg" />
              <span> {{ routeDetails?.route?.route_code || '' }}</span>
            </div>
          </div>
        </template>
      </page-action-header>
    </template>
    <div v-if="loading">
      <spinner></spinner>
    </div>
    <template v-else>
      <main class="relative">
        <google-maps
          :startLocation="startPoint"
          :endLocation="endPoint"
          :routeLine="polyline"
          class="h-full absolute -top-7 -right-10 -left-7 bottom-0" />
        <section
          class="
            lg:absolute
            mt-10
            lg:mt-0 lg:w-7/12
            md:w-7/12 md:mt-10
            lg:top-3
            xl:w-5/12 xl:top-10 xl:left-10
            right-0
            bottom-0
            left-10
          "
        >
          <div
            class="
              z-50
              p-10
              rounded-md
              shadow-md
              bg-white
              grid grid-cols-1
              divide-y
              space-y-4
            "
          >
            <h1>Route Information</h1>

            <div class="flex items-center justify-between pt-4">
              <div class="space-y-1">
                <p class="text-sm font-medium">Route</p>
                <trip-history
                  :pickup="routeDetails.route.pickup"
                  :destination="routeDetails.route.destination"
                ></trip-history>
              </div>
              <p class="bg-sh-grey-100 px-2.5 py-1 rounded-2xl text-xs">
                {{ routeDetails?.route?.route_code }}
              </p>
            </div>

            <div class="flex justify-between items-center pt-4">
              <div class="flex space-x-2">
                <p class="text-sm font-medium">Driver assigned</p>
              </div>
              <router-link
                class="
                  text-indigo-500
                  underline
                  text-xs
                  hover:text-sh-green-500 hover:decoration-sh-green-500
                "
                :to="`/drivers/details/${routeDetails.driver.id}/information`"
                >{{ routeDetails.driver.fname || '' }}
                {{ routeDetails.driver.lname || '' }}</router-link
              >
            </div>
            <div class="flex justify-between items-center pt-4">
              <div class="flex space-x-2">
                <p class="text-sm font-medium">Vehicle assigned</p>
              </div>
              <router-link
                class="
                  text-indigo-500
                  underline
                  text-xs
                  hover:text-sh-green-500 hover:decoration-sh-green-500
                "
                :to="{
                  name: 'vehicle.detail.info',
                  params: { vehicleId: routeDetails?.vehicle_id }
                }"
                >{{ routeDetails?.vehicle?.seats }} seater -
                {{ routeDetails?.vehicle?.brand }}
                {{ routeDetails?.vehicle?.name }} : {{
                  routeDetails?.vehicle?.registration_number
                }}</router-link
              >
            </div>
            <div class="flex justify-between items-center pt-4">
              <div class="flex space-x-2">
                <p class="text-sm font-medium">Cost Of Supply</p>
              </div>
              <p class="text-sm">NGN {{ routeDetails.cost_of_supply }}</p>
            </div>
            <div class="flex justify-between items-center pt-4">
              <div class="flex space-x-2">
                <p class="text-sm font-medium">Days available</p>
              </div>
              <p class="text-sm">
                {{
                  getDaysCount(routeDetails.route.route_availability_days)
                    .length === 7
                    ? 'Everyday'
                    : getDays(
                        getDaysCount(routeDetails.route.route_availability_days)
                      )
                }}
              </p>
            </div>
            <div class="flex justify-between items-center pt-4">
              <div class="flex space-x-2">
                <p class="text-sm font-medium">Availability</p>
              </div>
              <p
                v-if="routeDetails?.route?.visibility === 'private'"
                class="text-sm bg-black text-white px-2 py-1 rounded-2xl"
              >
                private
              </p>
              <p
                v-if="routeDetails?.route?.visibility === 'public'"
                class="text-sm bg-sh-green-700 text-white px-2 py-1 rounded-2xl"
              >
                public
              </p>
            </div>
            <div class="flex justify-between items-center pt-4">
              <div class="flex space-x-2">
                <p class="text-sm font-medium">City</p>
              </div>
              <p class="text-sm">
                {{ routeDetails?.route.city?.name || 'N/A' }}
              </p>
            </div>
          </div>
        </section>
      </main>
    </template>
  </page-layout>
</template>

<!-- <script>
import PageLayout from '@/components/layout/PageLayout';
import { mapGetters } from 'vuex';
import Spinner from '@/components/layout/Spinner';
import PageActionHeader from '@/components/PageActionHeader';
import { extractErrorMessage } from '@/utils/helper';
import TripHistory from '@/components/TripHistory.vue';
import GoogleMaps from '@/components/map/GoogleMaps.vue';
import { formatGeometry } from '@/utils/mapFunctions';

export default {
  name: 'DriverDetailsIndex',
  components: {
    PageActionHeader,
    Spinner,
    PageLayout,
    TripHistory,
    GoogleMaps
  },
  props: {
    routeId: Number || String
  },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext'
    })
  },
  data () {
    return {
      loading: false,
      trip: {},
      routeDetails: {},
      polyline: [],
      startPoint: {},
      endPoint: {},
      centerPoint: {},
    };
  },
  created () {
    this.fetchPartnerRouteDetails();
  },
  methods: {
    getDaysCount (stringifiedList) {
      const days = JSON.parse(stringifiedList);
      return days;
    },
    getDays (daysList) {
      let days = '';
      for (let index = 0; index < daysList.length; index++) {
        const element = daysList[index];
        // eslint-disable-next-line no-const-assign
        days += element + ', ';
      }
      return days;
    },
    async fetchPartnerRouteDetails () {
      this.loading = true;
      try {
        const response = await this.$axios.get(
          `/v1/partners/${this.partnerContext.partner.id}/routes/${this.routeId}`
        );
        this.routeDetails = response.data;
        this.getRouteGeometry();
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage, { position: 'top-right' });
      } finally {
        this.loading = false;
      }
    },
    getRouteGeometry () {
      console.log(1)
      this.polyline = formatGeometry(this.routeDetails.route.geometry);
      // console.log(this.routeDetails.route.geometry)
      // console.log(this.polyline)
      this.startPoint = this.polyline[0];
      this.endPoint = this.polyline[this.polyline.length - 1];
      this.centerPoint = this.polyline[parseInt(this.polyline.length / 2)];
      console.log(this.startPoint)
      console.log(this.endPoint)
      console.log(this.centerPoint)
      console.log(2)
    }
  }
};
</script> -->

<script setup lang="ts">
import PageLayout from '@/components/layout/PageLayout.vue';
import { useStore } from 'vuex';
import Spinner from '@/components/layout/Spinner.vue';
import PageActionHeader from '@/components/PageActionHeader.vue';
import { extractErrorMessage } from '@/utils/helper';
import TripHistory from '@/components/TripHistory.vue';
import GoogleMaps from '@/components/map/GoogleMaps.vue';
import { formatGeometry } from '@/utils/mapFunctions';
import { ref, Ref, computed, defineProps } from 'vue'
import {axiosInstance as axios} from '@/plugins/axios';
import {useToast} from 'vue-toast-notification';

const toast = useToast()
const store = useStore()
const props = defineProps<{
  routeId: number|string
}>()
const partnerContext:any = computed(() => store.getters['auth/activeContext'])
const loading = ref(false);
const trip = ref({})
const routeDetails = ref({}) as Ref<any>
const polyline = ref([]) as Ref<any[]>
const startPoint = ref({}) as Ref<any>
const endPoint = ref({}) as Ref<any>
const centerPoint = ref({}) as Ref<any>

const getDaysCount = (stringifiedList:any) => {
  const days = JSON.parse(stringifiedList);
  return days;
}
const getDays = (daysList:any) => {
  let days = '';
  for (let index = 0; index < daysList.length; index++) {
    const element = daysList[index];
    // eslint-disable-next-line no-const-assign
    days += element + ', ';
  }
  return days;
}
const fetchPartnerRouteDetails = async () => {
  loading.value = true;
  try {
    const response = await axios.get(
      `/v1/partners/${partnerContext.value.partner.id}/routes/${props.routeId}`
    );
    routeDetails.value = response.data;
    getRouteGeometry();
  } catch (error) {
    const errorMessage = extractErrorMessage(
      error,
      null,
      'Oops! An error occurred, please try again.'
    );
    toast.error(errorMessage, { position: 'top-right' });
  } finally {
    loading.value = false;
  }
}
const getRouteGeometry = () => {
  console.log(1)
  polyline.value = formatGeometry(routeDetails.value.route.geometry);
  // console.log(this.routeDetails.route.geometry)
  // console.log(this.polyline)
  startPoint.value = polyline.value[0];
  endPoint.value = polyline.value[polyline.value.length - 1];
  centerPoint.value = polyline.value[Math.ceil(polyline.value.length / 2)];
  console.log(startPoint.value)
  console.log(endPoint.value)
  console.log(centerPoint.value)
  console.log(2)
}

fetchPartnerRouteDetails()
</script>

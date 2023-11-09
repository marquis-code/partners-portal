import {Ref, ref, computed} from 'vue'
import {axiosInstance as axios} from '@/plugins/axios';
import { useStore } from 'vuex';
import { extractErrorMessage } from '@/utils/helper';
import moment from 'moment';
import {useToast} from 'vue-toast-notification';
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'

const toast = useToast()
const loadingStats = ref(false);
const partnerStats = ref({
  hasADriver: null as any,
  hasAVehicle: null as any,
  hasUploadedCompanyDoc: null as any,
  hasSettlementAccount: null as any,
  hasCompletedAddressVerification: 'under-review',
  hasCompletedIdentityVerification: 'under-review',
  partnerDriverCount: 0,
  partnerVehicleCount: 0,
  partnerAccruedEarnings: 0,
  partnerCompletedTrips: 0,
  partnerUpcomingTrips: 0,
  ratingCount: 0,
  ratingOverTen: 0,
  monthTripCount: [] as any[],
  monthTripDays: [] as any[]
});
const doneCount = ref(0);
const isTodoComplete = ref(false);
const partnerType = ref('');
const period = ref('');

export const useDashboard = () => {
  const store = useStore()
  const partnerContext:any = computed(() => store.getters['auth/activeContext'])

  const getBarChartTripsData = async () => {
    try {
      const response =
        (await axios.get(
          `/v1/partners/${partnerContext.value.partner.id}/trips/stats`
        )) || [];
      const numberOfTripsPerDay = response.data.map((item:any) => {
        return item.total;
      });
      const tripDays = response.data.map((item:any) => {
        return moment(item.date).format('MMM Do YY');
      });
      partnerStats.value.monthTripCount = numberOfTripsPerDay;
      partnerStats.value.monthTripDays = tripDays;
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        null,
        'An error occured while fetching your trips history'
      );
      toast.warning(errorMessage);
    }
  }
  const checkIfAllTodosAreDone = () => {
    if (
      partnerStats.value.hasCompletedIdentityVerification === 'completed' &&
      partnerStats.value.hasCompletedAddressVerification === 'completed' &&
      partnerStats.value.hasUploadedCompanyDoc &&
      partnerStats.value.hasADriver &&
      partnerStats.value.hasAVehicle &&
      partnerStats.value.hasSettlementAccount
    ) {
      isTodoComplete.value = true;
    }
  }
  const getOverallRatings = async () => {
    try {
      // Use this to filter if and when the need arises
      // axios.get(`/ratings/partners/${partnerContext.value.partner.id}?creation_date_start=2021-02-33&creation_date_end=2021-02-33`)
      const response = await axios.get(
        `v1/ratings/partners/${partnerContext.value.partner.id}`
      );
      partnerStats.value.ratingCount = response.data.count;
      partnerStats.value.ratingOverTen = response.data.rating;
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        null,
        'Oops! An error occurred, please try again.'
      );
      toast.error(errorMessage);
    }
  }
  const checkIdentityStatuses = () => {
    if (partnerContext.value.onboardingState.address.status === 'completed') {
      partnerStats.value.hasCompletedAddressVerification = 'completed';
      doneCount.value += 1;
    }
    if (partnerContext.value.onboardingState.identity.status === 'completed') {
      partnerStats.value.hasCompletedIdentityVerification = 'completed';
      doneCount.value += 1;
    }
  }
  const setPartnerType = () => {
    if (partnerContext.value.onboardingState.address.partner_type === 'individual') {
      partnerType.value = 'individual'
    } else {
      partnerType.value = 'business'
    }
  }
  const checkIfSettlementAccountHasBeenProvided = async () => {
    try {
      const response = await axios.get(
        `/cost-revenue/v1/settlement-accounts?partnerId=${partnerContext.value.partner.account_sid}`
      );
      if (response.data?.length) {
        partnerStats.value.hasSettlementAccount = true;
        doneCount.value += 1;
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        null,
        'Oops! An error occurred, please try again.'
      );
      toast.error(errorMessage);
    }
  }
  const fetchDashboardSummary = async (period = '') => {
    loadingStats.value = true;
    try {
      const response = await axios.get(
        `/v1/partners/${partnerContext.value.partner.id}/summaries?period=${period}`
      );
      //  Total driver check
      partnerStats.value.partnerDriverCount = response.data.total_drivers;
      if (partnerStats.value.partnerDriverCount > 0) {
        partnerStats.value.hasADriver = true;
        doneCount.value += 1;
      }
      // Total vehicle check
      partnerStats.value.partnerVehicleCount = response.data.total_vehicles;
      if (partnerStats.value.partnerVehicleCount > 0) {
        partnerStats.value.hasAVehicle = true;
        doneCount.value += 1;
      }
      // Company document check
      partnerStats.value.hasUploadedCompanyDoc = response.data.companyDocs?.length;
      if (partnerStats.value.hasUploadedCompanyDoc) doneCount.value += 1;

      partnerStats.value.partnerUpcomingTrips = response.data.total_upcoming_trips;
      partnerStats.value.partnerCompletedTrips = response.data.total_completed_trips;
      partnerStats.value.partnerAccruedEarnings = response.data.earningsSummary?.unsettledEarnings?.amount || 0
    } catch (error) {
      const errorMessage = extractErrorMessage(error, null, 'Oops! An error occurred, please try again.');
      Swal.fire({ title: 'Error!', text: errorMessage || 'An error occured', icon: 'error', confirmButtonColor: "#000000"})
    } finally {
      loadingStats.value = false
    }
  }

  return {
    loadingStats,
    partnerStats,
    doneCount,
    isTodoComplete,
    partnerType,
    period,
    getBarChartTripsData,
    checkIdentityStatuses,
    checkIfAllTodosAreDone,
    getOverallRatings,
    setPartnerType,
    checkIfSettlementAccountHasBeenProvided,
    fetchDashboardSummary
  }
}

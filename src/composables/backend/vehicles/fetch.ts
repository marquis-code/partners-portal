import {Ref, ref, computed} from 'vue'
import {axiosInstance as axios} from '@/plugins/axios';
import { useStore } from 'vuex';

const loading = ref(false);
const tableData = ref([]) as Ref<any[]>
const totalRecords = ref(null) as Ref<any>
const filters = ref({
  status: 'active',
  search: '',
  pageNumber: 1,
  pageSize: 10
});

export const useVehicles = () => {
  const store = useStore()
  const partnerContext:any = computed(() => store.getters['auth/activeContext'])

  const fetchVehicles = () => {
    loading.value = true;
    const params = {
      related: 'driver',
      status: filters.value.status,
      metadata: true
    };
    axios.get(`/v1/partner/${partnerContext.value.partner?.id}/vehicles?page=${filters.value.pageNumber}&limit=${filters.value.pageSize}&search=${filters.value.search}`, { params })
      .then((res) => {
        tableData.value = res.data.data || [];
        totalRecords.value = res.data.metadata?.total;
      })
      .finally(() => {
        loading.value = false;
      });
  }

  return { loading, tableData, totalRecords, filters, fetchVehicles }
}

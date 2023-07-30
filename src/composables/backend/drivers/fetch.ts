import {ref, computed, Ref} from 'vue'
import {axiosInstance as axios} from '@/plugins/axios';
import { useStore } from 'vuex';

const filters = ref({
  status: 'active',
  search: '',
  pageNumber: 1,
  pageSize: 10
})
const loading = ref(false)
const tableData = ref([]) as Ref<any[]>
const totalRecords = ref(null) as Ref<any>

const formatApiFormData = (apiFormData: Array<any>) => {
  const newTableData: any = [];
  apiFormData.forEach((eachDriver) => {
    newTableData.push({
      id: eachDriver.driver.id,
      name: eachDriver.driver.fname + ' ' + eachDriver.driver.lname,
      fname: eachDriver.driver.fname,
      lname: eachDriver.driver.lname,
      phone: eachDriver.driver.phone,
      email: eachDriver.driver.email,
      routeVehicles: eachDriver?.routeVehicles || null,
      avatar: eachDriver.driver.avatar,
      active: eachDriver.driver.active,
      deleted_at: eachDriver.driver.deleted_at,
      created_at: eachDriver.driver.created_at,
      dob: eachDriver.driver.dob,
      residential_address: eachDriver.driver.residential_address,
      license_number: eachDriver.driver.license_number,
      expiry_date: eachDriver.driver.expiry_date,
      files: eachDriver.driver.files
    });
  });
  return newTableData;
}

export const useFetchDrivers = () => {
  const store = useStore()
  const userSessionData:any = computed(() => store.getters['auth/userSessionData'])

  const fetchDrivers = () => {
    loading.value = true;
    axios.get(`/v1/partners/${userSessionData.value.activeContext.partner.account_sid}/drivers?status=${filters.value.status}&page=${filters.value.pageNumber}&limit=${filters.value.pageSize}&search=${filters.value.search}`)
      .then((res) => {
        tableData.value = (formatApiFormData(res.data.data) as any) || [];
        totalRecords.value = res.data.metadata?.total;
      })
      .finally(() => {
        loading.value = false;
      });
  }

  return {loading, tableData, totalRecords, filters, fetchDrivers}
}

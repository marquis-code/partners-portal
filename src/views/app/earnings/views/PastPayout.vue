<template>
  <main>
    <page-layout page-title="Earnings">
      <template #breadcrumbs>
        <div class="flex items-center space-x-3 py-3  ml-[28px]">
          <router-link
            :to="'/earnings'"
            class="text-gray-400 text-sm hover:text-gray-900"
            >Earnings</router-link
          >
          <img src="@/assets/images/breadcrumbs.svg" />
          <p class="text-gray-900 text-sm font-[500]">Past Payouts</p>
        </div>
      </template>
      <div>
        <div class="w-[100%] h-[auto] bg-[#fff] mt-[2rem] p-[10px] relative">
          <div class="w-[100%] flex flex-row justify-end items-center">
            <div class="flex flex-row items-center">
              <select
                :v-model="filter.sortBy"
                class="p-[10px] text-[14px] border border-[#616161] rounded outline-none mr-[20px]"
              >
                <option value="this-month">This Month</option>
                <option value="last-week">Last Week</option>
              </select>
            </div>
          </div>
          <div class="space-y-5 ring-1 ring-gray-50 shadow-sm rounded-sm bg-white">
        <!--    <div class="flex items-center justify-end p-5">-->
        <!--      <download-button></download-button>-->
        <!--    </div>-->
        <div>
          <app-table
            :loading="isFetchingEarnings"
            :error-loading="errorLoading"
            :items="tableData"
            :fields="headers"
          >
            <template v-slot:amount="{item}">
              <span
                class="text-[14px]"
              >{{Intl.NumberFormat('en-US').format(item?.amount)}}</span>
            </template>
          </app-table>
        </div>
      </div>
        </div>
      </div>
    </page-layout>
  </main>
</template>

<!-- <script lang="ts">
import { defineComponent } from 'vue';
import PageLayout from '@/components/layout/PageLayout.vue';
import AppTable from '@/components/AppTable.vue';
import moment from 'moment';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'EarningInformation',
  components: {
    PageLayout,
    AppTable,
  },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext'
    }),
    changedFilterSortBy(nv) {
      if (nv === this.filter.sortBy) return false;
      return true;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.getAllPayouts();
    },
    gotoEarning() {
      this.$router.push('/earnings');
    },
    async getAllPayouts() {
      try {
        this.isFetchingPayouts = true;
        const response = await this.$axios.get(
          `/cost-revenue/v1/partners/${this.partnerContext.partner.account_sid}/payouts`
        );
        if (response.status === 200) {
          this.tableData = this.formatTableData(response.data.result) as Array<any>;
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.isFetchingPayouts = false;
      }
    },
    formatTableData(data: Array<any>) {
      try {
        const result = [];
        for (const d of data) {
          const obj = {} as any;
          obj.id = d.id;
          obj.date = moment(d.createdAt).format('DD MMMM YYYY');
          obj.time = moment(d.createdAt).format('hh:mm A');
          obj.bankName = d.settlementAccount.bankName;
          obj.accountNumber = d.settlementAccount.accountNumber;
          obj.amount = d.amount;

          result.push(obj);
        }
        return result;
      } catch (err) {
        console.log(err);
      }
    },
  },
  data() {
    return {
      searchText: '',
      isFetchingPayouts: true,
      errorLoading: false,
      filter: {
        sortBy: '',
      },
      headers: [
        { label: 'Date', key: 'date' },
        { label: 'Time', key: 'time' },
        { label: 'Bank Name', key: 'bankName' },
        { label: 'Account Number', key: 'accountNumber' },
        { label: 'Amount (₦)', key: 'amount' },
      ],
      tableData: [] as Array<any>,
      isFetchingAllEarnings: false,
      isFetchingSettlements: false,
      isFetchingNextPaydate: false,
    }
  }
})
</script> -->

<script setup lang="ts">
import { ref, Ref, computed, onMounted } from 'vue';
import PageLayout from '@/components/layout/PageLayout.vue';
import AppTable from '@/components/AppTable.vue';
import moment from 'moment';
import { useStore } from 'vuex';
import router from '@/router'
import {axiosInstance as axios} from '@/plugins/axios';

const store = useStore()
const searchText = ref('');
const isFetchingPayouts = ref(true);
const errorLoading = ref(false);
const filter = ref({ sortBy: '' });
const headers = [
  { label: 'Date', key: 'date' },
  { label: 'Time', key: 'time' },
  { label: 'Bank Name', key: 'bankName' },
  { label: 'Account Number', key: 'accountNumber' },
  { label: 'Amount (₦)', key: 'amount' },
]
const tableData = ref([]) as Ref<any[]>
const isFetchingAllEarnings = ref(false);
const isFetchingSettlements = ref(false);
const isFetchingNextPaydate = ref(false);

const partnerContext:any = computed(() => store.getters['auth/activeContext'])

const init = async() => {
  await getAllPayouts();
}
const gotoEarning = () => {
  router.push('/earnings');
}
const getAllPayouts = async() => {
  try {
    isFetchingPayouts.value = true;
    const response = await axios.get(
      `/cost-revenue/v1/partners/${partnerContext.value.partner.account_sid}/payouts`
    );
    if (response.status === 200) {
      tableData.value = formatTableData(response.data.result) as Array<any>;
    }
  } catch (e) {
    console.log(e);
  } finally {
    isFetchingPayouts.value = false;
  }
}
const formatTableData = (data: Array<any>) => {
  try {
    const result = [];
    for (const d of data) {
      const obj = {} as any;
      obj.id = d.id;
      obj.date = moment(d.createdAt).format('DD MMMM YYYY');
      obj.time = moment(d.createdAt).format('hh:mm A');
      obj.bankName = d.settlementAccount.bankName;
      obj.accountNumber = d.settlementAccount.accountNumber;
      obj.amount = d.amount;

      result.push(obj);
    }
    return result;
  } catch (err) {
    console.log(err);
  }
}

onMounted(() => {
  init()
})
</script>

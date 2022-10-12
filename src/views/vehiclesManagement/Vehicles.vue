<template>
  <div class="flex items-center space-x-2 pb-2">
    <p class="text-sm text-black font-medium underline">Active</p>
    <p class="text-sm text-gray-400 font-medium">Inactive</p>
  </div>
  <div class="space-y-5 ring-1 ring-gray-50 shadow-sm rounded-sm bg-white">
    <div class="flex items-center justify-end p-5">
      <download-button></download-button>
    </div>
    <div>
      <app-table
        :loading="loading"
        :error-loading="errorLoading"
        :items="items"
        :fields="headers"
      >
        <template v-slot:name="{ item }">
          <router-link
            :to="{ name: 'dashboard.users.view', params: { id: item.id } }"
            class="text-xs font-medium underline text-gray-type-3"
          >
            {{ `${item.fname} ${item.lname}` }}
          </router-link>
        </template>
      </app-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppTable from '@/components/AppTable.vue';
import DownloadButton from '@/components/DownloadButton.vue';
export default defineComponent({
  name: 'Vehicles',
  components: { AppTable, DownloadButton },
  created() {
    this.fetchVehicles();
  },
  data() {
    return {
      loading: false,
      errorLoading: false,
      headers: [
        { label: 'Brand', key: 'brand' },
        { label: 'Model', key: 'model' },
        { label: 'Plate No', key: 'plate_number' },
        { label: 'Type', key: 'type' },
        { label: 'Capacity', key: 'capacity' },
        { label: 'Driver', key: 'driver' },
        { label: 'Actions', key: 'actions' }
      ],
      items: []
    };
  },
  methods: {
    async fetchVehicles() {
      await this.$axios
        .get('/v1/vehicles')
        .then((res) => {
          this.items = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
});
</script>

<style lang="scss" scoped>
</style>

<template>
  <div>
    <nav class="rounded-md w-full pb-3 flex justify-between items-center">
      <ol class="list-reset flex">
        <li><a href="#" class="text-gray-200">Dashboard</a></li>
        <span class="material-icons text-gray-200"> navigate_next </span>
        <span v-if="activeSection" class="flex flex-row">
          <li>
            <a href="#" class="text-black">{{ activeSection }}</a>
          </li>
        </span>
      </ol>
      <div v-if="activeSection === 'Vehicles'">
        <button
          @click="handleVehicle()"
          class="text-black text-sm bg-sh-green-500 px-6 py-2 font-medium rounded-md"
        >
          Add Vehicle
        </button>
      </div>
    </nav>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  mounted() {
    console.log(this.activeSection);
  },
  name: 'Breadcrumbs',
  props: {
    activeSection: String
  },
  data() {
    return {};
  },
  methods: {
    handleVehicle() {
      this.$router.push({ name: 'AddVehicle', path: '/add-vehicle' });
    }
  }
});
</script>

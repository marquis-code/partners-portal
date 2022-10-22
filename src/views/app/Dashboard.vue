<template>
  <page-layout page-title="Dashboard">
    <div>
      <div class="flex space-x-2 lg:space-x-3 items-center">
        <div
          v-if="step !== 0"
          class="flex items-center space-x-1"
          :class="
            step === 0 ? 'text-grays-black-2' : 'text-grays-black-6'
          "
        >
          <span
            class="text-white rounded-full w-5 text-center text-xs"
            :class="step === 0 ? 'bg-grays-black-2' : 'bg-grays-black-7'"
            >1</span
          >
          <p class="lg:text-base text-sm">Document upload</p>
        </div>
        <p
          v-if="step !== 0"
          class="h-0.5 w-6 lg:w-20 bg-gray-500"
        ></p>
        <div
          v-if="step === 0 || 1"
          class="flex items-center space-x-1"
          :class="
            step === 1 ? 'text-grays-black-2' : 'text-grays-black-6'
          "
        >
          <span
            class="text-white rounded-full w-5 text-center text-xs"
            :class="step === 1 ? 'bg-grays-black-2' : 'bg-grays-black-7'"
          >
            {{ step === 2 ? 2 : 1 }}</span
          >
          <p class="lg:text-base text-sm">Shareholders</p>
        </div>
        <div
          v-if="step === 3"
          class="flex items-center space-x-1"
          :class="
            step === 3 ? 'text-grays-black-2' : 'text-grays-black-6'
          "
        >
          <span
            class="text-white rounded-full w-5 text-center text-xs"
            :class="step === 3 ? 'bg-grays-black-2' : 'bg-grays-black-7'"
          >
            {{ step === 3 ? 2 : 1 }}</span
          >
          <p class="lg:text-base text-sm">Shareholders</p>
        </div>
      </div>
      <div v-if="step === 1" class="h-full p-10 bg-white">
        <div class="mt-2">
          <div class="flex flex-row">
            <img src="@/assets/icons/purple-list.svg" class="mr-3" />
            <p class="font-medium">Incorporation Certificates</p>
          </div>
          <p class="text-sm text-gray-300 pt-5">
            Proof of existence of business
          </p>
          <label class="text-xs font-medium text-grays-black-6"
            >Upload document</label
          >
          <ImageUpload class="pt-3" />
        </div>

        <div class="mt-2 pt-5">
          '
          <div class="flex flex-row">
            <img src="@/assets/icons/purple-list.svg" class="mr-3" />
            <p class="font-medium">Incorporation Certificates</p>
          </div>
          '
          <p class="text-sm text-gray-300">Mermorandum of association</p>
          <label class="text-xs font-medium text-grays-black-5"
            >UThis holds the information of the first members of your
            business</label
          >
          <image-upload class="pt-3" />
        </div>
      </div>
      <div v-if="step === 2" class="p-10 bg-white h-screen">
        <div class="flex flex-row">
          <p class="font-medium">Add all shareholders</p>
        </div>
        <div
          v-for="(stakeholder, index) in stakeholders"
          :key="index"
          class="text-sm text-gray-500 pt-3 mb-7"
        >
          <section
            class="
              lg:flex
              justify-between
              space-y-3
              lg:space-y-0 lg:space-x-10
              items-center
            "
          >
            <div class="space-y-2 w-full">
              <label class="text-xs font-medium text-grays-black-5"
                >Stake Holder's Full Name</label
              >
              <input
                maxlength="11"
                type="text"
                class="
                  text-xs
                  border-none
                  outline-none
                  w-full
                  rounded-md
                  p-3
                  placeholder-gray-500 placeholder-opacity-25
                  ring-1 ring-gray-300
                "
                placeholder="Enter document number"
              />
              <!-- <span class="text-sm font-light text-red-500" v-if="v$.identityForm.document.type.$dirty && v$.identityForm.document.type.required.$invalid">
              This field is required
            </span> -->
            </div>
            <div class="space-y-2 w-full">
              <label class="text-xs font-medium text-grays-black-5"
                >Stake Holder Share</label
              >
              <input
                maxlength="11"
                type="text"
                class="
                  text-xs
                  border-none
                  outline-none
                  w-full
                  rounded-md
                  p-3
                  placeholder-gray-500 placeholder-opacity-25
                  ring-1 ring-gray-300
                "
                placeholder="Enter document number"
              />
              <!-- <span class="text-sm font-light text-red-500" v-if="v$.identityForm.document.document_id.$dirty && v$.identityForm.document.document_id.required.$invalid">
            This field is required
          </span> -->
            </div>
            <span class="material-icons text-red-500 my-auto">delete_forever</span>
          </section>
        </div>
        <button
          class="
            ring-1 ring-gray-200
            font-medium
            text-sm
            mb-
            flex flex-row
            mr-4
            px-2
            py-3
            rounded-lg
            mt-6
          "
          @click="addNewStakeHolder"
        >
          <span class="material-icons">add</span>
          Add new shareholder
        </button>
      </div>
      <div v-if="step === 3" class="h-full p-10 bg-white">HEere is three</div>
    </div>
  </page-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PageLayout from '@/components/layout/PageLayout.vue';
import AppModal from '@/components/Modals/AppModal.vue';
import ImageUpload from '@/components/ImageUpload.vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    PageLayout,
    ImageUpload
  },
  data() {
    return {
      step: 2,
      stakeholders: [
        {
          name: '',
          percent: 0
        }
      ]
    };
  },
  methods: {
    addNewStakeHolder() {
      console.log('I am here');
      this.stakeholders.push({
        name: '',
        percent: 0
      });
    }
  }
});
</script>

<style lang="scss" scoped>
</style>

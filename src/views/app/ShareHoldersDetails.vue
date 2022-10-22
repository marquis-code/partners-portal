<template>
  <page-layout page-title="Dashboard">
    <div class="h-full p-10 bg-white">
      <!-- Breadcrumb like  -->
      <div class="flex justify-center space-x-2 lg:space-x-3 items-center">
        <div
          class="flex items-center space-x-1"
          :class="step === 0 ? 'text-grays-black-2' : 'text-grays-black-6'"
        >
          <span
            class="text-white rounded-full w-5 text-center text-xs"
            :class="step === 0 ? 'bg-grays-black-2' : 'bg-grays-black-7'"
            >1</span
          >
          <p class="lg:text-base text-sm">Document upload</p>
        </div>
        <div class="w-5 h-1 bg-grays-black-7"></div>
        <div
          class="flex items-center space-x-1"
          :class="step === 1 ? 'text-grays-black-2' : 'text-grays-black-6'"
        >
          <span
            class="text-white rounded-full w-5 text-center text-xs"
            :class="step === 1 ? 'bg-grays-black-2' : 'bg-grays-black-7'"
          >
            2</span
          >
          <p class="lg:text-base text-sm">Shareholders</p>
        </div>
        <div class="w-5 h-1 bg-grays-black-7"></div>
        <div
          class="flex items-center space-x-1"
          :class="step === 2 ? 'text-grays-black-2' : 'text-grays-black-6'"
        >
          <span
            class="text-white rounded-full w-5 text-center text-xs"
            :class="step === 2 ? 'bg-grays-black-2' : 'bg-grays-black-7'"
          >
            3</span
          >
          <p class="lg:text-base text-sm">Shareholders KYC</p>
        </div>
      </div>
      <!-- Company documents -->
      <Transition>
      <div v-if="step === 0" class="flex flex-col justify-between">
        <div>
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
            <div class="flex flex-row">
              <img src="@/assets/icons/purple-list.svg" class="mr-3" />
              <p class="font-medium">Incorporation Certificates</p>
            </div>
            <p class="text-sm text-gray-300">Mermorandum of association</p>
            <label class="text-xs font-medium text-grays-black-5"
              >UThis holds the information of the first members of your
              business</label
            >
            <image-upload class="pt-3" />
          </div>
        </div>
        <div class="flex justify-end mt-16">
          <div class="button-holders flex items-center space-x-5">
            <button
              class="
                rounded-md
                w-32
                flex
                justify-center
                items-center
                p-3
                px-5
                text-sm text-grays-black-5
                ring-1 ring-gray-400
                font-medium
              "
              @click="$router.push({name: 'dashboard'})"
            >
              Go back
            </button>
            <button
              class="
                rounded-md
                w-32
                flex
                justify-center
                items-center
                p-3
                px-5
                text-sm
              "
              @click="goForward"
              :disabled="loading"
              :class="
                loading
                  ? 'cursor-not-allowed text-grays-black-5 bg-grays-black-7'
                  : 'bg-sh-green-500 font-medium'
              "
            >
              Next
              <img class="ml-2" src="@/assets/images/arrow.svg" />
            </button>
          </div>
        </div>
      </div>
      </Transition>
      <!-- Add share holders -->
      <Transition>
        <div
          v-if="step === 1"
          class="p-10 bg-white h-full flex flex-col justify-between"
        >
          <div>
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
                    >Enter a stakeholders name</label
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
                    >Stakeholder Share (%)</label
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
                    placeholder="Enter stakeholders percent"
                  />
                  <!-- <span class="text-sm font-light text-red-500" v-if="v$.identityForm.document.document_id.$dirty && v$.identityForm.document.document_id.required.$invalid">
                This field is required
              </span> -->
                </div>
              </section>
              <span
                v-if="index !== 0"
                class="text-red-500 my-auto mt-4"
                @click="removeStakeHolder(index)"
                >Remove stakeholder</span
              >
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
          <div class="flex justify-end mb-16">
            <div class="button-holders flex items-center space-x-5">
              <button
                class="
                  rounded-md
                  w-32
                  flex
                  justify-center
                  items-center
                  p-3
                  px-5
                  text-sm text-grays-black-5
                  ring-1 ring-gray-400
                  font-medium
                "
                @click="goBack"
              >
                Go back
              </button>
              <button
                class="
                  rounded-md
                  w-32
                  flex
                  justify-center
                  items-center
                  p-3
                  px-5
                  text-sm
                "
                @click="goForward"
                :disabled="loading"
                :class="
                  loading
                    ? 'cursor-not-allowed text-grays-black-5 bg-grays-black-7'
                    : 'bg-sh-green-500 font-medium'
                "
              >
                Next
                <img class="ml-2" src="@/assets/images/arrow.svg" />
              </button>
            </div>
          </div>
        </div>
      </Transition>
      <!-- List Share holders -->
      <Transition>
      <div v-if="step === 2" class="h-full p-10 bg-white flex flex-col justify-between">
        <div class="space-y-5 ring-1 ring-gray-50 shadow-sm rounded-sm bg-white">
          <AppTable
          :loading="loading"
          :error-loading="errorLoading"
          :items="tableData"
          :fields="headers"
          >
          <template v-slot:status="{ item }">
            <span class="text-sm text-black" :class="item.status === 'Pending' ? 'text-orange-500' : 'text-sh-green-500'">
              {{ item.status === 'Pending' ? 'Pending' : 'Submitted' }}
            </span>
          </template>
          <template v-slot:action="{ item }">
            <button class="p-2 border-2 border-sh-purple-700 text-sh-purple-700 rounded-lg">
              Verify KYC {{item.action}}
            </button>
          </template>
          </AppTable>
        </div>
        <div class="flex justify-end mb-16">
          <div class="button-holders flex items-center space-x-5">
            <button
              class="
                rounded-md
                w-32
                flex
                justify-center
                items-center
                p-3
                px-5
                text-sm text-grays-black-5
                ring-1 ring-gray-400
                font-medium
              "
              @click="goBack"
            >
              Go back
            </button>
            <button
              class="
                rounded-md
                w-32
                flex
                justify-center
                items-center
                p-3
                px-5
                text-sm
              "
              @click="$router.push({name: 'dashboard.start-kyc'})"
              :disabled="loading"
              :class="
                loading
                  ? 'cursor-not-allowed text-grays-black-5 bg-grays-black-7'
                  : 'bg-sh-green-500 font-medium'
              "
            >
              Next
              <img class="ml-2" src="@/assets/images/arrow.svg" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
    </div>
  </page-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PageLayout from '@/components/layout/PageLayout.vue';
import AppModal from '@/components/Modals/AppModal.vue';
import ImageUpload from '@/components/ImageUpload.vue';
import AppTable from '@/components/AppTable.vue';

export default defineComponent({
  components: {
    PageLayout,
    ImageUpload,
    AppTable
  },
  data() {
    return {
      step: 0,
      loading: false,
      stakeholders: [
        {
          name: '',
          percent: 0
        }
      ],
      errorLoading: 0,
      headers: [
        { label: 'Stakeholders name', key: 'name' },
        { label: 'Stakeholder share (%)', key: 'percent' },
        { label: 'KYC Status', key: 'status' },
        { label: 'Action', key: 'action' }
      ],
      tableData: [
        {
          name: 'Ahmed Hassani',
          percent: '60%',
          status: 'Pending',
          action: 'http'
        }
      ]
    };
  },
  methods: {
    removeStakeHolder(index: number) {
      if (index !== 0) {
        this.stakeholders.splice(index, 1);
        return;
      }
      return 0;
    },
    goBack() {
      this.step -= 1;
    },
    goForward () {
      this.step += 1;
    },
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

<style lang="scss" scoped>/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

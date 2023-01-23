<template>
  <page-layout page-title="Dashboard">
    <div v-if="checkLoading" class="py-10 text-center">
      <Spinner></Spinner>
    </div>
    <div class="h-full p-10 bg-white" v-else>
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
              <ImageUpload
                @fileSelected="
                  selectThisDocument($event, 'IncorporationCertificate')
                "
                :uploading="uploadingInc"
                class="pt-3"
              />
            </div>
            <div class="mt-2 pt-5">
              <div class="flex flex-row">
                <img src="@/assets/icons/purple-list.svg" class="mr-3" />
                <p class="font-medium">Mermorandum of association</p>
              </div>
              <p class="text-sm text-gray-300">
                This holds the information of the first members of your business
              </p>
              <label class="text-xs font-medium text-grays-black-5"
                >Upload document</label
              >
              <ImageUpload
                @fileSelected="selectThisDocument($event, 'Mermorandum')"
                :uploading="uploadingMem"
                class="pt-3"
              />
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
                @click="$router.push({ name: 'dashboard' })"
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
                @click="saveCompanyDocuments"
                :disabled="!allDocumentsUploaded"
                :class="
                  !allDocumentsUploaded
                    ? 'cursor-not-allowed text-grays-black-5 bg-grays-black-7'
                    : 'bg-sh-green-500 font-medium'
                "
              >
                <Spinner v-if="loading"/>
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
            <TransitionGroup name="list" tag="ul">
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
                      v-model="stakeholders[index].name"
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
                      type="number"
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
                      v-model="stakeholders[index].share_amount"
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
            </TransitionGroup>
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
                @click="SaveStakeHolders"
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
        <div
          v-if="step === 2"
          class="h-full p-10 bg-white flex flex-col justify-between"
        >
          <div
            class="space-y-5 ring-1 ring-gray-50 shadow-sm rounded-sm bg-white"
          >
            <AppTable
              :loading="loading"
              :error-loading="false"
              :items="tableData"
              :fields="headers"
            >
              <template v-slot:status="{ item }">
                <span
                  class="text-sm text-black"
                  :class="
                    item.status === 'pending'
                      ? 'text-orange-500'
                      : 'text-sh-green-500'
                  "
                >
                  {{ item.status === 'pending' ? 'Pending' : 'Submitted' }}
                </span>
              </template>
              <template v-slot:action="{ item }">
                <button
                  class="
                    p-2
                    border-2 border-sh-purple-700
                    text-sh-purple-700
                    rounded-lg
                  "
                  @click="proceedToCoperateKYC(item.action)"
                >
                  Verify KYC
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
                @click="$router.push({ name: 'dashboard.start-kyc' })"
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
import ImageUpload from '@/components/ImageUpload.vue';
import AppTable from '@/components/AppTable.vue';
import { mapGetters } from 'vuex';
import Spinner from '@/components/layout/Spinner.vue';

export default defineComponent({
  components: {
    PageLayout,
    ImageUpload,
    AppTable,
    Spinner
  },
  data () {
    return {
      step: 0,
      loading: false,
      uploadingInc: false,
      uploadingMem: false,
      uploadingToS3: false,
      incorporationCertificateUrl: [] as string[],
      mermorandumUrl: [] as string[],
      allDocumentsUploaded: false,
      checkLoading: false,
      stakeholders: [
        {
          name: '',
          share_amount: 0
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
  watch: {
    // Step 1 watchers
    incorporationCertificateUrl () {
      if (this.incorporationCertificateUrl[0] && this.mermorandumUrl[0]) {
        this.allDocumentsUploaded = true;
      }
    },
    mermorandumUrl () {
      if (this.incorporationCertificateUrl[0] && this.mermorandumUrl[0]) {
        this.allDocumentsUploaded = true;
      }
    },
  },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext'
    })
  },
  created () {
    this.checkIfShareHoldersHaveBeenProvided()
  },
  methods: {
    // functions for step 1, uploading the company documents
    async selectThisDocument ($event: any, type: string) {
      const fileHolder = $event;
      if (type === 'IncorporationCertificate') {
        this.uploadingInc = true;
      }
      if (type === 'Mermorandum') {
        this.uploadingMem = true;
      }
      const fileUrl: string = await this.uploadTos3andGetDocumentUrl(fileHolder);
      if (type === 'IncorporationCertificate') {
        this.incorporationCertificateUrl = [];
        this.incorporationCertificateUrl.push(fileUrl);
        this.$toast.success(`Incorporation Certificate uploaded`);
        this.uploadingInc = false;
      }
      if (type === 'Mermorandum') {
        this.mermorandumUrl = [];
        this.mermorandumUrl.push(fileUrl);
        this.$toast.success(`Mermorandum of association uploaded`);
        this.uploadingMem = false;
      }
    },
    removeFile () {
      this.incorporationCertificateUrl = [];
    },
    async uploadTos3andGetDocumentUrl (file:any) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await this.$axios.post(
          `/v1/upload/identity/files`,
          formData
        );
        if (response.data?.files?.length) {
          return response.data.files[0].Location;
        }
      } catch (error) {
        this.$toast.warning(
          'An error occured while uploading your file, please try again'
        );
      } finally {
        console.log('uploading');
      }
    },
    async saveCompanyDocuments () {
      const incPayload = {
        user_id: this.partnerContext.user_id.toString(),
        document: {
          files: this.incorporationCertificateUrl,
          type: 'Incorportation Certification'
        }
      };
      const memPayload = {
        user_id: this.partnerContext.user_id.toString(),
        document: {
          files: this.mermorandumUrl,
          type: 'Mermorandum of Association'
        }
      };
      this.loading = true;
      try {
        await this.$axios.post(
          `/v1/partners/${this.partnerContext.partner.account_sid}/corporate-documents`,
          {...incPayload}
        );
        await this.$axios.post(
          `/v1/partners/${this.partnerContext.partner.id}/corporate-documents`,
          {...memPayload}
        );
        this.$toast.success("Company documents uploaded");
        this.loading = false;
        this.step += 1;
      } catch (error) {
        this.$toast.warning("An error occured, Please try again");
      } finally {
        this.loading = false;
      }
    },
    async checkIfDocuumentsHaveBeenProvided () {
      try {
        const response = await this.$axios.get(`/v1/partners/${this.partnerContext.partner.id}/corporate-documents`);
        if (response.data.data.length > 0) {
          this.step = 1;
        }
      } catch (error) {
        this.$toast.warning('An error occured, Please refresh this page ')
      }
    },
    async checkIfShareHoldersHaveBeenProvided () {
      this.checkLoading = true
      try {
        const response = await this.$axios.get(`/v1/partners/${this.partnerContext.partner.account_sid}/share-holders`);
        // console.log(response.data.data)
        if (response.data.data.length > 0) {
          this.tableData = this.structureShareSholders(response.data.data);
          this.step = 2;
        } else {
          await this.checkIfDocuumentsHaveBeenProvided()
        }
      } catch (error) {
        this.$toast.warning('An error occured, Please refresh this page ')
      } finally {
        this.checkLoading = false
      }
    },
    // functionos for step two: adding stake holders
    removeStakeHolder (index: number) {
      if (index !== 0) {
        this.stakeholders.splice(index, 1);
        return;
      }
      return 0;
    },
    async SaveStakeHolders () {
      if (this.checkStakeSum()) {
        const newPayload = this.structurePayload();
        try {
          for (let index = 0; index < newPayload.length; index++) {
            const payload = newPayload[index];
            await this.$axios.post(`/v1/partners/${this.partnerContext.partner.account_sid}/share-holders`, {
              ...payload
            })
          }
          this.checkIfShareHoldersHaveBeenProvided()
          // this.step += 1;
        } catch (error) {
          this.$toast.warning('An error occured');
        }
        this.$toast.success('Partners saved');
      } else {
        return 0
      }
    },
    checkStakeSum () {
      const totalSum = this.stakeholders.reduce((init, stake) => {
        return init + stake.share_amount;
      }, 0)
      if (totalSum !== 100) {
        this.$toast.warning('The sum of all share must be 100%')
        return false;
      } else {
        return true;
      }
    },
    structurePayload () {
      const newPayload = this.stakeholders.map(stake => {
        return {
          fname: stake?.name?.split(" ")[0],
          lname: stake?.name?.split(" ")[1] || '-',
          share_amount: stake.share_amount
        }
      });
      return newPayload;
    },
    goBack () {
      this.step -= 1;
    },
    goForward () {
      this.step += 1;
    },
    addNewStakeHolder () {
      console.log('I am here');
      this.stakeholders.push({
        name: '',
        share_amount: 0
      });
    },
    // functions for step 3
    structureShareSholders (shareholderslist: any[]) {
      const stakeholders = shareholderslist.map(stake => {
        return {
          name: stake.fname + ' ' + stake.lname,
          percent: stake.share_amount || '',
          status: 'pending',
          action: stake.id
        }
      });
      return stakeholders;
    },
    proceedToCoperateKYC (shareholderId: number) {
      this.$router.push({name: 'dashboard.start-kyc', params: {id: `${shareholderId}`}})
    }
  }
});
</script>

<style lang="scss" scoped>
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

<template>
  <page-layout page-title="Edit Vehicle Information">
    <template #actionsPane>
      <PageActionHeader>
        <template #breadcrumbs>
          <div class="flex items-center space-x-3 py-3">
            <p class="text-gray-400 text-sm">Dashboard</p>
            <img src="@/assets/images/breadcrumbs.svg" />
            <router-link
              :to="{ name: 'vehicle.detail.documents' }"
              class="text-gray-400 text-sm"
              >Vehicle Documents</router-link
            >
            <img src="@/assets/images/breadcrumbs.svg" />
            <p class="text-gray-900 text-sm">Update Vehicle Information</p>
          </div>
        </template>
      </PageActionHeader>
    </template>
    <main v-if="edit_document_type" class="space-y-16 bg-white py-8 lg:w-10/12 mx-auto">
      <div
        class="
          flex
          justify-center
          pl-3
          md:pl-0
          lg:w-10/12
          mx-auto
          items-center
          md:space-x-3
          w-full
        "
      >
        <div class="flex items-center space-x-1">
          <p
            class="
              text-xs text-left
              font-medium
              cursor-pointer
              text-bg-grays-black-2
            "
          >
          {{edit_document_type}}
          </p>
        </div>
      </div>
      <div class="w-11/12 mx-auto">
        <main class="space-y-10">
          <!-- <p class="text-sm text-gray-300 pt-5"></p> -->
          <div class="">
            <p class="text-sm text-gray-300">{{edit_document_type}}</p>
            <div v-if="edit_expiry_date" class="space-y-2 w-full lg:w-6/12 pr-1 py-5">
              <label class="text-xs font-medium text-grays-black-5"
                >Expiry date</label
              >
              <input
                type="date"
                v-model="edit_expiry_date"
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
                placeholder="Choose a date"
              />
            </div>
            <label class="text-xs font-medium text-grays-black-5">
              Upload Image</label
            >
            <image-upload class="pt-3"></image-upload>
          </div>
        </main>
      </div>
    </main>
  </page-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PageLayout from '@/components/layout/PageLayout.vue';
import PageActionHeader from '@/components/PageActionHeader.vue';
import ImageUpload from '@/components/ImageUpload.vue';

export default defineComponent<any, any, any>({
  name: 'EditVehicleDocuments ',
  components: { PageLayout, PageActionHeader, ImageUpload },
  data() {
    return {
      edit_id: null,
      edit_document_type: "",
      edit_expiry_date: '',
      edit_files: [],
      document: {
        document_type: 'Vehicle Information',
        documents: [
          {
            id: 27,
            partner_id: 63,
            files: [
              'https://shuttlers-avatars.s3.us-east-2.amazonaws.com/admin-vWPsb5VLK.jpeg'
            ],
            document_type: 'Vehicle Information',
            verified_at: null,
            expiry_date: '2022-10-21T00:00:00.000Z',
            verified_by: null,
            status: 'submitted',
            document_slug: 'vehicle-',
            vehicle_id: 413,
            created_at: '2022-10-20 13:36:47',
            updated_at: '2022-10-20 13:36:47'
          }
        ]
      }
    };
  },
  methods: {
    viewMyVehiclesDocuments() {
      this.$router.push({ name: 'vehicle.detail.documents' });
    },
    setExistingFormDate() {
      this.edit_document_type = this.document.document_type;
      this.edit_expiry_date = this.document.documents[0].expiry_date?.slice(0, 10);
      this.edit_files = this.document.documents[0].files[0];
      this.edit_id = this.document.documents[0].id
    },
    updateThisDocument () {
      console.log(this.edit_id)
    }
  },
  created() {
    this.setExistingFormDate();
  }
});
</script>

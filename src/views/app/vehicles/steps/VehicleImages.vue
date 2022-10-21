<template>
  <form>
    <main class="space-y-10">
      <div class="">
        <p class="text-sm text-gray-300 pt-5">Vehicle Interior</p>
        <label class="text-xs font-medium text-grays-black-5"
          >Upload Vehicle interior document (pdf, jpg, png)</label
        >
        <MultipleImageUpload :imageUrls="interiorImages" @filesSelected="selectFile($event, 'interior')" @fileRemoved="removeFiles('interior')" class="pt-3"/>
      </div>

      <div class="">
        <p class="text-sm text-gray-300 pt-5">Vehicle Exterior</p>
        <label class="text-xs font-medium text-grays-black-5"
          >Upload Vehicle Exterior document (pdf, jpg, png)</label
        >
        <MultipleImageUpload :imageUrls="exteriorImages" @filesSelected="selectFile($event, 'exterior')" @fileRemoved="removeFiles('exterior')" class="pt-3"/>
      </div>

    </main>

    <div class="flex justify-end items-center space-x-5 pt-5">
     <button type="button" class="text-black text-sm bg-gray-300 px-6 py-3 font-medium rounded-md" @click="viewVehicleDetails(getVehicleFormData.id)"> Skip </button>
     <button type="button" class="text-black text-sm bg-sh-green-500 px-6 py-3 font-medium rounded-md" @click="submitFinalForm"> Submit</button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MultipleImageUpload from '@/components/MultipleImageUpload.vue';
import { mapGetters } from 'vuex';
import { extractErrorMessage } from '@/utils/helper';
export default defineComponent({
  components: { MultipleImageUpload },
  computed: {
    ...mapGetters({
      vehicleFormData: 'vehicle/getVehicleData',
      getVehicleFormData: 'vehicle/getVehicleFormData',
      user: 'auth/user',
      partnerContext: 'auth/activeContext'
    })
  },
  methods: {
    async selectFile ($event: File, type: string) {
      const multipleDocumentObjects = $event;
      const multipleDocumentList = this.convertImageObjectToList(multipleDocumentObjects);
      this.uploadTos3andGetDocumentUrlList(multipleDocumentList, type);
    },
    removeFiles (type: any) {
      if (type === 'interior') {
        this.interiorImages = []
      }
      if (type === 'exterior') {
        this.exteriorImages = []
      }
    },
    uploadTos3andGetDocumentUrlList (multipleImages: Array<File>, type: string) {
      this.uploadingFile = true;
      multipleImages.forEach(async file => {
        try {
          const formData = new FormData();
          formData.append('file', file);
          const response = await this.$axios.post(`/v1/upload/identity/files`, formData);
          if (response.data?.files?.length) {
            if (type === 'interior') {
              this.interiorImages.push(response.data.files[0].Location);
            }
            if (type === 'exterior') {
              this.exteriorImages.push(response.data.files[0].Location);
            }
          }
        } catch (error) {
          this.$toast.warning("An error occured while uploading your file, please try again")
        }
      });
      this.uploadingFile = false;
      this.$toast.success(`${type} images uploaded`)
    },
    convertImageObjectToList (imageObject: any) {
      const imageList = [];
      for (const key in imageObject) {
        if (imageObject[key].size) {
          imageList.push(imageObject[key])
        }
      }
      return imageList;
    },
    viewVehicleDetails (id : number) {
      this.$router.push({
        name: 'vehicle.detail.info',
        params: {vehicleId: id}
      });
    },
    async submitFinalForm () {
      this.submittingFinalForm = true;
      try {
        await this.$axios.post(`/v1/partners/${this.partnerContext.partner.id}/vehicle/${this.getVehicleFormData.id}/vehicle-images`, {
          uploads: [...this.interiorImages]
        });
        await this.$axios.post(`/v1/partners/${this.partnerContext.partner.id}/vehicle/${this.getVehicleFormData.id}/vehicle-images`, {
          uploads: [...this.exteriorImages]
        });
        this.viewVehicleDetails(this.getVehicleFormData.id);
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          null,
          'Oops! An error occurred, please try again.'
        );
        if (errorMessage === "\"uploads\" must contain at least 1 items") {
          this.$toast.error("All Vehicle Images must be uploaded")
        } else {
          this.$toast.error(errorMessage);
        }
      } finally {
        this.submittingFinalForm = false
      }
    },
  },
  data () {
    return {
      submittingFinalForm: false,
      uploadingFile: false,
      interiorImages: [] as Array<any>,
      exteriorImages: [] as Array<any>
    }
  }
})
</script>

<style>

</style>

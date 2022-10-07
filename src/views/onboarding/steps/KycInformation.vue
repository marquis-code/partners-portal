<template>
  <main class="space-y-5">
    <div class="flex justify-center items-center space-x-4">
      <p
        :class="[
          activeView === 0 ? 'text-grays-black-2' : 'text-grays-black-6'
        ]"
        class="text-sm"
      >
        Identity verification
      </p>
      <img src="@/assets/images/pointer.svg" />
      <p
        :class="[
          activeView === 1 ? 'text-grays-black-2' : 'text-grays-black-6'
        ]"
        class="text-sm"
      >
        Address verification
      </p>
    </div>
    <div>
      <div class="flex items-center space-x-2">
        <span class="rounded-full p-1 border-2 border-indigo-500"></span>
        <h1 class="text-grays-black font-medium text-xl">
          {{
            activeView === 0 ? 'Identity verification' : 'Address verification'
          }}
        </h1>
      </div>
      <small class="text-grays-black-3"
        >These information will help us know you more</small
      >
    </div>

    <template v-if="activeView === 0">
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
            >Means of Identification</label
          >
          <select
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
            @change="handleIdentity"
            v-model="selected"
          >
            <option value="" hidden>Select a document type</option>
            <option
              v-for="(identity, index) in identificationOptions"
              :value="index"
              :key="index"
            >
              {{ identity }}
            </option>
          </select>
        </div>
        <div class="space-y-2 w-full">
          <label class="text-xs font-medium text-grays-black-5">{{
            selected === 0
              ? 'NIN'
              : selected === 1
              ? 'Drivers License'
              : selected === 2
              ? 'BVN'
              : selected === 3
              ? 'Passport'
              : 'Document Name'
          }}</label>
          <input
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
        </div>
      </section>
      <section class="flex justify-start space-x-10 items-start">
        <div class="space-y-2 w-full lg:w-6/12">
          <label class="text-xs font-medium text-grays-black-5">D.O.B</label>
          <input
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
            placeholder="Choose date"
          />
        </div>
      </section>
    </template>

    <template v-if="activeView === 1">
      <section class="flex justify-start flex-col space-y-5 items-start">
        <div class="space-y-2 w-full lg:w-6/12">
          <label class="text-xs font-medium text-grays-black-5">Address</label>
          <input
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
            placeholder="Enter your address"
          />
        </div>
        <div class="space-y-2 w-full relative">
          <label class="text-xs font-medium text-grays-black-5"
            >Upload document (Electricity bill, Waste bill, water bill
            etc)</label
          >
          <input type="file" class="hidden" />
          <form class="" ref="avatar-upload-form">
            <input
              type="file"
              ref="avatar"
              @change="uploadFile"
              class="hidden"
            />
          </form>
          <div
            @click="$refs.avatar.click()"
            class="
              py-8
              ring-1 ring-gray-300
              w-full
              flex flex-col
              rounded-md
              items-center
              cursor-pointer
            "
          >
            <img src="@/assets/images/upload.svg" />
            <p class="text-sm text-green-400">Click to upload</p>
            <p class="text-xs text-gray-400">or drag and drop</p>
          </div>
        </div>
      </section>
    </template>
    <div class="flex justify-end">
      <div class="flex items-center space-x-5">
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
          v-if="activeView === 0"
          @click="$emit('goBack')"
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
            text-sm text-grays-black-5
            bg-grays-black-10
          "
          v-if="activeView === 0"
          @click="next()"
        >
          Next
          <img class="ml-2" src="@/assets/images/arrow.svg" />
        </button>
      </div>
      <div class="flex space-x-5" v-if="activeView === 1">
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
          @click="previous()"
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
            text-sm text-grays-black-5
            bg-grays-black-10
            font-medium
          "
        >
          Submit
        </button>
      </div>
    </div>
  </main>
</template>

<script>
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';
export default defineComponent({
  name: 'KycInformation',
  data() {
    return {
      activeView: 0,
      file: '',
      selected: '',
      identificationOptions: ['NIN', 'Drivers License', 'BVN', 'Passport']
    };
  },
  methods: {
    ...mapActions('auth', ['setSessionData']),
    setupInterfaceData () {
      this.activeView = 0;
    },
    next () {
      this.activeView += 1;
    },
    previous () {
      this.activeView -= 1;
    },
    uploadFile () {
      this.file = this.$refs.avatar.files[0];

      const reader = new FileReader();

      reader.addEventListener('load', (fileLoadedEvent) => {
        const avatar = fileLoadedEvent.target.result;

        this.uploadingAvatar = true;
      });

      reader.readAsDataURL(this.file);
    }
  }
});
</script>

<template>
  <main>
    <notification-modal-content>
      <template #modalHeader>
        <div class="flex justify-center items-center">
          <img v-if="type == 'success'" src="@/assets/images/successIcon.svg" />
          <img v-if="type == 'failure'" src="@/assets/images/failureIcon.svg" />
          <img v-if="type == 'info'" src="@/assets/images/infoIcon.svg" />
        </div>
      </template>
      <template #modalBody>
        <div class="space-y-2 px-3 w-11/12">
          <h1 class="text-gray-700 text-lg font-medium text-center">{{ title }}?</h1>
          <p class="text-gray-400 text-xs lg:text-sm text-center">
            {{ description }}
          </p>
        </div>
      </template>
      <template #modalExtras>
        <div v-if="modalExtras == true" class="relative w-full px-4">
          <div class="">
            <input
              type="email"
              placeholder="opearations@shuttlers.ng"
              class="
                rounded-md
                text-sm
                px-5
                py-3
                w-full
                ring-1 ring-gray-50
                bg-gray-100
                border-none
                outline-none
              "
            />
          </div>
          <img
            class="absolute top-4 left-72 lg:left-80 bottom-0 z-50"
            src="@/assets/images/email.svg"
          />
        </div>
      </template>
      <template #modalFooter>
        <div v-if="type == ('success' || 'failure')" class="w-full px-5 pt-5">
          <button
            class="
              text-gray-800
              font-medium
              text-sm
              w-full
              py-2
              rounded-md
              bg-sh-green-500
            "
          >
            Dismiss
          </button>
        </div>

        <div v-else class="flex space-x-7">
          <button
            class="text-gray-600 rounded-md px-7 py-2 ring-1 ring-gray-500"
          >
            Cancel
          </button>
          <button class="text-white bg-red-500 rounded-md px-7 py-2">
            Remove
          </button>
        </div>
      </template>
    </notification-modal-content>
  </main>
</template>

<script>
import NotificationModalContent from './NotificationModalContent.vue';
export default {
  components: { NotificationModalContent },
  props: {
    type: String,
    title: String,
    description: String,
    modalExtras: Boolean
  }
};
</script>

<style>
</style>

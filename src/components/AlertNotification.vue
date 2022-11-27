<template>
  <main
    v-if="showAlert"
    class="
      w-full
      bg-indigo-600
      px-5
      py-3
      rounded-md
      flex
      justify-between
      items-center
    "
  >
    <div class="flex items-center space-x-2">
      <img src="@/assets/images/uploadIcon.svg" class="h-10" />
      <p class="text-gray-100">{{ message }}</p>
    </div>
    <div>
      <button class="p-3 rounded-md bg-gray-100 text-gray-500 text-sm">
        Upload vehicle document
      </button>
    </div>
  </main>
</template>

<script>
export default {
  name: 'AlertNotification',
  props: {
    message: String,
    showAlert: Boolean
  }
};
</script>

<style>
</style>

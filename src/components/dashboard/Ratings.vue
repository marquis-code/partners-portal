<template>
  <main class="p-10 flex justify-between items-center space-x-6">
    <div class="flex justify-center items-center flex-col space-y-3">
      <p class="text-sm text-gray-400">Ratings count</p>
      <div class="flex items-center space-x-2">
        <h1 class="font-bold">0.0</h1>
        <p
          class="
            text-sh-purple-700
            bg-indigo-300
            rounded-full
            w-7
            h-7
            flex
            justify-center
            items-center
            text-center text-xs
          "
        >
          0%
        </p>
      </div>
      <small class="text-xs text-gray-400"
        >Growth in ratings for this month</small
      >
    </div>
    <div class="h-full w-0.5 bg-gray-200"></div>
    <div class="flex justify-center items-center flex-col space-y-3">
      <p class="text-sm text-gray-400">Average ratings</p>
      <div class="flex items-center space-x-2">
        <h1 class="font-bold">0.0</h1>
        <div class="flex items-center">
          <img src="@/assets/images/ratingStar.svg" />
          <img src="@/assets/images/ratingStar.svg" />
          <img src="@/assets/images/ratingStar.svg" />
          <img src="@/assets/images/ratingStar.svg" />
          <img src="@/assets/images/ratingStar.svg" />
        </div>
      </div>
      <small class="text-xs text-gray-400">Average ratings this month</small>
    </div>
  </main>
</template>
<script>
export default {};
</script>
<style>
</style>

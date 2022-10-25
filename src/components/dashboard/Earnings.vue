<template>
  <main class="rounded-md bg-sh-grey-900 shadow-sm p-6 space-y-5">
    <img src="@/assets/images/earningsIcon.svg" />
    <p class="text-grays-black-4">Accrued earnings</p>
    <h1 class="text-grays-white text-2xl font-bold">NGN 20,000,000</h1>
    <div class="bg-grays-black-7 w-full h-0.5"></div>
    <div>
      <router-link
        class="
          flex
          items-center
          justify-between
          space-x-3
          text-sm
          hover:underline hover:decoration-sh-green-500
        "
        :to="{ name: 'earnings.information' }"
      >
        <span class="text-grays-black-7 text-sm hover:text-sh-green-500"
          >View earnings summary</span
        >
        <img src="@/assets/images/earningsArrow.svg" />
      </router-link>
    </div>
  </main>
</template>

<script>
export default {};
</script>

<style>
</style>

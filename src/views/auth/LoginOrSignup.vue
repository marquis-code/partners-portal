<template>
  <main
    class="
      flex
      items-center
      min-h-screen
      justify-center
      px-8
      py-8
      sm:px-12
      lg:col-span-7 lg:py-12 lg:px-16
    "
  >
    <div class="max-w-xl lg:max-w-2xl lg:w-3/6">
      <img alt="Shuttlers Logo" src="@/assets/images/brand_green.svg" />
      <h2 class="font-bold text-4xl text-sh-grey-900 mt-8">
        Vehicle Partner Portal
      </h2>
      <p class="text-grays-black-5 leading-10 mt-4 max-w-sm">
        A new experience to managing your Vehicles and Drivers and earning with
        them.
      </p>
      <p
        @click="$emit('goToLogin')"
        class="
          block
          cursor-pointer
          mt-10
          border
          rounded-lg
          border-sh-grey-900
          text-sh-grey-900
          font-bold
          text-sm
          w-full
          py-3
          text-center
        "
      >
        Login
      </p>
      <p
        @click="$emit('goToSignUp')"
        class="
          hover:bg-sh-green-600
          block
          cursor-pointer
          mt-4
          rounded-lg
          border border-transparent
          text-sh-grey-900
          font-bold
          bg-sh-green-500
          text-sm
          w-full
          py-3
          text-center
        "
      >
        Become a vehicle partner
      </p>
      <router-link to="/faq" class="mt-4 w-fit mx-auto text-sm py-2 px-3 flex items-center gap-2 text-[#0DAC5C] rounded-lg font-medium">
        <img src="@/assets/images/faqs/question_mark.svg" alt="">
        Go to FAQ
      </router-link>
    </div>
  </main>
</template>

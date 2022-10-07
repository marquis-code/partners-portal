<template>
   <CenteredPageHeader :title="title" :description="description" />
   <main>
      <div class="space-y-2 w-6/12">
      <label class="text-xs font-medium text-grays-black-5">Cities</label>
      <input class="
        text-xs
        border-none
        outline-none
        w-full
        rounded-md
        p-3
       placeholder-gray-500 placeholder-opacity-25
        ring-1 ring-gray-300"
     placeholder="Search city"/>
  </div>
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
   bg-grays-black-10"
    v-if="activeView === 0"
   @click="next()"
      >
        Next
        <img class="ml-2" src="@/assets/images/arrow.svg" />
      </button>
   </main>
</template>

<script>
import CenteredPageHeader from '../CenteredPageHeader.vue';
export default {
 components : {CenteredPageHeader},
 data(){
  return{
    title : 'What cities do you operate in?',
    description : 'We would love to know your country, in order to proceed.'
  }
 }
}
</script>

<style>

</style>

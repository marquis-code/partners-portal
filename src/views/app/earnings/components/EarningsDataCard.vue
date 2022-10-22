<template>
  <div class="
  w-[100%]
  h-[180px]
  bg-[#fff]
  flex
  flex-col
  items-start
  relative
  justify-between
  rounded-[5px]
  p-[10px]">
    <div
      class="
      w-[100%]
      h-[75%]
      border-b-[1.2px]
      flex
      flex-col
      items-start
      justify-between
      pb-[10px]
      border-[#73787624]"
    >
    <slot name="iconPlaceHolder"></slot>
    <div>
      <p class="relative text-[13px] text-[#575A65]">{{desc}}</p>
    </div>
    <div class="truncate">
      <p class="font-bold text-[19px]">{{value}}</p>
    </div>
  </div>
    <div class="
    w-[100%]
    h-[25%]
    relative
    ">
    <div v-if="!isRouteable" class="text-[12px] flex flex-row items-center w-[100%] h-[100%] relative">
      <p class="text-[#575A65] mr-[4px]">{{bottomDesc}}</p>
      <p class="text-[#575A65] font-bold">{{bottomDescValue}}</p>
    </div>
    <router-link v-else class="text-[12px] flex flex-row items-center justify-between w-[100%] h-[100%] relative" :to="link ?? '/'">
      <p class="text-[#4848ED]">{{bottomDesc}}</p>
      <img src="@/assets/icons/arrow-earnings.svg"/>
    </router-link>
  </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EarningsDataCard',
  props: {
    isRouteable: Boolean,
    desc: String,
    value: Number,
    link: String,
    bottomDesc: String,
    bottomDescValue: String,
    isLoading: Boolean,
  },
  data() {
    return {};
  }
})
</script>

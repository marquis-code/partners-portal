<template>
  <div
    v-if="isLoading"
    class="
      w-[100%]
      h-[180px]
      bg-[#fff]
      flex flex-col
      items-center
      relative
      justify-center
      rounded-[5px]
      p-[10px]
    "
  >
    <spinner></spinner>
  </div>
  <div v-else>
    <div
      class="
        w-[100%]
        h-[180px]
        bg-[#fff]
        items-start
        relative
        justify-between
        rounded-[5px]
        p-6
      "
    >
      <div
        class="
          w-[100%]
          h-[75%]
          border-b-[1.2px]
          flex flex-col
          items-start
          justify-between
          pb-[10px]
          border-[#73787624]
        "
      >
        <slot name="iconPlaceHolder"></slot>
        <div class="">
          <p class="relative text-xs text-[#575A65]">{{ desc }}</p>
        </div>
        <div>
          <p class="font-bold text-[19px]">{{ val }}</p>
        </div>
      </div>
      <div class="w-[100%] h-[25%] relative">
        <div
          v-if="!isRouteable"
          class="
            text-[12px]
            flex flex-row
            items-center
            w-[100%]
            h-[100%]
            relative
          "
        >
          <p class="text-[#575A65] mr-[4px]">{{ bottomDesc }}</p>
          <p class="text-[#575A65] font-bold">{{ bottomDescValue }}</p>
        </div>
        <router-link
          v-else
          class="
            text-[12px]
            flex flex-row
            items-center
            justify-between
            w-[100%]
            h-[100%]
            relative
          "
          :to="link ?? '/'"
        >
          <p class="text-[#4848ED]">{{ bottomDesc }}</p>
          <img src="@/assets/icons/arrow-earnings.svg" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<!-- <script lang="ts">
import { defineComponent } from 'vue';
import Spinner from '@/components/layout/Spinner.vue';

export default defineComponent({
  name: 'EarningsDataCard',
  components: {
    Spinner
  },
  computed: {
    val: function () {
      let v: any = this.formater ? this.formater(this.value) : this.value;

      if (this.currency) {
        v = this.currency + ' ' + v;
      }
      return v;
    }
  },
  props: {
    isRouteable: Boolean,
    desc: String,
    value: Number || String,
    link: String,
    bottomDesc: String,
    bottomDescValue: String,
    isLoading: Boolean,
    formater: Function,
    currency: String
  },
  data() {
    return {};
  }
});
</script> -->

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import Spinner from '@/components/layout/Spinner.vue';

const props = defineProps<{
  isRouteable?: boolean
  desc?: string
  value?: number | string
  link?: string
  bottomDesc?: string
  bottomDescValue?: string
  isLoading?: boolean
  formater?: any
  currency?: string
}>()

const val = computed(() => {
  let v: any = props.formater ? props.formater(props.value) : props.value;
  if (props.currency) {
    v = props.currency + ' ' + v;
  }
  return v;
})

// computed: {
//   val: function () {
//     let v: any = this.formater ? this.formater(this.value) : this.value;

//     if (this.currency) {
//       v = this.currency + ' ' + v;
//     }
//     return v;
//   }
// },
// props: {
//   isRouteable: Boolean,
//   desc: String,
//   value: Number || String,
//   link: String,
//   bottomDesc: String,
//   bottomDescValue: String,
//   isLoading: Boolean,
//   formater: Function,
//   currency: String
// },
</script>

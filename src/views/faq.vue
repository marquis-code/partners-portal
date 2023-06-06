<template>
  <button @click="goBack" class="text-black font-medium px-2 mt-4 ml-4">
    Go back
  </button>
  <div class="w-full p-4 py-8 max-w-[700px] mx-auto flex flex-col gap-8">
    <div class="flex flex-col gap-1">
      <h2 class="text-[#101828] text-xl md:text-2xl font-medium text-center">Frequently asked questions</h2>
      <p class="text-sm text-center text-[#667085]">Everything you need to know about the product and billing.</p>
    </div>

    <div class="flex flex-col gap-2">
      <div v-for="(item, index) in items" :key="index" class="p-4 rounded-lg" :class="item.expanded ? 'bg-[#F9FAFB]' : ''">
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-4 justify-between cursor-pointer"  @click="toggleAccordion(index)">
            <p class="text-[#101828] text-lg font-medium">{{ item.title }}</p>
            <img v-if="!item.expanded" src="@/assets/images/faqs/open.svg" alt="">
            <img v-else src="@/assets/images/faqs/close.svg" alt="">
          </div>
          <div v-if="item.expanded" class="text-[#667085] text-sm">{{ item.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'
const items = ref([
  {
    title: 'How do I link my vehicle and pilots on the dashboard?',
    content: 'To link your vehicles to your account on the dashboard, navigate to the "Vehicles" section and click on it. Add all your buses by following the instructions provided. Similarly, to link your drivers, locate the "Drivers" feature and click on it. From there, you can easily add your drivers to your account. Additionally, through this feature, you have the option to remove any drivers who are no longer working for you.',
    expanded: false
  },
  {
    title: 'How do I view my earnings and trips for the month?',
    content: 'To link your vehicles to your account on the dashboard, navigate to the "Vehicles" section and click on it. Add all your buses by following the instructions provided. Similarly, to link your drivers, locate the "Drivers" feature and click on it. From there, you can easily add your drivers to your account. Additionally, through this feature, you have the option to remove any drivers who are no longer working for you.',
    expanded: false
  },
  {
    title: 'How and when will I receive payments for the services rendered ?',
    content: 'To link your vehicles to your account on the dashboard, navigate to the "Vehicles" section and click on it. Add all your buses by following the instructions provided. Similarly, to link your drivers, locate the "Drivers" feature and click on it. From there, you can easily add your drivers to your account. Additionally, through this feature, you have the option to remove any drivers who are no longer working for you.',
    expanded: false
  },
  {
    title: 'What happens if there is a bus breakdown?',
    content: 'To link your vehicles to your account on the dashboard, navigate to the "Vehicles" section and click on it. Add all your buses by following the instructions provided. Similarly, to link your drivers, locate the "Drivers" feature and click on it. From there, you can easily add your drivers to your account. Additionally, through this feature, you have the option to remove any drivers who are no longer working for you.',
    expanded: false
  }
])

const toggleAccordion = (index: number) => {
  items.value.forEach((item, i) => {
    if (i === index) {
      item.expanded = !item.expanded;
    } else {
      item.expanded = false;
    }
  });
}

const goBack = () => {
  router.go(-1);
}
</script>

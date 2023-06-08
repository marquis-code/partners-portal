<template>
  <button @click="goBack" class="text-black font-medium px-2 mt-4 ml-4">
    Go back
  </button>
  <div class="w-full p-4 py-8 mb-[50px] max-w-[700px] mx-auto flex flex-col gap-8">
    <div class="flex flex-col gap-1">
      <h2 class="text-[#101828] text-xl md:text-2xl font-medium text-center">Frequently asked questions</h2>
      <p class="text-sm text-center text-[#667085]">Everything you need to know about the product and billing.</p>
    </div>

    <div class="flex flex-col gap-2">
      <div v-for="(item, index) in items" :key="index" class="p-4 rounded-lg"
        :class="item.expanded ? 'bg-[#F9FAFB]' : '' "
      >
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-4 justify-between cursor-pointer"  @click="toggleAccordion(index)">
            <p class="text-[#101828] text-lg font-medium">{{ item.title }}</p>
            <img v-if="!item.expanded" src="@/assets/images/faqs/open.svg" alt="">
            <img v-else src="@/assets/images/faqs/close.svg" alt="">
          </div>
          <div v-if="item.expanded" >
            <p class="text-[#667085] text-sm">{{ item.content }}</p>
            <ol v-if="item.steps.length" class="text-[#667085] text-sm list-decimal list-outside mt-4 ml-4 flex flex-col gap-2">
              <li v-for="n in item.steps" :key="n">{{ n }}</li>
            </ol>
          </div>
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
    expanded: false,
    steps: []
  },
  {
    title: 'How do I view my earnings and trips for the month?',
    content: 'Please access the "Earnings" feature and click on it. Once there, you will find options to filter your earnings by month or date. Additionally, you can download the report for the specific months you have filtered.',
    expanded: false,
    steps: []
  },
  {
    title: 'How and when will I receive payments for the services rendered ?',
    content: 'We have a regular payment cycle, and payments are usually made on a monthly basis. You will receive payments for the services rendered directly to the bank account you have provided in your partner profile.',
    expanded: false,
    steps: []
  },
  {
    title: 'What happens if there is a bus breakdown?',
    content: 'In case of a bus breakdown, please inform our support team immediately. We will work with you to resolve the situation and provide assistance to affected passengers.',
    expanded: false,
    steps: []
  },
  {
    title: 'How do I become a verified bus partner?',
    content: 'To become a verified bus partner, it is important to follow these steps:',
    expanded: false,
    steps: [
      'Complete KYC (Know Your Customer) Process: Ensure that you complete the KYC process, which includes providing necessary documentation for identity verification and address verification.',
      'Verify Your Identity: Submit the required identification documents to verify your identity. This typically involves providing government-issued identification such as NIN, International passport, driver\'s license or passport',
      'Address Verification: Provide proof of your address by submitting relevant documents such as utility bills, bank statements, or lease agreements. This helps establish your business location.',
      'Add Drivers and Vehicles: Include information about your drivers and their respective vehicles. Provide necessary details such as driver\'s licenses, vehicle registration documents, and insurance information.',
      'Set Up a Settlement Account: Add your settlement account details where you would like to receive payments for your services. This typically involves providing your bank account information for direct deposits.',
      'By following these steps and completing the necessary requirements, you can become a verified bus partner. It is essential to comply with the partner program\'s guidelines and regulations to ensure a smooth verification process.'
    ]
  },
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

<template>
<main>
<page-layout page-title="Earnings">
<template #breadcrumbs>
  <page-action-header>
    <template #tabs>
      <div class=" w-[100%] h-[100%] p-[0] ml-[28px]">
        <div class="flex flex-row items-center">
          <div class="flex flex-row items-center mr-[30px] cursor-pointer" @click="gotoEarning">
            <p class="text-[#ACAFAE] text-[14px] pb-[10px]">Earning information</p>
          </div>
          <div class="flex flex-row items-center mr-[30px] cursor-pointer" @click="gotoConfig">
            <p class="text-[#ACAFAE] text-[14px] pb-[10px]">Cost Configuration</p>
          </div>
          <div class="mr-[20px]">
            <p class="font-[500] text-[14px] pb-[10px] border-b-4 border-[#15CD70] rounded-t-3xl ">Payslip</p>
          </div>
        </div>
      </div>
    </template>
  </page-action-header>
</template>
<pdfContent class="fixed top-[-1000000px] z-[-999]"/>
<pdfOtherPages  class="fixed top-[-1000000px] z-[-999]" />
<div class="flex flex-col lg:flex-row lg:items-start gap-6">
  <div class="flex flex-col gap-6 w-full max-w-[400px]">
    <div class="bg-white rounded-lg border flex flex-col">
      <div class="border-b p-2 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <select :disabled="loading" v-model="selectedMonth" class="w-fit p-2 border rounded-lg">
            <option v-for="n,index in months" :key="n" :value="index+1">{{ n }}</option>
          </select>
          <select :disabled="loading" v-model="selectedYear" class="w-fit p-2 border rounded-lg">
            <template v-for="n in 10" :key="n">
              <option v-if="n + 2020 <= new Date().getFullYear()" :value="n + 2020">{{ n + 2020 }}</option>
            </template>
          </select>
        </div>
        <button :disabled="!selectedMonth || !selectedYear || loading" class="btn !min-w-[100px]" @click="fetchPayslip">
          <span v-if="!loading">Generate</span>
          <spinner v-else />
        </button>
      </div>
      <!-- <div class="p-2 flex items-center gap-2">
        <img src="@/assets/icons/search_gray.svg" alt="">
        <input type="text" placeholder="Search" v-model="search" class="outline-none border-0 p-2">
      </div> -->
    </div>
    <div class="flex flex-col gap-4" v-if="filteredPdf.length">
      <div v-for="n in filteredPdf" :key="n.name" @click="onPreviewPdf(n)"
        class="p-3 flex items-end justify-between bg-white rounded-lg"
        :class=" (activePdf && n.pdf == activePdf!.pdf) ? 'border border-[#20E682]' : 'border'"
      >
        <div class="flex items-start gap-2">
          <img src="@/assets/icons/docs.svg" alt="">
          <div class="flex flex-col gap-2">
            <p class="text-[#101211] text-sm font-medium">{{ n.name }}</p>
            <p class="text-sm text-[#8D918F]">{{ n.pages }} page(s)</p>
          </div>
        </div>
        <p class="text-sm text-[#8D918F]">Format: <span class="font-medium text-[#101211]">PDF</span></p>
      </div>
    </div>
    <p v-if="search.length && !filteredPdf.length" class="text-sm text-center text-[#09090F] font-medium">No result found</p>
  </div>

  <div class="flex-grow max-w-[1000px] bg-white rounded-lg border flex flex-col">
    <div class="border-b p-3 flex items-center justify-between gap-4">
      <p class="text-sm text-[#09090F]">Pay slip generated for: <span v-if="activePdf" class="font-medium">{{ activePdf!.name || '' }}</span></p>
      <button class="btn shrink-0 flex items-center gap-2" @click="saveFile" :disabled="!activePdf">
        <img src="@/assets/icons/download_white.svg" alt="">
        Print pay slip
      </button>
    </div>
    <div v-if="!previewPdf" class="p-3 flex items-center justify-center h-[400px]">
      <div class="w-fit h-fit flex flex-col">
        <img src="@/assets/illustration/payslip/empty_doc.svg" class="max-w-[200px] mx-auto" alt="">
        <div class="flex flex-col gap-2 text-center">
          <p class="text-lg text-[#09090F] font-medium">Preview Pay Slip</p>
          <p class="text-sm text-[#8D918F]">Click on ‘generate’ to preview pay slip</p>
        </div>
      </div>
    </div>
    <div v-else class="w-full flex flex-col gap-2 ">
      <p v-if="activePdf" class="text-sm text-right mr-4 mt-2">{{ activePdf.pages }} page(s)</p>
      <div  class="overflow-auto h-[400px] max-h-[450px] px-4">
        <vue-pdf-embed :source="previewPdf" />
      </div>
    </div>
  </div>
</div>
</page-layout>
</main>
</template>
<script setup lang="ts">
import { computed, ref} from 'vue'
import PageLayout from '@/components/layout/PageLayout.vue';
import PageActionHeader from '@/components/PageActionHeader.vue'
import router from '@/router';
import pdfContent from '../components/pdfContent.vue'
import pdfOtherPages from '../components/pdfOtherPages.vue'
import VuePdfEmbed from 'vue-pdf-embed'
import { usePayslip } from '../composables/payslip';
import spinner from '@/components/loader/spinner.vue'

const { loading, fetchPayslip, selectedMonth, selectedYear, previewPdf, months, generatedPdfs, onPreviewPdf, activePdf, saveFile } = usePayslip()
const search = ref('')

const gotoEarning = () => {
  router.push('/earnings')
}
const gotoConfig = () => {
  router.push('/earnings/cost-configuration');
}

const filteredPdf = computed(() => {
  return generatedPdfs.value.filter(el => el.name.toLowerCase().includes(search.value.toLowerCase()))
})
generatedPdfs.value = []
activePdf.value = null
previewPdf.value = null
</script>

<style scoped>
::-webkit-scrollbar {
	width: 6px;
	height: 6px;
}

::-webkit-scrollbar-track {
	background: transparent;
}

::-webkit-scrollbar-thumb {
	background: #6E717C;
	border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
	background: #8A9099;
}
</style>

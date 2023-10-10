<template>
	<div class="w-full border overflow-x-hidden rounded-lg">
		<div class="overflow-x-auto">
			<table v-if="loading || displayTable.length > 0" class="w-full table">
				<thead class="px-4">
					<tr class="h-[52px] border-b px-4">
            <th v-if="showSN" class="text-[10px] text-[#575A65] font-medium text-left px-4 bg-[#F9FAFB]">
              S/N
            </th>
						<th
							v-for="(header, i) in ([...headers] as any)"
							:key="i"
							class="text-[10px] text-[#575A65] font-medium text-left px-4 bg-[#F9FAFB]"
							:style="`width: ${header.width ? header.width : defaultColWidth}%;`"
						>
							{{ header.text }}
						</th>
					</tr>
				</thead>
				<div />
				<tbody v-if="!loading">
					<tr
						v-for="(data, index) in displayTable"
						:key="index + 1"
						:data-index="index"
						:class="[
							'border-t py-8 bg-white',
							canClickRow ? 'cursor-pointer' : '',
						]"
					>
            <td v-if="showSN" class="px-4 py-2 text-[#09090F] text-xs">
              {{index + 1 + (metadata?.perPage! * (metadata?.currentPage! - 1))}}
            </td>
						<td
							v-for="(value, key) of populateTable(data)"
							:key="key + 1"
							class="px-4 py-2 text-[#09090F] text-xs"
							:data-label="headers[value]"
						>
							<slot name="item" :item="({ [key]: key, data, index } as any)">
								<span>{{ value }}</span>
							</slot>
						</td>
					</tr>
				</tbody>
				<tbody v-else>
					<tr v-for="n in 3" :key="n" class="border-t border-gray50 py-8 font-normal  text-sm h-[52px]">
						<td v-for="(header, i) in headers" :key="i" class="px-4">
							<Skeleton height="15px" radius="3px" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div v-if="displayTable.length === 0 && !loading" class="min-h-[250px] flex items-center justify-center">
			<slot name="empty" />
		</div>
	</div>
  <div v-if="displayTable.length && !loading" class="flex border-t mt-4 p-4 items-center justify-between">
    <button :disabled="metadata?.currentPage === 1" class="paginate-button"
      @click="triggerPageChange(metadata?.currentPage! - 1)"
    >
      <img src="@/assets/icons/pagination/arrow_left.svg" alt="">
      Previous
    </button>
    <div class="flex items-center">
      <template v-if="metadata?.pages! < 6">
        <button v-for="n in metadata?.pages" :key="n" class="paginate-button-jump" @click="triggerPageChange(n)"
          :disabled="n === metadata?.currentPage" :class="{'text-[#1D2939]': n === metadata?.currentPage}"
        >
          {{ n }}
        </button>
      </template>
      <template v-else>
        <button v-for="n in 2" :key="n" class="paginate-button-jump" @click="triggerPageChange(n)"
          :disabled="n === metadata?.currentPage" :class="{'text-[#1D2939]': n === metadata?.currentPage}"
        >
          {{ n }}
        </button>
        <button disabled class="paginate-button-jump">...</button>
        <template v-for="n in metadata?.pages" :key="n">
          <button v-if="n >= metadata?.pages! - 1" class="paginate-button-jump" @click="triggerPageChange(n)"
            :disabled="n === metadata?.currentPage" :class="{'text-[#1D2939]': n === metadata?.currentPage}"
          >
            {{ n }}
          </button>
        </template>
      </template>
    </div>
    <button :disabled="metadata?.currentPage === metadata?.pages" class="paginate-button"
      @click="triggerPageChange(metadata?.currentPage! + 1)"
    >
      Next
      <img src="@/assets/icons/pagination/arrow_right.svg" alt="">
    </button>
  </div>
</template>

<script lang="ts" setup>
import {computed, defineProps, withDefaults, defineEmits, ref} from 'vue'
import Skeleton from '../loader/skeleton.vue'

const emit = defineEmits(['pageChange', 'rowClicked'])
export interface Props {
  canClickRow?: boolean
  headers: {text: string;width: string; value: string}[]
  tableData: any[]
  loading: boolean
  meta?: {currentPage: number; pages: number; perPage: number; total: number;}
  frontendPagination?: boolean
  showSN?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canClickRow: false,
  frontendPagination: false,
  showSN: true
})

const currentPage = ref(1)
const perPage = ref(10)
const total = computed(() => props.tableData.length)
const pages = computed(() => Math.ceil(total.value / perPage.value))

const metadata = computed(() => {
  if (props.frontendPagination) {
    return {
      currentPage: currentPage.value,
      perPage: perPage.value,
      total: total.value,
      pages: pages.value
    }
  } else {
    return props.meta
  }
})

const displayTable = computed(() => {
  if (props.frontendPagination) {
    return paginate(props.tableData)
  } else {
    return props.tableData
  }
})

const getItemsWithColWidth = computed(() => {
  let length = 0
  props.headers.forEach((item: any) => {
    if (!item.width) {
      length++
    }
  })
  return length
})

const defaultColWidth = computed(() => {
  return roundToTwo(100 / getItemsWithColWidth.value)
})

const roundToTwo = (num:number) => {
  return +(Math.round(parseFloat(num + 'e+2')) + 'e-2')
}

const from = computed(() => currentPage.value * perPage.value - perPage.value)
const to = computed(() => currentPage.value * perPage.value)
const paginate = (data:any) => {
  return data.slice(from.value, to.value)
}

const populateTable = (data:any) => {
  const element:any = {}

  props.headers.forEach((item: any) => {
    // for (const key in data) {
    if (item.value in data) {
      // if (key === item.value) {
      //   element[key] = data[key]
      // }
      element[item.value] = data[item.value]
    } else {
      element[item.value] = ''
    }
    // }
  })
  return element
}

const triggerPageChange = (page:number) => {
  if (props.frontendPagination) {
    currentPage.value = page
  } else {
    emit('pageChange', page)
  }
}

</script>

<style scoped >
.paginate-button{
  @apply flex items-center gap-2 p-2 border rounded-lg bg-white text-[#344054] text-sm font-medium disabled:cursor-not-allowed
}
.paginate-button-jump{
  @apply p-2 text-sm text-[#667085] font-medium disabled:cursor-not-allowed
}
</style>

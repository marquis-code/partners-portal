<template>
  <div class="relative w-full" ref="target">
    <input
      type="text" :required="isRequired"
      class="text-xs border-none outline-none w-full rounded-md p-3 placeholder-gray-500 placeholder-opacity-25 ring-1 ring-gray-300"
      :placeholder="placeHolder"
      :value="inputValue"
      @input="handleInput(($event.target as HTMLInputElement).value)"
    />

    <ul v-if="showDropdown" class="space-y-2 rounded-lg shadow-md absolute top-[50px] z-40">
      <div class="bg-gray-50 rounded-lg">
        <li
          @click="handleSelected(item.description)"
          v-for="item in suggestions"
          class="py-3 text-xs ring-1 ring-white cursor-pointer px-2"
          :key="item.place_id"
        >
          {{ item.description }}
        </li>
      </div>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref, watch, defineProps, withDefaults } from 'vue';
import { usePlacesAutocomplete } from 'v-use-places-autocomplete';
import { onClickOutside } from '@vueuse/core'

const emit = defineEmits(['autoCompleteAddress'])
export interface Props {
	placeHolder?: string
	isRequired?: boolean
  inputValue: any
}

const props = withDefaults(defineProps<Props>(), {
  placeHolder: 'Enter your address',
  isRequired: true,
})

const target = ref(null)
const query = ref('');
const showDropdown = ref(false);
const handleInput = (val:string) => {
  query.value = val
  emit('autoCompleteAddress', val);
}
const { suggestions } = usePlacesAutocomplete(query, {
  debounce: 500,
  minLengthAutocomplete: 3
});

function handleSelected (selectedAddressValue:any) {
  emit('autoCompleteAddress', selectedAddressValue);
  showDropdown.value = false;
  selectedAddressValue = null;
}

onClickOutside(target, () => {
  showDropdown.value = false
})

watch(query, () => {
  showDropdown.value = true;
});

</script>

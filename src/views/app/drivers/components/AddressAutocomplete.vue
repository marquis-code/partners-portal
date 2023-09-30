<template>
  <div ref="target">
    <input
      type="text"
      class="text-xs border-none outline-none w-full rounded-md p-3 placeholder-gray-500 placeholder-opacity-25 ring-1 ring-gray-300"
      placeholder="Enter driver's address"
      v-model="query"
    />

    <ul v-if="showDropdown" class="space-y-2 rounded-lg shadow-md absolute z-40">
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

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { usePlacesAutocomplete } from 'v-use-places-autocomplete';
import { onClickOutside } from '@vueuse/core'

export default defineComponent({
  name: 'AddressAutocomplete',
  setup (props, { emit }) {
    const target = ref(null)
    const query = ref('');
    const selected = ref('')
    const showDropdown = ref(false);
    const { suggestions } = usePlacesAutocomplete(query, {
      debounce: 500,
      minLengthAutocomplete: 3
    });

    function handleSelected (selectedAddressValue:any) {
      selected.value = selectedAddressValue;
      query.value = selectedAddressValue;
      emit('autoCompleteAddress', selectedAddressValue);
      showDropdown.value = false;
      selectedAddressValue = null;
    }

    watch(query, () => {
      if (selected.value !== query.value) {
        showDropdown.value = true;
      }
    });

    onClickOutside(target, () => {
      showDropdown.value = false
    })

    return {
      query,
      suggestions,
      handleSelected,
      showDropdown,
      target
    };
  },
  emits: ['autoCompleteAddress']
});
</script>

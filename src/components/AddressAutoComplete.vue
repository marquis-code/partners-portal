<template>
  <input
    type="text"
    class="
      text-xs
      border-none
      outline-none
      w-full
      rounded-md
      p-3
      placeholder-gray-500 placeholder-opacity-25
      ring-1 ring-gray-300
    "
    placeholder="Enter drivers address"
    v-model="query"
  />

  <ul v-if="showDropdown" class="space-y-2 rounded-md shadow-md">
    <div class="bg-gray-100">
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
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import { usePlacesAutocomplete } from 'v-use-places-autocomplete';

export default defineComponent({
  setup(props, { emit }) {
    const query = ref('');
    const showDropdown = ref(false);
    const { suggestions } = usePlacesAutocomplete(query, {
      debounce: 500,
      minLengthAutocomplete: 3
    });

    function handleSelected(selectedAddressValue) {
      query.value = selectedAddressValue;
      emit('autoCompleteAddress', selectedAddressValue);
      showDropdown.value = false;
    }

    watch(query, () => {
      showDropdown.value = true;
    });

    return {
      query,
      suggestions,
      handleSelected,
      showDropdown
    };
  },
  emits: ['autoCompleteAddress']
});
</script>

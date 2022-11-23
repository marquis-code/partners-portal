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

  <ul class="space-y-2">
    <li
      @click="handleSelected(item.description)"
      v-for="item in suggestions"
      class="py-3 rounded-sm ring-1 ring-gray-300 cursor-pointer text-sm px-2"
      :key="item.place_id"
    >
      {{ item.description }}
    </li>
  </ul>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { usePlacesAutocomplete } from 'v-use-places-autocomplete';

export default defineComponent({
  setup (context) {
    const query = ref('');
    const newAddress = ref('');
    const { suggestions } = usePlacesAutocomplete(query, {
      debounce: 500,
      minLengthAutocomplete: 3
    });
    // const newModel = computed(() => {
    //   return newAddress.value || query;
    // });

    const handleSelected = (selectedAddressValue) => {
      this.newAddress = selectedAddressValue;
      console.log(selectedAddressValue);
      context.emit('autoCompleteAddress', selectedAddressValue);
    };

    return {
      query,
      suggestions,
      handleSelected,
      newAddress,
      // newModel
    };
  },
  emits: ['autoCompleteAddress']
});
</script>

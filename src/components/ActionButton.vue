<template>
  <main class="w-4/12">
    <div
      class="
        bg-sh-green-500
        p-3
        rounded-md
        flex
        justify-center
        items-center
        space-x-3
        cursor-pointer
      "
      @click="toggle"
    >
      <p class="font-bold text-gray-900">Actions</p>
      <img src="@/assets/images/arrowDown.svg" />
    </div>
    <div
      v-if="show"
      class="
        flex flex-col
        items-center
        justify-center
        rounded-xl
        bg-white
        shadow-md
        mt-3
        py-5
        px-5
      "
    >
      <a
        v-for="dropdownContent in dropdownContents"
        :key="dropdownContent.item"
        @click="edit"
        href="#"
        :class="[
          dropdownContent.item === 'remove'
            ? 'hover:bg-red-500 hover:text-white'
            : 'hover:bg-black hover:text-white'
        ]"
        class="p-3 pl-3 w-full rounded-md text-sm text-gray-500"
        >{{ dropdownContent.label }}</a
      >
      <!-- <a
        @click="assign"
        href="#"
        class="
          p-3
          pl-3
          hover:bg-black hover:text-white
          w-full
          rounded-md
          text-sm text-gray-500
        "
        >Assign driver</a
      >
      <a
        @click="remove"
        href="#"
        class="
          p-3
          pl-3
          hover:bg-red-500 hover:text-white
          w-full
          rounded-md
          text-sm text-gray-500
        "
        >Remove</a
      > -->
    </div>
  </main>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
// NOTE: Array structure for dropdown contents looks like this
//   {
//     item: 'edit',
//     label: 'Edit'
//   },
export default defineComponent({
  props: {
    dropdownContents: Array
  },
  data () {
    return {
      show: false
    };
  },
  methods: {
    toggle () {
      this.show = !this.show;
    },
    edit () {
      this.show = !this.show;
      console.log('editing..');
    },
    assign () {
      this.show = !this.show;
      console.log('assigning..');
    },
    remove () {
      this.show = !this.show;
      console.log('removing..');
    }
  }
})
</script>

<style>
</style>

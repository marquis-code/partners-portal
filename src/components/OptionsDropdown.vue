<template>
  <on-click-outside :action="() => (isOpen = false)">
    <div class="relative inline-block text-left">
      <span @click.prevent="toggleState()">
        <slot name="label" v-bind="{isOpen}"></slot>
      </span>
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95">
        <div v-if="isOpen" class="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-dark-type-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
             role="menu" aria-orientation="vertical"
             aria-labelledby="menu-button" tabindex="-1">
          <div class="py-6 flex flex-col"
               role="none">
            <slot name="items"></slot>
          </div>
        </div>
      </transition>
    </div>
  </on-click-outside>
</template>

<!-- <script>
import OnClickOutside from "./OnCickOutside";

export default {
  name: "OptionsDropdown",
  components: { OnClickOutside },
  watch: {
    '$route' () {
      this.isOpen = false;
    }
  },
  data () {
    return {
      isOpen: false
    }
  },
  methods: {
    toggleState () {
      this.isOpen = !this.isOpen;
    }
  }
}
</script> -->

<script setup lang="ts">
import OnClickOutside from "./OnCickOutside.vue";
import { useRoute } from "vue-router";
import {ref, watch} from 'vue'

const route = useRoute()
const isOpen = ref(false)

watch(route, () => {
  isOpen.value = false
})

const toggleState = () => {
  isOpen.value = !isOpen.value
}

//   watch: {
//     '$route' () {
//       this.isOpen = false;
//     }
//   },
//   data () {
//     return {
//       isOpen: false
//     }
//   },
//   methods: {
//     toggleState () {
//       this.isOpen = !this.isOpen;
//     }
//   }
// }
</script>
<style scoped>

</style>

<template>
  <div class="home flex flex-row">
    <sidebar class="hidden md:flex" @sideBarNavigationClicked="changeNavigation"/>
    <div class="w-full pb-[80px]">
      <router-view/>
    </div>
</div>
<div v-if="active" class="fixed top-0 left-0 w-full h-full bg-white z-20 flex gap-4 justify-between">
  <sidebar class="max-w-[230px]" @sideBarNavigationClicked="changeNavigation"/>
  <div class="flex-grow bg-[#2b29291b]" @click="closeSidebar"></div>
</div>
</template>

<!-- <script lang="ts">
import {defineComponent} from "vue";
import Sidebar from "./Sidebar.vue";

export default defineComponent({
  name: "Home",
  data () {
    return {
      activeSection: "View All"
    }
  },
  methods: {
    changeNavigation (activeSection: string) {
      this.activeSection = activeSection;
      this.$router.push(`/${activeSection.toLowerCase()}`);
    }
  },
  components: { Sidebar }
})
</script> -->

<script setup lang="ts">
import {ref, watch} from "vue";
import Sidebar from "./Sidebar.vue";
import router from "@/router";
import { useSidebar } from "@/composables/sidebar";
import { useRoute } from "vue-router";

const route = useRoute()
const { active, closeSidebar } = useSidebar()
const activeSection = ref("View All")

const changeNavigation = (_activeSection: string) => {
  activeSection.value = _activeSection;
  router.push(`/${_activeSection.toLowerCase()}`);
}

watch(route, () => {
  closeSidebar()
})
</script>

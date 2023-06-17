<template>
  <div class="home flex flex-row">
    <sidebar @sideBarNavigationClicked="changeNavigation"/>
    <div class="w-full pb-[80px]">
      <router-view/>
    </div>
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
import {ref} from "vue";
import Sidebar from "./Sidebar.vue";
import router from "@/router";

const activeSection = ref("View All")

const changeNavigation = (_activeSection: string) => {
  activeSection.value = _activeSection;
  router.push(`/${_activeSection.toLowerCase()}`);
}
</script>

<template>
  <div
    class="h-screen py-9 pr-4 bg-white"
    :class="
      isSidebarFolded ? 'w-20 pl-0' : 'w-64 pl-4'
    "
  >
    <div
      class="flex mb-9"
      :class="isSidebarFolded ? 'flex-col items-center' : 'flex-row justify-between'"
    >
      <img v-if="isSidebarFolded" class="w-6 h-6 mb-6" src="@/assets/images/square-logo.svg">
      <img v-else src="@/assets/logo.png" class="h-6">
      <img @click="toggleSidebar" class="w-6 h-6 transform hover:scale-105 transition ease-out duration-500" src="@/assets/images/toggle.svg">
    </div>
    <div class="side-bar-item">
      <div v-for="(menu, index) in menus" :key="index" class="item">
        <div
          class="h-12 rounded-lg pl-5 py-4 flex flex-row justify-between transform hover:scale-95 transition ease-out duration-200"
          :class="{ 'bg-black': menu.selected, '' : isSidebarFolded}"
          @click="selectThisSection(index)"
        >
          <div class="flex flex-row items-center">
            <span
              class="material-icons mr-3"
              :class="menu.selected ? 'text-white' : 'text-gray-500'"
            >{{menu.icon}}</span>
            <span :class="menu.selected ? 'text-white' : 'text-gray-500'">
              {{isSidebarFolded ? ''  : menu.title }}
            </span>
          </div>
          <div>
            <div
              class="h-5 w-1"
              :class="menu.selected && !isSidebarFolded ? 'bg-sh-green-500' : ''"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "Sidebar",
  data() {
    return {
      isSidebarFolded: false,
      menus: [
        {title: 'Dashboard', icon: 'home', selected: true},
        {title: 'Driver Management', icon: 'group', selected: false},
        {title: 'Vehicle Management', icon: 'directions_car', selected: false}
      ],
    }
  },
  methods: {
    selectThisSection(itemIndex: number) {
      for (let index = 0; index < this.menus.length; index++) {
        if (index === itemIndex) {
          this.menus[index].selected = true;
        } else this.menus[index].selected = false;
      }
    },
    toggleSidebar() {
      this.isSidebarFolded = !this.isSidebarFolded
    }
  }
}
</script>

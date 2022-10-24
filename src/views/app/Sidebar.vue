<template>
  <div
    class="
      h-screen
      flex
      justify-between
      items-center
      flex-col
      py-6
      sticky
      top-0
    "
  >
    <div
      class="bg-white"
      :class="isSidebarFolded ? 'w-12 pl-0 pr-0' : 'w-64 pl-4 pr-4'"
    >
      <div
        class="flex mb-9"
        :class="
          isSidebarFolded ? 'flex-col items-center' : 'flex-row justify-between'
        "
      >
        <img
          v-if="isSidebarFolded"
          class="w-6 h-6 mb-6"
          src="@/assets/images/square-logo.svg"
        />
        <img v-else src="@/assets/logo.png" class="h-6" />
        <img
          v-if="!isMobileScreen"
          @click="toggleSidebar"
          class="
            w-6
            h-6
            transform
            hover:scale-105
            transition
            ease-out
            duration-500
          "
          src="@/assets/images/toggle.svg"
        />
      </div>
      <div
        v-for="(group, groupIndex) in menuGroup"
        :key="groupIndex"
        class="mb-5"
      >
        <div
          v-if="!isSidebarFolded"
          class="text-gray-400 text-xs border-b-[0.5px] px-2 py-4 w-full"
        >
          {{ group.sectionTitle }}
        </div>
        <div class="side-bar-item">
          <div v-for="(menu, index) in group.menus" :key="index" class="item">
            <router-link
              class="
                h-12
                rounded-lg
                py-4
                flex flex-row
                transform
                hover:scale-95
                transition
                ease-out
                duration-200
              "
              :class="{
                'justify-center': isSidebarFolded,
                'justify-between pl-5': !isSidebarFolded
              }"
              :to="{ name: menu.routeName }"
            >
              <div class="flex flex-row items-center text-gray-500">
                <span
                  class="material-icons sidemenu-icon"
                  :class="{
                    'mr-3': !isSidebarFolded
                  }"
                  >{{ menu.icon }}</span
                >
                <span class="font-sm sidemenu-icon-label">
                  {{ isSidebarFolded ? '' : menu.title }}
                </span>
              </div>
              <div>
                <div
                  class="h-5 w-1 sidebar-active-status"
                  :class="!isSidebarFolded ? '' : 'hidden'"
                ></div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div
      @click="logout"
      class="
        flex flex-row
        justify-between
        items-center
        py-2
        cursor-pointer
        space-x-3
        rounded-xl
        bg-green-200
        w-10/12
      "
      :class="isSidebarFolded ? 'p-1' : 'px-3 '"
    >
      <div class="flex flex-row items-center">
        <img
          src="@/assets/images/avatar-placeholder.svg"
          class="w-10 h-10 mr-2"
          :class="isSidebarFolded && 'text-center mr-0'"
        />
        <span v-if="!isSidebarFolded && user" class="text-sm font-medium">{{
          user.fname
        }}</span>
      </div>
      <span v-if="!isSidebarFolded" class="material-icons"> logout </span>
    </div>
  </div>
</template>
<script lang="ts">
// @click.prevent="selectThisSection(groupIndex, index)"
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
export default defineComponent({
  name: 'Sidebar',
  data() {
    return {
      isSidebarFolded: false,
      windowWidth: 0,
      isMobileScreen: false,
      menuGroup: [
        {
          sectionTitle: 'GENERAL',
          menus: [
            {
              title: 'Dashboard',
              routeName: 'dashboard',
              icon: 'home',
              selected: true
            },
            {
              title: 'Vehicles',
              routeName: 'vehicles.list',
              icon: 'directions_car',
              selected: false
            },
            {
              title: 'Drivers',
              routeName: 'drivers.list',
              icon: 'group',
              selected: false
            },
            {
              title: 'Trips',
              routeName: 'trips.list',
              icon: 'map',
              selected: false
            },
            {
              title: 'Routes',
              routeName: 'routes.list',
              icon: 'route',
              selected: false
            },
            // {title: 'Earnings', icon: 'payments', selected: false}
            {
              title: 'Earnings',
              routeName: 'earnings.information',
              icon: 'payments',
              selected: false
            }
          ]
        },
        {
          sectionTitle: 'SYSTEM',
          menus: [
            {
              title: 'Settings',
              routeName: 'settings.edit.partner',
              icon: 'settings',
              selected: false
            }
          ]
        }
      ]
    };
  },
  created() {
    window.addEventListener('resize', this.checkScreen);
    this.checkScreen();
  },
  computed: {
    ...mapGetters({ user: 'auth/user' })
  },
  methods: {
    // TODO (Tobi): Refactor component implementation
    selectThisSection(groupIndex: number, itemIndex: number) {
      for (let index = 0; index < this.menuGroup.length; index++) {
        const groupMenus = this.menuGroup[index].menus;
        for (let indexJ = 0; indexJ < groupMenus.length; indexJ++) {
          const section = groupMenus[indexJ];
          if (index === groupIndex && indexJ === itemIndex) {
            this.$emit('sideBarNavigationClicked', section.title);
            section.selected = true;
          } else section.selected = false;
        }
      }
    },
    toggleSidebar() {
      this.isSidebarFolded = !this.isSidebarFolded;
    },
    checkScreen() {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth <= 768) {
        this.isSidebarFolded = true;
        this.isMobileScreen = true;
      } else {
        this.isSidebarFolded = false;
        this.isMobileScreen = false;
      }
    },
    logout() {
      localStorage.clear();
      this.$router.push('/login');
      this.$router.go(0);
    }
  }
});
</script>

<style scoped lang="scss">
.router-link-active {
  @apply bg-black;
}

.router-link-active .sidemenu-icon,
.router-link-active .sidemenu-icon-label {
  @apply text-white;
}
.router-link-active .sidebar-active-status {
  @apply bg-sh-green-500;
}
</style>

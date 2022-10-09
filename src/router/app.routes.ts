import {RouteRecordRaw} from "vue-router";
import HomeView from "@/views/app/HomeView.vue";
import Dashboard from "@/views/app/Dashboard.vue";
import Drivers from "@/views/app/Drivers.vue";
import Vehicles from "@/views/app/Vehicles.vue";
import Earnings from "@/views/app/Earnings.vue";
import Settings from "@/views/app/Settings.vue";

export const AppRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    redirect: 'dashboard',
    component: HomeView,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: {
          title: 'Dashboard'
        }
      }
    ]
  },
  {
    path: '/drivers',
    name: 'drivers',
    component: Drivers,
    meta: {
      title: 'Drivers',
      requiresAuth: false
    }
  },
  {
    path: '/vehicles',
    name: 'vehicles',
    component: Vehicles,
    meta: {
      title: 'Vehicles',
      requiresAuth: false
    }
  },
  {
    path: '/earnings',
    name: 'earnings',
    component: Earnings,
    meta: {
      title: 'Earnings',
      requiresAuth: false
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: {
      title: 'Settings',
      requiresAuth: false
    }
  }
]

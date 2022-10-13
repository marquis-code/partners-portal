import {RouteRecordRaw} from "vue-router";
import HomeView from "@/views/app/HomeView.vue";
import Dashboard from "@/views/app/Dashboard.vue";
import UserSelection from "@/views/app/OrganizationSelection.vue";
import Drivers from "@/views/app/Drivers.vue";
import Vehicles from "@/views/vehiclesManagement/Vehicles.vue";
import Earnings from "@/views/app/Earnings.vue";
import Settings from "@/views/app/Settings.vue";
import AddVehicle from "@/views/vehiclesManagement/AddVehicle.vue";

import Trips from "@/views/vehiclesManagement/Trips.vue";
import VehicleDocuments from "@/views/vehiclesManagement/VehicleDocuments.vue";
import VehicleInformation from "@/views/vehiclesManagement/VehicleInformation.vue";

export const AppRoutes: Array<RouteRecordRaw> = [
  {
    path: "/organization",
    name: "organization.selection",
    component: UserSelection,
    meta: {
      title: "UserSelection",
      requiresAuth: true,
      contextPage: true
    },
  },
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
        path: '/add-vehicle',
        name: 'AddVehicle',
        component: AddVehicle,
        meta: {
          title: 'AddVehicle',
          requiresAuth: false
        }
      },
      {
        path: '/vehicle-information',
        name: 'VehicleInformation',
        component: VehicleInformation,
        meta: {
          title: 'VehicleInformation',
          requiresAuth: false
        }
      },
      {
        path: '/trips',
        name: 'Trips',
        component: Trips,
        meta: {
          title: 'Trips',
          requiresAuth: false
        }
      },
      {
        path: '/vehicle-documents',
        name: 'VehicleDocuments',
        component: VehicleDocuments,
        meta: {
          title: 'VehicleDocuments',
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
  },
]

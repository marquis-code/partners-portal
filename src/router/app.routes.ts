import {RouteRecordRaw} from "vue-router";
import HomeView from "@/views/app/HomeView.vue";
import Dashboard from "@/views/app/Dashboard.vue";
import UserSelection from "@/views/app/OrganizationSelection.vue";
import Drivers from "@/views/app/Drivers.vue";
import Vehicles from "@/views/app/vehicles/Vehicles.vue";
import Earnings from "@/views/app/Earnings.vue";
import Settings from "@/views/app/Settings.vue";
import {loadRouteComponent} from "@/utils/route-helper.util";

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
        redirect: 'vehicles.list',
        meta: {
          title: 'Vehicles',
          requiresAuth: true
        },
        children: [
          {
            path: '',
            name: 'vehicles.list',
            component: loadRouteComponent('app/vehicles/list/VehiclesList'),
            meta: {
              title: 'Vehicles',
              requiresAuth: true
            },
          },
          {
            path: 'add-vehicle',
            name: 'AddVehicle',
            component: loadRouteComponent('app/vehicles/AddVehicle'),
            meta: {
              title: 'Add Vehicle',
              requiresAuth: true
            }
          },
          {
            path: 'details/:vehicleId',
            component: loadRouteComponent('app/vehicles/details/VehicleDetailsIndex'),
            props: true,
            meta: {
              title: 'Vehicle Details',
              requiresAuth: true
            },
            children: [
              {
                path: '',
                name: 'vehicle.detail',
                redirect: 'information'
              },
              {
                path: 'information',
                name: 'vehicle.detail.info',
                component: loadRouteComponent('app/vehicles/details/VehicleInfo'),
                meta: {
                  title: 'Vehicle Details',
                  requiresAuth: true
                },
              },
              {
                path: 'trips',
                name: 'vehicle.detail.trips',
                component: loadRouteComponent('app/vehicles/details/VehicleTrips'),
                meta: {
                  title: 'Vehicle Details',
                  requiresAuth: true
                },
              },
              {
                path: 'documents',
                name: 'vehicle.detail.documents',
                component: loadRouteComponent('app/vehicles/details/VehicleDocuments'),
                meta: {
                  title: 'Vehicle Details',
                  requiresAuth: true
                },
              },
            ]
          },
        ]
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

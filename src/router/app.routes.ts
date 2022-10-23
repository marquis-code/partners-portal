import {RouteRecordRaw} from "vue-router";
import HomeView from "@/views/app/HomeView.vue";
import Dashboard from "@/views/app/Dashboard.vue";
import UserSelection from "@/views/app/OrganizationSelection.vue";
import Vehicles from "@/views/app/vehicles/Vehicles.vue";
import Earnings from "@/views/app/Earnings.vue";
import Trips from "@/views/app/Trips.vue";
import Settings from "@/views/app/Settings.vue";
import {loadRouteComponent} from "@/utils/route-helper.util";
import Drivers from "@/views/app/drivers/Drivers.vue";

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
        path: '/dashboard/company-kyc',
        name: 'dashboard.company-kyc',
        component: loadRouteComponent('app/ShareHoldersDetails'),
        meta: {
          title: 'Dashboard'
        }
      },
      {
        path: '/dashboard/start-kyc',
        name: 'dashboard.start-kyc',
        component: loadRouteComponent('app/KycInformationView'),
        meta: {
          title: 'Dashboard'
        },
        props: true
      },
      {
        path: '/drivers',
        name: 'drivers',
        component: Drivers,
        redirect: 'drivers.list',
        meta: {
          title: 'Drivers',
          requiresAuth: true
        },
        children: [
          {
            path: '',
            name: 'drivers.list',
            component: loadRouteComponent('app/drivers/list/DriversList'),
            meta: {
              title: 'Drivers',
              requiresAuth: true
            },
          },
          {
            path: 'add-driver',
            name: 'AddDriver',
            component: loadRouteComponent('app/drivers/AddDriver'),
            meta: {
              title: 'Add Driver',
              requiresAuth: true
            }
          },
          {
            path: ':driverId/edit',
            name: 'EditDriver',
            component: loadRouteComponent('app/drivers/EditDriver'),
            meta: {
              title: 'Edit Driver',
              requiresAuth: true
            }
          },
          {
            path: 'details/:driverId',
            component: loadRouteComponent('app/drivers/details/DriverDetailsIndex'),
            props: true,
            meta: {
              title: 'Driver Details',
              requiresAuth: true
            },
            children: [
              {
                path: '',
                name: 'driver.detail',
                redirect: 'information'
              },
              {
                path: 'information',
                name: 'driver.detail.info',
                component: loadRouteComponent('app/drivers/details/DriverInfo'),
                meta: {
                  title: 'Driver Details',
                  requiresAuth: true
                },
              },
              {
                path: 'trips',
                name: 'driver.detail.trips',
                component: loadRouteComponent('app/drivers/details/DriverTrips'),
                meta: {
                  title: 'Driver Details',
                  requiresAuth: true
                },
              }
            ]
          },
        ]
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
            path: ':vehicleId/edit',
            name: 'EditVehicle',
            component: loadRouteComponent('app/vehicles/EditVehicle'),
            meta: {
              title: 'Edit Vehicle',
              requiresAuth: true
            }
          },
          {
            path: ':vehicleId/edit/document/:documentId',
            name: 'EditVehicleDocument',
            props: true,
            component: loadRouteComponent('app/vehicles/details/EditVehicleDocuments'),
            meta: {
              title: 'Edit Vehicle Document',
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
              }
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
        path: '/trips',
        name: 'trips',
        component: Trips,
        meta: {
          title: 'Trips',
          requiresAuth: true
        },
        children: [
          {
            path: '',
            name: 'trips.list',
            component: loadRouteComponent('app/trips/list/TripsList'),
            meta: {
              title: 'Trips',
              requiresAuth: true
            }
          },
          {
            path: 'details/:tripId',
            component: loadRouteComponent('app/trips/details/SingleTrip'),
            name: 'trips.detail.info',
            props: true,
            meta: {
              title: 'Trip Details',
              requiresAuth: true
            }
          }
        ]
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

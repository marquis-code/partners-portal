import {RouteRecordRaw} from "vue-router";
import HomeView from "@/views/app/HomeView.vue";
import Dashboard from "@/views/app/Dashboard.vue";
import UserSelection from "@/views/app/OrganizationSelection.vue";
import Vehicles from "@/views/app/vehicles/Vehicles.vue";
import Earnings from "@/views/app/earnings/Earning.vue";
import Trips from "@/views/app/Trips.vue";
import Settings from "@/views/app/settings/Settings.vue";
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
        path: '/dashboard/start-kyc/:id',
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
        redirect: 'earnings.information',
        meta: {
          title: 'Earnings',
          requiresAuth: true,
        },
        children: [
          {
            path: '',
            name: 'earnings.information',
            component: loadRouteComponent('app/earnings/views/EarningInformation'),
            meta: {
              title: 'Earnings-Information',
              requiresAuth: true,
            },
          },
          {
            path: '/earnings/vehicle-information/:id',
            name: 'earnings.vehicleInformation',
            component: loadRouteComponent('app/earnings/views/VehicleEarningsInformation'),
            meta: {
              title: 'Vehicle-Earnings-Information',
              requiresAuth: true,
            },
          },

        ]
      },
      // {
      //   path: '/trips',
      //   name: 'trips',
      //   component: Trips,
      //   meta: {
      //     title: 'Trips',
      //     requiresAuth: true
      //   },
      //   children: [
      //     {
      //       path: '',
      //       name: 'trips.list',
      //       component: loadRouteComponent('app/trips/list/TripsList'),
      //       meta: {
      //         title: 'Trips',
      //         requiresAuth: true
      //       }
      //     },
      //     {
      //       path: 'details/:tripId',
      //       component: loadRouteComponent('app/trips/details/SingleTrip'),
      //       name: 'trips.detail.info',
      //       props: true,
      //       meta: {
      //         title: 'Trip Details',
      //         requiresAuth: true
      //       }
      //     },
      //     {
      //       path: 'details/mainfest/:tripId',
      //       component: loadRouteComponent('app/trips/details/TripManifest'),
      //       name: 'trips.manifest.info',
      //       props: true,
      //       meta: {
      //         title: 'Trip Details',
      //         requiresAuth: true
      //       }
      //     }
      //   ]
      // },
      {
        path: '/trips',
        name: 'trips',
        component: Trips,
        redirect: 'trips.list',
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
            },
          },
          {
            path: 'details/:tripId',
            component: loadRouteComponent('app/trips/details/TripsDetailsIndex'),
            props: true,
            meta: {
              title: 'Trip Details',
              requiresAuth: true
            },
            children: [
              {
                path: '',
                name: 'trip.detail',
                redirect: 'information'
              },
              {
                path: 'information',
                name: 'trip.detail.info',
                component: loadRouteComponent('app/trips/details/TripInfo'),
                meta: {
                  title: 'Trip Details',
                  requiresAuth: true
                },
              },
              {
                path: 'manifest',
                name: 'trip.detail.manifest',
                component: loadRouteComponent('app/trips/details/TripManifest'),
                meta: {
                  title: 'Trip Manifest',
                  requiresAuth: true
                },
              }
            ]
          },
        ]
      },
      {
        path: '/settings',
        name: 'settings',
        component: Settings,
        redirect: 'settings.edit.partner',
        meta: {
          title: 'Settings',
          requiresAuth: true
        },
        children: [
          {
            path: '',
            name: 'settings.edit.partner',
            component: loadRouteComponent('app/settings/EditPartnerInfo'),
            meta: {
              title: 'Edit Partner Information',
              requiresAuth: true
            }
          },
          {
            path: 'company',
            name: 'settings.edit.partner.company',
            component: loadRouteComponent('app/settings/EditCompanyInfo'),
            meta: {
              title: 'Edit Company Information',
              requiresAuth: true
            }
          },
          {
            path: 'accounts',
            name: 'settings.edit.settlemet.account',
            component: loadRouteComponent('app/settings/SettlementAccount'),
            meta: {
              title: 'Settlement Account Information',
              requiresAuth: true
            }
          }
        ]
      }
    ]
  },
]

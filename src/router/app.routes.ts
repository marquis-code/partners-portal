import {RouteRecordRaw} from "vue-router";
import HomeView from "@/views/HomeView.vue";
import Dashboard from "@/views/Dashboard.vue";

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
  }
]

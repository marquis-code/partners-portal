import Login from "@/views/auth/Login.vue";
import PasswordReset from "@/views/auth/PasswordReset.vue";
import ForgotPassword from "@/views/auth/ForgotPassword.vue";
import {loadRouteComponent} from "@/utils/route-helper.util";

export const AuthRoutes: Array<any> = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: 'Login',
      requiresAuth: false
    }
  },
  {
    path: '/password-reset',
    name: 'password-reset',
    component: PasswordReset,
    meta: {
      title: 'Reset your password',
      requiresAuth: false
    }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPassword,
    meta: {
      title: 'Forgot Password',
      requiresAuth: false
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: loadRouteComponent('AboutView.vue')
  }
]

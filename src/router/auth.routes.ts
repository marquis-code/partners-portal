import Login from "@/views/auth/login/Login.vue";
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
      requiresAuth: false,
      isGuest: true
    }
  },
  /*  {
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
  }, */

]

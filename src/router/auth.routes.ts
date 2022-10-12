import Login from "@/views/auth/login/Login.vue";
import Register from "@/views/auth/Register.vue";

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
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      title: 'Become a Partner',
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

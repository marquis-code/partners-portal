import jwt_decode from 'jwt-decode'
import { useRouter } from "vue-router";
import { ref } from 'vue'

import {axiosInstance, setAuthorization} from "@/plugins/axios";

const error = ref('')

export const useSignInUserExternally = () => {
  const sign_user_in = async (token: string, redirect = '/dashboard/events/manage/upcoming') => {
    error.value = ''
    if (!token) {
      error.value = 'Missing token'
      return false
    }
    const decoded = jwt_decode(token) as any

    return { ...decoded, token: {token, exp: 0, iat: 0}};
  }

  return { sign_user_in, error }
}

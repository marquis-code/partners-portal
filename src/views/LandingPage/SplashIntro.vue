<template>
    <login-or-signup  @goToLogin="$router.push({name: 'login'})" @goToSignUp="$router.push({name: 'register'})"/>
</template>
<script lang="ts">
import 'vue3-carousel/dist/carousel.css'

import {defineComponent} from "vue";
import LoginOrSignup from '@/views/auth/LoginOrSignup.vue';

export default defineComponent({
  components: {
    LoginOrSignup,
  },
  data () {
    return {
      step: 0,
      highlights: [
        {
          label: 'Manage your assets',
          description: 'Keep track of all your Drivers and Vehicles in one place.',
          image: require('@/assets/images/banners/manage_banner.svg')
        },
        {
          label: 'Earn from your Vehicles',
          description: 'Move shuttlers using your Vehicles and earn while doing so',
          image: require('@/assets/images/banners/earn_banner.svg')
        }
      ]
    }
  },
  computed: {
    registrationLink () {
      return `${process.env.VUE_APP_WEB_APP_BASE_URL}/register?ref=partner`;
    }
  }
})
</script>
<style lang="scss" scoped>
.carousel-wrapper {
  overflow-x: hidden;
  :deep .carousel {
    .carousel__pagination-button {
      &::after {
        border-radius: 100%;
        height: .75rem;
        width:  .75rem;
        background: #20E68220;

      }

      &--active::after {
        background: #20E682;
      }
    }
  }

}
</style>

<template>
  <forgot-password />
</template>

<!-- <script lang="ts">
import 'vue3-carousel/dist/carousel.css';

import { defineComponent } from 'vue';
import ForgotPassword from '@/views/auth/ForgotPassword.vue';

export default defineComponent({
  components: {
    ForgotPassword
  },
  data() {
    return {
      step: 0,
      highlights: [
        {
          label: 'Manage your assets',
          description:
            'Keep track of all your Drivers and Vehicles in one place.',
          image: require('@/assets/images/banners/manage_banner.svg')
        },
        {
          label: 'Earn from your Vehicles',
          description:
            'Move shuttlers using your Vehicles and earn while doing so',
          image: require('@/assets/images/banners/earn_banner.svg')
        }
      ]
    };
  }
});
</script> -->

<script setup lang="ts">
import 'vue3-carousel/dist/carousel.css';
import { } from 'vue';
import ForgotPassword from '@/views/auth/ForgotPassword.vue';

const step = 0
const highlights = [
  {
    label: 'Manage your assets',
    description:
      'Keep track of all your Drivers and Vehicles in one place.',
    image: require('@/assets/images/banners/manage_banner.svg')
  },
  {
    label: 'Earn from your Vehicles',
    description:
      'Move shuttlers using your Vehicles and earn while doing so',
    image: require('@/assets/images/banners/earn_banner.svg')
  }
]
</script>

<style lang="scss" scoped>
.carousel-wrapper {
  overflow-x: hidden;
  :deep .carousel {
    .carousel__pagination-button {
      &::after {
        border-radius: 100%;
        height: 0.75rem;
        width: 0.75rem;
        background: #20e68220;
      }

      &--active::after {
        background: #20e682;
      }
    }
  }
}
</style>

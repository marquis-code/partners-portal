<template>
  <register @goToLogin="$router.push({ name: 'login' })" />
</template>
<!-- <script lang="ts">
import 'vue3-carousel/dist/carousel.css';
import { defineComponent } from 'vue';
import Register from '@/views/auth/Register.vue';
export default defineComponent({
  components: {
    Register
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
  },
  computed: {
    registrationLink() {
      return `${process.env.VUE_APP_WEB_APP_BASE_URL}/register?ref=partner`;
    }
  }
});
</script> -->

<script setup lang="ts">
import 'vue3-carousel/dist/carousel.css';
import { computed } from 'vue';
import Register from '@/views/auth/Register.vue';

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

const registrationLink = computed(() => {
  return `${process.env.VUE_APP_WEB_APP_BASE_URL}/register?ref=partner`;
})

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

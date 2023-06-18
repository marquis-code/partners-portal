<template>
  <section class="bg-white">
    <!--    <sh-full-modal-component></sh-full-modal-component>-->
    <div class="lg:grid lg:min-h-screen lg:grid-cols-12">
      <section
        class="relative flex items-end bg-grays-black-2 lg:col-span-5 lg:h-full"
      >
        <div class="hidden lg:relative lg:block lg:p-12 carousel-wrapper pb-20">
          <carousel
            :items-to-show="1"
            :autoplay="8000"
            :wrap-around="true"
            class="lg:pb-12"
          >
            <slide v-for="(slide, index) in highlights" :key="index">
              <div
                class="
                  w-full
                  text-white
                  flex flex-col
                  items-center
                  pb-8
                  justify-center
                "
              >
                <img class="max-w-xs" :src="slide.image" />
                <h2 class="font-bold text-3xl leading-10 mt-16">
                  {{ slide.label }}
                </h2>
                <p class="text-grays-black-6 leading-8 mt-4">
                  {{ slide.description }}
                </p>
              </div>
            </slide>
            <template #addons>
              <pagination />
            </template>
          </carousel>
        </div>
      </section>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <Component :is="Component" />
        </transition>
      </router-view>
    </div>
  </section>
</template>
<!-- <script lang="ts">
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination } from 'vue3-carousel';

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LandingPage',
  components: {
    Carousel,
    Slide,
    Pagination
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
import { Carousel, Slide, Pagination } from 'vue3-carousel';

import { computed } from 'vue';
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

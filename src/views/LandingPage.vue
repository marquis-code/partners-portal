<template>
  <section class="bg-white">
<!--    <sh-full-modal-component></sh-full-modal-component>-->
    <div class="lg:grid lg:min-h-screen lg:grid-cols-12">
      <section class="relative flex items-end bg-grays-black-2 lg:col-span-5 lg:h-full">
        <div class="hidden lg:relative lg:block lg:p-12 carousel-wrapper pb-20">
          <carousel :items-to-show="1" :autoplay="8000" :wrap-around="true" class="lg:pb-12">
            <slide v-for="(slide, index) in highlights" :key="index">
              <div class="w-full text-white flex flex-col items-center pb-8 justify-center">
                <img class="max-w-xs" :src="slide.image">
                <h2 class="font-bold text-3xl leading-10 mt-16">{{slide.label}}</h2>
                <p class="text-grays-black-6 leading-8 mt-4">{{slide.description}}</p>
              </div>
            </slide>
            <template #addons>
              <pagination />
            </template>
          </carousel>
        </div>
      </section>

      <main
        class="flex items-center min-h-screen justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:py-12 lg:px-16">
        <div class="max-w-xl lg:max-w-2xl lg:w-3/6">
          <img alt="Shuttlers Logo" src="@/assets/images/brand_green.svg">
          <h2 class="font-bold text-4xl text-sh-grey-900 mt-8">Vehicle Partner Portal</h2>
          <p class="text-grays-black-5 leading-10 mt-4 max-w-sm">A new experience to managing your Vehicles and Drivers and earning with them.</p>
          <router-link to="/login" class="block cursor-pointer mt-10 border rounded-lg border-sh-grey-900 text-sh-grey-900 font-bold text-sm w-full py-3 text-center">
            Login
          </router-link>
          <a :href="registrationLink" class="hover:bg-sh-green-600 block cursor-pointer mt-4 rounded-lg border border-transparent text-sh-grey-900 font-bold bg-sh-green-500 text-sm w-full py-3 text-center">
            Become a vehicle partner
          </a>
        </div>
      </main>
    </div>
  </section>

</template>
<script lang="ts">
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination } from 'vue3-carousel'

import {defineComponent} from "vue";

export default defineComponent({
  name: 'LandingPage',
  components: {
    Carousel,
    Slide,
    Pagination,
  },
  data () {
    return {
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

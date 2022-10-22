<template>
  <page-layout page-title="Welcome">
    <div class="py-7 px-16 bg-white grid grid-cols-2 gap-4">
      <div class="left-side mr-16 border-r border-gray-200 pr-6">
        <p class="text-sm text-gray-500 mb-7">Complete your profile</p>
        <div class="flex flex-col">
          <CheckList :item="`Identity verification`" :done="true" />
          <CheckList :item="`Address verification`" :done="true" />
          <CheckList :item="`Upload company documents`" :done="false" @click="goToCompanyDocUpload"/>
          <CheckList :item="`Add a Driver (Optional)`" :done="false" />
          <CheckList :item="`Add a vehicle`" :done="false" />
          <CheckList :item="`Settlement Account details`" :done="false" />
        </div>
      </div>
      <!-- <div class="seperator w-0.5 h-20 bg-gray-100"></div> -->
      <div class="right-side flex flex-row justify-center items-center">
        <div class="">
          <p class="text-2xl font-medium">Welcome {{partnerContext.partner.company_name}}</p>
          <p>
            You’re doing well,
            <span class="text-sh-purple-700 underline">3 of 5</span> steps to be completed
          </p>
        </div>
      </div>
    </div>
  </page-layout>
</template>

<script>
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import PageLayout from '@/components/layout/PageLayout.vue';
import CheckList from '@/components/CheckList.vue';
export default defineComponent({
  components: { PageLayout, CheckList },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext'
    })
  },
  methods: {
    goToCompanyDocUpload() {
      this.$router.push('/dashboard/company-kyc')
    }
  }
});
</script>

<style scoped>
.seperator {
}
</style>

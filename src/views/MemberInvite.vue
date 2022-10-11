<template>
  <main class="flex justify-center items-center flex-col relative container mx-auto min-h-screen space-y-5">
    <template v-if="!loadingPageData">
      <div class="flex flex-col justify-between space-y-12 md:w-5/12 lg:w-4/12 w-11/12 mx-auto px-4 py-8 z-10 bg-white rounded-lg max-w-xl lg:max-w-2xl">
        <img src="@/assets/images/brand_green.svg" class="h-8" />

        <div class="flex justify-between items-center flex-col">
          <h1 class="mt-4 text-sh-grey-900 font-bold text-lg lg:text-3xl text-center">
            <span v-html="inviteTitle"></span>
          </h1>
          <p class="mt-4 text-grays-black-5 font-light text-sm md:text-base text-center">
            <span>Accept the invitation to become a member</span>
          </p>
          <div class="w-full space-x-2 mt-8 flex flex-grow" v-if="partnerInvitations.length === 1">
            <button
              :disabled="processingDecision"
              :class="processingDecision ? 'opacity-0.5' : ''"
              class="block cursor-pointer flex-1 rounded-lg border border-red-dark text-red-dark
          font-bold text-sm py-3 text-center" @click="rejectInvitation()">Reject</button>
            <button
              :disabled="processingDecision"
              :class="processingDecision ? 'opacity-0.5' : ''"
              class="hover:bg-sh-green-600 block cursor-pointer flex-1 rounded-lg border border-transparent text-sh-grey-900
          font-bold bg-sh-green-500 text-sm py-3 text-center" @click="acceptInvitation()">Accept</button>
          </div>
          <template v-else>
            <div class="w-full flex flex-col space-x-2">
              <div v-for="(invitation, index) in partnerInvitations" :key="index" class="w-full">

              </div>
            </div>
          </template>
        </div>

      </div>
    </template>
    <template v-else>
      <p class="text-sh-grey-900 font-bold text-lg text-center">Loading pending invitations...</p>
    </template>
    <div class="absolute bottom-0 hidden lg:flex absolute bottom-0 z-0 ">
      <img src="@/assets/images/backgroundGraphics.svg" class=" w-auto"/>
    </div>
  </main>
</template>

<script lang="ts">

import {Partner} from "@/models/organisation.model";
import {defineComponent} from "vue";
import {extractErrorMessage} from "@/utils/helper";

interface InvitePageData {
  partnerInvitations: Partial<Partner>[] | null;
}

export default defineComponent<any, any, Partial<InvitePageData>>({
  name: "MemberInvite",
  data () {
    return {
      partnerInvitations: [],
      loadingPageData: false,
      processingDecision: false,
    }
  },
  computed: {
    inviteTitle () {
      return (this.partnerInvitations?.length
        ? (this.partnerInvitations.length > 1
            ? 'Please make a decision on your pending invitations'
            : `Join <span class="text-sh-green-500">${this.partnerInvitations[0].company_name}</span> on Shuttlers`)
        : 'No partner invitations');
    }
  },
  created () {
    this.fetchPartnerInvitationData();
  },
  methods: {
    fetchPartnerInvitationData () {
      // const user: UserData = this.$store.getters['auth/user'];
      this.$axios.get(`v1/partner/invitations`)
        .then((response: any) => {
          this.partnerInvitations = response.data.data;
        }).catch((err: any) => {
          this.partnerInvitations = [{
            id: '',
            company_name: 'John doe limited',
          }]
          this.$toast.error(extractErrorMessage(err))
        }).finally(() => {
          this.loadingPageData = false;
        });
    },
    rejectInvitation () {
      const partner_account_sid = 1;
      this.processingDecision = true;
      this.$axios.post(`v1/partners/${partner_account_sid}/member-invitations/reject`)
        .then((res: any) => {
          // TODO: handle redirection after confirming design workflow
        })
        .catch((err: any) => {
          this.$toast.error(extractErrorMessage(err))
        })
        .finally(() => {
          this.processingDecision = false;
        });
    },
    acceptInvitation () {
      const partner_account_sid = 1;
      this.processingDecision = true;
      this.$axios.post(`v1/partners/${partner_account_sid}/member-invitations/reject`)
        .then((res: any) => {
          // TODO: handle redirection after confirming design workflow
        })
        .catch((err: any) => {
          this.$toast.error(extractErrorMessage(err))
        })
        .finally(() => {
          this.processingDecision = false;
        });
    }
  }
})
</script>

<style scoped>

</style>

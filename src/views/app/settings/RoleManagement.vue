<template>
  <div v-if="fetchingRoles">
    <spinner></spinner>
  </div>
  <div class="flex justify-end items-end pb-3">
    <button
      v-if="activeView !== 'add_role'"
      @click="handleViewChange"
      class="
        text-black text-sm
        bg-sh-green-500
        rounded-md
        shadow-sm
        px-5
        py-2
        mt-5
      "
    >
      Add Role
    </button>
  </div>
  <main
    v-if="activeView === 'role_table'"
    class="space-y-5 shadow-sm rounded-sm bg-white w-full"
  >
    <app-table
      :loading="fetchingMembers"
      :error-loading="errorLoading"
      :items="tableData"
      :fields="headers"
    >
      <template v-slot:is_default="{ item }">
        <span class="text-sm text-sh-green-700" v-if="item.is_default">
          Assigned
        </span>
        <span class="text-sm text-grays-black-6" v-else>
          No route assigned
        </span>
      </template>
      <template v-slot:actions="{ item }">
        <span
          @click="handleRoleDelete(item)"
          v-if="item && item.admin_class == 'owner'"
          class="text-sm text-red-500"
          >Remove {{item.admin_class}}</span
        >
      </template>
    </app-table>
  </main>
  <add-role
    @reloadPage="reloadPage"
    v-if="activeView === 'add_role'"
  ></add-role>

  <app-modal :modalActive="showModal">
    <div
      v-if="modalStatus === 'success'"
      class="flex flex-col justify-center items-center py-3"
    >
      <img src="@/assets/images/successCheck.svg" />
      <div class="space-y-3 pb-16 pt-5">
        <h1 class="text-center font-medium">Company information updated</h1>
        <p class="text-gray-400 text-center">
          Your company information has been updated.
        </p>
      </div>
      <button
        @click="closeModal"
        class="text-black bg-sh-green-500 rounded-md p-2 w-11/12 font-medium"
      >
        Dismiss
      </button>
    </div>
    <div
      v-if="modalStatus === 'warning'"
      class="flex flex-col justify-center items-center py-3"
    >
      <img src="@/assets/images/infoCheck.svg" />
      <div class="space-y-3 pb-16 pt-5">
        <h1 class="text-center font-medium text-lg">
          Delete {{ selectedIndividual?.admin_class }}
        </h1>
        <p class="text-gray-400 text-center">
          Are you sure you want to continue?
        </p>
      </div>
      <div class="flex justify-between items-center w-full space-x-10">
        <button
          @click="showModal = false"
          class="
            text-black
            bg-white
            ring-1 ring-gray-300
            rounded-md
            p-2
            w-11/12
            font-medium
          "
        >
          Cancel
        </button>
        <button
          @click="proceed"
          class="text-white bg-red-500 rounded-md p-2 w-11/12 font-medium"
        >
          Continue
        </button>
      </div>
    </div>

    <div
      v-if="modalStatus === 'warning-success'"
      class="flex flex-col justify-center items-center py-3"
    >
      <img src="@/assets/images/successCheck.svg" />
      <div class="space-y-3 pb-16 pt-5">
        <h1 class="text-center font-medium">
          {{ selectedIndividual?.admin_class }} has been removed
        </h1>
        <p class="text-gray-400 text-center">
          You have successfully removed an
          {{ selectedIndividual?.admin_class }}.
        </p>
      </div>
      <button
        @click="closeWarningSuccess"
        class="text-black bg-sh-green-500 rounded-md p-2 w-11/12 font-medium"
      >
        Dismiss
      </button>
    </div>
  </app-modal>
  <!-- </page-layout> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import { format } from 'date-fns';
import Spinner from '@/components/layout/Spinner.vue';
import AppModal from '@/components/Modals/AppModal.vue';
import AppTable from '@/components/AppTable.vue';
import AddRole from '@/views/app/settings/AddRole.vue';
import { getUserReadableDate } from '@/utils/dateFormatters';
import { extractErrorMessage } from '@/utils/helper';

export default defineComponent({
  components: {
    Spinner,
    AppModal,
    AppTable,
    AddRole
  },
  data() {
    return {
      modalStatus: 'success',
      activeView: 'role_table',
      errorLoading: false,
      fetchingMembers: false,
      tableData: [
        {
          id: 1,
          fname: 'Victor',
          lname: 'Abang',
          admin_class: 'Owner',
          email: 'Victor.abang@gmail.com',
          created_at: '20 May 2022',
          is_default: true
        }
      ],
      headers: [
        { label: 'First Name', key: 'fname' },
        { label: 'Last Name', key: 'lname' },
        { label: 'Admin Class', key: 'admin_class' },
        { label: 'Email', key: 'email' },
        { label: 'Created', key: 'created_at' },
        { label: 'Actions', key: 'actions' }
      ],
      fetchingRoles: false,
      format,
      showModal: false,
      processing: false,
      selectedIndividual: {}
    };
  },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext',
      userSessionData: 'auth/userSessionData',
      user: 'auth/user'
    })
  },
  created() {
    this.activeView = 'role_table';
    this.fetchPartnerMembers();
  },

  methods: {
    async fetchPartnerMembers() {
      try {
        this.fetchingMembers = true;
        const response = await this.$axios.get(
          `/v1/partners/${this.partnerContext.partner.account_sid}/members`
        );
        this.tableData = this.structureData(response.data.data);
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage);
      } finally {
        this.fetchingMembers = false;
      }
    },
    async handleRoleDelete(item: any) {
      this.modalStatus = 'warning';
      this.selectedIndividual = item;
      console.log(item);
      this.showModal = true;
      // await this.$axios.delete(`/v1/delete${item.id}`);
    },
    structureData(memberList: any) {
      const newMemberList: any[] = memberList.map(
        (member: {
          user: { fname: any; lname: any; email: any };
          role: any;
          created_at: string;
          id: any;
        }) => {
          return {
            fname: member?.user?.fname,
            lname: member?.user?.lname,
            admin_class: member?.role,
            email: member?.user?.email,
            created_at: getUserReadableDate(member?.created_at),
            actions: member?.id
          };
        }
      );
      return newMemberList;
    },
    handleViewChange() {
      this.activeView = 'add_role';
    },
    reloadPage() {
      this.activeView = 'role_table';
      // this.fetchRoles();
    },
    proceed() {
      this.modalStatus = 'warning-success';
    },
    closeWarningSuccess() {
      this.showModal = false;
    }
  }
});
</script>

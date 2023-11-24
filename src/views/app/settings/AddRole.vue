<template>
  <main class="md:w-9/12 p-10 lg:w-9/12 bg-white">
    <p class="text-sm text-gray-400 pb-3">Add New Member</p>
    <form class="space-y-3 lg:space-y-7">
      <section
        class="
          lg:flex
          justify-between
          space-y-3
          lg:space-y-0 lg:space-x-10
          items-center
        "
      >
        <div class="space-y-2 w-full">
          <label class="text-xs font-medium text-grays-black-5"
            >Email address</label
          >
          <input
            type="email"
            v-model="v$.form.email.$model"
            class="
              text-xs
              border-none
              outline-none
              w-full
              rounded-md
              p-3
              placeholder-gray-500 placeholder-opacity-25
              ring-1 ring-gray-300
            "
            placeholder="Enter staffs email address"
          />
          <span
            class="text-xs font-light text-red-500"
            v-if="v$.form.email.$dirty && v$.form.email.required.$invalid"
          >
            This field must be provided
          </span>
        </div>
        <div class="space-y-2 w-full">
          <label class="text-xs font-medium text-grays-black-5">Role</label>
          <select
            class="
              text-xs
              border-none
              outline-none
              w-full
              rounded-md
              p-3
              placeholder-gray-500 placeholder-opacity-25
              ring-1 ring-gray-300
            "
            v-model="v$.form.role.$model"
            name="role"
            id="role"
          >
            <option value="" disabled selected hidden>
              Select staffs role
            </option>
            <option value="owner">Owner</option>
            <option value="super-admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </select>
          <span
            class="text-xs font-light text-red-500"
            v-if="v$.form.role.$dirty && v$.form.role.required.$invalid"
          >
            This field must be provided
          </span>
        </div>
      </section>

      <div class="space-x-5 flex justify-end items-center pt-10">
        <button
          type="button"
          @click="createPartnerRoles"
          class="
            rounded-md
            w-32
            flex
            justify-center
            items-center
            p-3
            px-5
            text-sm
          "
          :disabled="v$.form.$invalid || processing"
          :class="
            v$.form.$invalid || processing
              ? 'cursor-not-allowed text-grays-black-5 bg-grays-black-7'
              : 'bg-sh-green-500 font-medium'
          "
        >
          {{ processing ? 'Saving' : 'Proceed' }}
          <spinner v-if="processing"></spinner>
        </button>
      </div>
    </form>
  </main>
  <app-modal :modalActive="showModal">
    <div class="flex flex-col justify-center items-center py-3">
      <img src="@/assets/images/successCheck.svg" />
      <div class="space-y-3 pb-16 pt-5">
        <h1 class="text-center font-medium">Member invite has been sent</h1>
        <p class="text-gray-400 text-center">
          This user will be notified to accept this invitation and join the
          organisation
        </p>
      </div>
      <button
        @click="goToMembersView"
        class="text-black bg-sh-green-500 rounded-md p-2 w-11/12 font-medium"
      >
        Dismiss
      </button>
    </div>
  </app-modal>
</template>

<!-- <script lang="ts">
import { defineComponent } from 'vue';
import useVuelidate from '@vuelidate/core';
import { mapGetters } from 'vuex';
import { email, required } from '@vuelidate/validators';
import { extractErrorMessage } from '@/utils/helper';
import Spinner from '@/components/layout/Spinner.vue';
import AppModal from '@/components/Modals/AppModal.vue';

interface Role {
  email?: string;
  role?: string;
}

export default defineComponent({
  components: {
    Spinner,
    AppModal
  },
  data () {
    return {
      v$: useVuelidate(),
      showModal: false,
      form: {} as Role,
      processing: false
    };
  },
  emits: ['reloadPage'],
  validations () {
    return {
      form: {
        email: { required, email },
        role: { required }
      }
    };
  },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext',
      userSessionData: 'auth/userSessionData',
      user: 'auth/user'
    })
  },
  methods: {
    goToMembersView () {
      this.showModal = false;
      this.$router.push({name: 'settings.edit.role.management'})
    },
    openModal () {
      this.showModal = true;
    },
    closeModal () {
      this.showModal = false;
      this.$emit('reloadPage');
    },
    async createPartnerRoles () {
      this.v$.form.$touch();
      if (this.processing || this.v$.form.$errors.length) {
        return;
      }
      this.processing = true;
      try {
        await this.$axios.post(`/v1/partners/${this.partnerContext.partner.account_sid}/member-invitations`, {...this.form})
        this.showModal = true;
      } catch (err) {
        const errorMessage = extractErrorMessage(
          err,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage, { position: 'top-right' });
      } finally {
        this.processing = false;
      }
    }
  }
});
</script> -->

<script setup lang="ts">
import { ref, Ref, computed, defineEmits } from 'vue';
import useVuelidate from '@vuelidate/core';
import { useStore } from 'vuex';
import { email, required } from '@vuelidate/validators';
import { extractErrorMessage } from '@/utils/helper';
import Spinner from '@/components/layout/Spinner.vue';
import AppModal from '@/components/Modals/AppModal.vue';
import router from '@/router';
import {axiosInstance as axios} from '@/plugins/axios';
import {useToast} from 'vue-toast-notification';

interface Role {
  email?: string;
  role?: string;
}

const toast = useToast()
const store = useStore()
const emit = defineEmits(['reloadPage'])
const validations = {
  form: {
    email: { required, email },
    role: { required }
  }
}
const showModal = ref(false)
const form = ref({}) as Ref<Role>
const processing = ref(false)
const v$ = useVuelidate(validations, {form})

const partnerContext:any = computed(() => store.getters['auth/activeContext'])
const userSessionData:any = computed(() => store.getters['auth/userSessionData'])
const user:any = computed(() => store.getters['auth/user'])

const goToMembersView = () => {
  showModal.value = false;
  router.push({name: 'settings.edit.role.management'})
}
const openModal = () => {
  showModal.value = true;
}
const closeModal = () => {
  showModal.value = false;
  emit('reloadPage');
}
const createPartnerRoles = async () => {
  v$.value.form.$touch();
  if (processing.value || v$.value.form.$errors.length) {
    return;
  }
  processing.value = true;
  try {
    await axios.post(`/v1/partners/${partnerContext.value.partner.account_sid}/member-invitations`, {...form.value})
    showModal.value = true;
  } catch (err) {
    const errorMessage = extractErrorMessage(
      err,
      null,
      'Oops! An error occurred, please try again.'
    );
    toast.error(errorMessage, { position: 'top-right' });
  } finally {
    processing.value = false;
  }
}
</script>

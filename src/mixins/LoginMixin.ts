import {defineComponent} from "vue";
import {mapActions} from "vuex";
import useVuelidate from "@vuelidate/core";

export default defineComponent({
  // setup: () => ({ v$: useVuelidate() }),
  data () {
    return {
      loading: false,
      v$: useVuelidate()
    }
  },
  computed: {
    signUpLink (): string {
      return `${process.env.VUE_APP_WEB_APP_BASE_URL}/register?ref=partner`
    },
    forgotPasswordLink (): string {
      return `${process.env.VUE_APP_WEB_APP_BASE_URL}/forgot-password`
    },
    isValidForm (): boolean {
      return !this.v$.form.$invalid;
    }
  },
  methods: {
    ...mapActions('auth', ['setUserSessionData']),
    isControlValid (controlName: string): boolean {
      return !(this.v$.form[controlName].$dirty && this.v$.form[controlName].$error);
    }
  }
})

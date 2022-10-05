<template>
  <div>Login</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {mapActions} from "vuex";

export default defineComponent({
  name: 'Login',
  methods: {
    ...mapActions('auth', ['setSessionData']),
    login () {
      // TODO: after getting login response, call setSessionData action with api response..it should fit the userSession model
      // @see @models/user-session.model for interface structure
    }
  }
});

</script>

<style lang="scss" scoped>

</style>

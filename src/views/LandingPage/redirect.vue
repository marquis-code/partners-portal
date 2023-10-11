<template>
	<div class="flex flex-col h-screen gap-4 p-5 justify-center items-center w-screen">
		<img src="@/assets/images/logo2.svg" alt="logo" class="w-96">
		<!-- <Spinner class="!border-t-dark" /> -->
	</div>
</template>

<script setup lang="ts">
import { useSignInUserExternally } from '@/composables/auth/external'
import { useRoute, useRouter } from "vue-router";
import { onMounted } from 'vue'
import { useStore } from 'vuex';

const { query } = useRoute()
const router = useRouter()
const store = useStore()

const { sign_user_in } = useSignInUserExternally()

onMounted(async () => {
  const res = await sign_user_in((query.token as string).replace(/"/g, '').trim(), query.path as string)
  if (res) {
    await store.dispatch('auth/authSuccess', res);
    router.push(query.path as string);
  }
})

</script>

<style scoped></style>

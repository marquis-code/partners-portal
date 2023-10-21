<template>
	<div class="w-full flex h-[300px] items-center justify-center">
      <div class="flex flex-col gap-2">
        <ColorSpinner/>
        <p class="text-sm text-black">Loading...</p>
      </div>
    </div>
</template>

<script setup lang="ts">
import ColorSpinner from '@/components/layout/Spinner.vue';
</script>

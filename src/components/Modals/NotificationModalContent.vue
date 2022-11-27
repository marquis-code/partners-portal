<template>
  <div class="">
    <main
      class="
        z-50
        flex
        justify-center
        items-center
        flex-col
        space-y-7
        rounded-md
        shadow-md
        w-full
        bg-white
        md:w-6/12
        lg:w-6/12
        xl:w-96
        2xl:w-96
        mx-auto
        py-10
      "
    >
      <slot name="modalHeader"></slot>
      <slot name="modalBody"></slot>
      <slot name="modalExtras"></slot>
      <slot name="modalFooter"></slot>
    </main>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
</style>

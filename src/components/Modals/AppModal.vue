<template>
  <Teleport to="body">
    <Transition name="modal-outer">
      <div
        v-show="modalActive"
        class="fixed w-full bg-black bg-opacity-30 h-full top-0 left-0 flex justify-center px-8"
      >
        <Transition name="modal-inner">
          <div
            v-if="modalActive"
            class="modal-main p-6 bg-white self-start mt-32 max-w-screen-md rounded-xl"
          >
            <slot/>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<!-- <script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  props: {
    modalActive: {
      type: Boolean,
      default: false,
    },
  },
  components: { }
});
</script> -->

<script setup lang="ts">
import {defineProps, withDefaults} from "vue";

export interface Props {
  modalActive?: boolean
}

withDefaults(defineProps<Props>(), {
  modalActive: false
})
</script>

<style scoped>
.modal-main {
  min-height: 288px;
  min-width: 350px;
}
@media screen and (min-width: 480px) {
  .modal-main {
    min-width: 420px;
  }
}
.modal-outer-enter-active,
.modal-outer-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-outer-enter-from,
.modal-outer-leave-to {
  opacity: 0;
}
.modal-inner-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}
.modal-inner-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-inner-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
.modal-inner-leave-to {
  transform: scale(0.8);
}
</style>

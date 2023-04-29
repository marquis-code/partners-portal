<template>
  <span
    v-if="isCountdownComplete"
    class="text-xs text-active font-medium cursor-pointer"
    @click="onClickResendCode"
    >Resend code</span
  >

  <span v-else class="text-xs font-medium"
    >Resend code in <b class="text-active">{{ timeLeft }}</b></span
  >
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  props: {
    value: {
      default: 600, // in seconds,
    },
    shouldStart: {
      default: true,
    },
  },
  data () {
    return {
      time: 10, // in seconds
      timer: 0 as any,
    };
  },
  created () {
    this.time = this.value;
    this.timer = setInterval(this.decrement, 1000);
  },
  watch: {
  },
  methods: {
    onClickResendCode () {
      this.time = this.value;
      this.timer = setInterval(this.decrement, 1000);
      this.$emit("on-timer-restart")
    },
    decrement () {
      if (this.time > 0) {
        this.time--;
        return;
      }

      clearInterval(this.timer);
    },
  },
  computed: {
    timeLeft () {
      return `${this.minutes}:${this.seconds}`;
    },
    minutes () {
      return String(Math.floor(this.time / 60)).padStart(2, "0");
    },
    seconds () {
      return String(this.time % 60).padStart(2, "0");
    },
    isCountdownComplete () {
      return this.time === 0;
    },
  },
  beforeUnmount () {
    clearInterval(this.timer);
  },
});
</script>

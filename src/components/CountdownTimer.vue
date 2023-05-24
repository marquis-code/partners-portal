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

<!-- <script lang="ts">
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
</script> -->

<script setup lang="ts">
import {ref, Ref, defineProps, withDefaults, defineEmits, computed, onBeforeUnmount, onMounted} from "vue";

const time = ref(10)
const timer = ref(0) as Ref<any>
const emit = defineEmits(['on-timer-restart'])
export interface Props {
  value?: number
  shouldStart?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: 600,
  shouldStart: true
})

const onClickResendCode = () => {
  time.value = props.value;
  timer.value = setInterval(decrement, 1000);
  emit('on-timer-restart')
  // this.$emit("on-timer-restart")
}

const decrement = () => {
  if (time.value > 0) {
    time.value--;
    return;
  }

  clearInterval(timer.value);
}

const timeLeft = computed(() => {
  return `${minutes.value}:${seconds.value}`;
})
const minutes = computed(() => {
  return String(Math.floor(time.value / 60)).padStart(2, "0");
})
const seconds = computed(() => {
  return String(time.value % 60).padStart(2, "0");
})
const isCountdownComplete = computed(() => {
  return time.value === 0;
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
})

onMounted(() => {
  time.value = props.value
  timer.value = setInterval(decrement, 1000);
})
</script>

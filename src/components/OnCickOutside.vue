<script>
export default {
  props: {
    action: Function
  },
  data () {
    return {
      listener: null,
    }
  },
  mounted () {
    this.listener = e => {
      if (e.target === this.$el || this.$el.contains(e.target)) {
        return;
      }
      this.action();
    };

    document.addEventListener("click", this.listener);
  },
  beforeUnmount () {
    if (this.listener) { document.removeEventListener("click", this.listener); }
  },
  render () {
    return this.$slots.default;
  }
};
</script>

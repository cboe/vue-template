<template>
  <div :class="b()">
    Some {{ content }}
  </div>
</template>

<script>
  export default {
    name: 'c-test',
    // status: 1,

    // components: {},
    // mixins: [],

    // props: {},
    data() {
      return {
        content: 'Text'
      };
    },

    // computed: {},
    // watch: {},

    // beforeCreate() {},
    // created() {},
    // beforeMount() {},
    // mounted() {},
    // beforeUpdate() {},
    // updated() {},
    // activated() {},
    // deactivated() {},
    // beforeDestroy() {},
    // destroyed() {},

    // methods: {},
    // render() {},
  };
</script>

<style lang="scss">
  .c-test {
    background: $color-grayscale--200;
  }
</style>

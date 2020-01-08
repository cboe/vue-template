<template>
  <div :class="b()" data-app>
    <slot></slot>
  </div>
</template>

<script>

  export default {
    name: 'l-default',
    // status: 1,

    // components: {},
    // mixins: [],

    // props: {},
    // data() {
    //   return {};
    // },

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
  .l-default {
    display: flex;
    flex-direction: column;
    height: 100vh;

    &__content {
      background: $color-grayscale--600;
      flex: 1 0 auto;
      min-height: 1px; // Fixes a content shifting issue with IE11 if a child element has hover
    }

    &__inner {
      position: relative;
      background: $color-grayscale--1000;
      box-shadow: 0 4px 10px 1px rgba($color-grayscale--400, 0.3);
      max-width: #{map-get($breakpoints, xl) - 20px};
    }
  }

  .s-layout {
    max-width: initial;
    margin: initial;
  }
</style>

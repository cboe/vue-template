<template>
  <fieldset :class="b()">
    <legend v-if="legend" :class="b('legend')">
      <span :class="b('inner')">{{ legend }}</span>
    </legend>
    <div :class="b('fields')">
      <slot></slot>
    </div>
  </fieldset>
</template>

<script>

  /**
   *
   * Component to render a fieldset with or without legend.
   *
   */
  export default {
    name: 'e-fieldset',
    status: 0,

    // components: {},
    // mixins: [],

    props: {
      /**
       * Defines the legend of the fieldset
       *
       */
      legend: {
        type: String,
        default: null,
      },
    },
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
  .e-fieldset {
    &__legend {
      @include font($font-size--18, 22px, $font-weight--regular);

      color: $color-secondary--1;
      margin-bottom: $spacing--0;
    }

    &__inner {
      display: inline-block;
      border-bottom: 1px solid $color-primary--1;
    }

    &__fields {
      padding: $spacing--25 0 $spacing--20;

      @include media(xs) {
        padding: $spacing--30 0;
      }
    }
  }
</style>

<template>
  <div :class="b()">
    <s-palette-item
      v-for="palette in palettes"
      :key="palette"
      :palette="palette"
      :colors="colors[palette]"
    />
  </div>
</template>

<script>
  import paletteColors from '../../setup/js/color';
  import sPaletteItem from './s-palette-item';

  export default {
    name: 's-palette-list',
    status: 0,

    components: {
      's-palette-item': sPaletteItem
    },
    // mixins: [],

    // props: {},
    // data() {
    //   return {};
    // },

    computed: {
      /**
       * Returns an Object of color lists.
       *
       * @returns {Object}
       */
      colors() {
        return paletteColors;
      },

      /**
       * Returns an Array of color palette names.
       *
       * @returns {Array.<String>}
       */
      palettes() {
        return Object.keys(paletteColors);
      }
    },
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
  .s-palette-list {
    font-family: $font-family--primary;
  }
</style>

<template>
  <div :class="b()">
    <a v-if="$attrs.href"
       :class="b('link')"
       :title="logo.title"
       v-bind="$attrs"
       tabindex="-1">
      <!-- TODO: Check if e-icon is the best way to render the logo -->
      <e-icon :icon="logo.icon"
              :alt="logo.alt"
      />
    </a>
    <e-icon v-else
            :icon="logo.icon"
            :alt="logo.alt"
    />
  </div>
</template>

<script>
  import themes from '../mixins/themes';

  /**
   * e-logo renders the company logo depending on the current theme (from the vuex store)
   *
   * Native link attributes can be used
   */
  export default {
    name: 'e-logo',
    status: 0,

    // components: {},
    mixins: [themes],

    inheritAttrs: false,

    // props: {},
    // data() {
    //   return {};
    // },

    computed: {
      /**
       * Get's the correct logo depending on the theme value from the vuex store.
       *
       * @returns {Object} logo-name
       */
      logo() {
        const { theme } = this;
        const title = this.$t('e-logo.linkTitle');
        let icon = '';
        let alt = '';

        switch (theme) {
          case '01':
            icon = 'styleguide-heart';
            alt = 'example logo default';
            break;

          case '02':
            icon = 'svg-logo-name-02';
            alt = 'example logo 02';
            break;

          case '03':
            icon = 'svg-logo-name-03';
            alt = 'example logo 03';
            break;

          case '04':
            icon = 'svg-logo-name-04';
            alt = 'example logo 04';
            break;

          case '05':
            icon = 'svg-logo-name-05';
            alt = 'example logo 05';
            break;

          default:
            icon = 'styleguide-heart';
            alt = 'example logo default';
        }

        return {
          icon,
          alt,
          title
        };
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
  .e-logo {
    &__link,
    &__link:hover,
    &__link:focus {
      display: inline-block;
      width: 100%;
      text-decoration: none;
      border-bottom: 0;
      padding: 0;
    }
  }
</style>

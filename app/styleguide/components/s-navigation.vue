<!--<template>-->
<!--  <div :class="b()">-->
<!--    <div :class="b('navigation-wrapper', wrapperModifiers)" @click="onClick">-->
<!--      <ul :class="b('navigation')">-->
<!--        <li :class="b('navigation-item', { logo: true })">-->
<!--          <a :class="b('navigation-link')"-->
<!--             href="http://www.valantic.com"-->
<!--             target="_blank"-->
<!--          >-->
<!--            <img src="../assets/valantic.svg" alt="valantic">-->
<!--          </a>-->
<!--        </li>-->
<!--        <li :class="b('navigation-item', { language: true })" @click.stop>-->
<!--          <s-language />-->
<!--        </li>-->
<!--        <li :class="b('navigation-item', { theme: true })" @click.stop>-->
<!--          <s-theme-selector />-->
<!--        </li>-->
<!--        <li :class="b('navigation-item', { settings: true })">-->
<!--          <h2>Settings</h2>-->
<!--          <s-demo-settings />-->
<!--        </li>-->
<!--        &lt;!&ndash; eslint-disable vue/no-use-v-if-with-v-for &ndash;&gt;-->
<!--        <router-link-->
<!--          v-if="route.meta"-->
<!--          v-for="route in routes"-->
<!--          :key="route.name"-->
<!--          :to="{ name: route.name }"-->
<!--          :class="b('navigation-item')"-->
<!--          :active-class="`${$options.name}-item&#45;&#45;active-path`"-->
<!--          :exact-active-class="`${$options.name}-item&#45;&#45;active`"-->
<!--          tag="li"-->
<!--          exact>-->
<!--          <a :class="b('navigation-link')">-->
<!--            {{ route.meta.title }}-->
<!--          </a>-->
<!--        </router-link>-->
<!--        <li :class="b('navigation-item', { components: true })">-->
<!--          <a :class="b('navigation-link')"-->
<!--             :href="styleguidistUrl"-->
<!--             target="_blank"-->
<!--          >-->
<!--            Components-->
<!--          </a>-->
<!--        </li>-->
<!--      </ul>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--  import sLanguage from './s-language';-->
<!--  import sThemeSelector from './s-theme-selector';-->
<!--  import sDemoSettings from './s-demo-settings';-->

<!--  export default {-->
<!--    name: 's-navigation',-->
<!--    // status: 1,-->

<!--    components: {-->
<!--      sDemoSettings,-->
<!--      sLanguage,-->
<!--      sThemeSelector-->
<!--    },-->
<!--    props: {-->
<!--      /**-->
<!--       * An array of styleguide routes-->
<!--       */-->
<!--      routes: {-->
<!--        type: Array,-->
<!--        default: () => [],-->
<!--      },-->

<!--      /**-->
<!--       * Position of navigation (top-right, top-left, bottom-left, bottom-right)-->
<!--       */-->
<!--      navPosition: {-->
<!--        type: String,-->
<!--        default: 'top-right',-->
<!--        validator(value) {-->
<!--          return [-->
<!--            'top-left',-->
<!--            'top-right',-->
<!--            'bottom-right',-->
<!--            'bottom-left',-->
<!--          ].includes(value);-->
<!--        },-->
<!--      },-->
<!--    },-->
<!--    data() {-->
<!--      return {-->
<!--        isOpen: false,-->
<!--      };-->
<!--    },-->
<!--    computed: {-->
<!--      styleguidistUrl() {-->
<!--        return process.env.NODE_ENV === 'production'-->
<!--          ? '/styleguidist'-->
<!--          : '//localhost:6060';-->
<!--      },-->

<!--      /**-->
<!--       * Returns all modifiers for the wrapper class.-->
<!--       *-->
<!--       * @returns {Object}-->
<!--       */-->
<!--      wrapperModifiers() {-->
<!--        return {-->
<!--          position: this.navPosition,-->
<!--          open: this.isOpen,-->
<!--        };-->
<!--      }-->
<!--    },-->
<!--    methods: {-->
<!--      onClick() {-->
<!--        this.isOpen = !this.isOpen;-->
<!--      }-->
<!--    }-->
<!--  };-->
<!--</script>-->

<!--<style lang="scss">-->
<!--  $s-navigation&#45;&#45;border: $spacing&#45;&#45;10 solid $color-grayscale&#45;&#45;400;-->
<!--  $s-navigation&#45;&#45;trigger-size: 40px;-->

<!--  .s-navigation {-->
<!--    &__navigation-wrapper {-->
<!--      font-family: $font-family&#45;&#45;primary;-->
<!--      margin: auto;-->
<!--      position: fixed;-->
<!--      opacity: 0.2;-->
<!--      min-width: $spacing&#45;&#45;40;-->
<!--      background-color: $color-grayscale&#45;&#45;1000;-->
<!--      z-index: 10000;-->
<!--      height: 100%;-->

<!--      &::before {-->
<!--        content: '';-->
<!--        position: absolute;-->
<!--        width: $s-navigation&#45;&#45;trigger-size;-->
<!--        height: $s-navigation&#45;&#45;trigger-size;-->
<!--        background-color: $color-grayscale&#45;&#45;1000;-->
<!--        border-top: 1px solid $color-grayscale&#45;&#45;400;-->
<!--        border-left: 1px solid $color-grayscale&#45;&#45;400;-->
<!--        background-image: url('../assets/menu-button.svg');-->
<!--        background-repeat: no-repeat;-->
<!--        background-size: $s-navigation&#45;&#45;trigger-size - 15px;-->
<!--        background-position: center;-->
<!--        cursor: pointer;-->
<!--      }-->

<!--      > * {-->
<!--        display: none;-->
<!--      }-->

<!--      &&#45;&#45;open {-->
<!--        opacity: 1;-->

<!--        > * {-->
<!--          display: block;-->
<!--        }-->
<!--      }-->

<!--      &&#45;&#45;position-top-right,-->
<!--      &&#45;&#45;position-bottom-right {-->
<!--        border-bottom: 0;-->
<!--        min-width: 0;-->
<!--        top: 0;-->
<!--        right: 0;-->
<!--        bottom: 0;-->

<!--        &::before {-->
<!--          top: 0;-->
<!--          left: -$s-navigation&#45;&#45;trigger-size;-->
<!--        }-->

<!--        &.s-navigation__navigation-wrapper&#45;&#45;open {-->
<!--          border-left: $s-navigation&#45;&#45;border;-->
<!--        }-->
<!--      }-->

<!--      &&#45;&#45;position-bottom-right {-->
<!--        &::before {-->
<!--          top: auto;-->
<!--          bottom: 0;-->
<!--        }-->
<!--      }-->

<!--      &&#45;&#45;position-top-left,-->
<!--      &&#45;&#45;position-bottom-left {-->
<!--        border-bottom: 0;-->
<!--        min-width: 0;-->
<!--        top: 0;-->

<!--        &::before {-->
<!--          top: 0;-->
<!--          left: 100%;-->
<!--        }-->

<!--        &.s-navigation__navigation-wrapper&#45;&#45;open {-->
<!--          border-right: $s-navigation&#45;&#45;border;-->
<!--        }-->
<!--      }-->

<!--      &&#45;&#45;position-bottom-left {-->
<!--        &::before {-->
<!--          top: auto;-->
<!--          bottom: 0;-->
<!--        }-->
<!--      }-->
<!--    }-->

<!--    &__navigation {-->
<!--      @extend %list-reset;-->

<!--      min-width: 200px;-->
<!--      max-height: 100vh;-->
<!--      overflow: auto;-->
<!--    }-->

<!--    &__navigation-item {-->
<!--      &&#45;&#45;components {-->
<!--        border-top: 1px solid $color-grayscale&#45;&#45;400;-->
<!--      }-->

<!--      &&#45;&#45;language,-->
<!--      &&#45;&#45;theme,-->
<!--      &&#45;&#45;settings {-->
<!--        padding: $spacing&#45;&#45;10 $spacing&#45;&#45;20;-->
<!--        border-bottom: 1px solid $color-grayscale&#45;&#45;400;-->
<!--      }-->
<!--    }-->

<!--    &__navigation-link {-->
<!--      padding: $spacing&#45;&#45;10 $spacing&#45;&#45;20;-->
<!--      text-decoration: none;-->
<!--      display: block;-->

<!--      &:hover {-->
<!--        text-decoration: underline;-->
<!--      }-->
<!--    }-->

<!--    &__navigation-item&#45;&#45;logo {-->
<!--      border-bottom: 1px solid $color-grayscale&#45;&#45;400;-->

<!--      img {-->
<!--        max-width: 150px;-->
<!--      }-->

<!--      .s-navigation__navigation-link {-->
<!--        padding: $spacing&#45;&#45;10 $spacing&#45;&#45;5;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--</style>-->

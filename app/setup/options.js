import Vue from 'vue';
import store from '@/store/index';
import VueI18n from 'vue-i18n';
import VueAxios from '@/setup/plugins/axios';
import VueBemCn from 'vue-bem-cn';
import cssVars from 'css-vars-ponyfill';

// Polyfills and self executing
import 'intersection-observer';
import 'picturefill';
import 'lazysizes';
import './lib/ls.attrchange'; // lazy sizes attribute change observer

import { I18N_FALLBACK, I18N_FALLBACK_MESSAGES } from './i18n';

/**
 * Polyfill for css vars on IE11 https://github.com/jhildenbiddle/css-vars-ponyfill
 */
cssVars({
  // ...
});
Vue.use(VueI18n);
Vue.use(VueAxios);
Vue.use(VueBemCn, {
  hyphenate: true,
});

export const i18n = new VueI18n({
  locale: I18N_FALLBACK,
  fallbackLocale: I18N_FALLBACK,
  messages: {
    [I18N_FALLBACK]: I18N_FALLBACK_MESSAGES,
  },
});

export default {
  el: '#app',
  store,
  i18n,
};

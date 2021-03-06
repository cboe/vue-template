import Vue from 'vue';
import Vuex from 'vuex';

const data = window.initialData || {};
const requireModule = require.context('./modules/', true, /index\.js/);
const modules = {};

requireModule.keys().forEach((fileName) => {
  const moduleName = fileName.replace(/(\.\/|\/index\.js)/g, '').replace(/-([a-z])/g, group => group[1].toUpperCase());

  modules[moduleName] = requireModule(fileName).default;
});

Vue.config.devtools = process.env.NODE_ENV !== 'production' || process.env.HAS_WATCHER;

Vue.use(Vuex);

const store = new Vuex.Store({
  /**
   * state, actions & getters
   * must be defined within modules
   * */
  modules
});

// Set initial data
Object.keys(data).forEach((action) => {
  try {
    store.dispatch(action, JSON.parse(data[action]));
  } catch (error) {
    throw new Error(`The initial data provided for '${action}' is no valid JSON.`);
  }
});

window.initialData = {};

export default store;

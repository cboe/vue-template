import index from '../styleguide/routes/index';
import sandbox from '../styleguide/routes/sandbox';

const root = '/styleguide';

/**
 * This file is only meant for style-example routes
 */
export default [
  {
    path: root,
    name: 'index',
    component: index,
    meta: {
      title: 'Welcome',
    }
  },
  {
    path: `${root}/sandbox`,
    name: 'sandbox',
    component: sandbox,
    meta: {
      title: 'Sandbox',
    }
  },
  {
    path: '*',
    redirect: root,
  },
];

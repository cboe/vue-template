// Form elements
// import eInput from '@/components/e-input';

// Elements
// import eIcon from '@/components/e-icon';

// Components
// import cModal from '@/components/c-modal';

// Web components
import cDatepicker from '@/components/c-datepicker';

// Import style only 'components'.
require.context('@/components', false, /\.scss/);

export default {
  install(Vue) {
    const components = [
      // eInput,
      // eIcon,
      // cModal,
    ];
    const customElements = [
      cDatepicker,
    ];

    // This improves component usage in PhpStorm, while keeping optimized import in production
    if (process.env.NODE_ENV === 'production') {
      components.forEach((component) => {
        Vue.component(component.name, component);
      });
    } else {
      // Vue.component(eInput.name, eInput);
      // Vue.component(eIcon.name, eIcon);
      // Vue.component(cModal.name, cModal);
    }

    customElements.forEach((component) => {
      Vue.customElement(component.name, component);
    });
  },
};

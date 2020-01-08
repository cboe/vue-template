### Modal swiper

```vue
<template>
  <c-swiper-modal :images="images"/>
</template>
<script>
  export default {
    name: 'swiper-modal',
    data() {
      return {
        images: [
          {
            fallback: 'http://via.placeholder.com/500',
            srcset: {
              500: 'http://via.placeholder.com/500',
              800: 'http://via.placeholder.com/800',
              1200: 'http://via.placeholder.com/1200'
            },
            alt: ''
          },
          {
            fallback: 'http://via.placeholder.com/500',
            srcset: {
              500: 'http://via.placeholder.com/500',
              800: 'http://via.placeholder.com/800',
              1200: 'http://via.placeholder.com/1200'
            },
            alt: ''
          },
          {
            fallback: 'http://via.placeholder.com/500',
            srcset: {
              500: 'http://via.placeholder.com/500',
              800: 'http://via.placeholder.com/800',
              1200: 'http://via.placeholder.com/1200'
            },
            alt: ''
          }]
      }
    },
  };
</script>
```

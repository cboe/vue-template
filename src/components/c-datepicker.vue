<template>
  <div :class="b()">
    <datepicker
      :language="languages[language]"
      :highlighted="{ dates: highlighted }"
      :day-cell-content="renderCell"
      monday-first
      full-month-name
      inline
      @selected="onDateSelected"
    />
    <footer v-if="highlightedDate" class="b('footer')">
      <ul v-if="highlightedDate.activeTimeSlots">
        <li v-for="(timeslot, index) in highlightedDate.activeTimeSlots" :key="index">
          <label><input type="radio" name="timeslot" :value="timeslot.value">{{ timeslot.label }}</label>
        </li>
      </ul>
      <div :class="b('actions')">
        <div v-if="highlightedDate.additionalPrice" v-html="highlightedDate.additionalPrice"></div>
        <button @click="onSubmit">OK</button>
      </div>
    </footer>
  </div>
</template>

<script>
  /* eslint-disable id-length */

  import Datepicker from 'vuejs-datepicker';
  import deliveryDates from '@/styleguide/mock-data/api-response/deliveryDates';
  import {
    de,
    fr,
    en,
    it
  } from 'vuejs-datepicker/dist/locale';

  export default {
    name: 'c-datepicker',
    // status: 1,

    components: {
      Datepicker,
    },
    // mixins: [],

    props: {
      highlightedDates: {
        type: Array,
        default: () => deliveryDates.data.validDates.map((entry) => {
          const date = new Date(entry.date);

          return {
            date,
            additionalPrice: entry.additionalPrice,
            activeTimeSlots: entry.activeTimeSlots,
          };
        }),
      },
      date: {
        type: Date,
        default: null,
      }
    },
    data() {
      return {
        highlighted: this.$props.highlightedDates.map(entry => entry.date),
        language: 'de', // TODO: make dynamic
        languages: {
          de,
          fr,
          en,
          it,
        },
        dateInternal: this.$props.date,
      };
    },

    computed: {
      highlightedDate() {
        const { dateInternal } = this;

        if (!dateInternal) {
          return null;
        }

        return this.highlightedDates.find((entry) => {
          const entryDate = entry.date;

          return entryDate.getDate() === dateInternal.getDate()
            && entryDate.getMonth() === dateInternal.getMonth()
            && entryDate.getFullYear() === dateInternal.getFullYear();
        });
      },
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

    methods: {
      renderCell(cell) {
        if (cell.isHighlighted) {
          const cellDate = new Date(cell.timestamp);
          const highlightedDate = this.highlightedDates.find((entry) => {
            const entryDate = entry.date;

            return entry.additionalPrice
              && entryDate.getDate() === cellDate.getDate()
              && entryDate.getMonth() === cellDate.getMonth()
              && entryDate.getFullYear() === cellDate.getFullYear();
          });

          if (highlightedDate) {
            return `<span class="${this.b('cell-inner', { additionalPrice: true })}">${cell.date}</span>`;
          }
        }

        return cell.date;
      },
      onDateSelected(date) {
        this.dateInternal = date;
      },
      onSubmit() {
        this.$emit('change', this.dateInternal);
      }
    },
    // render() {},
  };
</script>

<style lang="scss">
  .c-datepicker {
    &__cell-inner::after {
      content: "*";
      display: block;
      position: absolute;
      right: 0;
      bottom: 0;
      width: 12px;
      height: 12px;
      line-height: 12px;
    }

    // vuejs-datepicker
    /* stylelint-disable selector-class-pattern */
    .vdp-datepicker__calendar {
      header {
        @include font($font-size--14);

        color: $color-grayscale--1000;
        background-color: $color-primary--1;

        &::after { // Clear floats
          content: "";
          display: block;
          clear: both;
          height: 0;
        }
      }

      header .prev:not(.disabled),
      header .next:not(.disabled) {
        &:hover {
          background-color: transparent;
        }
      }

      .cell {
        position: relative;
      }

      .cell.day-header,
      .cell.day-header:hover {
        @include font($font-size--14);

        color: $color-grayscale--1000;
        background-color: $color-primary--1;
      }
    }
  }
</style>

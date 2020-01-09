<template>
  <div :class="b()">
    <datepicker
      :language="languages[language]"
      :highlighted="{ dates: highlightedDatesInternal }"
      :day-cell-content="renderCell"
      :disabled-dates="disabledDatesInternal"
      monday-first
      full-month-name
      inline
      @selected="onDateSelected"
    />
  </div>
</template>

<script>
  /* eslint-disable id-length */

  import Datepicker from 'vuejs-datepicker';
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
        type: String,
        default: null,
      },
      highlightedDatesWithInfo: {
        type: String,
        default: null,
      },
      date: {
        type: Date,
        default: null,
      },
      min: {
        type: String,
        default: null,
      },
      max: {
        type: String,
        default: null
      },
      disabledDates: {
        type: String,
        default: null
      },
    },
    data() {
      return {
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
      highlightedDateInstances() {
        const { highlightedDates } = this;

        return typeof highlightedDates === 'string'
          ? highlightedDates.split(',').map(date => new Date(date))
          : [];
      },
      highlightedDatesWithInfoInstances() {
        const { highlightedDatesWithInfo } = this;

        return typeof highlightedDatesWithInfo === 'string'
          ? highlightedDatesWithInfo.split(',').map(date => new Date(date))
          : [];
      },
      disabledDatesInstances() {
        const { disabledDates } = this;

        return typeof disabledDates === 'string'
          ? disabledDates.split(',').map(date => new Date(date))
          : [];
      },
      highlightedDatesInternal() {
        return [...this.highlightedDateInstances, ...this.highlightedDatesWithInfoInstances];
      },
      disabledDatesInternal() {
        const {
          min,
          max,
          disabledDatesInstances,
        } = this;
        const disabledDates = {};

        if (disabledDatesInstances.length) {
          disabledDates.dates = disabledDatesInstances;
        }

        if (min) {
          disabledDates.to = new Date(min);
        }

        if (max) {
          disabledDates.from = new Date(max);
        }

        return disabledDates;
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

    methods: {
      renderCell(cell) {
        const cellDate = new Date(cell.timestamp);
        const dateString = cellDate.toISOString().split('T')[0];

        if (this.highlightedDatesWithInfo && this.highlightedDatesWithInfo.includes(dateString)) {
          return `<span class="${this.b('cell-inner', { additionalPrice: true })}">${cell.date}</span>`;
        }

        return cell.date;
      },
      emit(eventName) {
        this.$emit(eventName, {
          date: this.dateInternal,
          pickupSlot: null
        });
      },
      onDateSelected(date) {
        this.dateInternal = date;

        this.emit('change');
      },
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
      width: 100%;

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

<template>
  <p class="view-mode">
    <span class="view-mode__label">View as</span>
    <button class="btn btn-link view-mode__button" type="button" v-bind:disabled="viewMode === 'grid' ? 'disabled' : false" aria-label="Table" v-on:click="setViewMode('grid')">
      <icon v-bind:class-name="'view-mode__icon'" v-bind:glyph="Table"></icon>
    </button>
    <button class="btn btn-link view-mode__button" type="button" v-bind:disabled="viewMode === 'card' ? 'disabled' : false" aria-label="Card" v-on:click="setViewMode('card')">
      <icon v-bind:class-name="'view-mode__icon'" v-bind:glyph="Card"></icon>
    </button>
  </p>
</template>

<script>
import Card from '../../assets/icons/card.svg'
import Icon from '../Icon.vue'
import Table from '../../assets/icons/table.svg'

export default {
  name: 'search-results-view',
  components: {
    Icon
  },
  data () {
    return {
      Card,
      Table
    }
  },
  computed: {
    viewMode () {
      return this.$store.state.resultView
    }
  },
  methods: {
    setViewMode (view) {
      this.$store.commit('SET_RESULT_VIEW', view)
    }
  }
}
</script>

<style lang="scss">
@import '~src/assets/sass/_base.scss';

.view-mode {
  margin-bottom: 0;
  padding-top: .5rem;
  padding-bottom: .5rem;
  text-align: right;
}

.view-mode__label {
  font-size: .75rem;
  margin-right: .5rem;
}

.view-mode__button {
  border: 0;
  padding: .375rem;

  &:disabled {
    opacity: .3;
  }
}

.view-mode__icon {
  display: block;
  height: 1.25rem;
  width: 1.25rem;
}
</style>

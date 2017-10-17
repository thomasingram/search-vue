<template>
  <div class="facet-checklist-container">
    <h2 class="facet-checklist-title">{{ facetGroupCleaned }}</h2>

    <div class="facet-checklist-controls">
      <button class="btn btn-link btn-sm facet-checklist-controls__button" type="button" v-on:click="toggleAllFacets(true)">Select all</button>
      <span class="facet-checklist-controls__divider">|</span>
      <button class="btn btn-link btn-sm facet-checklist-controls__button" type="button" v-on:click="toggleAllFacets(false)">Clear all</button>
    </div>

    <ul class="facet-checklist">
      <li v-for="facet in facets" class="form-check facet-checklist__item" v-bind:class="{ 'facet-checklist__item--checked': facet.active }">
        <label class="form-check-label facet-checklist__label">
          <input class="form-check-input" type="checkbox" v-model="facet.active" v-on:change="handleFacetChange(facet, $event)" />
          {{ facet.display_label }}
          <span class="facet-checklist__count">{{ facet.count | commafy }} {{ pluralize('result', facet.count) }}</span>
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
import Pluralize from '../../mixins/Pluralize.js'
import { forEach } from 'lodash'

export default {
  name: 'facet-checklist',
  props: {
    entityType: String,
    facetGroup: String,
    facets: [Object, Array]
  },
  computed: {
    facetGroupCleaned () {
      return this.facetGroup.replace(/_s_i/g, '').replace(/_/g, ' ')
    }
  },
  methods: {
    updateActiveFacetList (facetList) {
      const vm = this

      forEach(facetList, facet => {
        vm.$store.commit('UPDATE_ACTIVE_FACET', {
          entity: vm.entityType,
          parentKey: vm.facetGroup,
          key: facet.label,
          active: facet.active
        })
      })
      this.$store.commit('UPDATE_ACTIVE_FACET_LIST')

      this.$store.dispatch('search', {
        facetedSearch: true,
        entity: this.entityType
      })

      this.$store.commit('RESET_PAGINATION', {
        tableName: 'search',
        entityType: this.entityType
      })
    },
    handleFacetChange (facet, event) {
      this.updateActiveFacetList([{
        label: facet.label,
        active: event.target.checked
      }])
    },
    toggleAllFacets (checked) {
      forEach(this.facets, facet => {
        facet.active = checked
      })
      this.updateActiveFacetList(this.facets)
    }
  },
  mixins: [Pluralize]
}
</script>

<style lang="scss">
@import '~src/assets/sass/_base.scss';

.facet-checklist-container {
  position: relative;

  .facet-overlay--multiple-facet-groups & {
    margin-top: 4rem;
  }
}

.facet-checklist-title {
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: .375rem;
}

.facet-checklist-controls {
  margin-bottom: 1rem;
}

.facet-checklist-controls__button {
  border: 0;
  padding: 0;
}

.facet-checklist-controls__divider {
  color: $silver-dark;
  padding: 0 .5rem;
}

.facet-checklist {
  font-size: .875rem;
  margin-bottom: 0;
  padding-left: 0;

  .col-12 & {
    column-count: 3;
    column-gap: 1.875rem;
  }
}

.facet-checklist__item {
  margin-bottom: .5rem !important;

  &--checked {
    background-color: $silver-light;
  }
}

.facet-checklist__label {
  display: inline-block;
  line-height: 1.429;
  margin-left: .5rem;
  padding-top: .25rem;
  padding-bottom: .25rem;
}

.facet-checklist__count {
  color: $charcoal-light;
  display: block;
  font-size: .75rem;
}
</style>

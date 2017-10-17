<template>
  <div class="active-facets">
    <ul class="active-facets__list">
      <li v-for="facet in slicedActiveFacets" class="active-facet">
        <a class="active-facet__link" href="#" v-on:click.prevent="handleFacetGroupClick(facet.facetGroup)">
          {{ facet.facetGroup | replaceAll('_s_i', '') | replaceAll('_', ' ') }}:
          {{ facet.display_label }}<!--
        --></a>
        <button class="active-facet__remove" type="button" aria-label="Remove facet" v-on:click="handleRemoveFacetClick(facet)">
          <span aria-hidden="true">&times;</span>
        </button>
      </li>

      <li class="active-facets__button-container">
        <button v-show="showAllIsVisible" class="btn btn-link btn-sm active-facets__button" type="button" v-on:click="handleShowAllClick()">Show all ({{ flattenedActiveFacets.length }})</button>
        <button v-show="showLessIsVisible" class="btn btn-link btn-sm active-facets__button" type="button" v-on:click="handleShowLessClick()">Show less</button>

        <button v-show="flattenedActiveFacets.length > 0" class="btn btn-link btn-sm active-facets__button" type="button" v-on:click="handleClearAllClick()">Clear all filters</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { forEach, sortBy } from 'lodash'

const ACTIVE_FACETS_LIMIT = 3

export default {
  name: 'active-facets',
  data () {
    return {
      activeFacetsLength: ACTIVE_FACETS_LIMIT,
      showAllIsVisible: false,
      showLessIsVisible: false
    }
  },
  computed: {
    activeFacets () {
      return this.$store.state.active_facets[this.activeEntityType]
    },
    activeEntityType () {
      return this.$store.state.activeEntityType
    },
    flattenedActiveFacets () {
      let flattenedActiveFacets = []

      forEach(this.activeFacets, (facets, facetGroup) => {
        forEach(facets, facet => {
          flattenedActiveFacets.push({
            ...facet,
            facetGroup
          })
        })
      })

      flattenedActiveFacets = sortBy(flattenedActiveFacets, 'last_update')

      return flattenedActiveFacets.reverse()
    },
    slicedActiveFacets () {
      return this.flattenedActiveFacets.slice(0, this.activeFacetsLength)
    }
  },
  methods: {
    handleRemoveFacetClick (facet) {
      this.$store.commit('UPDATE_ACTIVE_FACET', {
        entity: facet.entity,
        parentKey: facet.facetGroup,
        key: facet.label,
        active: false
      })
      this.$store.commit('UPDATE_ACTIVE_FACET_LIST')

      this.$store.dispatch('search', {
        facetedSearch: true,
        entity: facet.entity
      })

      this.$store.commit('RESET_PAGINATION', {
        tableName: 'search',
        entityType: facet.entity
      })
    },
    handleShowAllClick () {
      this.activeFacetsLength = this.flattenedActiveFacets.length
      this.showAllIsVisible = false
      this.showLessIsVisible = true
    },
    handleShowLessClick () {
      this.activeFacetsLength = ACTIVE_FACETS_LIMIT
      this.showAllIsVisible = true
      this.showLessIsVisible = false
    },
    handleClearAllClick () {
      this.$store.commit('CLEAR_ACTIVE_FACETS_AT_LEVEL', this.activeEntityType)

      // Uncheck all facet checkboxes for the active entity type.
      forEach(this.$store.state.available_facets[this.activeEntityType], facets => {
        forEach(facets, facet => {
          facet.active = false
        })
      })

      this.$store.dispatch('search', {
        entity: this.activeEntityType
      })

      this.$store.commit('RESET_PAGINATION', {
        tableName: 'search',
        entityType: this.activeEntityType
      })
    },
    handleFacetGroupClick (facetKey) {
      this.$emit('facetGroupClick', [ facetKey ])
    }
  },
  watch: {
    '$store.state.active_facets': {
      handler: function () {
        const facetCount = this.flattenedActiveFacets.length

        if (facetCount > ACTIVE_FACETS_LIMIT) {
          this.showAllIsVisible = !this.showLessIsVisible
        } else {
          this.showAllIsVisible = false
          this.showLessIsVisible = false
        }

        this.activeFacetsLength = this.showLessIsVisible ? facetCount : ACTIVE_FACETS_LIMIT
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
@import '~src/assets/sass/_base.scss';

.active-facets {
  overflow: hidden;
  padding-top: .5rem;
  padding-bottom: .5rem;
}

.active-facets__list {
  font-size: .75rem;
  line-height: 1;
  list-style: none;
  margin-bottom: 0;
  padding-left: 0;
}

.active-facets__button {
  border: 0;
  font-size: .75rem;
  margin-right: .5rem;
  padding: 0;
}

.active-facets__button-container {
  float: left;
  padding-top: .5rem;
}

.active-facet {
  background-color: $silver-light;
  border-radius: 999px;
  float: left;
  margin: .25rem .625rem .25rem 0;
  padding: .125rem 0 .125rem .75rem;
}

.active-facet__link {
  position: relative;
  top: -2px;

  &:link,
  &:visited {
    color: $shipgray;
  }
}

.active-facet__remove {
  background-color: transparent;
  border: 0;
  color: rgba(0, 0, 0, .5);
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: 300;
  padding-right: .5rem;
  padding-left: .5rem;

  &:hover,
  &:focus,
  &:active {
    color: rgba(0, 0, 0, .7);
    outline: none;
  }
}
</style>
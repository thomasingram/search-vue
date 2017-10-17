<template>
  <div>
    <search-bar v-bind:is-advanced-search="isAdvancedSearch" v-on:advancedSearchEnd="advancedSearchEnd()"></search-bar>

    <tablist-entities></tablist-entities>

    <div v-if="showSearchControls" class="search-controls">
      <div class="container">
        <div class="row">
          <div class="col-10">
            <p v-if="resultsHelpTextIsVisible" class="search-results__help-text">Showing {{ entityName.toLowerCase() }} whose name matches &ldquo;{{ currentQuery }}&rdquo;.</p>
            <active-facets v-if="showActiveFacets" v-on:facetGroupClick="facetCall"></active-facets>
          </div>
          <div class="col-2">
            <search-results-view v-if="!onloadMessageIsVisible && !noResultsMessageIsVisible"></search-results-view>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <aside v-if="!$store.state.landerVisible" class="col-2 filters">
          <location-filters v-if="activeEntityType !== 'instruments'" v-on:facetGroupClick="facetCall" v-on:advancedSearchStart="advancedSearchStart()"></location-filters>
          <search-filters v-on:facetGroupClick="facetCall"></search-filters>
        </aside>

        <main v-bind:class="$store.state.landerVisible ? 'col-12' : 'col-10'">
          <lander v-if="$store.state.landerVisible"></lander>

          <template v-else>
            <search-results></search-results>
            <facet-overlay v-if="$store.state.overlayVisible" v-bind:facets-object="facetsObject"></facet-overlay>
          </template>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import ActiveFacets from './components/filters/ActiveFacets.vue'
import FacetOverlay from './components/filters/FacetOverlay.vue'
import Lander from './components/Lander.vue'
import LocationFilters from './components/filters/LocationFilters.vue'
import SearchBar from './components/SearchBar.vue'
import SearchFilters from './components/filters/SearchFilters.vue'
import SearchResults from './components/results/SearchResults.vue'
import SearchResultsView from './components/results/SearchResultsView.vue'
import TablistEntities from './components/TablistEntities.vue'
import $ from 'jquery'
import { pickBy } from 'lodash'

export default {
  name: 'search',
  components: {
    ActiveFacets,
    FacetOverlay,
    Lander,
    LocationFilters,
    SearchBar,
    SearchFilters,
    SearchResults,
    SearchResultsView,
    TablistEntities
  },
  data: () => {
    return {
      facetsObject: {},
      isAdvancedSearch: false
    }
  },
  computed: {
    activeEntityType () {
      return this.$store.state.activeEntityType
    },
    activeFacets () {
      return this.$store.state.active_facets[this.activeEntityType]
    },
    showActiveFacets () {
      return Object.keys(this.activeFacets).length
    },
    noResultsMessageIsVisible () {
      const $s = this.$store.state
      return !$s.isLoading.search[$s.activeEntityType] && $s.searchResults[$s.activeEntityType] && $s.searchResults[$s.activeEntityType].length === 0
    },
    onloadMessageIsVisible () {
      const $s = this.$store.state
      return !$s.isLoading.search[$s.activeEntityType] && $s.searchResults[$s.activeEntityType] && $s.searchResults[$s.activeEntityType].length === 0 && $s.currentQuery === '*:*'
    },
    showSearchControls () {
      return this.showActiveFacets || (!this.onloadMessageIsVisible && !this.noResultsMessageIsVisible)
    },
    entityName () {
      return this.$store.state.searchEntities[this.activeEntityType].name
    },
    currentQuery () {
      return this.$store.state.currentQuery !== '*:*' ? this.$store.state.currentQuery : ''
    },
    resultsHelpTextIsVisible () {
      const $s = this.$store.state
      return this.currentQuery && Object.keys($s.active_facets[$s.activeEntityType]).length === 0 && !$s.isLoading.search[$s.activeEntityType] && $s.searchResults[$s.activeEntityType] && $s.searchResults[$s.activeEntityType].length && !$s.searchIdentifier
    }
  },
  methods: {
    facetCall (facetKey) {
      if (!facetKey.length) {
        this.$store.commit('SEARCH_OVERLAY_VISIBLE', false)
        return
      }

      this.$store.dispatch('loadFacetData', {
        entity: this.$store.state.searchEntities[this.activeEntityType],
        facetFields: facetKey
      })
      this.$store.commit('SEARCH_OVERLAY_VISIBLE', true)
      this.$store.commit('SET_ACTIVE_FACET_GROUP', facetKey)

      // Scroll to the top of the window.
      window.scroll(0, 0)
    },
    buildFacetsObject () {
      this.facetsObject = {}

      const availableFacets = this.$store.state.available_facets[this.activeEntityType]

      this.$set(this.facetsObject, this.activeEntityType, pickBy(availableFacets, (value, key) => {
        return this.$store.state.activeFacetGroup.indexOf(key) !== -1
      }))
    },
    advancedSearchStart () {
      this.isAdvancedSearch = true
    },
    advancedSearchEnd () {
      this.isAdvancedSearch = false
    }
  },
  mounted: function () {
    // Get parameters from URL.
    if (this.$route.query.f !== undefined) {
      this.$store.commit('SET_OVERRIDE_FILTERS', this.$route.query.f)
    }

    if (this.$route.query.q !== undefined) {
      this.$store.commit('SET_OVERRIDE_QUERY', this.$route.query.q)
      this.$store.commit('UPDATE_QUERY', this.$route.query.q)
      this.$store.commit('LANDING_PAGE_VISIBLE', false)
    }

    if (this.$route.query.QuerySearch !== undefined) {
      this.$store.commit('SET_DQ_QUERY', this.$route.query.QuerySearch)

      switch (this.$route.query.Entity.toLowerCase()) {
        case 'organisation':
          this.$store.commit('SET_ACTIVE_ENTITY_TYPE', 'organisations')
          break
        case 'intrument':
          this.$store.commit('SET_ACTIVE_ENTITY_TYPE', 'instruments')
          break
        default:
          this.$store.commit('SET_ACTIVE_ENTITY_TYPE', this.$route.query.Entity.toLowerCase())
          break
      }
    }

    // Don't reset the search if the previous route was xEntity.
    if (this.$store.state.previousRoute === null || this.$store.state.previousRoute.name !== 'xentity') {
      this.$store.commit('CLEAR_ALL_FACETS')
      this.$store.commit('UPDATE_CURRENT_QUERY')
      this.$store.commit('RESET_PAGINATION', 'all')
    }

    this.$store.dispatch('loadFacetHierarchy')
    this.$store.dispatch('loadSearchIdentifiers')
    this.$store.dispatch('loadSearchHistory')

    if (this.$route.query.q !== undefined) {
      this.$store.dispatch('search')
    }

    $('#search-box').focus()
  },
  watch: {
    '$store.state.available_facets': {
      handler () {
        this.buildFacetsObject()
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
@import '~src/assets/sass/_base.scss';

#app main {
  padding-top: 0;
}

.filters {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.search-controls {
  background-color: $athensgray;
  border-bottom: 1px solid $silver-mid-f;
  margin-bottom: 1.5rem;
}

.search-results__help-text {
  color: $charcoal-light;
  font-size: .75rem;
  margin-bottom: 0;
  padding-top: 1rem;
}
</style>
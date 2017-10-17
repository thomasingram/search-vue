<template>
  <div class="search-bar">
    <div class="container">

      <form class="search-bar__form" v-on:submit.prevent="blurSearch()">
        <div class="row">
          <div class="col-4">
            <div class="form-group">
              <label class="sr-only" for="query">Name or identifier</label>
              <input class="form-control" id="query" type="text" v-model="query" placeholder="What are you looking for?" autocomplete="off">
              <button class="clear" id="clear_query" type="button" aria-label="Clear search" v-on:click="clearSearch()">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
          <!--
          <div class="col-4">
            <div class="form-group">
              <label for="query">Name or identifier</label>
              <input class="form-control" id="query" type="text" v-model="query" placeholder="Organisation, person, instrument" autocomplete="off">
              <button class="clear" id="clear_query" type="button" aria-label="Clear search" v-on:click="clearSearch()">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
          <div class="col-4">
            <div class="form-group">
              <label for="location_query">Address</label>
              <input class="form-control" id="location_query" type="text" v-model="locationQuery" placeholder="Country, city, postcode" autocomplete="off">
              <button class="clear" id="clear_location_query" type="button" aria-label="Clear location" v-on:click="clearLocation()">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
          -->
          <div class="col-2">
            <button class="btn btn-primary search-bar__submit" type="submit" v-on:click="search()">Search</button>
          </div>
        </div>
      </form>

      <div class="row results-count-container">
        <p v-show="hits > 0" class="col-10 results-count">{{ hits | commafy }} {{ pluralize('record', hits) }}{{ searchQuery }}</p>
      </div>

    </div>
  </div>
</template>

<script>
import Pluralize from '../mixins/Pluralize.js'
import SearchHistoryPlugin from '../plugins/SearchHistoryPlugin.js'
import SearchIdentifiersPlugin from '../plugins/SearchIdentifiersPlugin.js'
import $ from 'jquery'
import tween from 'tween.js'
import Vue from 'vue'
require('../../node_modules/typeahead.js/dist/typeahead.jquery.js')

Vue.use(SearchHistoryPlugin)
Vue.use(SearchIdentifiersPlugin)

export default {
  name: 'search-bar',
  props: {
    isAdvancedSearch: Boolean
  },
  data: function () {
    return {
      locationQuery: this.$store.state.locationQuery,
      query: this.$store.state.query
    }
  },
  computed: {
    hits () {
      return this.$store.state.hitCounts.search.total
    },
    currentQuery () {
      return this.$store.state.currentQuery !== '*:*' ? this.$store.state.currentQuery : ''
    },
    currentLocationQuery () {
      return this.$store.state.currentLocationQuery
    },
    searchQuery () {
      if (!this.currentQuery && !this.currentLocationQuery) {
        return ''
      }

      let searchQuery = ` for "${this.currentQuery}", "${this.currentLocationQuery}"`

      if (!this.currentQuery) {
        searchQuery = searchQuery.slice(0, 5) + searchQuery.slice((8 + this.currentQuery.length))
      }

      if (!this.currentLocationQuery) {
        searchQuery = searchQuery.slice(0, (this.currentQuery.length + 7))
      }

      return searchQuery
    }
  },
  methods: {
    blurSearch () {
      $('#query').blur()
    },
    clearLocation () {
      this.locationQuery = ''
      // We mutate the state directly so that the previous location isn't used
      // in the search request.
      this.$store.state.locationQuery = ''

      $('#clear_location_query').hide()

      if (this.currentLocationQuery) {
        this.search()
      }
    },
    clearSearch () {
      this.query = ''
      $('#query').typeahead('val', '')
                 .focus()

      $('#clear_query').hide()

      if (this.currentQuery) {
        this.search()
      }
    },
    resetSearch () {
      this.$store.commit('CLEAR_ACTIVE_FACET_GROUP')
      this.$store.commit('CLEAR_ADVANCED_SEARCH_FIELDS')
      this.$store.commit('CLEAR_ALL_FACETS')
      this.$store.commit('CLEAR_SEARCH_RESULTS')
      this.$store.commit('LANDING_PAGE_VISIBLE', false)
      this.$store.commit('RESET_PAGINATION', 'all')
      this.$store.commit('SEARCH_OVERLAY_VISIBLE', false)
      this.$store.commit('UPDATE_QUERY', this.query)
      this.$store.commit('UPDATE_CURRENT_LOCATION_QUERY')
      this.$store.commit('UPDATE_CURRENT_QUERY')
    },
    search () {
      let options = {
        append: false,
        facetedSearch: false,
        entity: null,
        identifierSearch: false,
        advancedSearch: this.isAdvancedSearch
      }

      const identifier = Vue.identifierFromQuery(this.query)
      if (identifier) {
        options.identifierSearch = true
        this.$store.commit('SET_SEARCH_IDENTIFIER', identifier.IdentifierGroupKey)
      } else {
        this.$store.commit('CLEAR_SEARCH_IDENTIFIER')
      }

      if (this.isAdvancedSearch) {
        options.entity = this.$store.state.activeEntityType
      }

      if (!this.isAdvancedSearch) {
        this.resetSearch()
      }

      this.$store.dispatch('search', options)
        .then(() => {
          // Reload the search history to show the search term in the recent
          // searches list.
          this.$store.dispatch('loadSearchHistory')
        })

      this.$emit('advancedSearchEnd')
    },
    updateLocationQuery () {
      this.$store.commit('UPDATE_LOCATION_QUERY', this.locationQuery)
    },
    updateQuery () {
      this.$store.commit('UPDATE_QUERY', this.query)
    }
  },
  mixins: [Pluralize],
  mounted: function () {
    const vm = this

    // Enable/Disable the clear search button.
    $('#query').on('keyup', function () {
      $('#clear_query').toggle(this.value.length > 0)
    })

    // Enable/Disable the clear location button.
    $('#location_query').on('keyup', function () {
      $('#clear_location_query').toggle(this.value.length > 0)
    })

    // Display unique identifier suggestions or recent searches.
    $('#query').typeahead({
      highlight: true,
      hint: false,
      minLength: 0
    }, {
      source: Vue.identifierMatcher(),
      display: function (suggestion) {
        return suggestion.IdentifierGroupKey + ':' + vm.query
      },
      templates: {
        header: '<div class="tt-header">Did you mean:</div>',
        suggestion: function (context) {
          return `<div>
                    ${context.IdentifierGroupKeyFriendlyText} &ldquo;${vm.query}&rdquo; <span class="tt-example">${context.IdentifierExampleText}</span>
                  </div>`
        }
      },
      limit: 10
    }, {
      source: Vue.searchHistoryMatcher(),
      display: function (suggestion) {
        return suggestion.SearchTerm
      },
      templates: {
        header: '<div class="tt-header">Recent searches:</div>',
        suggestion: function (context) {
          return `<div>
                    ${context.SearchTerm}
                  </div>`
        }
      },
      limit: 5
    })

    // Update query when a suggestion is selected.
    $('#query').on('typeahead:select', function (event) {
      vm.query = event.target.value
    })
  },
  watch: {
    query: function () {
      this.updateQuery()
    },
    '$store.state.query': function () {
      this.query = this.$store.state.query
    },
    '$store.state.hitCounts.search.total': {
      handler: function (newValue, oldValue) {
        const vm = this

        const animate = time => {
          window.requestAnimationFrame(animate)
          tween.update(time)
        }

        new tween.Tween({ tweeningNumber: oldValue })
          .easing(tween.Easing.Quadratic.Out)
          .to({ tweeningNumber: newValue }, 500)
          .onUpdate(function () {
            vm.hits = this.tweeningNumber.toFixed(0)
          })
          .start()

        animate()

        // Update the url.
        vm.$router.replace({
          path: '/search'
        })
      },
      deep: true
    },
    isAdvancedSearch: function () {
      if (this.isAdvancedSearch) {
        this.search()
      }
    },
    locationQuery: function () {
      this.updateLocationQuery()
    }
  }
}
</script>

<style lang="scss">
@import '~src/assets/sass/_base.scss';

.search-bar {
  background-color: white;
  padding: 2rem 0 1rem;
}

.search-bar__title {
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: 1rem;
}

.search-bar__form {
  background-color: transparent; /* This overrides a style in Case Flow. */

  .form-group {
    margin-bottom: 0;
  }
}

.clear {
  background-color: transparent;
  border: 0;
  color: $charcoal-light;
  cursor: pointer;
  display: none;
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 38px;
  padding: 0;
  position: absolute;
  right: 30px;
  bottom: 3px;

  &:hover,
  &:focus,
  &:active {
    color: $charcoal-mid;
    outline: none;
  }
}

.search-bar__submit {
  position: absolute;
  bottom: 0;
}

.results-count-container {
  min-height: 2rem;
}

.results-count {
  margin: .5rem 0 0;
}

.twitter-typeahead {
  width: 100%;
}

.tt-menu {
  background-color: $white;
  border: 1px solid $silver-dark;
  border-top: 0;
  font-size: .875rem;
  width: 100%;
}

.tt-header {
  border-bottom: 1px solid $silver-mid;
  font-weight: 500;
  padding: .5rem 1.5rem;
}

.tt-suggestion {
  border-bottom: 1px solid $silver-mid;
  cursor: pointer;
  line-height: 30px;
  overflow: hidden;
  padding: .5rem 1.5rem;

  &:last-child {
    border-bottom: 0;
  }

  &:hover,
  &:focus,
  &:active,
  &.tt-cursor {
    background-color: $silver-light;
  }
}

.tt-highlight {
  font-weight: 500;
}

.tt-example {
  color: $silver-dark;
  float: right;
}
</style>

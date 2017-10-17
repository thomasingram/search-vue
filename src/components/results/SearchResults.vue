<template>
  <section class="search-results">
    <h2 class="sr-only">Results</h2>

    <search-results-info v-if="onloadMessageIsVisible">
      <h2>We hold over 3 billion records across 200+ data sources across the globe.</h2>
      <p>Start searching by typing into the search box and then using the filters on the left to narrow your results.</p>
      <icon v-bind:glyph="Laptop"></icon>
    </search-results-info>

    <search-results-info v-else-if="noResultsMessageIsVisible">
      <template v-if="$store.state.searchInListManagement && (activeEntityType === 'listed_organisations' || activeEntityType === 'listed_people')">
        <p>No list record found.</p>
        <a v-if="$store.state.userAllowedToAddListItem" class="btn btn-primary" v-bind:href="$store.state.currentHost + $store.state.listManagementUrl.add[activeEntityType]" target="_blank">Add List Item</a>
      </template>
      <template v-else>
        <p>Your search did not match any {{ entityName.toLowerCase() }}.</p>
      </template>
    </search-results-info>

    <template v-else>
      <search-results-list v-if="viewMode === 'card'" v-bind:entity-type="activeEntityType"></search-results-list>
      <search-results-table v-if="viewMode === 'grid'" v-bind:entity-type="activeEntityType" v-bind:is-x-entity="false" v-bind:table-data="$store.state.searchResults[activeEntityType]" v-bind:table-name="'search'"></search-results-table>
      <entity-overlay v-if="$store.state.searchInListManagement && (activeEntityType === 'listed_organisations' || activeEntityType === 'listed_people')"></entity-overlay>
    </template>
  </section>
</template>

<script>
import EntityOverlay from '../EntityOverlay.vue'
import Icon from '../Icon.vue'
import Laptop from '../../assets/icons/laptop.svg'
import SearchResultsInfo from './SearchResultsInfo.vue'
import SearchResultsList from './SearchResultsList.vue'
import SearchResultsTable from './SearchResultsTable.vue'

export default {
  name: 'search-results',
  components: {
    EntityOverlay,
    Icon,
    SearchResultsInfo,
    SearchResultsList,
    SearchResultsTable
  },
  data () {
    return {
      Laptop
    }
  },
  computed: {
    viewMode () {
      return this.$store.state.resultView
    },
    noResultsMessageIsVisible () {
      const $s = this.$store.state
      return !$s.isLoading.search[$s.activeEntityType] && $s.searchResults[$s.activeEntityType] && $s.searchResults[$s.activeEntityType].length === 0
    },
    entityName () {
      return this.$store.state.searchEntities[this.activeEntityType].name
    },
    onloadMessageIsVisible () {
      const $s = this.$store.state
      return !$s.isLoading.search[$s.activeEntityType] && $s.searchResults[$s.activeEntityType] && $s.searchResults[$s.activeEntityType].length === 0 && $s.currentQuery === '*:*'
    },
    activeEntityType () {
      return this.$store.state.activeEntityType
    }
  }
}
</script>

<style lang="scss">
@import '~src/assets/sass/_base.scss';

.search-results {
  .loader::after {
    top: 150px;
    bottom: auto;
  }
}

/* Highlighting */
em {
  background-color: $buttercream;
  font-style: normal;
}
</style>

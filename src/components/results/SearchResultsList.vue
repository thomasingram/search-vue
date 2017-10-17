<template>
  <div>
    <ul class="row search-results-list">
      <li v-for="(result, index) in searchResults" v-if="result.doclist.docs.length" class="col-4 mb-3" v-bind:key="index">
        <results-card v-bind:entity-type="entityType" v-bind:identifier="result.groupValue" v-bind:is-x-entity="false" v-bind:results-object="result.doclist.docs[0]" v-bind:source-count="result.doclist.numFound"></results-card>
      </li>
    </ul>

    <button v-if="loadMoreIsVisible" class="btn btn-secondary load-more-results" type="button" v-on:click="loadMoreResults()" v-bind:disabled="$store.state.isLoading.search[entityType] ? 'disabled' : false">Load More Results</button>
  </div>
</template>

<script>
import ResultsCard from '../cards/ResultsCard.vue'

export default {
  name: 'search-results-list',
  components: {
    ResultsCard
  },
  props: {
    entityType: String
  },
  computed: {
    searchResults () {
      return this.$store.state.searchResults[this.entityType]
    },
    loadMoreIsVisible () {
      const $s = this.$store.state
      return $s.resultsPerPage * ($s.pagination.current.search[this.entityType] + 1) < $s.hitCounts.search[this.entityType]
    }
  },
  methods: {
    loadMoreResults () {
      this.$store.commit('SET_PAGE', {
        tableName: 'search',
        entity: this.entityType,
        count: this.$store.state.pagination.highest.search[this.entityType] + 1
      })
      this.$store.dispatch('search', {
        append: true,
        entity: this.entityType
      })
    }
  }
}
</script>

<style lang="scss">
.search-results-list {
  list-style-type: none;
  margin-bottom: 0;
  padding-left: 0;
}

.load-more-results {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>

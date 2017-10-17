<template>
  <ul v-if="relatedEntities.length" class="x-entity-results-list">
    <li v-for="(result, index) in relatedEntities" class="x-entity-results-list__item" v-bind:key="index">
      <results-card v-bind:entity-type="entityType"
                    v-bind:identifier="result.groupValue"
                    v-bind:is-x-entity="true"
                    v-bind:results-object="result.doclist.docs[0]"
                    v-bind:source-count="result.doclist.numFound">
      </results-card>
    </li>
  </ul>
</template>

<script>
import ResultsCard from '../cards/ResultsCard.vue'

export default {
  name: 'x-entity-results-list',
  components: {
    ResultsCard
  },
  props: {
    entityType: String,
    relatedEntities: Array
  }
}
</script>

<style lang="scss">
.x-entity-results-list {
  list-style-type: none;
  padding-left: 0;
}

.x-entity-results-list__item {
  margin-bottom: 1rem;
}
</style>
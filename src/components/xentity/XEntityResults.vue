<template>
  <section class="x-entity-results">
    <h3 class="x-entity-results__entity-type">{{ entityType[0].toUpperCase() + entityType.slice(1) }}</h3>

    <p v-if="noResultsMessageIsVisible">No related {{ entityType }}.</p>

    <x-entity-results-list v-else v-bind:entity-type="entityType" v-bind:related-entities="relatedEntities"></x-entity-results-list>
  </section>
</template>

<script>
import XEntityResultsList from './XEntityResultsList.vue'

export default {
  name: 'x-entity-results',
  components: {
    XEntityResultsList
  },
  props: {
    entityType: String
  },
  data () {
    return {
      relatedEntities: []
    }
  },
  computed: {
    xEntity () {
      return this.$store.state.xEntitySelected
    },
    xEntityResults () {
      return this.$store.state.xEntityResults
    },
    noResultsMessageIsVisible () {
      return !this.$store.state.isLoading.xEntity[this.entityType] && this.xEntityResults[this.xEntity.identifier] && (this.xEntityResults[this.xEntity.identifier][this.entityType].length === 0 || this.xEntityResults[this.xEntity.identifier][this.entityType][0].length === 0)
    }
  },
  watch: {
    '$store.state.xEntityResults': {
      handler () {
        if (this.xEntityResults[this.xEntity.identifier] && this.xEntityResults[this.xEntity.identifier][this.entityType].length) {
          this.relatedEntities = this.xEntityResults[this.xEntity.identifier][this.entityType][0]
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
.x-entity-results__entity-type {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}
</style>
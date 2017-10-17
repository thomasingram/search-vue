<template>
  <div v-show="showFacetOverlay" class="facet-overlay" v-bind:class="{ 'facet-overlay--multiple-facet-groups': facetArray.length > 1 }">
    <facet-sort v-on:sort="handleFacetSort"></facet-sort>

    <div class="row">
      <div v-for="facet in facetArray" v-bind:class="'col-' + (12 / facetArray.length)">
        <facet-checklist v-bind:entity-type="facet.entityType" v-bind:facet-group="facet.facetGroup" v-bind:facets="facet.facets"></facet-checklist>
      </div>
    </div>

    <button class="facet-overlay__close" type="button" aria-label="Close filters" v-on:click="handleCloseClick()">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>
import FacetChecklist from './FacetChecklist.vue'
import FacetSort from './FacetSort.vue'
import { forEach, orderBy } from 'lodash'

export default {
  name: 'facet-overlay',
  components: {
    FacetChecklist,
    FacetSort
  },
  props: {
    facetsObject: Object
  },
  data () {
    return {
      facetArray: []
    }
  },
  computed: {
    showFacetOverlay () {
      return !this.$store.state.isLoading.search[this.$store.state.activeEntityType]
    }
  },
  methods: {
    handleCloseClick () {
      this.$store.commit('SEARCH_OVERLAY_VISIBLE', false)
      this.$store.commit('CLEAR_ACTIVE_FACET_GROUP')
    },
    parseFacetsObject () {
      this.facetArray = []

      forEach(this.facetsObject, (facetGroups, entityType) => {
        forEach(facetGroups, (facets, facetGroup) => {
          this.facetArray.push({
            entityType,
            facetGroup,
            facets
          })
        })
      })
    },
    handleFacetSort (sort) {
      if (!sort) return

      const sortBy = sort.split(' ')[0]
      const order = sort.split(' ')[1]

      forEach(this.facetArray, facet => {
        facet.facets = orderBy(facet.facets, sortBy, order)
      })
    }
  },
  watch: {
    facetsObject: {
      handler: function () {
        this.parseFacetsObject()
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
@import '~src/assets/sass/_base.scss';

.facet-overlay {
  background-color: white;
  border: 1px solid $silver-mid-f;
  border-radius: .5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .05);
  max-height: 37.5rem;
  opacity: .97;
  overflow: auto;
  padding: 1.5rem 1rem;
  position: absolute;
  top: 7rem;
  left: 0;
  width: 100%;
}

.facet-overlay__close {
  background-color: transparent;
  border: 0;
  color: rgba(0, 0, 0, .5);
  cursor: pointer;
  font-size: 3rem;
  font-weight: 300;
  line-height: 1;
  padding: 0 1rem;
  position: absolute;
  top: 0;
  right: 0;

  &:hover,
  &:focus,
  &:active {
    color: rgba(0, 0, 0, .7);
    outline: none;
  }
}
</style>

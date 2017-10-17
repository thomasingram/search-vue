<template>
  <form class="form-inline facet-sort">
    <label class="mr-2 facet-sort__label" for="sort">Sort by</label>
    <select class="custom-select facet-sort__select" id="sort" v-on:change="handleSortChange()" v-model="sort">
      <option value="display_label asc">A to Z</option>
      <option value="display_label desc">Z to A</option>
      <option value="count asc">Smallest to Largest</option>
      <option value="count desc">Largest to Smallest</option>
    </select>
  </form>
</template>

<script>
export default {
  name: 'facet-sort',
  data: () => {
    return {
      sort: 'display_label asc'
    }
  },
  methods: {
    handleSortChange () {
      this.$emit('sort', this.sort)
    }
  },
  watch: {
    '$store.state.activeFacetGroup': function () {
      this.sort = 'display_label asc'
    },
    '$store.state.active_facets': {
      handler: function () {
        this.$emit('sort', this.sort)
      },
      deep: true
    },
    '$store.state.available_facets': {
      handler: function () {
        this.$emit('sort', this.sort)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
@import '~src/assets/sass/_base.scss';

.facet-sort {
  position: absolute;
  top: 3.5rem;
  right: 1rem;
  z-index: 1;

  .facet-overlay--multiple-facet-groups & {
    right: 1.5rem;
  }
}

.facet-sort__label {
  font-size: .875rem;
}

.facet-sort__select {
  font-size: .875rem;
  height: 1.875rem;
}
</style>

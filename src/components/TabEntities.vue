<template>
  <li class="nav-item tab-entity">
    <a class="nav-link" v-bind:class="{ active: $store.state.activeEntityType === entityType }" href="#" v-on:click.prevent="setActiveEntityType(entityType)">
      <span class="tab-entity__name">{{ entityName }}</span>
      <span class="tab-entity__count">({{ resultCount | commafy }})</span>
    </a>
  </li>
</template>

<script>
export default {
  name: 'tab-entities',
  props: {
    entityIndex: Number,
    entityType: String
  },
  computed: {
    entityName () {
      return this.$store.state.searchEntities[this.entityType].name
    },
    resultCount () {
      return this.$store.state.hitCounts.search[this.entityType]
    }
  },
  methods: {
    setActiveEntityType (entityType) {
      this.$store.commit('SET_ACTIVE_ENTITY_TYPE', entityType)
      this.$store.commit('SEARCH_OVERLAY_VISIBLE', false)
      this.$store.commit('LANDING_PAGE_VISIBLE', false)
    }
  }
}
</script>

<style lang="scss">
@import '~src/assets/sass/_base.scss';

.tab-entity__name {
  color: $shipgray;
}

.tab-entity__count {
  color: $jumbo;
  font-size: 90%;
}

.nav-tabs {
  border-bottom: 0;
  font-size: .875rem;

  .nav-item {
    margin-bottom: 0;
    margin-left: .667rem;

    &:first-child {
      margin-left: 0;
    }
  }

  .nav-link {
    background-color: $mischka;
    border: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    height: 100%;
    padding: .5rem .75rem;
    position: relative;
    text-align: center;

    &:hover,
    &:focus,
    &:active {
      border-color: transparent;
    }

    &.active {
      background-color: $brightgray;

      .tab-entity__name {
        color: white;
      }

      .tab-entity__count {
        color: $spunpearl;
      }
    }
  }
}
</style>

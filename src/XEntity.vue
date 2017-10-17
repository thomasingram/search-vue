<template>
  <div class="container x-entity">
    <h1 class="x-entity__title">Related entities</h1>

    <h2 class="x-entity__entity-name">&ldquo;{{ xEntityName | stripTags }}&rdquo;{{ xEntityLocation }} is connected to:</h2>

    <div class="row">
      <x-entity-results v-for="(entity, entityType) in $store.state.searchEntities" v-if="entity.isXEntity" class="col-4" v-bind:entity-type="entityType"></x-entity-results>
    </div>

    <button class="btn btn-link x-entity__back" type="submit" v-on:click="handleBackClick()">< Back to search results</button>
  </div>
</template>

<script>
import XEntityResults from './components/xentity/XEntityResults.vue'

export default {
  name: 'x-entity',
  components: {
    XEntityResults
  },
  computed: {
    xEntity () {
      return this.$store.state.xEntitySelected
    },
    xEntityLocation () {
      let location = ''

      switch (this.xEntityType) {
        case 'organisations':
          if (this.xEntity.entity.Operating_Town && this.xEntity.entity.Operating_Country_Name) {
            location = ` in ${this.xEntity.entity.Operating_Town[0]}, ${this.xEntity.entity.Operating_Country_Name[0]}`
          }
          break
        case 'people':
          if (this.xEntity.entity.Home_Town && this.xEntity.entity.Home_Country_Name) {
            location = ` in ${this.xEntity.entity.Home_Town[0]}, ${this.xEntity.entity.Home_Country_Name[0]}`
          }
          break
      }

      return location
    },
    xEntityName () {
      switch (this.xEntityType) {
        case 'organisations':
          return this.xEntity.entity.Organisation_Full_Name[0]
        case 'people':
          return this.xEntity.entity.Full_Name[0]
        case 'instruments':
          return this.xEntity.entity.Instrument_Name[0]
      }
    },
    xEntityType () {
      return this.xEntity.name
    }
  },
  methods: {
    handleBackClick () {
      this.$store.commit('REMOVE_X_ENTITY_FROM_RESULTS', this.xEntity.identifier)
      this.$router.back()
    }
  },
  mounted () {
    this.$store.dispatch('loadXEntityData')
  }
}
</script>

<style lang="scss">
@import '~src/assets/sass/_base.scss';

.x-entity {
  padding-top: 2rem;
  position: relative;
}

.x-entity__title {
  font-size: 2rem;
  font-weight: 300;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.x-entity__entity-name {
  border-bottom: 1px solid $silver-mid;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
}

.x-entity__back {
  border: 0;
  font-size: .875rem;
  padding: 0;
  position: absolute;
  top: 2rem;
  left: 15px;
}
</style>
<template>
  <div class="nav-container">
    <div class="container">
      <div class="row">
        <nav class="col-12" role="navigation">
          <ul class="nav nav-tabs">
            <tab-entities v-for="(entityData, entityName, entityIndex) in $store.state.searchEntities" v-if="entityData.isActive" v-bind:entity-index="entityIndex" v-bind:entity-type="entityName"></tab-entities>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import TabEntities from './TabEntities.vue'

export default {
  name: 'tablist-entities',
  components: {
    TabEntities
  }
}
</script>

<style lang="scss">
@import '~src/assets/sass/_base.scss';

.nav-container {
  background-color: white;
  border-bottom: 2px solid $brightgray;
}
</style>

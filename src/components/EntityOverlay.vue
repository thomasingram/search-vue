<template>
  <div>
    <div v-if="entityOverlayIsVisible && viewMode === 'grid'" class="entity-overlay">
      <h3 class="entity-overlay__title">{{ entity.name | stripTags }}</h3>

      <div class="entity-overlay__button-container">
        <a class="btn btn-secondary" v-bind:href="copyEntityUrl" target="_blank">Copy</a>
        <a class="btn btn-secondary" v-bind:href="removeEntityUrl" target="_blank">De-List</a>
        <a class="btn btn-secondary" v-bind:href="editEntityUrl" target="_blank">Amend</a>
      </div>
    </div>

    <a v-if="!entityOverlayIsVisible"
       class="btn btn-primary add-list-item"
       v-bind:href="$store.state.currentHost + $store.state.listManagementUrl.add[activeEntityType]"
       target="_blank"
       aria-label="Add List Item"
       v-tooltip.left="'Add List Item'">
        <span aria-hidden="true">+</span>
    </a>
  </div>
</template>

<script>
import Vue from 'vue'
import { VTooltip } from 'v-tooltip'

Vue.directive('tooltip', VTooltip)

export default {
  name: 'entity-overlay',
  data () {
    return {
      entityOverlayIsVisible: false
    }
  },
  computed: {
    entity () {
      return this.$store.state.entitySelected
    },
    copyEntityUrl () {
      const $s = this.$store.state
      return `${$s.currentHost}${$s.listManagementUrl.copy[this.entity.entityType]}&PrimaryKey=${this.entity.identifier}`
    },
    editEntityUrl () {
      const $s = this.$store.state
      return `${$s.currentHost}${$s.listManagementUrl.edit[this.entity.entityType]}?id=${this.entity.identifier}`
    },
    removeEntityUrl () {
      const $s = this.$store.state
      return `${$s.currentHost}${$s.listManagementUrl.remove[this.entity.entityType]}?id=${this.entity.identifier}`
    },
    viewMode () {
      return this.$store.state.resultView
    },
    activeEntityType () {
      return this.$store.state.activeEntityType
    }
  },
  watch: {
    '$store.state.entitySelected': {
      handler: function () {
        this.entityOverlayIsVisible = Object.keys(this.$store.state.entitySelected).length > 0
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
@import '~src/assets/sass/_base.scss';

.entity-overlay {
  background-color: $scooter;
  display: flex;
  justify-content: space-between;
  opacity: .9;
  padding: 1rem;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
}

.entity-overlay__title {
  color: white;
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 38px;
  margin-bottom: 0;
  width: 60%;
}

.entity-overlay__button-container {
  text-align: right;
  width: 25%;
}

.add-list-item {
  border-radius: 50px;
  font-size: 2rem;
  height: 50px;
  line-height: 1.25;
  padding: 0;
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  width: 50px;
}

.tooltip {
  display: block !important;
  padding: 4px;
  pointer-events: none;
  z-index: 10000;

  &[aria-hidden="true"] {
    opacity: 0;
    transition: opacity .15s, visibility .15s;
    visibility: hidden;
  }

  &[aria-hidden="false"] {
    opacity: 1;
    transition: opacity .15s;
    visibility: visible;
  }

  .tooltip-inner {
    background-color: black;
    border-radius: 16px;
    color: white;
    padding: 5px 10px 4px;
  }

  .tooltip-arrow {
    display: none;
  }
}
</style>

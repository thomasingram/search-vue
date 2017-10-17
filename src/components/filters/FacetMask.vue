<template>
  <form v-on:submit="handleFormSubmit($event)">
    <div class="form-group">
      <label v-bind:for="facetTitle + '_start'">{{ startDateLabel }}</label>
      <input class="form-control" v-bind:id="facetTitle + '_start'" type="text" placeholder="yyyy-mm-dd" v-model="dateRange.start.value" v-mask="'####-##-##'" />
    </div>

    <div class="form-group" v-show="dateRange.end.visible">
      <label v-bind:for="facetTitle + '_end'">End Date</label>
      <input class="form-control" v-bind:id="facetTitle + '_end'" type="text" placeholder="yyyy-mm-dd" v-model="dateRange.end.value" v-mask="'####-##-##'" />
    </div>

    <button type="button" v-on:click="toggleEndDate">{{ buttonLabel }}</button>

    <button type="submit" v-on:click="updateActiveFacets">Search</button>
  </form>
</template>

<script>
import Vue from 'vue'
import VueMask from 'v-mask'

Vue.use(VueMask)

export default {
  name: 'FacetMask',
  props: ['facetData', 'facetTitle', 'entity'],
  data: function () {
    return {
      currentValue: [],
      dateRange: {
        start: {
          value: '',
          visible: true
        },
        end: {
          value: '',
          visible: false
        }
      }
    }
  },
  computed: {
    startDateLabel: function () {
      return !this.dateRange.end.visible ? 'Date of Birth' : 'Start Date'
    },
    buttonLabel: function () {
      return !this.dateRange.end.visible ? 'Show End Date' : 'Hide End Date'
    }
  },
  methods: {
    updateActiveFacets: function () {
      while (this.currentValue.length) {
        let value = this.currentValue.pop()
        this.$store.commit('UPDATE_ACTIVE_FACET', {
          active: false,
          entity: this.entity,
          key: value,
          parentKey: this.facetTitle
        })
      }

      Object.keys(this.dateRange).forEach(key => {
        if (this.dateRange[key].visible) {
          const date = this.dateRange[key].value
          if (date.trim()) {
            this.$store.commit('ADD_ACTIVE_FACET', {
              entity: this.entity,
              key: date,
              parentKey: this.facetTitle
            })
            this.currentValue.push(date)
          }
        }
      })
      this.$store.commit('UPDATE_ACTIVE_FACET_LIST')

      this.$store.dispatch('search', {
        facetedSearch: true,
        entity: this.entity
      })

      this.$store.commit('RESET_PAGINATION', this.entity)
    },
    handleFormSubmit: function (event) {
      event.preventDefault()
    },
    toggleEndDate: function () {
      this.dateRange.end.visible = !this.dateRange.end.visible
    }
  }
}
</script>

<style lang="scss">
.form-group {
  margin-bottom: 15px;

  > label {
    display: inline-block;
    margin-bottom: 5px;
  }
}

.form-control {
  border: 1px solid #ccc;
  border-radius: 3px;
  display: block;
  font-size: 14px;
  padding: 6px 12px;
  width: 100%;
}
</style>

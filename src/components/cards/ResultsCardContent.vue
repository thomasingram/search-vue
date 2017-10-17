<template>
  <div>
    <!-- Source -->
    <div v-if="result.sourceName" class="card__group-container card__group-container--source">
      <div class="card__group">
        <span class="sr-only">Source</span>
        <span class="card__value">{{ result.sourceName }} ({{ sourceCount }} {{ pluralize('source', sourceCount) }})</span>
      </div>
    </div>

    <!-- Name -->
    <div v-if="resultName.length" class="card__group-container card__group-container--name">
      <div class="card__group" v-for="(field, index) in resultName">
        <span class="card__label">{{ field.label }}</span>
        <template v-if="index === 0">
          <a class="card__value" v-bind:href="targetEntityUrl + identifier" v-html="field.value" target="_blank"></a>
        </template>
        <template v-else>
          <span class="card__value" v-html="field.value"></span>
        </template>
      </div>
    </div>

    <!-- Address -->
    <div v-if="resultAddress.length" class="card__group-container card__group-container--address">
      <div class="card__group" v-for="field in resultAddress">
        <span class="card__label">{{ field.label }}</span>
        <span class="card__value" v-html="field.value"></span>
      </div>
    </div>

    <!-- Meta -->
    <div v-if="resultMeta.length" class="row card__group-container card__group-container--meta">
      <div class="col card__group" v-for="field in resultMeta">
        <span class="sr-only">{{ field.label }}</span>
        <span class="card__value" v-html="field.value"></span>
      </div>
    </div>
  </div>
</template>

<script>
import Pluralize from '../../mixins/Pluralize.js'
import RenderCell from '../../mixins/RenderCell.js'
import { forEach } from 'lodash'

export default {
  name: 'results-card-content',
  props: {
    entityType: String,
    identifier: String,
    result: Object,
    sourceCount: Number
  },
  data () {
    return {
      parsedResult: {},
      nameLimit: 3,
      addressLimit: 2,
      metaLimit: 3
    }
  },
  computed: {
    targetEntityUrl () {
      let url = ''

      switch (this.entityType) {
        case 'organisations':
          url = this.$store.state.currentHost + '/Pages/Profiles/Company.aspx?id='
          break
        case 'people':
          url = this.$store.state.currentHost + '/Pages/Profiles/Person.aspx?id='
          break
        case 'instruments':
          url = this.$store.state.currentHost + '/Pages/Profiles/Instrument.aspx?id='
          break
        case 'listed_organisations':
          url = this.$store.state.currentHost + '/Pages/Profiles/Company.aspx?Listed=1&id='
          break
        case 'listed_people':
          url = this.$store.state.currentHost + '/Pages/Profiles/Person.aspx?Listed=1&id='
          break
        case 'listed_objects':
          url = this.$store.state.currentHost + '/Pages/Profiles/Object.aspx?Listed=1&id='
          break
        case 'listed_locations':
          url = this.$store.state.currentHost + '/Pages/Profiles/Location.aspx?Listed=1&id='
          break
      }

      return url
    },
    resultName () {
      return this.parsedResult.name ? this.parsedResult.name.slice(0, this.nameLimit) : []
    },
    resultAddress () {
      return this.parsedResult.address ? this.parsedResult.address.slice(0, this.addressLimit) : []
    },
    resultMeta () {
      return this.parsedResult.meta ? this.parsedResult.meta.slice(0, this.metaLimit) : []
    },
    cardFields () {
      return this.$store.state.cardFields
    }
  },
  methods: {
    parseResult () {
      this.parsedResult = {}

      forEach(this.cardFields[this.entityType], (fields, fieldKey) => {
        this.parsedResult[fieldKey] = []

        forEach(fields, field => {
          const value = this.renderCell(field, this.result)

          if (value) {
            this.parsedResult[fieldKey].push({
              label: field.displayName,
              value
            })
          }
        })
      })
    }
  },
  mixins: [Pluralize, RenderCell],
  mounted: function () {
    this.parseResult()
  },
  watch: {
    result: function () {
      this.parseResult()
    }
  }
}
</script>

<style lang="scss">

</style>

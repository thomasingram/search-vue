<template>
  <div class="location-filters">
    <h3 class="location-filters__title">Location Filters</h3>

    <form v-on:submit.prevent="handleAdvancedSearch()">
      <div id="location_filters" role="tablist" aria-multiselectable="true">
        <div>
          <a class="location-filters__link" id="heading_location_type" href="#collapse_location_type" data-parent="#location_filters" data-toggle="collapse" role="tab" aria-controls="collapse_location_type" aria-expanded="true">
            Address Type
            <icon v-bind:class-name="'location-filters__icon'" v-bind:glyph="Chevron"></icon>
          </a>
          <div class="collapse show location_filters__content" id="collapse_location_type" role="tabpanel" aria-labelledby="heading_location_type">
            <fieldset v-if="addressTypes[activeEntityType].length" class="form-group">
              <legend class="sr-only">Location Type</legend>
              <div v-for="addressType in addressTypes[activeEntityType]" class="form-check">
                <label class="form-check-label">
                  <input class="form-check-input" type="checkbox" v-model="addressType.checked" />
                  {{ addressType.name }}
                </label>
              </div>
            </fieldset>
          </div>
        </div>
      </div>

      <div v-for="field in addressFields[activeEntityType]" class="location_filters__field">
        <label v-bind:for="field.key" class="location_filters__label">{{ field.label }}</label>
        <input class="form-control form-control-sm"
               v-bind:id="field.key"
               type="text"
               v-bind:placeholder="'Search ' + pluralize(field.label.toLowerCase()) + ' in results'"
               autocomplete="off"
               v-model="fields[activeEntityType][field.key]"
               v-on:keyup.enter="handleAdvancedSearch()" />
        <button v-if="field.key === 'Country' || field.key === 'County' || field.key === 'Town'" class="btn btn-link btn-sm location-filters__view-all" v-bind:id="'view_all_' + field.label.toLowerCase()" type="button" v-on:click="viewAllFacets(field.facetGroupKeys)">View all<span class="sr-only"> {{ pluralize(field.label.toLowerCase()) }}</span></button>
      </div>

      <div class="location_filters__button-container">
        <button class="btn btn-secondary btn-sm location_filters__button" type="submit">Apply</button>
      </div>
    </form>
  </div>
</template>

<script>
import Chevron from '../../assets/icons/chevron.svg'
import Icon from '../Icon.vue'
import Marker from '../../assets/icons/marker.svg'
import Pluralize from '../../mixins/Pluralize.js'
import $ from 'jquery'
import { forEach, pickBy } from 'lodash'

// These "magic numbers" are required by the API.
const locationFilterTypes = {
  Mailing: 1,
  Operating: 2,
  Registered: 3,
  Business: 4,
  Home: 5,
  Postal: 6
}

export default {
  name: 'location-filters',
  components: {
    Icon
  },
  data () {
    return {
      addressTypes: {
        organisations: [],
        people: [],
        listed_organisations: [],
        listed_people: [],
        listed_objects: [],
        listed_locations: []
      },
      Chevron,
      fields: {
        organisations: {},
        people: {},
        listed_organisations: {},
        listed_people: {},
        listed_objects: {},
        listed_locations: {}
      },
      Marker
    }
  },
  computed: {
    activeEntityType () {
      return this.$store.state.activeEntityType
    },
    facetGroups () {
      return this.$store.state.facet_groups
    },
    addressFields () {
      return this.$store.state.addressFields
    }
  },
  methods: {
    viewAllFacets (facetKeys) {
      let facetKeysRequested = []

      for (let i = 0; i < facetKeys.length; i++) {
        for (let j = 0; j < this.addressTypes[this.activeEntityType].length; j++) {
          if (!this.addressTypes[this.activeEntityType][j].checked) {
            continue
          }

          if (facetKeys[i].indexOf(this.addressTypes[this.activeEntityType][j].key) !== -1) {
            facetKeysRequested.push(facetKeys[i])
          }
        }
      }

      this.$emit('facetGroupClick', facetKeysRequested)
    },
    handleAdvancedSearch () {
      // Create an object of non-empty fields.
      let fields = pickBy(this.fields[this.activeEntityType])

      fields.LocationFilterTypes = []
      for (let i = 0; i < this.addressTypes[this.activeEntityType].length; i++) {
        const addressType = this.addressTypes[this.activeEntityType][i]
        if (addressType.checked) {
          fields.LocationFilterTypes.push(addressType.id)
        }
      }

      this.$store.commit('UPDATE_ADVANCED_SEARCH_FIELDS', {
        fields,
        entity: this.activeEntityType
      })

      this.$emit('advancedSearchStart')
    },
    findAddressFacetGroups () {
      Object.keys(this.addressTypes).forEach(entityType => {
        if (this.addressTypes[entityType].length) {
          return
        }

        for (let i = 0; i < this.facetGroups[entityType].length; i++) {
          let facetGroup = this.facetGroups[entityType][i]

          if (facetGroup.Key === 'Address') {
            for (let j = 0; j < facetGroup.Children.length; j++) {
              let facetGroupChild = facetGroup.Children[j]

              if (locationFilterTypes[facetGroupChild.Key]) {
                this.addressTypes[entityType].push({
                  checked: true,
                  id: locationFilterTypes[facetGroupChild.Key],
                  key: facetGroupChild.Key,
                  name: facetGroupChild.Name
                })
              }
            }
          }
        }
      })
    },
    clearFields () {
      forEach(this.fields, (fields, entityType) => {
        this.fields[entityType] = {}
      })

      this.$store.commit('CLEAR_ADVANCED_SEARCH_FIELDS')
    }
  },
  mixins: [Pluralize],
  mounted () {
    this.findAddressFacetGroups()

    this.$nextTick(function () {
      // Show/Hide facet groups when location type checkboxes are
      // checked/unchecked. This could be done more Vue-like but for now this
      // approach is considered the easiest to delete in the future.
      $('.form-check-input').on('change', function () {
        const title = $('.facet-checklist-title')

        if (!title.length) return

        if (title.text().indexOf('Country') !== -1) {
          $('#view_all_country').click()
        } else if (title.text().indexOf('County') !== -1) {
          $('#view_all_county').click()
        } else if (title.text().indexOf('Town') !== -1) {
          $('#view_all_town').click()
        }
      })
    })
  },
  watch: {
    'facetGroups': {
      handler: function () {
        this.findAddressFacetGroups()
      },
      deep: true
    },
    '$store.state.currentQuery': function () {
      this.clearFields()
    }
  }
}
</script>

<style lang="scss">
@import '~src/assets/sass/_base.scss';

fieldset.form-group {
  border: 0;
  margin: 0 0 .5rem;
  padding: 0;
}

.form-check {
  margin-bottom: 0;
}

.form-check-label {
  font-size: .875rem;
}

.location-filters {
  padding-top: 1rem;
}

.location-filters__title {
  font-size: 1.25rem;
  font-weight: 400;
  letter-spacing: 2px;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.location-filters__title-icon {
  fill: $charcoal-dark;
  height: 1.125rem;
  position: relative;
  top: 3px;
  width: 1.125rem;
}

.location-filters__link {
  color: $charcoal-dark;
  display: block;
  font-size: .875rem;
  line-height: 1.25;
  padding: .5rem 1.5rem .5rem .5rem;
  position: relative;
}

.location-filters__icon {
  height: .375rem;
  overflow: visible !important;
  position: absolute;
  top: 50%;
  right: .5rem;
  transform: translateY(-50%);
  width: .625rem;

  .collapsed & {
    transform: translateY(-50%) rotate(90deg);
  }
}

.location_filters__content {
  overflow: hidden;
  padding: 0 .5rem;
}

.location_filters__field {
  margin-bottom: .5rem;
  overflow: hidden;
  padding: 0 .5rem;
  position: relative;
}

.location_filters__label {
  font-size: .875rem;
  margin-bottom: .25rem;
}

.location-filters__view-all {
  border: 0;
  font-size: .813rem;
  padding: 0;
  position: absolute;
  top: .313rem;
  right: .5rem;
}

.location_filters__button-container {
  margin-bottom: .5rem;
  padding-right: .5rem;
  padding-left: .5rem;
  text-align: right;
}
</style>

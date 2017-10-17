﻿<template>
  <div class="search-filters" id="search_filters" role="tablist" aria-multiselectable="true">
    <h3 v-if="flattenedHierarchy.length > 0" class="search-filters__title">Filters</h3>

    <ul v-if="flattenedHierarchy.length" class="search-filters__list">
      <li v-for="(list, listIndex) in flattenedHierarchy" class="search-filter">
        <a v-if="list.facets"
           class="collapsed search-filter__link search-filter__link--nested"
           v-bind:id="'search_filter_heading_' + listIndex"
           v-bind:href="'#search_filter_collapse_' + listIndex"
           data-parent="#search_filters"
           data-toggle="collapse"
           role="tab"
           v-bind:aria-controls="'search_filter_collapse_' + listIndex"
           aria-expanded="false">
          {{ list.name }}
          <icon v-bind:class-name="'search-filter__icon'" v-bind:glyph="Chevron"></icon>
        </a>        
        <a v-else class="search-filter__link" v-bind:class="{ 'search-filter__link--active': $store.state.overlayVisible && $store.state.activeFacetGroup[0] === list.key }" href="#" v-on:click.prevent="toggleActive(list.key)">
          {{ list.name }}
        </a>

        <ul v-if="list.facets" class="collapse search-filters__list" v-bind:id="'search_filter_collapse_' + listIndex" role="tabpanel" v-bind:aria-labelledby="'search_filter_heading_' + listIndex">
          <li v-for="facet in list.facets">
            <a class="search-filter__link search-filter__link--nested-child" v-bind:class="{ 'search-filter__link--active': $store.state.overlayVisible && $store.state.activeFacetGroup[0] === facet.key }" href="#" v-on:click.prevent="toggleActive(facet.key)">
              {{ facet.name }}
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import Chevron from '../../assets/icons/chevron.svg'
import Icon from '../Icon.vue'

export default {
  name: 'search-filters',
  components: {
    Icon
  },
  data: function () {
    return {
      Chevron
    }
  },
  computed: {
    flattenedHierarchy () {
      let mdmArray = []

      const findTheRoot = theArray => {
        const recurseChildren = (arr, facetArr) => {
          if (arr.Children && arr.Children.length) {
            for (let i = 0; i < arr.Children.length; i++) {
              recurseChildren(arr.Children[i], facetArr)
            }
          } else {
            facetArr.push({
              key: arr.Key,
              name: arr.Name
            })
          }
        }

        for (let i = 0; i < theArray.length; i++) {
          if (theArray[i].Children.length === 0) {
            mdmArray.push({
              key: theArray[i].Key,
              name: theArray[i].Name
            })
            continue
          } else {
            mdmArray.push({
              name: theArray[i].Name,
              facets: []
            })
          }

          for (let j = 0; j < theArray[i].Children.length; j++) {
            recurseChildren(theArray[i].Children[j], mdmArray[i].facets)
          }
        }
      }

      let facetHierarchy = this.facetGroups[this.activeEntityType]

      if (this.activeEntityType === 'listed_people') {
        // Remove all address facet groups apart from 'Birth' and 'Citizenship'.
        for (let i = 0; i < facetHierarchy.length; i++) {
          if (facetHierarchy[i].Key === 'Address') {
            facetHierarchy[i].Children = facetHierarchy[i].Children.filter(child => {
              return child.Key === 'Birth' || child.Key === 'Citizenship_s_i'
            })
          }
        }
      } else {
        // Remove the address facet group.
        facetHierarchy = facetHierarchy.filter(facetGroup => {
          return facetGroup.Key !== 'Address'
        })
      }

      if (this.activeEntityType === 'people') {
        // Remove the date of birth facet group.
        for (let i = 0; i < facetHierarchy.length; i++) {
          if (facetHierarchy[i].Key === 'IdentifyingInformation') {
            facetHierarchy[i].Children = facetHierarchy[i].Children.filter(child => {
              return child.Key !== 'DOB_s_i'
            })
          }
        }
      }

      findTheRoot(facetHierarchy)

      return mdmArray
    },
    facetGroups () {
      return this.$store.state.facet_groups
    },
    activeEntityType () {
      return this.$store.state.activeEntityType
    }
  },
  methods: {
    toggleActive (facetKey) {
      this.$emit('facetGroupClick', [ facetKey ])
    }
  }
}
</script>

<style lang="scss">
@import '~src/assets/sass/_base.scss';

.search-filters {
  padding-top: 1rem;
}

.search-filters__title {
  font-size: 1.25rem;
  font-weight: 400;
  letter-spacing: 2px;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.search-filters__list {
  list-style-type: none;
  margin-bottom: 0;
  padding-left: 0;

  &.show {
    border-bottom: 1px solid $silver-mid-f;
  }
}

.search-filter__link {
  cursor: pointer;
  color: $charcoal-dark;
  display: block;
  font-size: .875rem;
  line-height: 1.25;
  padding: .625rem 1rem .625rem .5rem;
  position: relative;

  &.search-filter__link--nested {
    &:not(.collapsed) {
      border-top: 1px solid $silver-mid-f;
      font-weight: 500;
    }
  }

  &--active {
    background-color: $mischka;
  }
}

.search-filter__link--nested {
  position: relative;
}

.search-filter__link--nested-child {
  border: 0;
  font-size: .813rem;
}

.search-filter__icon {
  height: .375rem;
  overflow: visible !important;
  position: absolute;
  top: 50%;
  right: .25rem;
  transform: translateY(-50%) rotate(90deg);
  width: .625rem;

  .search-filter__link--nested:not(.collapsed) & {
    transform: translateY(-50%);
  }
}
</style>

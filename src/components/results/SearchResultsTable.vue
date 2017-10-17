<template>
  <div class="search-results-table-container" v-bind:class="{ 'hidden-columns-visible': showHideColumnsIsVisible, 'entity-selected': entitySelected.length }">

    <div class="table-controls">
      <!-- Enter/Exit full screen -->
      <button v-show="!tableIsFullScreen" class="btn btn-secondary btn-sm table-full-screen-button" type="button" v-on:click="handleFullScreenClick()">Enter Full Screen</button>
      <button v-show="tableIsFullScreen" class="btn btn-secondary btn-sm table-full-screen-button" type="button" v-on:click="handleFullScreenClick()">Exit Full Screen</button>

      <!-- Show/Hide columns -->
      <button v-show="!showHideColumnsIsVisible" class="btn btn-secondary btn-sm" type="button" v-on:click="handleShowHideColumnsClick()">Show/Hide Columns</button>
      <button v-show="showHideColumnsIsVisible" class="btn btn-secondary btn-sm" type="button" v-on:click="handleShowHideColumnsClick()">Done</button>

      <!-- Hidden columns -->
      <div v-if="showHideColumnsIsVisible && hiddenFieldsCount > 0" class="hidden-columns">
        <span class="hidden-columns__label">Hidden Columns:</span>
        <ul class="hidden-columns__list">
          <template v-for="(field, index) in displayFields">
            <template v-if="field.children && field.children.length">
              <li v-for="(childField, childIndex) in field.children" v-if="childField.isHidden" class="hidden-columns__item">
                <a class="hidden-columns__link" href="#" v-on:click.prevent="toggleColumn(index, childIndex)">{{ field.displayName }} - {{ childField.displayName }}</a>
              </li>
            </template>
            <template v-else>
              <li v-if="field.isHidden" class="hidden-columns__item">
                <a class="hidden-columns__link" href="#" v-on:click.prevent="toggleColumn(index)">{{ field.displayName }}</a>
              </li>
            </template>
          </template>
        </ul>
      </div>
    </div>

    <!-- Search results table -->
    <div class="search-results-table-wrapper">
      <table class="table search-results-table">
        <thead>
          <tr v-if="hasChildFields" class="table-row--colspan">
            <th v-if="$store.state.searchInListManagement && (entityType === 'listed_organisations' || entityType === 'listed_people')" class="column-action"></th>
            <th class="column-action"></th>
            <th v-if="entityType !== 'addresses'"></th>

            <template v-for="field in displayFields">
              <template v-if="field.children && field.children.length">
                <th v-if="visibleFieldsCount(field.children) > 0" class="table-header--colspan" v-bind:colspan="visibleFieldsCount(field.children)">{{ field.displayName }}</th>
              </template>
              <template v-else>
                <th v-if="!field.isHidden"></th>
              </template>
            </template>

            <th v-if="!isXEntity && (entityType !== 'listed_organisations' && entityType !== 'listed_people' && entityType !== 'listed_objects' && entityType !== 'listed_locations')"></th>
            <th v-show="$store.state.searchInCaseFlow && entityTypeId === window.caseflowEntityType"></th>
            <th v-show="$store.state.searchInCaseFlow && entityTypeId === window.caseflowEntityType"></th>
          </tr>

          <tr class="table-row--fields">
            <th v-if="$store.state.searchInListManagement && (entityType === 'listed_organisations' || entityType === 'listed_people')" class="column-action"></th>
            <th class="column-action"></th>
            <th v-if="entityType !== 'addresses'">Source</th>

            <template v-for="(field, index) in displayFields">
              <template v-if="field.children && field.children.length">
                <template v-for="(childField, childIndex) in field.children">
                  <th v-if="!childField.isHidden" class="table-header" v-bind:class="'table-header--' + field.displayName.toLowerCase()">
                    <span class="table-header__text">{{ childField.displayName }}</span>
                    <button v-show="showHideColumnsIsVisible" class="table-header__toggle" type="button" v-on:click="toggleColumn(index, childIndex)">[-]</button>
                  </th>
                </template>
              </template>

              <template v-else>
                <th v-if="!field.isHidden" class="table-header">
                  <span class="table-header__text">{{ field.displayName }}</span>
                  <button v-show="showHideColumnsIsVisible" class="table-header__toggle" type="button" v-on:click="toggleColumn(index)">[-]</button>
                </th>
              </template>
            </template>

            <th v-if="!isXEntity && (entityType !== 'listed_organisations' && entityType !== 'listed_people' && entityType !== 'listed_objects' && entityType !== 'listed_locations')"></th>
            <th v-show="$store.state.searchInCaseFlow && entityTypeId === window.caseflowEntityType"></th>
            <th v-show="$store.state.searchInCaseFlow && entityTypeId === window.caseflowEntityType"></th>
          </tr>
        </thead>

        <tbody>
          <template v-for="(result, resultIndex) in targetSearchResults">
            <template v-for="(row, index) in result.doclist.docs">
              <tr v-bind:data-row-group="calcIndex(resultIndex)"
                  v-bind:class="{
                    'first-of-group': index === 0,
                    'last-of-group': index === result.doclist.docs.length - 1,
                     active: rowIsActive(calcIndex(resultIndex)),
                     even: calcIndex(resultIndex) % 2 === 0,
                     odd: calcIndex(resultIndex) % 2 !== 0,
                     nested: index === 0 && result.doclist.docs.length > 1,
                    'nested-child': index !== 0 && result.doclist.docs.length > 1
                  }">

                <!-- List Management -->
                <td v-if="$store.state.searchInListManagement && (entityType === 'listed_organisations' || entityType === 'listed_people')" class="column-action">
                  <input class="record-checkbox" type="checkbox" v-bind:value="result.doclist.docs[index].primaryKey" v-model="entitySelected" v-on:click="handleEntitySelectionChange($event, resultIndex, index)" />
                </td>

                <td class="column-action" valign="top">
                  <span v-if="index === 0 && result.doclist.docs.length > 1 && !rowIsActive(calcIndex(resultIndex))" class="group-toggle" v-on:click.stop="toggleActiveRow(calcIndex(resultIndex))">
                    <i class="fa fa-angle-right" aria-hidden="true"></i>
                  </span>
                  <span v-else-if="index === 0 && result.doclist.docs.length > 1" class="group-toggle" v-on:click.stop="toggleActiveRow(calcIndex(resultIndex))">
                    <i class="fa fa-angle-down" aria-hidden="true"></i>
                  </span>
                </td>

                <td v-if="entityType !== 'addresses'" class="source" v-bind:class="{ 'external-source': index !== 0 && result.doclist.docs.length > 1 }">
                  <span class="td-link" v-bind:class="{ faded: $store.state.isLoading[tableName][entityType] }" v-bind:title="result.doclist.docs[index].sourceId" v-on:click.stop="openResultPage(result, index, 'source')">
                    {{ result.doclist.docs[index].sourceName }}<!--
                  --></span>
                  <span v-if="index === 0 && result.doclist.numFound > 1">({{ result.doclist.numFound - 1 }})</span>
                </td>

                <template v-for="field in displayFields">
                  <template v-if="field.children && field.children.length">
                    <template v-for="childField in field.children">
                      <td v-if="!childField.isHidden">
                        <span class="{ faded: $store.state.isLoading[tableName][entityType] }">
                          <template v-if="isEntityName(childField.displayName)">
                            <span class="td-link" v-on:click.stop="openResultPage(result, index, 'entity')">
                              <span v-html="renderCell(childField, result.doclist.docs[index])"></span>
                            </span>
                          </template>
                          <template v-else>
                            <span v-html="renderCell(childField, result.doclist.docs[index])"></span>
                          </template>
                        </span>
                      </td>
                    </template>
                  </template>

                  <template v-else>
                    <td v-if="!field.isHidden">
                      <span class="{ faded: $store.state.isLoading[tableName][entityType] }">
                        <template v-if="isEntityName(field.displayName)">
                          <span class="td-link" v-on:click.stop="openResultPage(result, index, 'entity')">
                            <span v-html="renderCell(field, result.doclist.docs[index])"></span>
                          </span>
                        </template>
                        <template v-else>
                          <span v-html="renderCell(field, result.doclist.docs[index])"></span>
                        </template>
                      </span>
                    </td>
                  </template>
                </template>

                <td v-if="!isXEntity && (entityType !== 'listed_organisations' && entityType !== 'listed_people' && entityType !== 'listed_objects' && entityType !== 'listed_locations')">
                  <button class="btn btn-secondary btn-sm" v-on:click="setXEntity(result)">Related Entities</button>
                </td>

                <!-- Case Flow -->
                <td v-show="$store.state.searchInCaseFlow && entityTypeId === window.caseflowEntityType">
                  <div class="dropdown link-entity" v-bind:data-identifier="result.groupValue">
                    <button class="btn btn-secondary btn-sm dropdown-toggle"
                            v-bind:id="'link_entity__button_' + result.groupValue"
                            type="button"
                            v-bind:disabled="entityIsLinked(result.groupValue) ? 'disabled' : false"
                            data-toggle="dropdown"
                            aria-expanded="false"
                            aria-haspopup="true">
                      Link
                    </button>
                    <div class="dropdown-menu" v-bind:aria-labelledby="'link_entity__button_' + result.groupValue">
                      <a v-for="type in entityLinkTypes" class="dropdown-item link-entity__item" href="#" v-bind:data-entity-link-type="type.Id">{{ type.LinkDisplayText }}</a>
                    </div>
                  </div>
                </td>

                <!-- Case Flow -->
                <td v-show="$store.state.searchInCaseFlow && entityTypeId === window.caseflowEntityType">
                  <div class="dropdown research-entity">
                    <button class="btn btn-secondary btn-sm dropdown-toggle"
                            v-bind:id="'research_entity__button_' + result.groupValue"
                            type="button"
                            data-toggle="dropdown"
                            aria-expanded="false"
                            aria-haspopup="true">
                      Research
                    </button>
                    <div class="dropdown-menu" v-bind:aria-labelledby="'research_entity__button_' + result.groupValue">
                      <a v-for="type in entityResearchTypes" class="dropdown-item" v-bind:href="type.NavigateUrl + entitySearchQuery(result.doclist.docs[index])" v-bind:target="type.Target">{{ type.Text }}</a>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <nav class="table-pagination" role="navigation" aria-label="Pagination">
      <ul class="table-pagination__list">
        <li class="table-pagination__item" v-bind:class="{ 'table-pagination__item--disabled': $store.state.pagination.current[tableName][entityType] <= 0 }">
          <a href="#" v-on:click.prevent="loadPage($store.state.pagination.current[tableName][entityType] - 1)">Prev</a>
        </li>

        <li class="table-pagination__item">
          Page {{ $store.state.pagination.current[tableName][entityType] + 1 }} of {{ maxPage > 0 ? $options.filters.commafy(maxPage) : 1 }}
        </li>

        <li class="table-pagination__item" v-bind:class="{ 'table-pagination__item--disabled': $store.state.pagination.current[tableName][entityType] >= maxPage }">
          <a href="#" v-on:click.prevent="loadPage($store.state.pagination.current[tableName][entityType] + 1)">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script>
import RenderCell from '../../mixins/RenderCell.js'
import $ from 'jquery'
import { flatMap, forEach, some } from 'lodash'

const flatten = fields => {
  return flatMap(fields, field => {
    return field.children ? flatten(field.children) : field
  })
}

export default {
  name: 'search-results-table',
  props: {
    entityType: String,
    isXEntity: Boolean,
    tableData: Array,
    tableName: String
  },
  data () {
    return {
      targetSearchResults: [],
      inactiveRows: {},
      window: window,
      entityLinkTypes: window.menuItems !== undefined ? window.menuItems : [],
      entityResearchTypes: window.researchMenuItems !== undefined ? window.researchMenuItems : [],
      matchedEntityKeys: window.matchedEntityKeys,
      showHideColumnsIsVisible: false,
      tableIsFullScreen: false,
      entitySelected: []
    }
  },
  computed: {
    maxPage () {
      return Math.floor(this.$store.state.hitCounts[this.tableName][this.entityType] / this.$store.state.resultsPerPage)
    },
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
    entityTypeId () {
      return this.$store.state.searchEntities[this.entityType].id
    },
    displayFields () {
      return this.$store.state.display_fields[this.entityType]
    },
    hasChildFields () {
      return some(this.displayFields, field => {
        return field.children && this.visibleFieldsCount(field.children) > 0
      })
    },
    hiddenFieldsCount () {
      const hiddenFields = flatten(this.displayFields).filter(field => {
        return field.isHidden
      })
      return hiddenFields.length
    },
    targetSourceUrl () {
      let url = ''

      switch (this.entityType) {
        case 'organisations':
          url = this.$store.state.currentHost + '/Pages/Profiles/SourceCompanyProfile.aspx'
          break
        case 'people':
          url = this.$store.state.currentHost + '/Pages/Profiles/SourcePersonProfile.aspx'
          break
        case 'instruments':
          url = this.$store.state.currentHost + '/Pages/Profiles/SourceRecord.aspx'
          break
        case 'listed_organisations':
          url = this.$store.state.currentHost + '/Pages/Profiles/SourceCompanyProfile.aspx'
          break
        case 'listed_people':
          url = this.$store.state.currentHost + '/Pages/Profiles/SourcePersonProfile.aspx'
          break
        case 'listed_objects':
          url = this.$store.state.currentHost + '/Pages/Profiles/SourceRecord.aspx'
          break
        case 'listed_locations':
          url = this.$store.state.currentHost + '/Pages/Profiles/SourceRecord.aspx'
          break
      }

      return url
    }
  },
  methods: {
    loadPage (pageNumber) {
      // Break if we're already loading results.
      if (this.$store.state.isLoading[this.tableName][this.entityType]) {
        return
      }

      // Break if we're out of range.
      if (pageNumber === this.$store.state.pagination.current[this.tableName][this.entityType] || pageNumber < 0 || pageNumber > this.maxPage) {
        return
      }

      // If we've already loaded this page, just display it rather than re-fetching.
      if (pageNumber <= this.$store.state.pagination.highest[this.tableName][this.entityType]) {
        this.$store.commit('SET_PAGE', {
          tableName: this.tableName,
          entity: this.entityType,
          count: pageNumber
        })
        this.updateTargetSearchResults()
      } else {
        // Otherwise, load it and append the results.
        this.$store.commit('SET_PAGE', {
          tableName: this.tableName,
          entity: this.entityType,
          count: pageNumber
        })
        this.$store.dispatch('search', {
          append: true,
          entity: this.entityType
        })
      }
    },
    openResultPage (resultEntity, resultIndex, type) {
      let url = ''

      if (type === 'entity') {
        if (this.targetEntityUrl !== '') {
          url = this.targetEntityUrl + resultEntity.groupValue
          window.open(url, '_blank')
        }
      } else if (type === 'source') {
        const sourceId = resultEntity.doclist.docs[resultIndex].sourceId
        const primaryKey = resultEntity.doclist.docs[resultIndex].primaryKey
        url = this.targetSourceUrl + '?IndexID=' + sourceId + '&PrimaryKey=' + primaryKey
        window.open(url, '_blank')
      }
    },
    calcIndex (offset) {
      return (this.$store.state.pagination.current[this.tableName][this.entityType] * this.$store.state.resultsPerPage) + offset + 1
    },
    updateTargetSearchResults () {
      if (this.$store.state.activeEntityType === 'all') {
        return
      }
      const currentPage = this.$store.state.pagination.current[this.tableName][this.entityType]
      const resultsPerPage = this.$store.state.resultsPerPage
      const start = currentPage * resultsPerPage
      const end = start + resultsPerPage

      this.$nextTick(() => {
        this.targetSearchResults = this.tableData.slice(start, end)
      })
    },
    toggleActiveRow (rowIndex) {
      let rows = this.inactiveRows
      const targetIndex = rows[this.entityType].indexOf(rowIndex)

      if (targetIndex !== -1) {
        rows[this.entityType].splice(targetIndex, 1)
      } else {
        rows[this.entityType].push(rowIndex)
      }

      this.inactiveRows = rows
      this.$forceUpdate()
    },
    rowIsActive (rowIndex) {
      const targetIndex = this.inactiveRows[this.entityType].indexOf(rowIndex)
      return targetIndex === -1
    },
    clearInactiveRows () {
      const vm = this
      forEach(this.$store.state.searchEntities, (value, key) => {
        vm.inactiveRows[key] = []
      })
    },
    isEntityName (value) {
      if (!value) {
        return false
      }
      return value === 'Name' || value === 'Original' || value === 'Instrument Name'
    },
    setXEntity (result) {
      const payload = {
        entity: result.doclist.docs[0],
        identifier: result.groupValue
      }
      this.$store.commit('SET_X_ENTITY', payload)
      this.$router.push({ path: '/search/xentity' })
    },
    entitySearchQuery (result) {
      let query = ''

      switch (this.entityType) {
        case 'organisations':
          query = result.Organisation_Full_Name[0]
          break
        case 'people':
          query = result.Full_Name[0]
          break
      }

      return encodeURI(query)
    },
    entityIsLinked (identifier) {
      if (!this.matchedEntityKeys) {
        return
      }
      return this.matchedEntityKeys.indexOf(identifier) !== -1
    },
    toggleColumn (index, childIndex) {
      if (childIndex !== undefined) {
        this.$set(this.$store.state.display_fields[this.entityType][index].children[childIndex], 'isHidden', !this.$store.state.display_fields[this.entityType][index].children[childIndex]['isHidden'])
      } else {
        this.$set(this.$store.state.display_fields[this.entityType][index], 'isHidden', !this.$store.state.display_fields[this.entityType][index]['isHidden'])
      }
    },
    handleShowHideColumnsClick () {
      this.showHideColumnsIsVisible = !this.showHideColumnsIsVisible
    },
    visibleFieldsCount (fields) {
      const visibleFields = fields.filter(field => {
        return !field.isHidden
      })
      return visibleFields.length
    },
    handleFullScreenClick () {
      this.tableIsFullScreen = !this.tableIsFullScreen
      // A click event handler is also attached to `.table-full-screen-button` in the `mounted` hook.
    },
    handleEntitySelectionChange (event, resultIndex, index) {
      // Remove all but the last selected entity.
      this.entitySelected.splice(0, this.entitySelected.length - 1)

      if (event.target.checked) {
        const currentPage = this.$store.state.pagination.current[this.tableName][this.entityType]
        const resultsPerPage = this.$store.state.resultsPerPage
        const resultIndexAdjusted = resultIndex + (currentPage * resultsPerPage)
        const result = this.tableData[resultIndexAdjusted]
        const entityName = this.entityName(result.doclist.docs[index])

        const payload = {
          entityType: this.entityType,
          identifier: result.groupValue,
          name: entityName
        }
        this.$store.commit('SET_ENTITY_SELECTED', payload)
      } else {
        this.$store.commit('CLEAR_ENTITY_SELECTED')
      }
    },
    entityName (result) {
      switch (this.entityType) {
        case 'organisations':
        case 'listed_organisations':
          return result.Organisation_Full_Name[0]
        case 'people':
        case 'listed_people':
          return result.Full_Name[0]
      }
    }
  },
  mixins: [RenderCell],
  mounted () {
    this.updateTargetSearchResults()
    this.clearInactiveRows()

    $(this.$el).on('click', '.link-entity__item', event => {
      event.preventDefault()

      const $link = $(event.target)

      const identifier = $link.parents('.link-entity').data('identifier')
      const entityPrimaryKeyField = document.getElementById(window.hdnEntityPrimaryKey)
      entityPrimaryKeyField.setAttribute('value', identifier)

      const entityLinkType = $link.data('entity-link-type')
      const entityLinkTypeField = document.getElementById(window.hdnSelectionTypeId)
      entityLinkTypeField.setAttribute('value', entityLinkType)

      const linkEntityButton = document.getElementById(window.linkMatchButtonId)
      linkEntityButton.click()

      if (this.matchedEntityKeys) {
        window.matchedEntityKeys.push(identifier)
      }
    })

    // Fix table header on scroll.
    $('.search-results-table-wrapper').on('scroll', function () {
      $('.search-results-table > thead')[0].style.top = this.scrollTop + 'px'
    })

    // Enter/Exit full screen.
    $('.table-full-screen-button').on('click', function () {
      $('body').toggleClass('table-full-screen')
    })
  },
  destroyed () {
    this.$store.commit('CLEAR_ENTITY_SELECTED')
  },
  watch: {
    '$store.state.currentQuery': function () {
      this.clearInactiveRows()
    },
    '$store.state.activeEntityType': {
      handler: function () {
        this.searchResults = this.$store.state.searchResults[this.$store.state.activeEntityType]
        this.updateTargetSearchResults()

        this.showHideColumnsIsVisible = false
      },
      deep: true
    },
    'tableData': {
      handler: function () {
        this.$nextTick(() => {
          this.updateTargetSearchResults()
        })
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
@import '~src/assets/sass/_base.scss';

.search-results-table {
  margin-bottom: 0;

  > thead {
    display: block;
    position: relative;

    th {
      background-color: white;
      border-bottom: 1px solid $mischka;
      font-weight: 400;
    }
  }

  > tbody {
    display: block;

    td {
      background-color: $whitelilac;
      border-top: 0;
      border-bottom: 1px solid $mischka;
    }
  }

  th,
  td {
    max-width: 150px;
    min-width: 150px;
    width: 150px;

    &.column-action {
      min-width: 37px;
      width: 37px;
    }
  }

  .nested {
    td {
      background-color: white;
    }

    &.active {
      td {
        color: $violetred;
        font-weight: 500;
      }
    }
  }

  .nested-child {
    display: none;

    &.active {
      display: table-row;
    }
  }
}

.search-results-table-wrapper {
  border: 1px solid $mischka;
  border-radius: .25rem;
  overflow: auto;

  .table-full-screen & {
    border-radius: 0;
    max-height: none;
  }
}

.search-results-table-container {
  .table-full-screen & {
    background-color: white;
    display: flex;
    flex-flow: column nowrap;
    height: 100vh;
    padding-top: 64px;
    padding-bottom: 0 !important;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
  }

  &.entity-selected {
    padding-bottom: 4.375rem !important;
  }
}

.table-full-screen {
  overflow-y: hidden;
}

.table-controls {
  margin-bottom: 1rem;

  .table-full-screen & {
    margin-bottom: 0;
    padding: 1rem 15px;
  }
}

.group-toggle {
  color: darken($scooter, 15%) !important;
  cursor: pointer;
}

.td-link {
  cursor: pointer;
  text-decoration: underline;
}

.table-pagination {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.table-pagination__list {
  margin-bottom: 0;
  padding-left: 0;
  text-align: center;
}

.table-pagination__item {
  display: inline-block;

  &--disabled {
    opacity: .1;
  }
}

.table-row--colspan {
  > th {
    padding: .25rem .75rem;
  }
}

.table-row--fields {
  :not(.table-header--name) + .table-header--name,
  :not(.table-header--address) + .table-header--address,
  :not(.table-header--sanction) + .table-header--sanction,
  .table-header--name + :not(.table-header--name),
  .table-header--address + :not(.table-header--address),
  .table-header--sanction + :not(.table-header--sanction) {
    border-left: 1px solid $mischka;
  }
}

.table-header--colspan {
  border-left: 1px solid $mischka;
  font-size: 1rem;
}

th[class~="table-header--colspan"]:nth-child(-1) {
  border-right: 1px solid $mischka;
}

.table-header--address {
  min-width: 200px;
  width: 200px;
}

.table-header__toggle {
  background-color: transparent;
  border: 0;
  color: $charcoal-light;
  cursor: pointer;
}

.hidden-columns {
  margin-top: 1rem;
}

.hidden-columns__label {
  font-size: .875rem;
  font-weight: 500;
}

.hidden-columns__list {
  font-size: .875rem;
  list-style: none;
  margin-bottom: 0;
  padding-left: 0;
}

.hidden-columns__item {
  display: inline;
  margin-right: 1rem;
}

.hidden-columns__link {
  &:link,
  &:visited {
    color: $charcoal-light;
  }
}

.record-checkbox {
  margin-top: .25rem;
}

.source {
  color: darken($scooter, 15%) !important;
  font-weight: 500;
}
</style>

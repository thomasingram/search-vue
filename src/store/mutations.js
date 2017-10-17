import { generateUUID } from '../utils.js'
import $ from 'jquery'
import { filter, forEach } from 'lodash'
import Vue from 'vue'

export default {
  UPDATE_QUERY (state, input) {
    // state.query = input
    Vue.set(state, 'query', input)
  },
  UPDATE_CURRENT_QUERY (state) {
    if (state.overrideQuery !== '') {
      state.currentQuery = state.overrideQuery
    } else {
      if (state.query === '') {
        state.currentQuery = '*:*'
      } else {
        state.currentQuery = state.query
      }
    }
  },
  SEARCH_OVERLAY_VISIBLE (state, bool) {
    state.overlayVisible = bool
  },
  SET_ACTIVE_ENTITY_TYPE (state, entityType) {
    Vue.set(state, 'activeEntityType', entityType)
  },
  ADD_SEARCH_REQUEST (state, request) {
    state.searchRequests.push(request)
  },
  CLEAR_SEARCH_REQUESTS (state) {
    forEach(state.searchRequests, function (request) {
      // request.abort()
    })
    state.searchRequests = []
  },
  CLEAR_SEARCH_RESULTS (state) {
    state.searchResults = {
      organisations: [],
      people: [],
      instruments: [],
      addresses: [],
      listed_organisations: [],
      listed_people: [],
      listed_objects: [],
      listed_locations: []
    }
  },
  UPDATE_HITS_COUNT (state, payload) {
    state.hitCounts[payload.tableName][payload.entity] = payload.count

    forEach(state.hitCounts, function (countData, tableName) {
      state.hitCounts[tableName].total = 0
      forEach(state.hitCounts[tableName], function (count) {
        state.hitCounts[tableName].total += count
      })
    })
  },
  UPDATE_RESPONSE_TIME (state, payload) {
    state.responseTime[payload.entity] = payload.responseTime
  },
  SET_PAGE (state, payload) {
    Vue.set(state.pagination.current[payload.tableName], payload.entity, payload.count)

    var highest = state.pagination.current[payload.tableName][payload.entity] > state.pagination.highest[payload.tableName][payload.entity] ? state.pagination.current[payload.tableName][payload.entity] : state.pagination.highest[payload.tableName][payload.entity]

    Vue.set(state.pagination.highest[payload.tableName], payload.entity, highest)
  },
  RESET_PAGINATION (state, target) {
    if (target === 'all') {
      forEach(state.pagination.current, function (pageData, tableName) {
        forEach(state.pagination.current[tableName], function (pageNumber, entityType) {
          Vue.set(state.pagination.current[tableName], entityType, 0)
        })
      })
      forEach(state.pagination.highest, function (pageData, tableName) {
        forEach(state.pagination.highest[tableName], function (pageNumber, entityType) {
          Vue.set(state.pagination.highest[tableName], entityType, 0)
        })
      })
    } else {
      Vue.set(state.pagination.current[target.tableName], target.entityType, 0)
      Vue.set(state.pagination.highest[target.tableName], target.entityType, 0)
    }
  },
  UPDATE_SEARCH_RESULTS (state, payload) {
    // placeholder function for any formatting
    // needs on results data
    Vue.set(state.searchResults, payload.entity, payload.docs)
    state.activeResult = null
  },
  APPEND_SEARCH_RESULTS (state, payload) {
    var newResults = state.searchResults[payload.entity].concat(payload.docs)
    Vue.set(state.searchResults, payload.entity, newResults)
  },
  UPDATE_AVAILABLE_FACETS (state, payload) {
    var facetsObject = {}

    forEach(payload.facets, function (value, key) {
      facetsObject[key] = {}

      for (var i = 0; i < value.length; i += 2) {
        facetsObject[key][value[i]] = {
          entity: payload.entity,
          label: value[i],
          display_label: value[i],
          count: value[i + 1],
          active: false
        }
      }
    })

    // make our SRC_IDs pretty by mapping to our dictionary
    if (facetsObject.SRC_IDs) {
      forEach(facetsObject.SRC_IDs, function (value, key) {
        if (state.sourceIDs[value.label]) {
          facetsObject.SRC_IDs[key].display_label = state.sourceIDs[value.label]
        }
      })
    }

    facetsObject = $.extend(true, {}, state.available_facets[payload.entity], facetsObject)

    Vue.set(state.available_facets, payload.entity, facetsObject)
  },
  RECREATE_EXISTING_ACTIVE_FACETS (state, payload) {
    forEach(state.active_facets, function (activeFacetList, activeEntityType) {
      forEach(state.available_facets, function (availableFacetList, availableEntityType) {
        if (activeEntityType === availableEntityType) {
          forEach(activeFacetList, function (matchedFacetList, matchedFacetListKey) {
            forEach(matchedFacetList, function (matchedFacet, matchedFacetKey) {
              Vue.set(state.available_facets[activeEntityType][matchedFacetListKey][matchedFacet.label], 'active', true)
            })
          })
        }
      })
    })

    if (payload) {
      forEach(payload, function (fields, key) {
        if (key.indexOf('_') !== -1) {
          return true
        }

        forEach(fields, function (fieldValues, fieldName) {
          forEach(fieldValues, function (fieldValue) {
            if (state.available_facets[key][fieldName]) {
              Vue.set(state.available_facets[key][fieldName][fieldValue], 'active', true)
            }
          })
        })
      })
    }
  },
  UPDATE_ACTIVE_FACET (state, payload) {
    const facet = state.available_facets[payload.entity][payload.parentKey][payload.key]
    Vue.set(facet, 'active', payload.active)
    facet.last_update = Date.now()

    state.overrideFilters = {}
  },
  UPDATE_ACTIVE_FACET_LIST (state) {
    forEach(state.available_facets, function (facetList, entityType) {
      var newActiveFacets = {}
      var returnedActiveFacets = {}

      forEach(facetList, function (value, key) {
        newActiveFacets[key] = filter(value, function (o) {
          return o.active
        })
      })

      forEach(newActiveFacets, function (value, key) {
        if (value.length > 0) {
          returnedActiveFacets[key] = value
        }
      })

      Vue.set(state.active_facets, entityType, returnedActiveFacets)
    })
  },
  CLEAR_ALL_FACETS (state, data) {
    state.available_facets = {
      organisations: {},
      people: {},
      instruments: {},
      addresses: {},
      listed_organisations: {},
      listed_people: {},
      listed_objects: {},
      listed_locations: {}
    }
    state.active_facets = {
      organisations: {},
      people: {},
      instruments: {},
      addresses: {},
      listed_organisations: {},
      listed_people: {},
      listed_objects: {},
      listed_locations: {}
    }
    state.hitCounts = {
      search: {
        total: 0,
        organisations: 0,
        people: 0,
        instruments: 0,
        addresses: 0,
        listed_organisations: 0,
        listed_people: 0,
        listed_objects: 0,
        listed_locations: 0
      },
      xEntity: {
        total: 0,
        organisations: 0,
        people: 0,
        instruments: 0,
        addresses: 0
      }
    }
  },
  CLEAR_ACTIVE_FACETS_AT_LEVEL (state, levelLabel) {
    Vue.set(state.active_facets, levelLabel, {})
  },
  CLEAR_OVERRIDE_QUERY (state) {
    state.overrideQuery = ''
  },
  SET_OVERRIDE_QUERY (state, payload) {
    state.overrideQuery = payload
  },
  SET_DQ_QUERY (state, payload) {
    state.dqQuery = payload
  },
  CLEAR_OVERRIDE_FILTERS (state) {
    state.overrideFilters = {}
  },
  SET_OVERRIDE_FILTERS (state, payload) {
    state.overrideFilters = JSON.parse(payload)
  },
  UPDATE_MODIFIED_FACETS_TIMESTAMP (state) {
    state.facets_last_update = Date.now()
  },
  SET_ACTIVE_RESULT (state, index) {
    state.activeResult = index
  },
  UPDATE_RESULT_DETAILS (state, data) {
    state.detailsPage = data
  },
  CLEAR_SOURCE_DETAILS (state) {
    for (var obj in state.detailsSourceInfo) delete state.detailsSourceInfo[obj]
  },
  ADD_SOURCE_TO_DETAILS_PAGE (state, payload) {
    Vue.set(state.detailsSourceInfo, payload.key, payload.data)
  },
  SET_LOADING_STATUS (state, payload) {
    Vue.set(state.isLoading[payload.tableName], payload.entity, payload.value)
  },
  SET_SEARCH_IDENTIFIER (state, identifier) {
    state.searchIdentifier = identifier
  },
  CLEAR_SEARCH_IDENTIFIER (state) {
    state.searchIdentifier = ''
  },
  SET_SESSION_ID (state, payload) {
    if (payload.facetedSearch && state.sessionId !== null) {
      return
    }
    state.sessionId = generateUUID()
  },
  SET_RESULT_VIEW (state, view) {
    state.resultView = view
  },
  SET_ACTIVE_FACET_GROUP (state, facetGroup) {
    state.activeFacetGroup = facetGroup
  },
  CLEAR_ACTIVE_FACET_GROUP (state) {
    state.activeFacetGroup = []
  },
  SET_X_ENTITY (state, payload) {
    let xEntity = {
      name: state.activeEntityType,
      entity: payload.entity,
      identifier: payload.identifier,
      facets: payload.facets
    }
    state.xEntitySelected = xEntity
  },
  SET_X_ENTITY_RESULTS (state, payload) {
    Vue.set(state.xEntityResults, payload.identifier, payload.results)
  },
  REMOVE_X_ENTITY_FROM_RESULTS (state, identifier) {
    Vue.delete(state.xEntityResults, identifier)
  },
  UPDATE_X_ENTITY_RESULTS (state, payload) {
    state.xEntityResults[payload.identifier][payload.entityType].push(payload.docs)
  },
  UPDATE_ADVANCED_SEARCH_FIELDS (state, payload) {
    state.advancedSearchFields[payload.entity] = payload.fields
  },
  CLEAR_ADVANCED_SEARCH_FIELDS (state) {
    state.advancedSearchFields = {
      organisations: {},
      people: {},
      instruments: {},
      addresses: {},
      listed_organisations: {},
      listed_people: {},
      listed_objects: {},
      listed_locations: {}
    }
  },
  SET_PREVIOUS_ROUTE (state, route) {
    state.previousRoute = route
  },
  LANDING_PAGE_VISIBLE (state, bool) {
    state.landerVisible = bool
  },
  SET_SEARCH_HISTORY (state, history) {
    state.searchHistory = history
  },
  UPDATE_LOCATION_QUERY (state, input) {
    state.locationQuery = input
  },
  UPDATE_CURRENT_LOCATION_QUERY (state) {
    state.currentLocationQuery = state.locationQuery
  },
  SET_ENTITY_SELECTED (state, payload) {
    const entity = {
      entityType: payload.entityType,
      identifier: payload.identifier,
      name: payload.name
    }
    state.entitySelected = entity
  },
  CLEAR_ENTITY_SELECTED (state) {
    state.entitySelected = {}
  }
}

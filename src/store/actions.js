import idFields from './idFields.js'
import $ from 'jquery'
import { forEach, isEmpty } from 'lodash'
import Vue from 'vue'

export default {
  loadFacetHierarchy ({ state }) {
    forEach(state.searchEntities, function (entity, entityName) {
      if (!entity.isActive) {
        return
      }

      $.ajax({
        url: state.facetHierarchyUrl.get + entity.id,
        type: 'GET',
        dataType: 'json',
        success: data => {
          Vue.set(state.facet_groups, entityName, data)
        },
        error: error => {
          console.error(error)
        }
      })
    })
  },
  loadFacetData ({ commit, state }, payload) {
    const searchEntityKey = payload.entity.name.replace(/ /g, '_').toLowerCase()
    const facetRequest = {
      'Text': state.query,
      'PageNumber': state.pagination.current.search[searchEntityKey] + 1,
      'RowsPerPage': state.resultsPerPage,
      'EntityType': payload.entity.id,
      'Filters': {},
      'FacetFields': payload.facetFields
    }

    // Add advanced search fields to the request.
    forEach(state.advancedSearchFields[searchEntityKey], (value, key) => {
      facetRequest[key] = value
    })

    // Add active facets to the request.
    forEach(state.active_facets[searchEntityKey], (value, key) => {
      if (facetRequest.FacetFields.indexOf(key) !== -1) {
        return
      }

      facetRequest.Filters[key] = []
      forEach(value, facet => {
        facetRequest.Filters[key].push(facet.label)
      })
    })

    commit('SET_LOADING_STATUS', { tableName: 'search', entity: searchEntityKey, value: true })

    $.ajax({
      url: state.facetDataUrl,
      contentType: 'application/json',
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(facetRequest),
      success: data => {
        const facetData = {
          entity: searchEntityKey,
          facets: data.facet_counts.facet_fields
        }

        commit('UPDATE_AVAILABLE_FACETS', facetData)
        commit('RECREATE_EXISTING_ACTIVE_FACETS', state.overrideFilters)
        commit('UPDATE_MODIFIED_FACETS_TIMESTAMP')

        commit('SET_LOADING_STATUS', { tableName: 'search', entity: searchEntityKey, value: false })
      },
      error: error => {
        console.error(error)
      }
    })
  },
  loadSearchIdentifiers ({ state }) {
    $.ajax({
      url: state.searchIdentifiersUrl,
      type: 'GET',
      dataType: 'json',
      success: data => {
        state.searchIdentifiers = data
      },
      error: error => {
        console.error(error)
      }
    })
  },
  loadXEntityData ({ commit, state }) {
    commit('SET_X_ENTITY_RESULTS', {
      identifier: state.xEntitySelected.identifier,
      results: {
        organisations: [],
        people: [],
        instruments: [],
        addresses: []
      }
    })

    let selectedEntityType = 3

    switch (state.activeEntityType) {
      case 'organisations':
        selectedEntityType = 3
        break
      case 'people':
        selectedEntityType = 4
        break
      case 'instruments':
        selectedEntityType = 5
        break
    }

    function commitPayload (payload) {
      if (!payload.docs.matches) {
        payload.docs.matches = 0
      }

      commit('UPDATE_X_ENTITY_RESULTS', payload)
      commit('UPDATE_HITS_COUNT', {
        tableName: 'xEntity',
        entity: state.activeEntityType,
        count: payload.docs.matches
      })
    }

    function commitLoadingStatus (entityName, isLoading) {
      commit('SET_LOADING_STATUS', {
        tableName: 'xEntity',
        entity: entityName.toLowerCase(),
        value: isLoading
      })
    }

    forEach(state.searchEntities, function (value, key) {
      if (!value.isXEntity) {
        return
      }

      // don't attempt matching on ourselves (yet)
      if (selectedEntityType === value.id) {
        return
      }

      // gb05448421ucip003241881
      let searchRequest = { 'PageNumber': 1, 'EntityPrimaryKey': state.xEntitySelected.identifier, 'ResultEntityType': value.id, 'SelectedEntityType': selectedEntityType, 'Filters': [] }

      commitLoadingStatus(value.name, true)

      $.ajax({
        url: state.xEntityUrl,
        data: JSON.stringify(searchRequest),
        contentType: 'application/json',
        type: 'POST',
        'dataType': 'json',
        'success': function (data) {
          let payload = {
            entityType: value.name.toLowerCase(),
            identifier: state.xEntitySelected.identifier,
            docs: [],
            facets: {}
          }

          commitLoadingStatus(value.name, false)

          if (!data.grouped) {
            payload.docs.matches = 0
            commitPayload(payload)
            return
          }

          if (data.grouped[value.identifyingField].groups.length === 0) {
            return
          }

          let docs = data.grouped[value.identifyingField]
          // hydrate the payload with the data
          payload.docs = docs.groups
          payload.facets = docs.facet_counts

          commitPayload(payload)
        },
        'error': function (error) {
          console.error(error)
          commitLoadingStatus(value.name, false)
        }
      })
    })
  },
  saveFeedbackData ({ state }, payload) {
    return $.ajax({
      url: state.feedbackStoreUrl,
      type: 'POST',
      data: payload,
      dataType: 'json'
    })
  },
  loadEntityCount ({ state }) {
    return $.ajax({
      url: state.entityCountUrl,
      type: 'GET',
      dataType: 'json'
    })
  },
  loadNewsFeed ({ state }) {
    return $.ajax({
      url: state.newsFeedUrl,
      type: 'GET',
      dataType: 'json'
    })
  },
  loadSearchHistory ({ commit, state }) {
    $.ajax({
      url: state.searchHistoryUrl,
      type: 'GET',
      dataType: 'json',
      success: response => {
        commit('SET_SEARCH_HISTORY', response.Data)
      },
      error: error => {
        console.error(error)
      }
    })
  },
  search ({commit, dispatch, state}, options = { append: false, facetedSearch: false, entity: null, identifierSearch: false, advancedSearch: false }) {
    // set jQuery's ajax search to tradtional
    // to parse array query parameters in the way Solr
    // expects them to be handled
    $.ajaxSettings.traditional = true

    // cancel any outstanding requests
    commit('CLEAR_SEARCH_REQUESTS')

    // clean out existing search results if this
    // is a new search term
    if (options.facetedSearch === false && options.advancedSearch === false) {
      commit('CLEAR_SEARCH_RESULTS')
    }

    commit('SET_SESSION_ID', { facetedSearch: options.facetedSearch })

    var requestParams = []

    // loop through all entities and add them to the
    // requests array to be handled by our search
    if (options.entity === null) {
      forEach(state.searchEntities, function (value, key) {
        if (!value.isActive) {
          return
        }

        var queryObject = {
          entity: key,
          searchTarget: value.mdmTarget,
          queryFields: state.query_inputs[key + '_fields_to_query'].concat(idFields),
          queryFacets: state.query_facets[key],
          returnFields: state.query_inputs[key + '_fields_to_return']
        }
        requestParams.push(queryObject)
      })
    } else {
      var key = options.entity
      var value = state.searchEntities[key]
      var queryObject = {
        entity: key,
        searchTarget: value.mdmTarget,
        queryFields: state.query_inputs[key + '_fields_to_query'].concat(idFields),
        queryFacets: state.query_facets[key],
        returnFields: state.query_inputs[key + '_fields_to_return']
      }
      requestParams.push(queryObject)
    }

    // build our actual request objects to pass to
    // the $.when function
    forEach(requestParams, function (request) {
      if (!options.facetedSearch) {
        commit('SET_LOADING_STATUS', {
          tableName: 'search',
          entity: request.entity,
          value: true
        })
      }

      // build the query string for each API
      var queryString = ''
      if (state.currentSearchUrl === 'solr') {
        queryString = (state.currentQuery === '*:*') ? state.currentQuery : '(' + state.currentQuery + ')'
      } else if (state.currentSearchUrl === '.net') {
        queryString = (state.currentQuery === '*:*') ? '' : state.currentQuery
      }

      // build up our parameters based on
      // the provided search options
      var ajaxParams = {
        'wt': 'json',
        'q': queryString,
        'qf': request.queryFields.join(' '),
        'defType': 'edismax',
        'fl': request.returnFields.join(),
        'rows': state.resultsPerPage,
        'start': state.pagination.current.search[request.entity] * state.resultsPerPage,
        'facet': 'on',
        'facet.field': request.queryFacets,
        'facet.method': 'enum',
        'fq': '',
        // 'group': 'on',
        // 'group.field': state.searchEntities[request.entity].identifyingField,
        'timeAllowed': 50000
      }

      // Kill faceting if we've already got the counts
      if (options.facetedSearch) {
        delete (ajaxParams['facet'])
        delete (ajaxParams['facet.fields'])
      }

      // append our facet queries to the search params
      var fqQuery = ''
      var netFilterOverride = false

      if (isEmpty(state.overrideFilters) || state.overrideFilters[request.entity + '_completed']) {
        forEach(state.active_facets, function (listData, listKey) {
          // make sure we're only including facets
          // for the current entity
          if (listKey === options.entity) {
            forEach(listData, function (value, key) {
              var facetString = ''

              if (value.length > 0) {
                facetString = '+' + key + ':('

                for (var i = 0; i < value.length; i++) {
                  var label = state.active_facets[listKey][key][i]['label']
                  facetString += '"' + label + '" '
                }

                facetString += ') '
              }

              fqQuery += facetString
            })
          }
        })
      } else if (state.overrideFilters[request.entity + '_ready'] !== undefined) {
        var fqs = state.overrideFilters[request.entity]

        forEach(fqs, function (values, key) {
          fqQuery += '+' + key + ':('
          forEach(values, function (filter) {
            fqQuery += '"' + filter + '" '
          })

          fqQuery += ') '
        })

        state.overrideFilters[request.entity + '_completed'] = true
        netFilterOverride = true
      }

      ajaxParams['fq'] = fqQuery

      // log the performance of our query time
      var requestInitializeTime = new Date().getTime()

      // the search request
      if (state.currentSearchUrl === 'solr') {
        var ajaxRequest = $.ajax({
          'url': state.searchUrl['solr'] + request.searchTarget,
          'data': ajaxParams,
          'success': function (data) {
            var parsedData = transformToGroupedData(data)
            handleSuccess(parsedData)
          },
          'error': function () {
            // todo, error handling
          },
          'timeout': 60000,
          'dataType': 'jsonp',
          'jsonp': 'json.wrf'
        })
      } else if (state.currentSearchUrl === '.net') {
        var filters = {}

        // gather facet collection for .net APIs
        if (!netFilterOverride) {
          forEach(state.active_facets, function (listData, listKey) {
            // make sure we're only including facets
            // for the current entity
            if (listKey === options.entity) {
              forEach(listData, function (value, key) {
                filters[key] = []

                forEach(value, function (facet) {
                  filters[key].push(facet.label)
                })
              })
            }
          })
        } else {
          forEach(state.overrideFilters[request.entity], function (value, key) {
            filters[key] = []

            forEach(value, function (facet) {
              filters[key].push(facet)
            })
          })
        }

        // state.dqQuery is never cleared/reset - should it be?
        var dqQueryArr = []

        if (state.dqQuery.length > 0) {
          dqQueryArr.push(state.dqQuery)
        }

        var searchRequest = {
          'Text': state.query,
          'PageNumber': state.pagination.current.search[request.entity] + 1,
          'RowsPerPage': ajaxParams.rows,
          'EntityType': state.searchEntities[request.entity].id,
          'Filters': filters,
          'ReportQueries': dqQueryArr,
          // 'FacetFields': ajaxParams['facet.field'],
          // 'SelectFields': request.returnFields,
          // 'GroupField': state.searchEntities[request.entity].identifyingField,
          'SessionId': state.sessionId,
          'Location': state.locationQuery
        }

        if (options.identifierSearch) {
          // Remove the identifier prefix + ':' from the query
          searchRequest.Text = searchRequest.Text.substring(state.searchIdentifier.length + 1)
          if (state.searchIdentifier !== 'all') {
            searchRequest.IdentifierGroupKey = state.searchIdentifier
          }
        }

        if (state.advancedSearchFields[request.entity]) {
          Object.keys(state.advancedSearchFields[request.entity]).forEach(field => {
            searchRequest[field] = state.advancedSearchFields[request.entity][field]
          })
        }

        $.ajax({
          url: state.searchUrl['.net'],
          data: JSON.stringify(searchRequest),
          contentType: 'application/json',
          type: 'POST',
          'dataType': 'json',
          'success': function (data) {
            var parsedData = transformToGroupedData(data)
            handleSuccess(parsedData)
          },
          'error': function (error) {
            console.error(error)
          }
        })
      }

      function transformToGroupedData (data) {
        // if this response object is already grouped
        // then break out of the transform funtction.
        if (data.hasOwnProperty('grouped')) {
          return data
        }

        var groupedData = {}
        groupedData.responseHeader = data.responseHeader
        groupedData.facet_counts = data.facet_counts
        groupedData.grouped = {}
        groupedData.grouped[state.searchEntities[request.entity].identifyingField] = {}
        groupedData.grouped[state.searchEntities[request.entity].identifyingField].matches = data.response.numFound
        groupedData.grouped[state.searchEntities[request.entity].identifyingField].groups = []

        forEach(data.response.docs, function (docVal, docIndex) {
          var formattedGroup = {
            groupValue: data.response.docs[docIndex][state.searchEntities[request.entity].identifyingField],
            doclist: {
              numFound: 1,
              start: 0,
              docs: [
                docVal
              ]
            }
          }
          groupedData.grouped[state.searchEntities[request.entity].identifyingField].groups.push(formattedGroup)
        })

        return groupedData
      }

      function handleSuccess (data) {
        var key = Object.keys(data.grouped)[0]
        var docs = data.grouped[key]

        // Highlighting the results.
        if (data.highlighting && !data.highlighting['']) {
          forEach(docs.groups, function (gr, index) {
            if (gr.doclist.docs.length === 0) {
              return false
            }

            var hlk = Object.keys(data.highlighting)
            var keys = Object.keys(data.highlighting[hlk[index]])

            // There can be multiple highlights per record.
            forEach(keys, function (name, hlIndex) {
              gr.doclist.docs[0][keys[hlIndex]] = data.highlighting[hlk[index]][keys[hlIndex]]
            })
          })
        }

        if (options.append) {
          commit('APPEND_SEARCH_RESULTS', {
            entity: request.entity,
            docs: docs.groups
          })
        } else {
          commit('UPDATE_SEARCH_RESULTS', {
            entity: request.entity,
            docs: docs.groups
          })
          commit('UPDATE_HITS_COUNT', {
            tableName: 'search',
            entity: request.entity,
            count: docs.matches
          })
          commit('UPDATE_RESPONSE_TIME', {
            entity: request.entity,
            responseTime: (new Date().getTime()) - requestInitializeTime
          })

          /*
          if (options.facetedSearch === false) {
            var facetData = {
              entity: request.entity,
              facets: data.facet_counts.facet_fields
            }

            commit('UPDATE_AVAILABLE_FACETS', facetData)
            commit('RECREATE_EXISTING_ACTIVE_FACETS', state.overrideFilters)
            commit('UPDATE_MODIFIED_FACETS_TIMESTAMP')
          }
          */
        }

        if (!isEmpty(state.overrideFilters) && state.overrideFilters[request.entity + '_completed'] === undefined) {
          state.overrideFilters[request.entity + '_ready'] = true
          dispatch('search', {append: false, entity: request.entity, facetedSearch: true})
        } else {
          if (!options.facetedSearch) {
            commit('SET_LOADING_STATUS', {
              tableName: 'search',
              entity: request.entity,
              value: false
            })
          }
        }
      }

      // store the request on the state object so that
      // we can cancel it if a new query is entered before
      // we receive results
      commit('ADD_SEARCH_REQUEST', ajaxRequest)
    })
  }
}

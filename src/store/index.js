import actions from './actions.js'
import addressFields from './addressFields.js'
import cardFields from './cardFields.js'
import displayFields from './displayFields.js'
import mutations from './mutations.js'
import queryFields from './queryFields.js'
import sourceIDs from './dictionary.js'
import Vue from 'vue'
import Vuex from 'vuex'

require('es6-promise').polyfill()
require('es6-object-assign').polyfill()

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: false,
  state: {
    currentHost: '',
    currentSearchUrl: '.net',
    searchUrl: {
      'solr': 'http://10.247.144.48:8080/solr/',
      '.net': process.env.API_URI_PREFIX + '/api/Search/SearchEntities/'
    },
    facetHierarchyUrl: {
      'get': process.env.API_URI_PREFIX + '/api/Search/GetFacetHierarchy?sourceEntityType='
    },
    searchIdentifiersUrl: process.env.API_URI_PREFIX + '/api/Search/GetIdentifierPatterns',
    facetDataUrl: process.env.API_URI_PREFIX + '/api/Search/GetSearchFilters',
    xEntityUrl: process.env.API_URI_PREFIX + '/api/Search/GetConnectedEntities',
    feedbackStoreUrl: 'https://script.google.com/macros/s/AKfycbyUr3ZvNp8q2O7ROIjusDb1VRpYgk2fDHETRKZNKochijboxQsF/exec',
    entityCountUrl: process.env.API_URI_PREFIX + '/api/Search/GetEntityCount',
    newsFeedUrl: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Fnews%2Frss%2Fheadlines%2Fsection%2Ftopic%2FBUSINESS.en_uk%2FBusiness%3Fned%3Duk%26hl%3Den-GB&api_key=wubfanwu13q5ne5zhooxp09cl7bgbq7ni46ee0qa',
    searchHistoryUrl: process.env.API_URI_PREFIX + '/api/Search/GetRecentSearches',
    query: '',
    currentQuery: '',
    overrideQuery: '',
    dqQuery: [],
    locationQuery: '',
    currentLocationQuery: '',
    overrideFilters: null,
    searchRequests: [],
    overlayVisible: false,
    activeEntityType: 'organisations',
    searchEntities: {
      'organisations': {
        name: 'Organisations',
        mdmTarget: 'company_mdm/select',
        identifyingField: 'Organisation_Primary_Key',
        id: 3,
        isActive: true,
        isXEntity: true
      },
      'people': {
        name: 'People',
        mdmTarget: 'people_mdm/select',
        identifyingField: 'People_Primary_Key',
        id: 4,
        isActive: true,
        isXEntity: true
      },
      'instruments': {
        name: 'Instruments',
        mdmTarget: 'instrument_mdm/select',
        identifyingField: 'Instrument_Primary_Key',
        id: 5,
        isActive: true,
        isXEntity: true
      },
      'addresses': {
        name: 'Addresses',
        mdmTarget: 'UPU/select',
        identifyingField: 'Address_Key',
        id: 7,
        isActive: false,
        isXEntity: false
      },
      'listed_organisations': {
        name: 'Listed Organisations',
        mdmTarget: 'sanctions_company_mdm/select',
        identifyingField: 'SRC380_Primary_Key',
        id: 8,
        isActive: window.showSanctionTabs !== undefined ? window.showSanctionTabs : false,
        isXEntity: false
      },
      'listed_people': {
        name: 'Listed People',
        mdmTarget: 'sanctions_people_mdm/select',
        identifyingField: 'SRC381_Primary_Key',
        id: 9,
        isActive: window.showSanctionTabs !== undefined ? window.showSanctionTabs : false,
        isXEntity: false
      },
      'listed_objects': {
        name: 'Listed Objects',
        mdmTarget: 'sanctions_company_mdm/select',
        identifyingField: 'SRC380_Primary_Key',
        id: 10,
        isActive: window.showSanctionTabs !== undefined ? window.showSanctionTabs : false,
        isXEntity: false
      },
      'listed_locations': {
        name: 'Listed Locations',
        mdmTarget: 'sanctions_people_mdm/select',
        identifyingField: 'SRC381_Primary_Key',
        id: 11,
        isActive: window.showSanctionTabs !== undefined ? window.showSanctionTabs : false,
        isXEntity: false
      }
    },
    query_inputs: queryFields,
    display_fields: displayFields,
    query_facets: {},
    facet_groups: {
      organisations: [],
      people: [],
      instruments: [],
      addresses: [],
      listed_organisations: [],
      listed_people: [],
      listed_objects: [],
      listed_locations: []
    },
    available_facets: {
      organisations: {},
      people: {},
      instruments: {},
      addresses: {},
      listed_organisations: {},
      listed_people: {},
      listed_objects: {},
      listed_locations: {}
    },
    active_facets: {
      organisations: {},
      people: {},
      instruments: {},
      addresses: {},
      listed_organisations: {},
      listed_people: {},
      listed_objects: {},
      listed_locations: {}
    },
    facets_last_update: Date.now(),
    sourceIDs: sourceIDs,
    searchResults: {
      organisations: [],
      people: [],
      instruments: [],
      addresses: [],
      listed_organisations: [],
      listed_people: [],
      listed_objects: [],
      listed_locations: []
    },
    resultsPerPage: window.resultsPerPage || 10,
    pagination: {
      highest: {
        search: {
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
          organisations: 0,
          people: 0,
          instruments: 0,
          addresses: 0
        }
      },
      current: {
        search: {
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
          organisations: 0,
          people: 0,
          instruments: 0,
          addresses: 0
        }
      }
    },
    hitCounts: {
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
    },
    responseTime: {
      organisations: 0,
      people: 0,
      instruments: 0,
      addresses: 0,
      listed_organisations: 0,
      listed_people: 0,
      listed_objects: 0,
      listed_locations: 0
    },
    activeResult: null,
    isLoading: {
      search: {
        organisations: false,
        people: false,
        instruments: false,
        addresses: false,
        listed_organisations: false,
        listed_people: false,
        listed_objects: false,
        listed_locations: false
      },
      xEntity: {
        organisations: false,
        people: false,
        instruments: false,
        addresses: false
      }
    },
    searchIdentifier: '',
    searchIdentifiers: {},
    sessionId: null,
    activeFacetGroup: [],
    resultView: 'card',
    xEntitySelected: {},
    xEntityResults: {},
    advancedSearchFields: {
      organisations: {},
      people: {},
      instruments: {},
      addresses: {},
      listed_organisations: {},
      listed_people: {},
      listed_objects: {},
      listed_locations: {}
    },
    searchInCaseFlow: window.searchInCaseFlow !== undefined ? window.searchInCaseFlow : false,
    searchInListManagement: window.showSanctionTabs !== undefined ? window.showSanctionTabs : false,
    listManagementUrl: {
      add: {
        listed_organisations: '/List/CreateSanctioned?entityType=8',
        listed_people: '/List/CreateSanctioned?entityType=9'
      },
      copy: {
        listed_organisations: '/ListManagement/EditListItem.aspx?ListID=-1&EntityTypeID=2',
        listed_people: '/ListManagement/EditListItem.aspx?ListID=-2&EntityTypeID=1'
      },
      edit: {
        listed_organisations: '/List/EditOrganisation',
        listed_people: '/List/EditPerson'
      },
      remove: {
        listed_organisations: '/List/EditOrganisation',
        listed_people: '/List/EditPerson'
      }
    },
    previousRoute: null,
    landerVisible: true,
    searchHistory: [],
    identifierSuggestionCount: 0,
    addressFields: addressFields,
    cardFields: cardFields,
    searchOptions: {
      append: false,
      entity: null,
      facetedSearch: false,
      identifierSearch: false
    },
    entitySelected: {},
    userAllowedToAddListItem: window.canAddListedItem !== undefined ? window.canAddListedItem : false
  },
  actions,
  mutations
})

export default store

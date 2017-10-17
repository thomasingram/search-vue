import Vue from 'vue'
import store from 'src/store'
import LocationFilters from 'src/components/filters/LocationFilters.vue'
import Marker from 'src/assets/icons/marker.svg'
import Chevron from 'src/assets/icons/chevron.svg'

describe('LocationFilters.vue', () => {
  describe('initialisation', () => {
    it('should initialise the component with data object', () => {
      expect(LocationFilters.data()).to.eql({
        addressTypes: {
          organisations: [],
          people: [],
          listed_organisations: [],
          listed_people: []
        },
        Chevron,
        fields: {
          organisations: {},
          people: {},
          listed_organisations: {},
          listed_people: {}
        },
        Marker
      })
    })
  })

  describe('methods', () => {
    let component

    beforeEach(() => {
      const vm = new Vue({
        template: `<location-filters ref="locationFilters"></location-filters>`,
        components: {
          LocationFilters
        },
        store
      }).$mount()

      component = vm.$refs.locationFilters

      component.addressTypes = {
        organisations: [
          {
            checked: true,
            key: 'Mailing',
            name: 'Mailing',
            id: 1
          },
          {
            checked: true,
            key: 'Operating',
            name: 'Operating',
            id: 2
          },
          {
            checked: true,
            key: 'Registered',
            name: 'Registered',
            id: 3
          }
        ]
      }
    })

    describe('viewAllFacets', () => {
      it('should call $emit method', () => {
        sinon.stub(component, '$emit')
        component.viewAllFacets(['Operating_Country_Name_s_i'])
        expect(component.$emit).to.have.been.calledWith('facetGroupClick', ['Operating_Country_Name_s_i'])
        component.$emit.restore()
      })
    })

    describe('handleAdvancedSearch', () => {
      it('should call commit method with fields and the entity type', () => {
        sinon.stub(store, 'commit')
        component.fields.organisations = {
          Country: 'China'
        }
        component.handleAdvancedSearch()
        expect(store.commit).to.have.been.calledWith('UPDATE_ADVANCED_SEARCH_FIELDS', {
          fields: {
            Country: 'China',
            LocationFilterTypes: [1, 2, 3]
          },
          entity: 'organisations'
        })
        store.commit.restore()
      })

      it('should omit empty fields', () => {
        sinon.stub(store, 'commit')
        component.fields.organisations = {
          Country: 'China',
          County: 'Zhejiang',
          Town: 'Hangzhou',
          PostCode: '',
          Address: ''
        }
        component.handleAdvancedSearch()
        expect(store.commit).to.have.been.calledWith('UPDATE_ADVANCED_SEARCH_FIELDS', {
          fields: {
            Country: 'China',
            County: 'Zhejiang',
            Town: 'Hangzhou',
            LocationFilterTypes: [1, 2, 3]
          },
          entity: 'organisations'
        })
        store.commit.restore()
      })

      it('should omit address types that are unchecked', () => {
        sinon.stub(store, 'commit')
        component.fields.organisations = {
          Country: 'China'
        }
        component.addressTypes.organisations[0].checked = false
        component.handleAdvancedSearch()
        expect(store.commit).to.have.been.calledWith('UPDATE_ADVANCED_SEARCH_FIELDS', {
          fields: {
            Country: 'China',
            LocationFilterTypes: [2, 3]
          },
          entity: 'organisations'
        })
        store.commit.restore()
      })

      it('should call $emit method', () => {
        sinon.stub(component, '$emit')
        component.handleAdvancedSearch()
        expect(component.$emit).to.have.been.calledWith('advancedSearchStart')
        component.$emit.restore()
      })
    })
  })
})

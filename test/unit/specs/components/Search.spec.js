import Vue from 'vue'
import store from 'src/store'
import router from 'src/router'
import Search from 'src/Search.vue'

describe('Search.vue', () => {
  describe('initialisation', () => {
    it('should initialise the component with data object', () => {
      expect(Search.data()).to.eql({
        facetsObject: {},
        isAdvancedSearch: false
      })
    })
  })

  describe('methods', () => {
    let component

    beforeEach(() => {
      const vm = new Vue({
        template: `<search ref="search"></search>`,
        components: {
          Search
        },
        store,
        router
      }).$mount()

      component = vm.$refs.search
    })

    describe('facetCall', () => {
      it('should call dispatch method with entity data and facet key', () => {
        sinon.stub(store, 'dispatch')
        component.facetCall(['Legal_Form_s_i'])
        expect(store.dispatch).to.have.been.calledWith('loadFacetData', {
          entity: store.state.searchEntities[store.state.activeEntityType],
          facetFields: ['Legal_Form_s_i']
        })
        store.dispatch.restore()
      })

      it('should call commit method to display the facet overlay', () => {
        sinon.stub(store, 'commit')
        component.facetCall('Legal_Form_s_i')
        expect(store.commit).to.have.been.calledWith('SEARCH_OVERLAY_VISIBLE', true)
        store.commit.restore()
      })
    })

    describe('buildFacetsObject', () => {
      it('should build an object with the latest available facet', () => {
        store.state.available_facets['organisations'] = {
          Legal_Form_s_i: {
            'Charitable Organization': {
              active: false,
              count: 7,
              display_label: 'Charitable Organization',
              entity: 'organisations',
              label: 'Charitable Organization'
            }
          },
          Activity_Status_s_i: {}
        }
        component.buildFacetsObject()
        expect(component.facetsObject).to.eql({
          organisations: {
            Legal_Form_s_i: {
              'Charitable Organization': {
                active: false,
                count: 7,
                display_label: 'Charitable Organization',
                entity: 'organisations',
                label: 'Charitable Organization'
              }
            }
          }
        })
        store.state.available_facets['organisations'] = {}
      })
    })
  })
})

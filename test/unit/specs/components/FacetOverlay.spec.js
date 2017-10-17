import Vue from 'vue'
import store from 'src/store'
import FacetOverlay from 'src/components/filters/FacetOverlay.vue'

describe('FacetOverlay.vue', () => {
  describe('initialisation', () => {
    it('should initialise the component with array facetArray', () => {
      expect(FacetOverlay.data()).to.eql({
        facetArray: []
      })
    })
  })

  describe('methods', () => {
    let component

    beforeEach(() => {
      const vm = new Vue({
        template: `<facet-overlay v-bind:facets-object="facetsObject" ref="facetOverlay"></facet-overlay>`,
        components: {
          FacetOverlay
        },
        data: function () {
          return {
            facetsObject: {
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
            }
          }
        },
        store
      }).$mount()

      component = vm.$refs.facetOverlay
    })

    describe('handleCloseClick', () => {
      it('should call commit method with boolean false', () => {
        sinon.stub(store, 'commit')
        component.handleCloseClick()
        expect(store.commit).to.have.been.calledWith('SEARCH_OVERLAY_VISIBLE', false)
        store.commit.restore()
      })
    })

    describe('parseFacetsObject', () => {
      it('should parse the object', () => {
        component.parseFacetsObject()
        expect(component.facetArray[0].entityType).to.equal('organisations')
        expect(component.facetArray[0].facetGroup).to.equal('Legal_Form_s_i')
        expect(component.facetArray[0].facets).to.eql({
          'Charitable Organization': {
            active: false,
            count: 7,
            display_label: 'Charitable Organization',
            entity: 'organisations',
            label: 'Charitable Organization'
          }
        })
      })
    })
  })
})

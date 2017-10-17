import Vue from 'vue'
import store from 'src/store'
import ActiveFacets from 'src/components/filters/ActiveFacets.vue'

describe('ActiveFacets.vue', () => {
  describe('methods', () => {
    let component
    let facet

    beforeEach(() => {
      const vm = new Vue({
        template: `<active-facets ref="activeFacets"></active-facets>`,
        components: {
          ActiveFacets
        },
        store
      }).$mount()

      component = vm.$refs.activeFacets

      facet = {
        active: true,
        count: 2,
        display_label: 'Secretary',
        entity: 'people',
        label: 'Secretary',
        facetGroup: 'Job_Title_s_i'
      }
    })

    describe('handleRemoveFacetClick', () => {
      it('should call commit method with facet data', () => {
        sinon.stub(store, 'commit')
        component.handleRemoveFacetClick(facet)
        expect(store.commit).to.have.been.calledWith('UPDATE_ACTIVE_FACET', {
          entity: facet.entity,
          parentKey: facet.facetGroup,
          key: facet.label,
          active: false
        })
        store.commit.restore()
      })

      it('should call commit method to update the active facets', () => {
        sinon.stub(store, 'commit')
        component.handleRemoveFacetClick(facet)
        expect(store.commit).to.have.been.calledWith('UPDATE_ACTIVE_FACET_LIST')
        store.commit.restore()
      })

      it('should call dispatch method with boolean facetedSearch and the entity type', () => {
        sinon.stub(store, 'commit')
        sinon.stub(store, 'dispatch')
        component.handleRemoveFacetClick(facet)
        expect(store.dispatch).to.have.been.calledWith('search', {
          facetedSearch: true,
          entity: 'people'
        })
        store.commit.restore()
        store.dispatch.restore()
      })

      it('should call commit method with the entity type to reset pagination', () => {
        sinon.stub(store, 'commit')
        component.handleRemoveFacetClick(facet)
        expect(store.commit).to.have.been.calledWith('RESET_PAGINATION', {
          tableName: 'search',
          entityType: 'people'
        })
        store.commit.restore()
      })
    })
  })
})

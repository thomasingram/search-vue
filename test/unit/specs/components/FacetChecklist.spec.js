import Vue from 'vue'
import store from 'src/store'
import FacetChecklist from 'src/components/filters/FacetChecklist.vue'

describe('FacetChecklist.vue', () => {
  describe('methods', () => {
    let component
    let facetList

    beforeEach(() => {
      const vm = new Vue({
        template: `<facet-checklist v-bind:entity-type="'people'" v-bind:facet-group="'Job_Title_s_i'" ref="facetChecklist"></facet-checklist>`,
        components: {
          FacetChecklist
        },
        store
      }).$mount()

      component = vm.$refs.facetChecklist

      facetList = {
        'Secretary': {
          active: true,
          count: 2,
          display_label: 'Secretary',
          entity: 'people',
          label: 'Secretary'
        }
      }
    })

    describe('updateActiveFacetList', () => {
      it('should call commit method with facet data', () => {
        sinon.stub(store, 'commit')
        component.updateActiveFacetList(facetList)
        expect(store.commit).to.have.been.calledWith('UPDATE_ACTIVE_FACET', {
          entity: facetList['Secretary'].entity,
          parentKey: 'Job_Title_s_i',
          key: facetList['Secretary'].label,
          active: facetList['Secretary'].active
        })
        store.commit.restore()
      })

      it('should call commit method to update the active facets', () => {
        sinon.stub(store, 'commit')
        component.updateActiveFacetList(facetList)
        expect(store.commit).to.have.been.calledWith('UPDATE_ACTIVE_FACET_LIST')
        store.commit.restore()
      })

      it('should call dispatch method with boolean facetedSearch and the entity type', () => {
        sinon.stub(store, 'commit')
        sinon.stub(store, 'dispatch')
        component.updateActiveFacetList(facetList)
        expect(store.dispatch).to.have.been.calledWith('search', {
          facetedSearch: true,
          entity: 'people'
        })
        store.commit.restore()
        store.dispatch.restore()
      })

      it('should call commit method with the entity type to reset pagination', () => {
        sinon.stub(store, 'commit')
        component.updateActiveFacetList(facetList)
        expect(store.commit).to.have.been.calledWith('RESET_PAGINATION', {
          tableName: 'search',
          entityType: 'people'
        })
        store.commit.restore()
      })
    })
  })
})

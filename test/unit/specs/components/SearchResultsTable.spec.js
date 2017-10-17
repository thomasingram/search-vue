import Vue from 'vue'
import store from 'src/store'
import SearchResultsTable from 'src/components/results/SearchResultsTable.vue'

describe('SearchResultsTable.vue', () => {
  describe('initialisation', () => {
    it('should initialise the component with data object', () => {
      expect(SearchResultsTable.data()).to.eql({
        targetSearchResults: [],
        inactiveRows: {},
        window: window,
        entityLinkTypes: window.menuItems !== undefined ? window.menuItems : [],
        entityResearchTypes: window.researchMenuItems !== undefined ? window.researchMenuItems : [],
        matchedEntityKeys: window.matchedEntityKeys,
        showHideColumnsIsVisible: false,
        tableIsFullScreen: false
      })
    })
  })

  describe('methods', () => {
    let component

    beforeEach(() => {
      const vm = new Vue({
        template: `<search-results-table v-bind:entity-type="'organisations'" v-bind:table-data="tableData" v-bind:table-name="'search'" ref="searchResultsTable"></search-results-table>`,
        components: {
          SearchResultsTable
        },
        data () {
          return {
            tableData: []
          }
        },
        store
      }).$mount()

      component = vm.$refs.searchResultsTable
    })

    describe('loadPage', () => {
      it('should call commit method and fetch the results', () => {
        sinon.stub(store, 'commit')
        sinon.stub(store, 'dispatch')
        store.state.hitCounts.search['organisations'] = 100000
        component.loadPage(1)
        expect(store.commit).to.have.been.calledWith('SET_PAGE', {
          tableName: 'search',
          entity: 'organisations',
          count: 1
        })
        expect(store.dispatch).to.have.been.calledWith('search', {
          append: true,
          entity: 'organisations'
        })
        store.commit.restore()
        store.dispatch.restore()
        store.state.hitCounts.search['organisations'] = 0
      })

      it('should call commit method and display the results rather than re-fetching', () => {
        sinon.stub(store, 'commit')
        sinon.stub(component, 'updateTargetSearchResults')
        store.state.hitCounts.search['organisations'] = 100000
        store.state.pagination.highest.search['organisations'] = 1
        component.loadPage(1)
        expect(store.commit).to.have.been.calledWith('SET_PAGE', {
          tableName: 'search',
          entity: 'organisations',
          count: 1
        })
        expect(component.updateTargetSearchResults).to.have.been.called
        store.commit.restore()
        component.updateTargetSearchResults.restore()
        store.state.hitCounts.search['organisations'] = 0
        store.state.pagination.highest.search['organisations'] = 0
      })
    })

    describe('calcIndex', () => {
      it('should calculate the index of the table row', () => {
        let index
        index = component.calcIndex(0)
        expect(index).to.equal(1)
        store.state.pagination.current.search['organisations'] = 1
        index = component.calcIndex(0)
        expect(index).to.equal(11)
      })
    })
  })
})

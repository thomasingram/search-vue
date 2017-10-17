import Vue from 'vue'
import store from 'src/store'
import SearchResultsList from 'src/components/results/SearchResultsList.vue'

describe('SearchResultsList.vue', () => {
  describe('methods', () => {
    let component

    beforeEach(() => {
      const vm = new Vue({
        template: `<search-results-list v-bind:entity-type="'organisations'" ref="searchResultsList"></search-results-list>`,
        components: {
          SearchResultsList
        },
        store
      }).$mount()

      component = vm.$refs.searchResultsList
    })

    describe('loadMoreIsVisible', () => {
      it('should calculate if there are more results to fetch', () => {
        store.state.currentQuery = 'Warren Buffett'
        store.state.hitCounts.search['organisations'] = 20
        store.state.pagination.current.search['organisations'] = 0
        expect(component.loadMoreIsVisible).to.be.true
        component.loadMoreResults()
        expect(component.loadMoreIsVisible).to.not.be.true
        store.state.currentQuery = ''
        store.state.hitCounts.search['organisations'] = 0
        store.state.isLoading.search['organisations'] = false
        store.state.pagination.current.search['organisations'] = 0
        store.state.pagination.highest.search['organisations'] = 0
      })
    })

    describe('loadMoreResults', () => {
      it('should call commit method and fetch the results', () => {
        sinon.stub(store, 'commit')
        sinon.stub(store, 'dispatch')
        component.loadMoreResults()
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
      })
    })
  })
})

import store from '../store'

export default {
  install (Vue) {
    Vue.searchHistoryMatcher = () => {
      return (query, results) => {
        let matches = []

        const queryIsIdentifier = store.identifierSuggestionCount > 0

        if (!queryIsIdentifier) {
          for (let i = 0; i < store.state.searchHistory.length; i++) {
            const search = store.state.searchHistory[i]
            if (query === '' || search.SearchTerm.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
              matches.push(search)
            }
          }
        }

        results(matches)
      }
    }
  }
}

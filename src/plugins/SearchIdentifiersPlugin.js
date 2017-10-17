import store from '../store'

export default {
  install (Vue) {
    Vue.identifierMatcher = () => {
      return (query, results) => {
        let matches = []

        const queryHasAtLeastFourDigits = query.match(/(.*\d){4,}/)

        if (queryHasAtLeastFourDigits) {
          Object.keys(store.state.searchIdentifiers).forEach(key => {
            const identifier = store.state.searchIdentifiers[key]
            const regex = new RegExp(identifier.IdentifierRegexPattern.replace(/\\/g, '\\'))
            if (regex.test(query)) {
              matches.push(identifier)
            }
          })
        }

        store.identifierSuggestionCount = matches.length

        results(matches)
      }
    }

    Vue.identifierFromQuery = query => {
      if (!query) return ''

      let queryId = ''

      Object.keys(store.state.searchIdentifiers).forEach(key => {
        const identifier = store.state.searchIdentifiers[key]
        if (query.toLowerCase().indexOf(identifier.IdentifierGroupKey.toLowerCase() + ':') !== -1) {
          queryId = identifier
          return
        }
      })

      return queryId
    }
  }
}

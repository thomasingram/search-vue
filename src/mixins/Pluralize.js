import pluralize from 'pluralize'

export default {
  methods: {
    pluralize (word, count) {
      return pluralize(word, count)
    }
  }
}

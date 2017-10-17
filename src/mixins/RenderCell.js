export default {
  methods: {
    renderCell (displayField, result) {
      let cellValue = ''

      if (typeof displayField.field === 'string') {
        let value = typeof result[displayField.field] === 'object'
            ? result[displayField.field][0]
            : result[displayField.field]

        if (value) {
          cellValue = value
        }
      } else if (Array.isArray(displayField.field)) {
        for (let i = 0; i < displayField.field.length; i++) {
          let value = typeof result[displayField.field[i]] === 'object'
              ? result[displayField.field[i]][0]
              : result[displayField.field[i]]

          if (value) {
            cellValue += '<span class="' + displayField.field[i] + '">' + value + '</span>, '
          }
        }

        cellValue = cellValue.replace(/,\s*$/, '')
      }

      if (displayField.cellFilter) {
        cellValue = this.$options.filters[displayField.cellFilter](cellValue, displayField.displayName)
      }

      return cellValue
    }
  }
}

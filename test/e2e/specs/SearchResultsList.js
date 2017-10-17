module.exports = {
  'SearchResultsList.vue': function (browser) {
    const devServer = browser.globals.devServerURL

    browser.url(devServer)
    // Set the search field to 'Vitsoe' and hit enter, check that there are 10 results.
    browser.setValue('#query', ['Vitsoe', browser.Keys.ENTER])
    browser.waitForElementPresent('.search-results-list > li:first-child', 10000)
    browser.elements('css selector', '.card', function (result) {
      browser.assert.strictEqual(result.value.length, 10)
    })
    // Check that the load more results button exists.
    browser.assert.elementPresent('.load-more-results')
    // Click on the load more results button, check that there are 12 results.
    browser.click('.load-more-results')
    browser.waitForElementNotPresent('.bar', 10000)
    browser.elements('css selector', '.card', function (result) {
      browser.assert.strictEqual(result.value.length, 12)
    })
    // Check that the load more results button does not exist.
    browser.assert.elementNotPresent('.load-more-results')
    browser.end()
  }
}

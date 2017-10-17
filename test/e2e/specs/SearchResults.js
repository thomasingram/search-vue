module.exports = {
  'SearchResults.vue': function (browser) {
    const devServer = browser.globals.devServerURL

    browser.url(devServer)
    browser.click('.tab-entity:first-child > a')
    // Check that the message exists.
    browser.assert.elementPresent('.search-results-info')
    // Check that the message contains 'We hold over 3 billion records across 200+ data sources across the globe.'.
    browser.assert.containsText('.search-results-info', 'We hold over 3 billion records across 200+ data sources across the globe.')
    // Set the search field to '4XCI' and hit enter, check that the message contains 'Your search did not match any organisations.'.
    browser.setValue('#query', ['4XCI', browser.Keys.ENTER])
    browser.waitForElementNotPresent('.bar', 10000)
    browser.assert.containsText('.search-results-info', 'Your search did not match any organisations.')
    // Set the search field to 'ICX4' and hit enter, check that the view as label exists.
    browser.assert.elementNotPresent('.view-mode__label')
    browser.clearValue('#query')
    browser.setValue('#query', ['ICX4', browser.Keys.ENTER])
    browser.waitForElementPresent('.search-results-list > li:first-child', 10000)
    browser.assert.elementPresent('.view-mode__label')
    // Check that there are 2 view as buttons.
    browser.elements('css selector', '.view-mode__button', function (result) {
      browser.assert.strictEqual(result.value.length, 2)
    })
    // Check that the first view as button is not disabled.
    browser.expect.element('button[class~="view-mode__button"]:nth-of-type(1)').to.not.have.attribute('disabled')
    // Check that the second view as button is disabled.
    browser.expect.element('button[class~="view-mode__button"]:nth-of-type(2)').to.have.attribute('disabled')
    // Click on the first view as button, check that the result view is table.
    browser.assert.elementNotPresent('.search-results-table')
    browser.click('button[class~="view-mode__button"]:nth-of-type(1)')
    browser.assert.elementPresent('.search-results-table')
    // Click on the second view as button, check that the result view is card.
    browser.assert.elementNotPresent('.search-results-list')
    browser.click('button[class~="view-mode__button"]:nth-of-type(2)')
    browser.assert.elementPresent('.search-results-list')
    browser.end()
  }
}

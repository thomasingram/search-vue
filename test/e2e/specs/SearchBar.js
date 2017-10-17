module.exports = {
  'SearchBar.vue': function (browser) {
    const devServer = browser.globals.devServerURL

    browser.url(devServer)
    // Check that the search field exists.
    browser.assert.elementPresent('#query')
    // Check that the search field has a placeholder that equals 'What are you looking for?'.
    browser.expect.element('#query').to.have.attribute('placeholder').equals('What are you looking for?')
    // Check that the search button exists.
    browser.assert.elementPresent('.search-bar__submit')
    // Check that the search button is labelled 'Search'.
    browser.expect.element('.search-bar__submit').text.to.equal('Search')
    // Check that the search query exists.
    browser.setValue('#query', ['ICX4', browser.Keys.ENTER])
    browser.waitForElementPresent('.search-results-list > li:first-child', 10000)
    browser.expect.element('.results-count').text.to.contain('ICX4')
    // Check that the clear button is visible.
    browser.assert.visible('#clear_query')
    // Check that the clear button clears the search field.
    browser.click('#clear_query')
    browser.assert.value('#query', '')
    // Check that the identifier suggestion is visible.
    browser.setValue('#query', 'HWUPKR0MPOU8FGXBT394')
    browser.assert.visible('.tt-menu')
    browser.expect.element('.tt-suggestion').text.to.contain('LEI')
    browser.end()
  }
}

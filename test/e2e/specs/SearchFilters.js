module.exports = {
  'SearchFilters.vue': function (browser) {
    const devServer = browser.globals.devServerURL

    browser.url(devServer)
    browser.click('.tab-entity:first-child > a')
    browser.waitForElementPresent('li[class="search-filter"]:first-child', 5000)
    // Check that the title equals 'FILTERS'.
    browser.expect.element('.search-filters__title').text.to.equal('FILTERS')
    // Check that there are 7 facet groups.
    browser.elements('css selector', '.search-filter', function (result) {
      browser.assert.strictEqual(result.value.length, 7)
    })
    // Check that the first facet group contains 'Legal Form'.
    browser.assert.containsText('li[class="search-filter"]:first-child', 'Legal Form')
    // Check that the nested facet groups are not visible.
    browser.pause(1000)
    browser.expect.element('li[class="search-filter"]:nth-child(2) > .search-filters__list').to.not.be.visible
    // Click on the second facet group, check that the nested facet groups are visible.
    browser.click('li[class="search-filter"]:nth-child(2) > a')
    browser.pause(1000)
    browser.expect.element('li[class="search-filter"]:nth-child(2) > .search-filters__list').to.be.visible
    // Click on the second facet group, check that the nested facet groups are not visible.
    browser.click('li[class="search-filter"]:nth-child(2) > a')
    browser.pause(1000)
    browser.expect.element('li[class="search-filter"]:nth-child(2) > .search-filters__list').to.not.be.visible
    // Click on the first facet group, check that the facet overlay exists.
    browser.click('li[class="search-filter"]:first-child > a')
    browser.assert.elementPresent('.facet-overlay')
    browser.end()
  }
}

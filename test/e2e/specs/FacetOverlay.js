module.exports = {
  'FacetOverlay.vue': function (browser) {
    const devServer = browser.globals.devServerURL

    browser.url(devServer)
    browser.click('.tab-entity:first-child > a')
    browser.waitForElementPresent('li[class="search-filter"]:first-child', 5000)
    browser.click('.search-filters__list > li:first-child > a')
    // Check that the close button closes the facet overlay.
    browser.assert.elementPresent('.facet-overlay')
    browser.click('.facet-overlay__close')
    browser.assert.elementNotPresent('.facet-overlay')
    browser.end()
  }
}

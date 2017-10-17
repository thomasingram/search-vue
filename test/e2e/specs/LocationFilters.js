module.exports = {
  'LocationFilters.vue': function (browser) {
    const devServer = browser.globals.devServerURL

    browser.url(devServer)
    browser.click('.tab-entity:first-child > a')
    browser.waitForElementPresent('#location_filters .form-group', 5000)
    // Check that the title equals 'LOCATION FILTERS'.
    browser.expect.element('.location-filters__title').text.to.equal('LOCATION FILTERS')
    // Check that the location type label exists.
    browser.assert.elementPresent('.location-filters__link')
    // Check that the location types are visible.
    browser.expect.element('.location_filters__content').to.be.visible
    // Click on the location type label, check that the location types are not visible.
    browser.click('.location-filters__link')
    browser.pause(1000)
    browser.expect.element('.location_filters__content').to.not.be.visible
    // Click on the location type label to show the location types.
    browser.click('.location-filters__link')
    browser.pause(1000)
    // Check that there are 3 location types.
    browser.elements('css selector', '#location_filters .form-check-input', function (result) {
      browser.assert.strictEqual(result.value.length, 3)
    })
    // Check that the first location type contains 'Mailing'.
    browser.assert.containsText('#location_filters div[class="form-check"]:nth-of-type(1) .form-check-label', 'Mailing')
    // Check that the second location type contains 'Operating'.
    browser.assert.containsText('#location_filters div[class="form-check"]:nth-of-type(2) .form-check-label', 'Operating')
    // Check that the third location type contains 'Registered'.
    browser.assert.containsText('#location_filters div[class="form-check"]:nth-of-type(3) .form-check-label', 'Registered')
    // Check that all 3 location type checkboxes are checked.
    browser.expect.element('#location_filters div[class="form-check"]:nth-of-type(1) .form-check-input').to.be.selected
    browser.expect.element('#location_filters div[class="form-check"]:nth-of-type(2) .form-check-input').to.be.selected
    browser.expect.element('#location_filters div[class="form-check"]:nth-of-type(3) .form-check-input').to.be.selected
    // Check that the country field exists.
    browser.assert.elementPresent('#Country')
    // Check that the county field exists.
    browser.assert.elementPresent('#County')
    // Check that the town field exists.
    browser.assert.elementPresent('#Town')
    // Check that the postcode field exists.
    browser.assert.elementPresent('#PostCode')
    // Check that the address field exists.
    browser.assert.elementPresent('#Address')
    // Set the search field to 'ICX4' and hit enter, check that there are 2 results.
    browser.setValue('#query', ['ICX4', browser.Keys.ENTER])
    browser.waitForElementPresent('.search-results-list > li:first-child', 10000)
    browser.elements('css selector', '.card', function (result) {
      browser.assert.strictEqual(result.value.length, 2)
    })
    // Set the country field to 'United Kingdom' and hit enter, check that there is 1 result.
    browser.setValue('#Country', ['United Kingdom', browser.Keys.ENTER])
    browser.waitForElementNotPresent('.bar', 10000)
    browser.elements('css selector', '.card', function (result) {
      browser.assert.strictEqual(result.value.length, 1)
    })
    // Check that the registered address contains 'United Kingdom'.
    browser.assert.containsText('.Registered_Country_Name', 'United Kingdom')
    // Set the country field to 'United States' and hit enter, check that there are 0 results.
    browser.clearValue('#Country')
    browser.setValue('#Country', ['United States', browser.Keys.ENTER])
    browser.waitForElementNotPresent('.bar', 10000)
    browser.elements('css selector', '.card', function (result) {
      browser.assert.strictEqual(result.value.length, 0)
    })
    browser.end()
  }
}

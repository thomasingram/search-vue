module.exports = {
  'TablistEntities.vue': function (browser) {
    const devServer = browser.globals.devServerURL

    browser.url(devServer)
    // Check that there are 3 tabs.
    browser.elements('css selector', '.tab-entity', function (result) {
      browser.assert.strictEqual(result.value.length, 3)
    })
    // Check that the first tab contains 'Organisations'.
    browser.assert.containsText('li[class~="tab-entity"]:nth-child(1)', 'Organisations')
    // Check that the second tab contains 'People'.
    browser.assert.containsText('li[class~="tab-entity"]:nth-child(2)', 'People')
    // Check that the third tab contains 'Instruments'.
    browser.assert.containsText('li[class~="tab-entity"]:nth-child(3)', 'Instruments')
    // Check that the first tab is active.
    browser.assert.cssClassPresent('li[class~="tab-entity"]:nth-child(1) > a', 'active')
    // Check that the second and third tab are not active.
    browser.assert.cssClassNotPresent('li[class~="tab-entity"]:not(:nth-child(1)) > a', 'active')
    // Click on the second tab, check that the first tab is not active and the second tab is active.
    browser.click('li[class~="tab-entity"]:nth-child(2) > a')
    browser.assert.cssClassNotPresent('li[class~="tab-entity"]:nth-child(1) > a', 'active')
    browser.assert.cssClassPresent('li[class~="tab-entity"]:nth-child(2) > a', 'active')
    browser.end()
  }
}

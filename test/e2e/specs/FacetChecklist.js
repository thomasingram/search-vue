module.exports = {
  'FacetChecklist.vue': function (browser) {
    const devServer = browser.globals.devServerURL

    browser.url(devServer)
    browser.click('.tab-entity:first-child > a')
    browser.waitForElementPresent('li[class="search-filter"]:first-child', 5000)
    browser.click('.search-filters__list > li:first-child > a')
    browser.pause(5000)
    // Check that the title equals 'Legal Form'.
    browser.expect.element('.facet-checklist-title').text.to.equal('Legal Form')
    // Check that the select all button exists.
    browser.assert.elementPresent('button[class~="facet-checklist-controls__button"]:nth-of-type(1)')
    // Check that the select all button is labelled 'Select all'.
    browser.expect.element('button[class~="facet-checklist-controls__button"]:nth-of-type(1)').text.to.equal('Select all')
    // Check that the clear all button exists.
    browser.assert.elementPresent('button[class~="facet-checklist-controls__button"]:nth-of-type(2)')
    // Check that the clear all button is labelled 'Clear all'.
    browser.expect.element('button[class~="facet-checklist-controls__button"]:nth-of-type(2)').text.to.equal('Clear all')
    // Check that the sort by control exists.
    browser.assert.elementPresent('.facet-sort')
    // Check that the sort by control is labelled 'Sort by'.
    browser.expect.element('.facet-sort__label').text.to.equal('Sort by')
    // Check that there are 4 sort by options.
    browser.elements('css selector', '.facet-sort__select > option', function (result) {
      browser.assert.strictEqual(result.value.length, 4)
    })
    // Check that the sort by control has the option 'A to Z' selected.
    browser.assert.value('.facet-sort__select', 'display_label asc')
    // Check that there are 100 facet checkboxes.
    browser.elements('css selector', '.facet-checklist input', function (result) {
      browser.assert.strictEqual(result.value.length, 100)
    })
    // Check that the first facet checkbox is labelled 'Agricultural Company'.
    browser.assert.containsText('.facet-checklist li:first-child label', 'Agricultural Company')
    // Select the sort by control option 'Z to A', check that the first facet checkbox is labelled 'Unlimited Liability Company'.
    browser.click('.facet-sort__select > option:nth-child(2)')
    browser.assert.containsText('.facet-checklist li:first-child label', 'Unlimited Liability Company')
    // Select the sort by control option 'Smallest to Largest', check that the first facet checkbox is labelled 'Private Limited Liability Company - Gmbh '.
    browser.click('.facet-sort__select > option:nth-child(3)')
    browser.assert.containsText('.facet-checklist li:first-child label', 'Private Limited Liability Company - Gmbh ')
    // Select the sort by control option 'Largest to Smallest', check that the first facet checkbox is labelled 'Branch'.
    browser.click('.facet-sort__select > option:nth-child(4)')
    browser.assert.containsText('.facet-checklist li:first-child label', 'Branch')
    // Select the sort by control option 'A to Z', check that the first facet checkbox is labelled 'Agricultural Company'.
    browser.click('.facet-sort__select > option:nth-child(1)')
    browser.assert.containsText('.facet-checklist li:first-child label', 'Agricultural Company')
    browser.end()
  }
}

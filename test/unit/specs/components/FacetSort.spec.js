import Vue from 'vue'
import store from 'src/store'
import FacetSort from 'src/components/filters/FacetSort.vue'

describe('FacetSort.vue', () => {
  describe('initialisation', () => {
    it('should initialise the component with string sort', () => {
      expect(FacetSort.data()).to.eql({
        sort: 'display_label asc'
      })
    })
  })

  describe('methods', () => {
    let component

    beforeEach(() => {
      const vm = new Vue({
        template: `<facet-sort ref="facetSort"></facet-sort>`,
        components: {
          FacetSort
        },
        store
      }).$mount()

      component = vm.$refs.facetSort
    })

    describe('handleSortChange', () => {
      it('should call $emit method', () => {
        sinon.stub(component, '$emit')
        component.handleSortChange()
        expect(component.$emit).to.have.been.calledWith('sort', 'display_label asc')
        component.$emit.restore()
      })
    })
  })
})

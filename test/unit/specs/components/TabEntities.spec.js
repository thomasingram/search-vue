import Vue from 'vue'
import store from 'src/store'
import TabEntities from 'src/components/TabEntities.vue'

describe('TabEntities.vue', () => {
  describe('methods', () => {
    let component

    beforeEach(() => {
      const vm = new Vue({
        template: `<tab-entities v-bind:entity-type="'organisations'" ref="tabEntities"></tab-entities>`,
        components: {
          TabEntities
        },
        store
      }).$mount()

      component = vm.$refs.tabEntities
    })

    describe('entityName', () => {
      it('should convert the first character to uppercase', () => {
        expect(component.entityName).to.equal('Organisations')
      })
    })

    describe('resultCount', () => {
      it('should update the result count for the entity type', () => {
        expect(component.resultCount).to.equal(0)
        component.$store.commit('UPDATE_HITS_COUNT', {
          tableName: 'search',
          entity: 'organisations',
          count: 100000
        })
        expect(component.resultCount).to.equal(100000)
      })
    })

    describe('setActiveEntityType', () => {
      it('should call commit method with the entity type', () => {
        sinon.stub(store, 'commit')
        component.setActiveEntityType('people')
        expect(store.commit).to.have.been.calledWith('SET_ACTIVE_ENTITY_TYPE', 'people')
        store.commit.restore()
        component.setActiveEntityType('organisations')
      })
    })
  })
})

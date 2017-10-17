<template>
  <div class="card">
    <div class="card-block">
      <results-card-content v-bind:entity-type="entityType" v-bind:identifier="identifier" v-bind:result="result" v-bind:source-count="sourceCount"></results-card-content>

      <button v-if="!isXEntity && (entityType !== 'listed_organisations' && entityType !== 'listed_people' && entityType !== 'listed_objects' && entityType !== 'listed_locations')" class="btn btn-secondary btn-sm" type="button" v-on:click="setXEntity()">Related Entities</button>

      <!-- Case Flow -->
      <div v-show="$store.state.searchInCaseFlow && entityTypeId === window.caseflowEntityType" class="dropdown link-entity" v-bind:data-identifier="identifier">
        <button class="btn btn-secondary btn-sm dropdown-toggle"
                v-bind:id="'link_entity__button_' + identifier"
                type="button"
                v-bind:disabled="entityIsLinked ? 'disabled' : false"
                data-toggle="dropdown"
                aria-expanded="false"
                aria-haspopup="true">
          Link
        </button>
        <div class="dropdown-menu" v-bind:aria-labelledby="'link_entity__button_' + identifier">
          <a v-for="type in entityLinkTypes" class="dropdown-item link-entity__item" href="#" v-bind:data-entity-link-type="type.Id">{{ type.LinkDisplayText }}</a>
        </div>
      </div>

      <!-- Case Flow -->
      <div v-show="$store.state.searchInCaseFlow && entityTypeId === window.caseflowEntityType" class="dropdown research-entity">
        <button class="btn btn-secondary btn-sm dropdown-toggle"
                v-bind:id="'research_entity__button_' + identifier"
                type="button"
                data-toggle="dropdown"
                aria-expanded="false"
                aria-haspopup="true">
          Research
        </button>
        <div class="dropdown-menu" v-bind:aria-labelledby="'research_entity__button_' + identifier">
          <a v-for="type in entityResearchTypes" class="dropdown-item" v-bind:href="type.NavigateUrl + entitySearchQuery" v-bind:target="type.Target">{{ type.Text }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ResultsCardContent from './ResultsCardContent.vue'
import $ from 'jquery'

export default {
  name: 'results-card',
  components: {
    ResultsCardContent
  },
  props: {
    entityType: String,
    identifier: String,
    isXEntity: Boolean,
    resultsObject: Object,
    sourceCount: Number
  },
  data () {
    return {
      window: window,
      entityLinkTypes: window.menuItems !== undefined ? window.menuItems : [],
      entityResearchTypes: window.researchMenuItems !== undefined ? window.researchMenuItems : [],
      matchedEntityKeys: window.matchedEntityKeys
    }
  },
  computed: {
    result () {
      return this.resultsObject
    },
    entityTypeId () {
      return this.$store.state.searchEntities[this.entityType].id
    },
    entitySearchQuery () {
      let query = ''

      switch (this.entityType) {
        case 'organisations':
          query = this.result.Organisation_Full_Name[0]
          break
        case 'people':
          query = this.result.Full_Name[0]
          break
      }

      return encodeURI(query)
    },
    entityIsLinked () {
      if (!this.matchedEntityKeys) {
        return false
      }

      return this.matchedEntityKeys.indexOf(this.identifier) !== -1
    }
  },
  methods: {
    setXEntity () {
      const payload = {
        entity: this.result,
        identifier: this.identifier
      }
      this.$store.commit('SET_X_ENTITY', payload)
      this.$router.push({ path: '/search/xentity' })
    }
  },
  mounted () {
    $(this.$el).find('.link-entity__item').click(event => {
      event.preventDefault()

      const $link = $(event.target)

      const identifier = $link.parents('.link-entity').data('identifier')
      const entityPrimaryKeyField = document.getElementById(window.hdnEntityPrimaryKey)
      entityPrimaryKeyField.setAttribute('value', identifier)

      const entityLinkType = $link.data('entity-link-type')
      const entityLinkTypeField = document.getElementById(window.hdnSelectionTypeId)
      entityLinkTypeField.setAttribute('value', entityLinkType)

      const linkEntityButton = document.getElementById(window.linkMatchButtonId)
      linkEntityButton.click()

      if (this.matchedEntityKeys) {
        window.matchedEntityKeys.push(identifier)
      }
    })
  }
}
</script>

<style lang="scss">
@import '~src/assets/sass/_base.scss';

.card {
  border-radius: .5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .05);
}

.card-block {
  padding: 1rem 1.25rem;
}

.card__group-container {
  border-bottom: 2px solid $silver-light;
  margin-bottom: 1rem;
  padding-bottom: 1rem;

  &:last-of-type {
    border-bottom: 0;
    padding-bottom: 0;
  }

  &--source {
    margin-right: -1.25rem;
    margin-left: -1.25rem;
    padding: 0 1.25rem .75rem;
  }
}

.card__group {
  line-height: 1.333;

  .card__group-container--name &:first-child,
  .card__group-container--address &:first-child {
    margin-bottom: .75rem;
  }

  .card__group-container--name &:only-of-type,
  .card__group-container--address &:only-of-type {
    margin-bottom: 0;
  }

  .card__group-container--meta > & {
    border-right: 2px solid $silver-light;

    &:last-child {
      border-right: 0;
    }
  }
}

.card__label {
  color: $charcoal-dark;
  font-size: .75rem;
  font-weight: 500;

  .card__group:first-child > & {
    display: block;
    font-size: .875rem;
    margin-bottom: .125rem;

    &::after {
      content: normal;
    }
  }

  .card__group-container--name &::after {
    content: ':';
    display: inline;
  }

  .card__group-container--address & {
    display: block;
  }
}

.card__value {
  color: $charcoal-light;
  font-size: .75rem;

  &:link,
  &:visited {
    text-decoration: underline;
  }

  .card__group:first-child > & {
    font-size: 1rem;
  }

  .card__group-container--meta &,
  .card__group-container--meta .card__group:first-child > & {
    color: $charcoal-dark;
    font-size: .875rem;
  }
}
</style>

<template>
  <div class="lander">
    <div class="row">
      <div class="col-6">
        <h2 class="lander__subtitle">Current Records</h2>
        <donut v-bind:data="entityCount"></donut>
      </div>
      <div class="col-6">
        <h2 class="lander__subtitle">Business News</h2>
        <news v-bind:feed="newsFeed"></news>
      </div>
    </div>
  </div>
</template>

<script>
import Donut from './visualisations/Donut.vue'
import News from './News.vue'
import { forEach } from 'lodash'

export default {
  name: 'lander',
  components: {
    Donut,
    News
  },
  data () {
    return {
      entityCount: [],
      newsFeed: {}
    }
  },
  methods: {
    parseEntityCountData (data) {
      forEach(data, (entityCount, entityType) => {
        this.entityCount.push({
          label: entityType,
          value: entityCount
        })
      })
    }
  },
  mounted () {
    this.$store.dispatch('loadEntityCount')
      .done(data => {
        this.parseEntityCountData(data.Data)
      })
      .fail(xhr => {
        const error = JSON.parse(xhr.responseText)
        console.error(error.Message)
      })

    this.$store.dispatch('loadNewsFeed')
      .done(data => {
        this.newsFeed = data
      })
      .fail(xhr => {
        const error = JSON.parse(xhr.responseText)
        console.error(error.Message)
      })
  }
}
</script>

<style lang="scss">
.lander {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.lander__subtitle {
  font-size: 1.75rem;
  font-weight: 300;
  margin-bottom: 1rem;
}
</style>

<template>
  <ul v-if="newsItemsCount > 0" class="news">
    <li v-for="item in newsItems" class="news__item">
      <h3 class="news__title"><a v-bind:href="item.link" target="_blank">{{ item.title }}</a></h3>
      <p class="news__date"><time v-bind:datetime="item.pubDate.substring(0, 10)">{{ item.pubDate.substring(0, 10) | formatDate }}</time></p>
    </li>
  </ul>
</template>

<script>
const NEWS_ITEMS_LIMIT = 8

export default {
  name: 'news',
  props: {
    feed: Object
  },
  computed: {
    newsItemsCount () {
      return this.feed.items ? this.feed.items.length : 0
    },
    newsItems () {
      return this.feed.items ? this.feed.items.slice(0, NEWS_ITEMS_LIMIT) : []
    }
  }
}
</script>

<style lang="scss">
.news {
  list-style-type: none;
  margin-bottom: 0;
  padding-left: 0;
}

.news__item {
  margin-bottom: .5rem;
}

.news__title {
  font-size: .875rem;
  margin-bottom: .25rem;
}

.news__date {
  color: #666;
  font-size: .75rem;
  margin-bottom: 0;
}
</style>

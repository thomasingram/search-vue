<template>
  <div class="row no-gutters justify-content-center search-results-info">
    <div class="col-8">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'search-results-info'
}
</script>

<style lang="scss">
.search-results-info {
  margin-top: 4.5rem;
  text-align: center;

  h2 {
    font-size: 1.5rem;
  }
}
</style>

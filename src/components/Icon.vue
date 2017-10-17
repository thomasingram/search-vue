<template>
  <svg v-bind:class="className">
    <use v-bind:xlink:href="glyph" />
  </svg>
</template>

<script>
export default {
  name: 'icon',
  props: {
    className: String,
    glyph: String
  }
}
</script>

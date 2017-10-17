<template>
  <div class="loader"></div>
</template>

<script>
export default {
  name: 'loader'
}
</script>

<style lang="scss">
@import '~src/assets/sass/_base.scss';

.loader {
  background-color: inherit;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
}

.loader::after {
  animation: spin 1s infinite linear;
  border: 2px solid rgba(0, 0, 0, .15);
  border-top: 3px solid $cobalt;
  border-radius: 100%;
  content: '';
  height: 60px;
  margin: auto;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 60px;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  } to {
    transform: rotate(360deg);
  }
}
</style>

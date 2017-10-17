<template>
  <button class="btn btn-primary feedback-button" type="button" data-target="#feedback_form" data-toggle="modal">Feedback</button>
</template>

<script>
export default {
  name: 'feedback-button'
}
</script>

<style lang="scss">
@import '~src/assets/sass/_base.scss';

.feedback-button {
  font-weight: 700;
  position: fixed;
  top: 45%;
  right: -2.5rem;
  transform: rotate(-90deg);
  z-index: 9999;
}
</style>

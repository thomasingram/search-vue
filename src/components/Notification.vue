<template>
  <div v-show="notificationIsVisible" class="notification">
    <p class="notification__text" v-html="notificationText"></p>
    <button class="notification__close" type="button" aria-label="Close" v-on:click="handleCloseClick()">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'notification',
  data () {
    return {
      notificationIsVisible: false,
      notificationText: ''
    }
  },
  methods: {
    showNotification () {
      this.notificationIsVisible = true
    },
    hideNotification () {
      this.notificationIsVisible = false
    },
    handleCloseClick () {
      this.hideNotification()
    }
  },
  mounted () {
    const vm = this

    $(document)
      .ajaxError((event, jqXHR) => {
        vm.notificationText = `The server returned a <span class="notification__response">${jqXHR.status} ${jqXHR.statusText}</span>. Please try again, and if it still doesn&rsquo;t work, let us know.`
        vm.showNotification()
      })
      .ajaxStart(() => {
        vm.hideNotification()
      })
  }
}
</script>

<style lang="scss">
@import '~src/assets/sass/_base.scss';

.notification {
  background-color: lighten($cardinal, 45%);
  border: 1px solid lighten($cardinal, 40%);
  border-radius: .3rem;
  opacity: .8;
  padding: .938rem;
  position: fixed;
  top: 10px;
  right: 10px;
  width: 18.75rem;
  z-index: 9999;
}

.notification__text {
  margin-bottom: 0;
}

.notification__response {
  background-color: $cardinal;
  border-radius: .25rem;
  color: white;
  font-family: monospace;
  font-size: 90%;
  padding: .2rem .4rem;
}

.notification__close {
  background-color: transparent;
  border: 0;
  color: $charcoal-light;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1;
  padding: 0;
  position: absolute;
  top: 0;
  right: 7px;

  &:hover,
  &:focus,
  &:active {
    color: $charcoal-mid;
    outline: none;
  }
}
</style>

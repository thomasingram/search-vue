<template>
  <div id="app">
    <notification></notification>

    <router-view></router-view>

    <feedback-form></feedback-form>

    <nprogress-container></nprogress-container>
  </div>
</template>

<script>
import FeedbackForm from './components/feedback/FeedbackForm.vue'
import Notification from './components/Notification.vue'
import store from './store'
import $ from 'jquery'
import { replace } from 'lodash'
import Vue from 'vue'
import NprogressContainer from 'vue-nprogress/src/NprogressContainer.vue'

/* Global filters. */

Vue.filter('commafy', function (value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

Vue.filter('replaceAll', function (value, pattern, replacement) {
  if (!value) return ''
  return replace(value, new RegExp(pattern, 'g'), replacement)
})

Vue.filter('idToSourceName', function (value) {
  var target = store.state.sourceIDs[value]
  if (target !== undefined) {
    return target
  } else {
    return value
  }
})

/**
 * Vue filter to convert a date from YYYY-MM-DD to DD/MM/YYYY.
 *
 * @param {String} value The date to convert
 */
Vue.filter('formatDate', function (value) {
  if (!value) return ''

  let date

  if (value.indexOf('-') !== -1) {
    const dateSplit = value.split('-')
    date = dateSplit[2] + '/' + dateSplit[1] + '/' + dateSplit[0]
  } else {
    const year = value.substring(0, 4)
    const month = value.substring(4, 6)
    const day = value.substring(6, 8)
    date = day + '/' + month + '/' + year
  }

  return date
})

/**
 * Vue filter to remove the country ISO code from an address if the country name exists.
 *
 * @param {String} address The address to modify
 */
Vue.filter('removeCountryIsoCodeIfCountryNameExists', function (address) {
  const hasCountryNameAndCountryIsoCode = address.indexOf('Country_Name') !== -1 && address.indexOf('Country_ISO_Code') !== -1
  if (!hasCountryNameAndCountryIsoCode) {
    return
  }

  return replace(address, /, <span class="\w+_Country_ISO_Code">[A-Z]{2}<\/span>/i, '')
})

/**
 * Vue filter to return the field label if the field value is equal to 'Yes'.
 *
 * @param {String} value The field value
 * @param {String} label The field label
 */
Vue.filter('returnLabelIfValueEqualsYes', function (value, label) {
  return value === 'Yes' ? label : ''
})

/**
 * Vue filter to remove HTML tags from strings.
 *
 * @param {String} value The value to modify
 */
Vue.filter('stripTags', function (value) {
  return value.replace(/<.+?>/g, '')
})

export default {
  name: 'app',
  components: {
    FeedbackForm,
    Notification,
    NprogressContainer
  },
  mounted () {
    // Control the progress bar.
    $(document)
      .ajaxStart(() => {
        this.$nprogress.start()
      })
      .ajaxStop(() => {
        this.$nprogress.done()
      })
  }
}
</script>

<style lang="scss">
@import '~src/assets/sass/_base.scss';

body {
  background-color: $athensgray;
  -webkit-font-smoothing: antialiased;
}

@media (min-width: 1600px) {
  .container {
    width: 1540px;
  }
}

/* NProgress */
.nprogress-container {
  min-height: 5px;
  position: fixed !important;
  top: 0;
  width: 100%;
  z-index: 9999;
}

#nprogress .bar {
  background: $azure;
}

#nprogress .peg {
  box-shadow: 0 0 10px $azure, 0 0 5px $azure;
}
</style>

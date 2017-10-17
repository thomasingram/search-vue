<template>
  <div>
    <feedback-button></feedback-button>

    <div class="modal fade" id="feedback_form" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="feedback_form_title">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="feedback_form_title">Feedback</h5>
            <button class="close" type="button" data-dismiss="modal" aria-label="Close" v-on:click="handleCloseClick()">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body">
            <div v-if="successMessageIsVisible" class="alert alert-success" role="alert">
              <strong>Thank you</strong> Your feedback has been sent.
            </div>
            <div v-if="errorMessageIsVisible" class="alert alert-danger" role="alert">
              <strong>We're sorry</strong> Your feedback was not able to be sent. Please try again later.
            </div>
            
            <form>
              <div class="form-group">
                <label for="name" class="form-control-label">Name</label>
                <input class="form-control" id="name" type="text" v-model="fields.name">
              </div>

              <div class="form-group">
                <label for="subject" class="form-control-label">What is your feedback related to?</label>
                <select class="custom-select" id="subject" v-model="fields.subject">
                  <option value="1">Facets (data)</option>
                  <option value="2">Results (data)</option>
                  <option value="3">Using the interface</option>
                  <option value="4">Labelling</option>
                  <option value="5">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label for="comments" class="form-control-label">Comments</label>
                <textarea class="form-control" id="comments" rows="5" v-model="fields.comments"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" type="button" v-on:click="handleSendClick()">Send</button>
            <button class="btn btn-secondary" type="button" data-dismiss="modal" v-on:click="handleCloseClick()">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FeedbackButton from './FeedbackButton.vue'

export default {
  name: 'feedback-form',
  components: {
    FeedbackButton
  },
  data () {
    return {
      fields: {},
      successMessageIsVisible: false,
      errorMessageIsVisible: false
    }
  },
  methods: {
    handleSendClick () {
      this.hideMessages()

      const payload = {
        name: this.fields.name,
        subject: this.fields.subject,
        comments: this.fields.comments
      }

      this.$store.dispatch('saveFeedbackData', payload)
        .done(() => {
          this.successMessageIsVisible = true
          this.clearFields()
        })
        .fail(() => {
          this.errorMessageIsVisible = true
        })
    },
    handleCloseClick () {
      this.hideMessages()
    },
    hideMessages () {
      this.successMessageIsVisible = false
      this.errorMessageIsVisible = false
    },
    clearFields () {
      this.fields = {}
    }
  }
}
</script>

<style lang="scss">
@import '~src/assets/sass/_base.scss';

.custom-select {
  display: block;
}

.close {
  color: $charcoal-light;
  font-size: 2rem;
  font-weight: 300;
  opacity: 1 !important;
  position: relative;
  top: -3px;
  right: 5px;

  &:hover,
  &:focus,
  &:active {
    color: $charcoal-mid;
    outline: none;
  }
}
</style>

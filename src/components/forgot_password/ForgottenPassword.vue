<!--This component is where the user is taken when they click 'Forgot Password'. From here they enter their email
which will be sent a reset link. When they open the reset link, it will open the ResetPassword component-->

<template>
  <div class="fancy-background"
       tabindex="-1">
    <v-card
      color="#1f4685"
      elevation="12"
      class="reset-password-card">
      <v-card-title dark class="reset-password-card-title justify-center"><p class="normal-word-break">Forgotten your password?</p></v-card-title>
      <v-card-text v-if="!sent">
        <p class="white--text">Enter your email address and we'll send you password reset instructions.</p>
        <v-form
          ref="form"
          class="text-align-center"
          v-model="valid"
          lazy-validation
          @enter="submit"
        >
          <v-text-field
            v-model="email"
            solo
            label="E-mail"
            prepend-inner-icon="mdi-email"
            :rules="emailRule"
          ></v-text-field>
          <v-btn style="margin-right: 1vw" @click="$router.push({name:'login'})">
            Back
          </v-btn>
          <v-btn
            class="mr-4"
            type="submit"
            @click="submit"
          > Send </v-btn>
        </v-form>
      </v-card-text>
      <v-card-text v-else>
        <p class="white--text">You should receive an email shortly. If you don't, try resending the instructions, and checking your junk email folder.</p>
        <v-form
          class="text-align-center">
          <v-btn
            ref="reset-button"
            class="mr-4"
            :loading="resetButtonLoading"
            type="submit"
            @click="submit"
          >
            <div v-if="successfullySent"><v-icon>mdi-check</v-icon> Sent </div>
            <div v-else> Resend </div>
          </v-btn>
        </v-form>

      </v-card-text>
      <v-slide-x-transition>
        <v-alert type="error" v-if="error" >
          {{errorMessage}}
        </v-alert>
      </v-slide-x-transition>
    </v-card>

  </div>

</template>

<script>
import api from "@/api/api";
import validation from "@/common/validation";


export default {
  name: "ForgottenPassword",
  title: '17 SQN | Forgotten Password',
  data: () => ({
    sent: false,
    valid: true,
    email: null,
    emailRule: validation.userRules.emailRules,
    resetButtonLoading: false,
    sendButtonLoading: false,
    successfullySent: false,
    resetPayload: null,
    stopFurtherSubmits: false,
    error: false,
    errorMessage: "Something went wrong",
  }),

  methods: {

    validate () {
      return this.$refs.form.validate()
    },

    async submit(event) {
      event.preventDefault();
      if (this.stopFurtherSubmits) {
        return;
      }
      this.stopFurtherSubmits = true;
      this.sendButtonLoading = true;
      try {
        if (this.sent) {
          this.resetButtonLoading = true;
          await api.resetPassword.sendResetEmail(this.email);
          this.resetButtonLoading = false;
          this.successfullySent = true;
          setTimeout(() => {
            this.successfullySent = false;
          }, 1000);

        } else {
          let isValid = this.validate();
          if (isValid) {
            await api.resetPassword.sendResetEmail(this.email);
            this.sent = true;
          }
        }
      } catch (err) {
        if(err.response.data.length > 0) {
          this.errorMessage = err.response.data;
        } else {
          this.errorMessage = "Something went wrong";
        }
        this.error = true;
        setTimeout(() => {
          this.error = false;
        }, 3000);
      }
      this.sendButtonLoading = false;
      this.stopFurtherSubmits = false;
    }
  }
}
</script>

<style scoped>
@import '../../../public/styles/reset-password.css';
</style>
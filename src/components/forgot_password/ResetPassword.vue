<template>
  <div class="fancy-background"
       tabindex="-1"
       @keyup.enter="submit">
    <v-card
      color="#1f4685"
      elevation="12"
      class="reset-password-card">
      <v-card-title dark class="reset-password-card-title justify-center"><p class="normal-word-break">Reset Password</p></v-card-title>
      <v-card-text v-if="validToken">
        <v-form
          ref="form"
          class="text-align-center"
          v-model="valid"
          lazy-validation
          @enter="submit"
        >
          <v-text-field
            solo
            v-model="password"
            :rules="rules.passwordRules"
            label="Enter new password"

            :type="value ? 'password' : 'text'"
            prepend-inner-icon="mdi-lock"
            required
          >
            <template v-slot:append>
              <v-btn icon @click="() => (value = !value)" tabindex="-1">
                <v-icon v-if="value" >mdi-eye</v-icon>
                <v-icon v-if="!value" >mdi-eye-off</v-icon>
              </v-btn>
            </template>
          </v-text-field>

          <v-text-field
            solo
            v-model="confirmPassword"
            :rules="passwordConfirmationRules"
            label="Confirm new password"

            :type="value1 ? 'password' : 'text'"
            prepend-inner-icon="mdi-lock"
            required
          >
            <template v-slot:append>
              <v-btn icon @click="() => (value1 = !value1)" tabindex="-1">
                <v-icon v-if="value1" >mdi-eye</v-icon>
                <v-icon v-if="!value1" >mdi-eye-off</v-icon>
              </v-btn>
            </template>
          </v-text-field>


          <v-btn
            class="mr-4"
            type="submit"
            :loading="submitButtonLoading"
            @click="submit"
          > Submit </v-btn>
        </v-form>

        <v-slide-x-transition>
          <v-alert type="error" v-if="error" >
            {{errorMessage}}
          </v-alert>
        </v-slide-x-transition>
      </v-card-text>

      <v-card-text v-else class="text-align-center">
        <p class="white--text">Your reset password request has expired.</p>
        <v-btn @click="returnToLogin" small dark text>Return to login page</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import api from "@/api/api";
import validation from "@/common/validation";

export default {
  name: "ResetPassword",

  title: "17 SQN | Reset Password",

  mounted() {
    this.verifyToken();
  },

  data() {
    return {
      valid: true,
      submitButtonLoading: false,
      validToken: true,

      error: false,
      errorMessage: "Failed to update password",

      email: null,
      token: null,

      password: '',
      confirmPassword: '',

      value: true,
      value1: true,

      rules: validation.userRules

    }
  },

  computed: {
    passwordConfirmationRules() {
      return [
        (v) => !!v || 'Password is required',
        (v) => (v === this.password) || 'Passwords must match',
      ]
    },
  },

  methods: {
    validate () {
      return this.$refs.form.validate()
    },

    async submit(event) {
      event.preventDefault();
      let isValid = this.validate();
      if (isValid) {
        this.submitButtonLoading = true;
        let payload = {
          email: this.email,
          token: this.token,
          password: this.password
        };
        try {
          await api.resetPassword.updatePassword(payload);
          await this.$router.push({name: 'login'});
        } catch (err) {
          this.error = true;
          this.submitButtonLoading = false;
          if (err.response.data) {
            this.errorMessage = err.response.data;
          } else {
            this.errorMessage = "Failed to update password";
          }
        }
      }
    },

    async verifyToken() {
      this.email = this.$route.query.email;
      this.token = this.$route.query.token;
      let payload = {
        email: this.email,
        token: this.token
      }
      try {
        await api.resetPassword.verifyToken(payload);
      } catch {
        this.validToken = false;
      }
    },

    returnToLogin() {
      this.$router.push({name: 'login'});
    }
  }
}
</script>

<style scoped>
@import '../../../public/styles/reset-password.css';

</style>
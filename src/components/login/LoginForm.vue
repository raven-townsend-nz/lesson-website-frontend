<template>
  <div class="login-form-contents">
    <p class="login-register-header">Sign in</p>
    <v-form
        ref="form"
        v-model="valid"
        lazy-validation
    >
      <v-text-field
          v-model="email"
          solo
          :rules="emailRules"
          label="E-mail"
          prepend-inner-icon="mdi-email"
          required
      ></v-text-field>
      <v-text-field
          autocomplete="current-password"
          solo
          v-model="password"
          :rules="passwordRules"
          label="Enter password"

          @keydown.native.enter="submit"
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

      <v-slide-x-transition>
        <v-alert type="error" v-if="error" >
          Incorrect email or password
        </v-alert>
      </v-slide-x-transition>

      <v-btn
          :disabled="!valid"
          :loading="signInButtonLoading"
          class="mr-4"
          @click="submit"
      >
        Sign in
      </v-btn>
      <br>
      <br>
      <div class="hr-sect">OR</div>
      <br>
      <v-btn
          class="mr-4"
          @click="showRegister"
          style="background: #1976d2; color: white;"
      >
        Sign up
      </v-btn>
      <br>
      <br>
      <v-btn @click="forgottenPassword" small dark text>Forgotten password?</v-btn>
    </v-form>
  </div>
</template>

<script>
import api from "@/api/api";
import storage_util from "../../common/storage_util";

export default {
  name: "LoginForm",
  title: '17 SQN | Log in',
  data: () => ({
    error: false,
    valid: false,
    value: true,
    signInButtonLoading: false,
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Password is required',
    ],
  }),

  methods: {
    validate () {
      return this.$refs.form.validate()
    },

    submit() {
      this.signInButtonLoading = true;
      let isValid = this.validate();
      if (isValid) {
        let payload = {
          email: this.email,
          password: this.password
        }

        api.loginRegister.login(payload)
            .then( res => {
              storage_util.setUser(res.data.userId, res.data.token, res.data)
              this.$router.push({ path: '/home'})
            }
        ).catch(err => {
          if (err.response.status === 400) {
            this.showError();
          }
        })
      }
      this.signInButtonLoading = false;
    },

    showRegister() {
      this.$parent.switchToRegister();
    },

    showError() {
      this.error = true;
      setTimeout( () => {
        this.error = false;
      }, 4000)
    },

    forgottenPassword() {
      this.$router.push({name: "forgottenPassword"});
    }
  },
}
</script>

<style scoped>
@import '../../../public/styles/login-register.css';
</style>
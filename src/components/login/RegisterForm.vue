<template>
  <div>
    <div class="register-form-contents">
      <p class="login-register-header">Sign up</p>
      <v-form
          ref="form"
          v-model="valid"
          lazy-validation
      >
        <div class="double">
          <div class="double-width">
            <v-text-field
                v-model="firstName"
                solo
                :rules="rules.firstNameRules"
                label="First Name"
                prepend-inner-icon="mdi-account-box"
                required
            ></v-text-field>
          </div>

          <div class="double-width">
            <v-text-field
                v-model="lastName"
                solo
                :rules="rules.lastNameRules"
                label="Last Name"
                prepend-inner-icon="mdi-account-box-outline"
                required
            ></v-text-field>
          </div>
        </div>

        <div class="double">
          <div class="double-width">
            <v-text-field
                v-model="email"
                solo
                :rules="rules.emailRules"
                label="E-mail"
                prepend-inner-icon="mdi-email"
                required
            ></v-text-field>
          </div>

          <div class="double-width">
            <v-text-field
                ref="slackId"
                solo
                v-model="slackId"
                :rules="slackIdRules"
                label="Slack ID"
                prepend-inner-icon="mdi-slack"
                required
            >
              <template v-slot:append>
                <v-btn icon @click="slackIdHelp()" tabindex="-1">
                  <v-icon >mdi-help-circle</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </div>
        </div>

        <v-text-field
            solo
            v-model="password"
            :rules="rules.passwordRules"
            label="Enter password"

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
            label="Confirm password"

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

        <v-slide-x-transition>
          <v-alert type="error" v-if="error" >
            {{ errorMessage }}
          </v-alert>
        </v-slide-x-transition>

        <v-btn
            :disabled="!valid"
            class="mr-4"
            :loading="submitButtonLoading"
            @click="signUp"
            style="margin-right: 2.5vw;"
        >
          Sign up
        </v-btn>
        <v-btn
            class="mx-2"
            fab
            small
            style="float: left"
            @click="showLogIn"
        >
          <v-icon dark>
            mdi-arrow-left
          </v-icon>
        </v-btn>

      </v-form>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";
import storage_util from "../../common/storage_util";
import validation from "../../common/validation";

export default {
  name: "RegisterForm",
  title: '17 SQN | Register',
  data: () => ({
    error: false,
    errorMessage: 'Unable to register',
    valid: false,
    value: true,
    value1: true,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    slackId: '',
    rules: validation.userRules,
    triedSlackIds: [],
    submitButtonLoading: false
  }),

  computed: {
    passwordConfirmationRules() {
      return [
        (v) => !!v || 'Password is required',
        (v) => (v === this.password) || 'Passwords must match',
      ]
    },
    slackIdRules() {
      return [
        (v) => !!v || 'Slack ID is required',
          // form invalid if the user tries to re-use a previously invalidated slackId
        (v) => !this.triedSlackIds.includes(v) || "Slack ID doesn't exist in ATC workspace",
      ]
    }
  },

  methods: {
    validate () {
      return this.$refs.form.validate();
    },
    registPayload() {
      return {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        slackId: this.slackId,
      }
    },

    signUp() {
      let isValid = this.validate();
      if (isValid) { // if form is valid
        this.submitButtonLoading = true;
        validation.slackIdValidation(this.slackId).then(res => {
          if(!res){
            this.triedSlackIds.push(this.slackId);
            this.$refs.slackId.validate();
            throw "Slack ID doesn't exist";
          }
        }).then(() => {
          let payload = this.registPayload();
          return api.loginRegister.register(payload)
        }).then(() => {
          return api.loginRegister.login({
            email: this.email,
            password: this.password,
          })
        }).then(res => {
          storage_util.setUser(res.data.userId, res.data.token, res.data);
          return api.slackApi.registerMessage(this.slackId, this.firstName + " " + this.lastName);
        }).then(() => {
          this.$router.push({ path: '/home'}); // finally push to home page
        }).catch(err => {
          this.submitButtonLoading = false;
          if (typeof(err) === 'string') {
            this.showError(err);
          } else {
            this.showError(err.response.data)
            console.log(err.response.data);
          }
        })

      }
    },

    showLogIn() {
      this.$parent.switchToLogIn();
    },

    showError(msg) {
      this.errorMessage = msg;
      this.error = true;
      setTimeout( () => {
        this.error = false;
      }, 4000)
    },

    slackIdHelp() {
      window.open("https://www.workast.com/help/articles/61000165203/");
    }
  },


}
</script>

<style scoped>

</style>
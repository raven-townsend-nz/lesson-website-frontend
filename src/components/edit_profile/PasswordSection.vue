<template>
  <v-card class="edit-profile-card form">
    <v-card-title
      class="edit-profile-header">
      <p class="centre" >Change Password</p>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-text-field
          solo
          v-model="currentPassword"
          :rules="currentPasswordRules"
          :label="this.editSelf ? 'Enter current password' : 'Enter your password'"
          :type="hidePassword1 ? 'password' : 'text'"
          prepend-inner-icon="mdi-lock"
          required
        >
          <template v-slot:append>
            <v-btn icon @click="() => (hidePassword1 = !hidePassword1)" tabindex="-1">
              <v-icon v-if="hidePassword1" >mdi-eye</v-icon>
              <v-icon v-if="!hidePassword1" >mdi-eye-off</v-icon>
            </v-btn>
          </template>
        </v-text-field>

        <v-text-field
          solo
          v-model="password"
          :rules="rules.passwordRules"
          :label="this.editSelf ? 'Enter new password' : `Enter user's new password`"
          :type="hidePassword2 ? 'password' : 'text'"
          prepend-inner-icon="mdi-pencil"
          required
        >
          <template v-slot:append>
            <v-btn icon @click="() => (hidePassword2 = !hidePassword2)" tabindex="-1">
              <v-icon v-if="hidePassword2" >mdi-eye</v-icon>
              <v-icon v-if="!hidePassword2" >mdi-eye-off</v-icon>
            </v-btn>
          </template>
        </v-text-field>

        <v-text-field
          solo
          v-model="confirmPassword"
          :rules="passwordConfirmationRules"
          :label="this.editSelf ? 'Confirm new password' : `Confirm user's new password`"
          :type="hidePassword3 ? 'password' : 'text'"
          prepend-inner-icon="mdi-pencil"
          required
        >
          <template v-slot:append>
            <v-btn icon @click="() => (hidePassword3 = !hidePassword3)" tabindex="-1">
              <v-icon v-if="hidePassword3" >mdi-eye</v-icon>
              <v-icon v-if="!hidePassword3" >mdi-eye-off</v-icon>
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
          @click="updatePassword"
          style="margin-right: 2.5vw;"
        >
          Save password
        </v-btn>
        <v-btn
          class="mx-2"
          fab
          small
          style="float: left"
          @click="showProfile"
        >
          <v-icon dark>
            mdi-arrow-left
          </v-icon>
        </v-btn>

      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>

import validation from "@/common/validation";
import api from "@/api/api";
import events from "@/common/events";


export default {
  name: "PasswordSection",

  props: ["userIdToEdit", "editSelf"], // set editSelf true if the user is editing their own profile

  data: () => ({
    error: false,
    errorMessage: 'Unable to register',
    valid: false,
    snackbar: false,
    currentPassword: '',
    password: '',
    confirmPassword: '',
    hidePassword1: true,
    hidePassword2: true,
    hidePassword3: true,
    rules: validation.userRules,
    currentPasswordRules: [
      v => !!v || 'Current password is required'
    ],
    currentDetails: null,
  }),

  mounted() {
    api.crudUsers.getUser(this.userIdToEdit)
      .then(res => {
        this.setUserDetails(res.data);
      });
  },

  computed: {
    passwordConfirmationRules() {
      return [
        (v) => !!v || 'Password is required',
        (v) => (v === this.password) || 'Passwords must match',
      ]
    }
  },

  methods: {

    setUserDetails(user) {
      this.currentDetails = user;
      this.currentDetails["id"] = this.userIdToEdit;
    },

    showProfile() {
      const event = new Event(events.SWITCH_TO_PROFILE);
      window.dispatchEvent(event);
    },

    validate () {
      return this.$refs.form.validate()
    },

    closeDialog() {
      const event = new Event(events.CLOSE_DIALOG);
      window.dispatchEvent(event);
    },

    updatePassword() {
      let isValid = this.validate();
      if (isValid) {
        let payload = this.currentDetails;
        payload.password = this.password;
        payload.currentPassword = this.currentPassword;

        api.crudUsers.editUser(this.currentDetails.id, payload)
          .then(() => {
            const event = new Event(events.PASSWORD_UPDATED);
            window.dispatchEvent(event);
            this.closeDialog();
          }).catch(err => {
            console.log(err);
            this.error = true;
            this.errorMessage = err.response.data;
        })
      }
    },

    clearForm() {
      this.$refs.form.reset();
    }
  }
}
</script>

<style scoped>
@import '../../../public/styles/login-register.css';
@import '../../../public/styles/edit-profile.css';

</style>
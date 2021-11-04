<template>
  <v-card class="edit-profile-card form">
    <v-card-title
      class="edit-profile-header">

      <p class="centre">Edit Profile</p>
    </v-card-title>
    <v-card-title v-if="loggedInAsDgaa && editSelf" style="color: white">
      Sorry, you cannot edit the DGAA account
    </v-card-title>
    <v-card-text v-else>
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
              solo
              v-model="slackId"
              :rules="rules.slackIdRules"
              label="Slack ID"
              prepend-inner-icon="mdi-slack"
              required
            ></v-text-field>
          </div>
        </div>

        <v-btn
          v-if="showGrantAdminButton"
          :disabled="justChangedToAdmin"
          solo
          style="background: #1976d2; color: white;"
          class="save-button"
          width="100%"
          @click="upgradeUser">
          Grant training officer permissions
        </v-btn>

        <v-btn
          v-if="!editSelf && loggedInAsDgaa && isAdmin"
          solo
          style="background: #bf2a2a; color: white;"
          class="save-button"
          width="100%"
          @click="downgradeUser">
          Revoke training officer permissions
        </v-btn>

        <v-btn
          solo
          style="background: #1976d2; color: white;"
          class="save-button"
          width="100%"
          @click="showPassword">
          Change password
        </v-btn>

        <v-slide-x-transition>
          <v-alert type="error" v-if="error" >
            {{ errorMessage }}
          </v-alert>
        </v-slide-x-transition>
        <v-btn
          :disabled="!valid || noChanges"
          class="mr-4"
          @click="updateUser"
        >
          Save changes
        </v-btn>

      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>

import validation from "@/common/validation";
import api from "@/api/api";
import storage_util from "@/common/storage_util";
import events from "@/common/events";


export default {
  name: "RegisterForm",

  props: ["userIdToEdit", "editSelf"],

  data: () => ({
    error: false,
    errorMessage: 'Unable to save changes',
    valid: false,
    value: true,
    value1: true,
    firstName: '',
    lastName: '',
    email: '',
    slackId: '',
    isAdmin: null,
    rules: validation.userRules,
    currentDetails: '',
    justChangedToAdmin: false, // in order to disable 'grant admin' button after you click it
    loggedInAsDgaa: false
  }),

  mounted() {
    this.loggedInAsDgaa = (storage_util.getUserDetails().email === process.env.VUE_APP_DGAA_EMAIL);
    api.crudUsers.getUser(this.userIdToEdit)
      .then(res => {
        this.setUserDetails(res.data);
      });
  },

  computed: {
    noChanges() {
      let noChanges = true;
      if (this.firstName !== this.currentDetails.firstName) {
        noChanges = false;
      }
      if (this.lastName !== this.currentDetails.lastName) {
        noChanges = false;
      }
      if (this.email !== this.currentDetails.email) {
        noChanges = false;
      }
      if (this.slackId !== this.currentDetails.slackId) {
        noChanges = false;
      }
      return noChanges;
    },

    showGrantAdminButton() {
      /* Grant admin should always be hidden if a user is editing themself */
      if (this.editSelf) {
        return false;

      /* If a user is not an admin the button should show */
      } else if (!this.isAdmin) {
        return true

      /* User was just made admin, so the button should stay (but be disabled) unless current user is DGAA (in which
         case the button will disappear to be replaced by a 'revoke' button */
      } else if (this.justChangedToAdmin && !this.loggedInAsDgaa) {
        return true;
      }

      return false
    }
  },

  methods: {
    validate () {
      return this.$refs.form.validate()
    },

    setUserDetails(user) {
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.email = user.email;
      this.slackId = user.slackId;
      this.isAdmin = user.isAdmin;
      this.currentDetails = user;
      if (user.id) {
        this.currentDetails["id"] = user.id;
      } else {
        this.currentDetails["id"] = this.userIdToEdit;
      }
    },

    closeDialog() {
      const event = new Event(events.CLOSE_DIALOG);
      window.dispatchEvent(event);
    },

    userPayload(){
      return {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        slackId: this.slackId,
        isAdmin: this.isAdmin
      }
    },

    updateUser() {
      let isValid = this.validate();
      if (isValid) {
        let payload = this.userPayload();

        api.crudUsers.editUser(this.currentDetails.id, payload)
          .then(() => {
            storage_util.updateUser();
            const event = new Event(events.PROFILE_UPDATED);
            window.dispatchEvent(event);
            if (!this.editSelf) {
              this.updateEditedUser(payload);
            }
            this.closeDialog();
          }).catch(err => {
            console.log(err);
            this.error = true;
            if (err.response.data.length > 0) {
              this.errorMessage = err.response.data;
            } else {
              this.errorMessage = "Unable to save changes";
            }
        })
      }
    },

    showError(msg) {
      if (msg.length > 0) { // make sure there is actually a message from the backend to display
        this.errorMessage = msg;
      } else {
        this.errorMessage = "Unable to save changes";
      }
      this.error = true;
      setTimeout( () => {
        this.error = false;
      }, 4000)
    },

    showPassword() {
      const event = new Event(events.SWITCH_TO_PASSWORD);
      window.dispatchEvent(event);
    },

    clearForm() {
      this.valid = true;
      this.error = '';
      this.errorMessage = "Unable to save changes";
      this.value = true;
      this.value1 = true;
      this.justChangedToAdmin = false;
    },

    upgradeUser() {
      api.crudAdmins.upgradeUser(this.currentDetails.id).then(() => {
        const event = new Event(events.PROFILE_UPDATED);
        window.dispatchEvent(event);
        this.isAdmin = true;
        this.justChangedToAdmin = true;
        const payload = this.userPayload();
        this.updateEditedUser(payload);
      })
    },

    downgradeUser() {
      api.crudAdmins.downgradeUser(this.currentDetails.id).then(() => {
        const event = new Event(events.PROFILE_UPDATED);
        window.dispatchEvent(event);
        this.isAdmin = false;
        this.justChangedToAdmin = false;
        const payload = this.userPayload();
        this.updateEditedUser(payload);
      })
    },

    updateEditedUser(payload) {
      payload.id = this.currentDetails.id;
      this.$emit('userUpdated', payload)
    }
  },
}

</script>

<style scoped>
@import '../../../public/styles/login-register.css';
@import '../../../public/styles/edit-profile.css';
</style>
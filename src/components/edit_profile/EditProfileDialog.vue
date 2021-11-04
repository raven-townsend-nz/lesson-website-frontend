<template>
  <v-overlay :opacity="0.8" v-model="dialog">
    <v-dialog v-model="dialog"
              @close="close"
              content-class="edit-profile-dialog"
              transition="dialog-top-transition"
              max-width="600">
      <v-btn
          icon
          dark
          style="float: right; z-index: 1; margin: 3vh 3vh 3vh 0;"
          @click="close"
      >
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
      <transition name="slide-fade"
                  mode="out-in">

        <ProfileSection v-if="!changePassword"
                        ref="profileSection"
                        :user-id-to-edit="userIdToEdit"
                        @userUpdated="updateEditedUser"
                        :edit-self="editSelf"/>
        <PasswordSection v-if="changePassword"
                         ref="passwordSection"
                         :user-id-to-edit="userIdToEdit"
                         :edit-self="editSelf"/>
      </transition>
    </v-dialog>
  </v-overlay>
</template>

<script>
import ProfileSection from "@/components/edit_profile/ProfileSection";
import PasswordSection from "@/components/edit_profile/PasswordSection";
import events from "@/common/events";

export default {
  name: "EditProfileDialog",
  props: ["editSelf"],

  data: () => ({
    dialog: false,
    changePassword: false,
    userIdToEdit: 0
  }),

  components: {ProfileSection, PasswordSection},

  watch: {
    dialog (val) {
      if (!val) {
        this.resetEditProfile();
      }
    }
  },

  mounted() {
    window.addEventListener(events.USER_UPDATED, this.resetEditProfile);
    window.addEventListener(events.SWITCH_TO_PROFILE, this.switchToProfile);
    window.addEventListener(events.SWITCH_TO_PASSWORD, this.switchToPassword);
    window.addEventListener(events.CLOSE_DIALOG, this.close);
  },

  methods: {
    resetEditProfile() {
      try {this.$refs.profileSection.clearForm();} catch { /* Do nothing */ }
      try {this.$refs.passwordSection.clearForm();} catch { /* Do nothing */ }
      this.changePassword = false;
    },

    switchToProfile() {
      this.changePassword = false;
    },

    switchToPassword() {
      this.changePassword = true;
    },

    open(user) {
      this.dialog = true;
      if (this.$refs.profileSection) {
        this.$refs.profileSection.setUserDetails(user);
      } else {
        this.userIdToEdit = user.id;
      }
    },

    close() {
      this.dialog = false;
    },

    setSnackbar(msg) {
      this.$parent.setSnackbar(msg);
    },

    updateEditedUser(user) {
      this.$emit('userUpdated', user);
    }
  },
}

</script>


<style scoped>
@import '../../../public/styles/login-register.css';
@import '../../../public/styles/edit-profile.css';

</style>
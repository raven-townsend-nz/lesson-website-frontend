<template>
  <div class="home-wrapper"
       data-app>

    <Navbar/>
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColour"
    >
      {{ snackbarMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <EditProfileDialog ref="editProfile"
                       :edit-self="true"/>

    <AllLessons v-if="page === 'allLessons'"/>
    <AllLessonAllocations v-if="page === 'lessonAllocations'"/>
    <ManageUsers v-else-if="page === 'manageUsers'"/>
    <MyLessons v-else-if="page === 'myLessons'"/>
    <TrainingProgram v-else-if="page === 'trainingProgram'"/>

  </div>
</template>

<script>
import storage_util from "../../common/storage_util";
import events from "../../common/events";
import Navbar from "./Navbar";
import EditProfileDialog from "../edit_profile/EditProfileDialog";
import ManageUsers from "../manage_users/ManageUsers";
import AllLessons from "../all_lessons/AllLessons";
import AllLessonAllocations from "../lesson_allocations/AllLessonAllocations";
import MyLessons from "../my_lessons/MyLessons";
import TrainingProgram from "../training_program/TrainingProgram";


export default {
  name: "Home",
  components: {AllLessons, AllLessonAllocations, ManageUsers, Navbar, EditProfileDialog, MyLessons, TrainingProgram},
  props: ['page'],
  data: () => ({
    snackbar: false,
    snackbarMessage: '',
    snackbarColour: "red darken-2"
  }),

  mounted() {
    window.addEventListener(events.PROFILE_UPDATED, () => {this.setSnackbar("Profile updated", "green")});
    window.addEventListener(events.PASSWORD_UPDATED, () => {this.setSnackbar("Password updated", "green")});
    window.addEventListener(events.USER_NOT_DELETED, () => {this.setSnackbar("Failed to delete user", "red darken-2")});
    window.addEventListener(events.ALLOCATION_NOT_DELETED, () => {this.setSnackbar("Failed to delete allocation", "red darken-2")});
    window.addEventListener(events.LESSON_NOT_DELETED, () => {this.setSnackbar("Failed to delete lesson", "red darken-2")});
    window.addEventListener(events.SLACK_MSG_FAILED, () => {this.setSnackbar("Slack notifications failed. Please inform the relevant users in person", "red darken-2")});
    window.addEventListener(events.OPEN_PROFILE_DIALOG, this.openEditProfile);
  },

  methods: {
    openEditProfile() {
      let user = storage_util.getUserDetails();
      user.id = storage_util.getUserId();
      this.$refs.editProfile.open(user);
    },

    setSnackbar(msg, colour) {
      this.snackbarMessage = msg;
      this.snackbar = true;
      this.snackbarColour = colour;
    }
  }
}
</script>

<style scoped>
@import "../../../public/styles/home.css";
@import '../../../public/styles/edit-profile.css';
</style>
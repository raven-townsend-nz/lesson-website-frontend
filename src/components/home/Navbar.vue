<template>
  <div
      @mouseover="hover = true"
      @mouseleave="hover = false"
  >
    <v-card class="navbar-wrapper">
      <v-navigation-drawer
          permanent
          :mini-variant.sync="mini"
          src="../../assets/login-background.png"
          dark
      >
<!--        HEADING (IMG/BURGER)-->
        <v-list>

          <div class="navbar-burger">
            <v-list-item v-if="mini" v-on:click="mini = false">
              <v-icon>mdi-menu</v-icon>
            </v-list-item>
          </div>
          <v-list-item class="px-2" style="padding-inline: 0.5vw">
              <v-img src="../../assets/logo-unshaded.png" ></v-img>
            <div class="back-burger">
              <v-icon v-if="!mini" v-on:click="mini = true">mdi-backburger</v-icon>
            </div>
          </v-list-item>

        </v-list>

        <v-divider></v-divider>

<!--        PAGE BUTTONS-->
        <div class="navbar-content">

          <div class="navbar-buttons">
            <v-list nav dense>

              <v-list-item link :to="{name: 'myLessons'}" v-on:click.stop="">
                <v-list-item-icon>
                  <v-icon class="navbar-icon">mdi-file-edit</v-icon>
                </v-list-item-icon>
                <v-list-item-title>My Lessons</v-list-item-title>
              </v-list-item>

              <v-list-item link :to="{name: 'allLessons'}" v-on:click.stop="">
                <v-list-item-icon>
                  <v-icon class="navbar-icon">mdi-file-cabinet</v-icon>
                </v-list-item-icon>
                <v-list-item-title>All Lessons</v-list-item-title>
              </v-list-item>

              <v-list-item v-if="isAdmin" link :to="{name: 'lessonAllocations'}" v-on:click.stop="">
                <v-list-item-icon>
                  <v-icon class="navbar-icon">mdi-share</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Lesson Allocations</v-list-item-title>
              </v-list-item>

              <v-list-item v-if="isAdmin" link :to="{name: 'manageUsers'}" v-on:click.stop="">
                <v-list-item-icon>
                  <v-icon class="navbar-icon">mdi-account-group</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Manage Users</v-list-item-title>
              </v-list-item>

              <v-list-item link :to="{name: 'trainingProgram'}" v-on:click.stop="">
                <v-list-item-icon>
                  <v-icon class="navbar-icon">mdi-google-spreadsheet</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Training Program</v-list-item-title>
              </v-list-item>

            </v-list>
          </div>

<!--          PROFILE -->
          <div class="navbar-profile">
            <v-list-item v-if="mini" link @click.stop="openEditProfile">
              <v-icon>mdi-account-circle</v-icon>
            </v-list-item>
            <v-list-item link v-if="!mini" @click="openEditProfile">
              <v-list-item-content>
                <v-chip v-if="!mini" light small style="max-width: fit-content" text-color="rgb(31, 70, 133)">
                  {{ isAdmin? 'Training Officer' : 'Instructor' }}
                </v-chip>
                <v-list-item-title>
                  {{ name }}
                  <v-icon>mdi-pencil</v-icon>
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ email }}
                </v-list-item-subtitle>
              </v-list-item-content>

            </v-list-item>
          </div>
        </div>
<!--        LOGOUT FOOTER-->
        <template v-slot:append>
          <v-divider></v-divider>
          <div class="navbar-footer">
            <v-icon v-if="mini" v-on:click.stop="logout()">mdi-logout-variant</v-icon>
            <LogoutButton v-else/>
          </div>
        </template>

      </v-navigation-drawer>
    </v-card>
  </div>
</template>

<script>
import storage_util from "../../common/storage_util";
import events from "@/common/events";
import LogoutButton from "@/components/login/LogoutButton";
import api from "@/api/api";

export default {
  name: "Navbar",
  components: {LogoutButton},
  data() {
    return {
      mini: true,
      name: null,
      email: null,
      isAdmin: null,
      hover: false,
    }
  },

  mounted() {
    this.setUserDetails();
    window.addEventListener(events.USER_UPDATED, this.setUserDetails);
  },

  methods: {
    openEditProfile() {
      const event = new Event(events.OPEN_PROFILE_DIALOG);
      window.dispatchEvent(event);
    },

    setUserDetails() {
      let userDetails = storage_util.getUserDetails();
      this.name = `${userDetails.firstName} ${userDetails.lastName}`;
      this.email = userDetails.email;
      this.isAdmin = userDetails.isAdmin;
    },

    logout() {
      api.loginRegister.logoutUser()
          .then( () => {
                storage_util.logoutUser();
                this.$router.push({name: "login"});
              }
          ).catch(err => {
        if (err.response.status === 401) {
          this.showError();
        }
      })
    }
  },

}
</script>

<style scoped>
@import "../../../public/styles/navbar.css";
</style>
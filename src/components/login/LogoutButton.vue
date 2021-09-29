<template>
  <v-btn
      class="mr-4"
      @click="logout"
      style="background: #1976d2; color: white;"
  >
    Logout
    <v-icon left style="padding-left: 0.5vw">mdi-logout-variant</v-icon>
  </v-btn>
</template>

<script>
import api from "@/api/api";
import storage_util from "../../common/storage_util";

export default {
  name: "LogoutButton",
  methods: {
    logout() {
      api.loginRegister.logoutUser();
      storage_util.logoutUser();
      this.$router.push({name: "login"});
    }
  },
}
</script>

<style scoped>

</style>
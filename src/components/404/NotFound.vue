<template>
  <div class="fancy-background">
    <v-card class="not-found-card">
      <div class="title-blue">404 Not Found</div>
      <v-img
        class="wider-img"
        src="../../../public/cadetnet-loading-symbol.gif"
        max-height="300"
        max-width="300"></v-img>
      <v-btn text color="#1f4685" @click="handleButton"> {{ buttonMessage }} </v-btn>
    </v-card>
  </div>
</template>

<script>
import storage_util from "@/common/storage_util";

export default {

  name: "NotFound",

  title: '17 SQN | 404 Not Found',

  data() {
    return {
      buttonMessage: storage_util.isLoggedIn() ? 'Go to the home page' : 'Go to the login page'
    }
  },

  methods: {
    handleButton() {
      if (storage_util.isLoggedIn()) {
        this.$router.push({name: "home"});
      } else {
        this.$router.push({name: "login"});
      }
    }
  }
}
</script>

<style scoped>
@import '../../../public/styles/404.css';
</style>
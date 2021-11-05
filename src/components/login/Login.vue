<template>
  <div class="full-wrapper">
    <div class="form-wrapper">
      <div class="left-col">
        <v-img lazy-src="../../assets/blurred-logo.png" src="../../assets/logo.png" class="login-logo"/>
      </div>
      <div class="right-col">
        <div class="form">
          <transition name="slide-fade" mode="out-in">
            <LoginForm v-if="showLogin"/>
            <RegisterForm v-if="!showLogin"/>
          </transition>
        </div>
      </div>
    </div>
    <v-img lazy-src="../../assets/blurred-login-background.png" src="../../assets/login-background.png" class="login-background"/>

  </div>
</template>

<script>
import LoginForm from "@/components/login/LoginForm";
import RegisterForm from "@/components/login/RegisterForm";

export default {
  name: "Login",
  components: {RegisterForm, LoginForm},
  data: () => ({
    showLogin: true,
  }),

  methods: {
    switchToLogIn() {
      this.showLogin = true;
    },

    switchToRegister() {
      this.showLogin = false;
    }
  },
}
</script>

<style scoped>
@import '../../../public/styles/login-register.css';
</style>
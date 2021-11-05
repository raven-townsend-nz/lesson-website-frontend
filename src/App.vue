<template>
  <v-app>
    <div id="app">
      <router-view/>
    </div>
  </v-app>
</template>

<script>

export default {
  name: 'app',

  data: () => ({
    //
  }),
};
</script>
<style>
@font-face{
  font-family:Lesson Font;
  src: url(../public/fonts/GothamProMedium.ttf)
}

html, .v-application {
  font-family: "Lesson Font" !important;
}

body::-webkit-scrollbar {
  display: none;
}

::-webkit-scrollbar-track
{
  background-color: #dedede;
  border-radius: 2rem;
}

::-webkit-scrollbar
{
  width: 10px;
  height: 10px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb
{
  border-radius: 10px;
  background-image: url("assets/login-background.png");
}
</style>

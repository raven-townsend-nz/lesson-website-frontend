import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueRouter from "vue-router";
import titleMixin from "@/common/titleMixin";


import '@mdi/font/css/materialdesignicons.min.css'


Vue.config.productionTip = false
Vue.use(VueRouter);
Vue.mixin(titleMixin);


new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

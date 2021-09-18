import Vue from 'vue';
import vuetify from './plugins/vuetify';
import App from './App.vue';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import router from './router';

Vue.config.productionTip = false;

const vm = new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount('#app');

vm.$forceUpdate();

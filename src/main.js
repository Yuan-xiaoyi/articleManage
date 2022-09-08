import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/default.css'
import VueCookie from 'vue-cookie'
import store from "./store/index"
import filter from "./utils/filter"

Vue.prototype.$filter = filter;
Vue.use(VueCookie) 
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
}).$mount('#app')

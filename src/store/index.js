import Vue from 'vue'
import Vuex from 'vuex'
import orderStatus from "./modules/orderStatus";
 
Vue.use(Vuex)
 
export default new Vuex.Store({
    state: {
        // token: ''
    },
    mutations: {
      // SET_TOKEN: (state, token) => {
      //   state.token = token
      //   localStorage.setItem("token", token)
      // },
    },
    actions: {},
    modules: {
        orderStatus // 这个部分，其实就相当于，this.$store.orderStatus 给引入了下一级的变量
    }
})
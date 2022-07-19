import Vue from 'vue'
import App from './App.vue'
import '../src/elementui/index'
import './mock/index'

Vue.config.productionTip = false

new Vue({
  // router,
  // store,
  render: h => h(App)
}).$mount('#app')

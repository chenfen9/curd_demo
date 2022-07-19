import Vue from 'vue'
import App from './App.vue'
import {Button,Card,Input,Pagination,Table,TableColumn,Message,Dialog,  Form,
  FormItem} from 'element-ui'
import './mock/index'

Vue.use(Button)
Vue.use(Card)
Vue.use(Input)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Form);
Vue.use(FormItem)
Vue.config.productionTip = false
Vue.prototype.$message = Message;
new Vue({
  // router,
  // store,
  render: h => h(App)
}).$mount('#app')

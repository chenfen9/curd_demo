import Vue from 'vue'
import {Button,Card,MessageBox,Input,Pagination,Table,TableColumn,Message,Dialog,Form,FormItem,Icon} from 'element-ui';

Vue.use(Button)
Vue.use(Card)
Vue.use(Input)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Icon)
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message;
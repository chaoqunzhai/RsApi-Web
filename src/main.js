import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css
import '@/styles/admin.scss'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)
Vue.use(Antd)

import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

Vue.use(VueCodemirror)

import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'

import { getDicts, listCityData } from '@/api/admin/dict/data'
import { getItems, setItems } from '@/api/table'
import { getConfigKey } from '@/api/admin/sys-config'
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel, /* download,*/
  selectItemsLabel,
  toDictData, getNamesFromCodes
} from '@/utils/costum'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import Viser from 'viser-vue'
Vue.use(Viser)

import * as filters from './filters' // global filters

import Pagination from '@/components/Pagination'
import BasicLayout from '@/layout/BasicLayout'

import VueParticles from 'vue-particles'
Vue.use(VueParticles)

import '@/utils/dialog'

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.listCityData = listCityData
Vue.prototype.getItems = getItems
Vue.prototype.setItems = setItems
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectItemsLabel = selectItemsLabel
Vue.prototype.toDictData = toDictData
Vue.prototype.getNamesFromCodes = getNamesFromCodes
// Vue.prototype.download = download

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('BasicLayout', BasicLayout)

Vue.prototype.msgSuccess = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'success' })
}

Vue.prototype.msgError = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'error' })
}

Vue.prototype.msgInfo = function(msg) {
  this.$message.info(msg)
}

Vue.use(permission)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

import VueDND from 'awe-dnd'
Vue.use(VueDND)

import 'remixicon/fonts/remixicon.css'

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.config.silent = true

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

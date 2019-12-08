import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts'

import 'common/stylus/index.styl'

// 解决移动端300ms延迟

Vue.prototype.$echarts = echarts

Vue.use(Element, {size: 'small', zIndex: 3000})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

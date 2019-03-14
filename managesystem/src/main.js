/* 入口文件 */ 
import Vue from 'vue'

// 引入element-ui
import ElementUI from 'element-ui';  // js组件
import 'element-ui/lib/theme-chalk/index.css'; // 样式

// base.css
import './assets/style/css/comment.less'
// iconfont.css
import './assets/style/css/iconfont.css';

//引入comment.css
import './assets/style/css/comment.less'

import './assets/style/css/iconfont.css'

//request.js
import request from './api/request'
// echarts
import echarts from 'echarts'

//把request挂载在uve原型上 所有vue实例共享
Vue.prototype.req=request;
Vue.prototype.echarts = echarts;

import App from './App.vue'
import router from './router'



// 使用element-ui
Vue.use(ElementUI)

Vue.config.productionTip = false
// 路由守卫
router.beforeEach((to, from, next) => {
  // 获取浏览器token
  const token = window.localStorage.getItem('token')
  // 如果没有token
  if (!token) {
    // 如果去的是登录
    if (to.path === '/login') {
      next(); // 放行
    } else {
      // 否则 跳转到登录
      next({path: '/login'}) 
    }
  } else {
    next(); // 放行
  }
})


new Vue({

  router,
  render: h => h(App)
}).$mount('#app')

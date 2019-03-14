import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    //路由重定向
    // 默认根目录
    {
      path: '/',
      redirect: '/login' // 路由重定向
    },
    { //登录
      path: '/login',
      name: 'login',
      component: () => import('./views/Login/Login.vue')
    },
    { // 后端首页（容器组件）
      path: '/index',
      component: () => import('./views/Index/Index.vue'),
      children: [
        // 默认就是系统信息
        {
          path: '',
          name: '',
          component: () => import('./views/Systemnews/Systemnews.vue')
        },
        //账号部分
        {
          path: 'accountadd',
          name: 'accountadd',
          component: () => import('./views/Accountadd/Accountadd.vue')
        },
        {
          path: 'accountmanage',
          name: 'accountmanage',
          component: () => import('./views/Accountmanage/Accountmanage.vue')
        },
        {
          path: 'passwordmodfiy',
          name: 'passwordmodfiy',
          component: () => import('./views/Passwordmodfiy/Passwordmodfiy.vue')
        },
        //商品部分
        {
          path: 'commodityadd',
          name: 'commodityadd',
          component: () => import('./views/Commodityadd/Commodityadd.vue')
        },
        {
          path: 'commoditymanage',
          name: 'commoditymanage',
          component: () => import('./views/Commoditymanage/Commoditymanage.vue')
        },
        //统计部分

        {
          path: 'salesstatistics',
          name: 'salesstatistics',
          component: () => import('./views/Salesstatistics/Salesstatistics.vue')
        },
        {
          path: 'stockstatistics',
          name: 'stockstatistics',
          component: () => import('./views/Stockstatistics/Stockstatistics.vue')
        },
        //出货部分
        {
          path: 'saleslist',
          name: 'saleslist',
          component: () => import('./views/Saleslist/Saleslist.vue')
        },
        {
          path: 'outboundgoods',
          name: 'outboundgoods',
          component: () => import('./views/Outboundgoods/Outboundgoods.vue')
        },
        {
          path: 'returngoods',
          name: 'returngoods',
          component: () => import('./views/Returngoods/Returngoods.vue')
        },
        //进货部分
        {
          path: 'repertoryadd',
          name: 'repertoryadd',
          component: () => import('./views/Repertoryadd/Repertoryadd.vue')

        },
        {
          path: 'repertorymanage',
          name: 'repertormanage',
          component: () => import('./views/Repertorymanage/Repertorymanage.vue')

        },
        //会员部分
        {
          path: 'memberadd',
          name: 'memberadd',
          component: () => import('./views/Memberadd/Memberadd.vue')

        },
        {
          path: 'membermanage',
          name: 'membermanage',
          component: () => import('./views/Membermanage/Membermanage.vue')

        },
        // 个人中心
        {
          path: '/index/personal',
          name: 'personal',
          component: () => import('./views/Personal/Personal.vue')
        }



      ]
    },

  ]
})
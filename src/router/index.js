import Vue from 'vue'
import VueRouter from 'vue-router'
import progressOption from '../../progress.config'
import materialPlan from '@/views/pages/materialPlan.vue'
import machine from '@/views/pages/machine.vue'
import material from '@/views/pages/material.vue'
import warehouse from '@/views/components/warehouseSlot.vue'
import plc from '@/views/pages/plc.vue'
import operator from '@/views/pages/operator.vue'
import Home from '@/views/home.vue'
import systemPerson from '@/views/pages/systemPerson.vue'
import changePerson from '@/views/pages/changePerson.vue'
import { Message } from 'element-ui'
// import store from '@/store'
// import { storage } from '@/service/storage'

Vue.use(VueRouter)

export const publicRoutes = [
  {
    path: '/',
    redirect: '/login',
    meta: {
      progressOption
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: '主页',
      path: '/home'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: '主页',
      path: '/home'
    },
    children: [
      {
        path: '/changePerson',
        name: 'changePerson',
        component: changePerson,
        meta: {}
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login.vue'),
    meta: {
      progressOption,
      title: '登录',
      path: '/login'
    }
  }
]
export const asyncRoutes = [
  {
    path: '/home/plantArea',
    name: 'plantArea',
    component: () => import('@/views/pages/plantArea.vue'),
    meta: {
      progressOption,
      title: '厂区管理',
      icon: 'el-icon-office-building',
      roles: ['PRIVILEGE_PLANT_AREA']
    }
  },
  {
    path: '/home/machine',
    name: 'machine',
    component: machine,
    meta: {
      progressOption,
      title: '自助机管理',
      icon: 'el-icon-money',
      roles: ['PRIVILEGE_OPERATION_FLOOR']
    }
  },
  {
    path: '/home/material',
    name: 'material',
    component: material,
    meta: {
      progressOption,
      title: '物料管理',
      icon: 'el-icon-box',
      roles: ['PRIVILEGE_WAREHOUSE']
    }
  },
  {
    path: '/home/warehouse',
    name: 'warehouse',
    component: warehouse,
    meta: {
      progressOption,
      title: '仓库管理',
      icon: 'el-icon-house',
      roles: ['PRIVILEGE_WAREHOUSE']
    }
  },
  {
    path: '/home/plc',
    name: 'plc',
    component: plc,
    meta: {
      progressOption,
      title: 'plc管理',
      icon: 'el-icon-notebook-2',
      roles: ['PRIVILEGE_PLC']
    }
  },
  {
    path: '/home/materialPlan',
    name: 'materialPlan',
    component: materialPlan,
    meta: {
      progressOption,
      title: '发料计划设置',
      icon: 'el-icon-refresh',
      roles: ['PRIVILEGE_PLAN']
    }
  },
  {
    path: '/home/operator',
    name: 'operator',
    component: operator,
    meta: {
      progressOption,
      title: '自助机操作人员管理',
      icon: 'el-icon-user',
      roles: ['PRIVILEGE_OPERATOR_SETTING']
    }
  },
  {
    path: '/home/systemPerson',
    name: 'systemPerson',
    component: systemPerson,
    meta: {
      progressOption,
      title: '系统人员管理',
      icon: 'el-icon-coordinate',
      roles: ['PRIVILEGE_SYSTEM_USER']
    }
  }
]

const router = new VueRouter({
  // 由于是后台，为了简单起见使用hash
  mode: 'hash',
  routes: publicRoutes
})

const whiteList = publicRoutes.map((route) => route.path)
router.beforeEach((to, form, next) => {
  const token = localStorage.getItem('token')
  if (token) {
    next()
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      Message.error('请重新登录')
    }
  }
})
// router.beforeEach((to, from, next) => {
//   if (to.path != '/login' && to.name != '404' && !localStorage.token) {
//     Message.error('请先登录')
//     next({
//       path: '/login'
//     })
//   } else {
//     next()
//   }
// })

export default router

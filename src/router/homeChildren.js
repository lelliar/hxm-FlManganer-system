import progressOption from '../../progress.config'
export const asyncRoutes = [
  {
    path: 'plant',
    name: 'plant',
    component: () => import(/* webpackChunkName: "home" */ '@/views/pages/plantArea.vue'),
    meta: {
      progressOption,
      title: '厂区管理',
      roles: ['PRIVILEGE_PLANT_AREA']
    }
  },
  {
    path: 'machine',
    name: 'machine',
    component: () => import(/* webpackChunkName: "home" */ '@/views/pages/machine.vue'),
    meta: {
      progressOption,
      title: '自助机管理',
      roles: ['PRIVILEGE_OPERATION_FLOOR']
    }
  },
  {
    path: 'material',
    name: 'material',
    component: () => import(/* webpackChunkName: "home" */ '@/views/pages/material.vue'),
    meta: {
      progressOption,
      title: '物料管理',
      roles: ['PRIVILEGE_WAREHOUSE']
    }
  },
  {
    path: 'warehouse',
    name: 'warehouse',
    component: () => import(/* webpackChunkName: "home" */ '@/views/components/warehouseSlot.vue'),
    meta: {
      progressOption,
      title: '仓库管理',
      roles: ['PRIVILEGE_WAREHOUSE']
    }
  },
  {
    path: 'plc',
    name: 'plc',
    component: () => import(/* webpackChunkName: "home" */ '@/views/pages/plc.vue'),
    meta: {
      progressOption,
      title: 'plc管理',
      roles: ['PRIVILEGE_PLC']
    }
  },
  {
    path: 'materialPlan',
    name: 'materialPlan',
    component: () => import(/* webpackChunkName: "home" */ '@/views/pages/materialPlan.vue'),
    meta: {
      progressOption,
      title: '发料计划设置',
      roles: ['PRIVILEGE_PLAN']
    }
  },
  {
    path: 'operator',
    name: 'operator',
    component: () => import(/* webpackChunkName: "home" */ '@/views/pages/operator.vue'),
    meta: {
      progressOption,
      title: '自助机操作人员管理',
      roles: ['PRIVILEGE_OPERATOR']
    }
  },
  {
    path: 'systemPerson',
    name: 'systemPerson',
    component: () => import(/* webpackChunkName: "home" */ '@/views/pages/systemPerson.vue'),
    meta: {
      progressOption,
      title: '系统人员管理',
      roles: ['PRIVILEGE_SYSTEM_USER']
    }
  }
]

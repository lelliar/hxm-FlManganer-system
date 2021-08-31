import progressOption from '../../progress.config'
export default [
  {
    path: 'plant',
    name: 'plant',
    component: () => import(/* webpackChunkName: "home" */ '@/views/pages/plantArea.vue'),
    meta: {
      progressOption
    }
  },
  {
    path: 'machine',
    name: 'machine',
    component: () => import(/* webpackChunkName: "home" */ '@/views/pages/machine.vue'),
    meta: {
      progressOption
    }
  },
  {
    path: 'material',
    name: 'material',
    component: () => import(/* webpackChunkName: "home" */ '@/views/pages/material.vue'),
    meta: {
      progressOption
    }
  },
  {
    path: 'warehouse',
    name: 'warehouse',
    component: () => import(/* webpackChunkName: "home" */ '@/views/components/warehouseSlot.vue'),
    meta: {
      progressOption
    }
  },
  {
    path: 'plc',
    name: 'plc',
    component: () => import(/* webpackChunkName: "home" */ '@/views/pages/plc.vue'),
    meta: {
      progressOption
    }
  },
  {
    path: 'materialPlan',
    name: 'materialPlan',
    component: () => import(/* webpackChunkName: "home" */ '@/views/pages/materialPlan.vue'),
    meta: {
      progressOption
    }
  },
  {
    path: 'operator',
    name: 'operator',
    component: () => import(/* webpackChunkName: "home" */ '@/views/pages/operator.vue'),
    meta: {
      progressOption
    }
  },
  {
    path: 'systemPerson',
    name: 'systemPerson',
    component: () => import(/* webpackChunkName: "home" */ '@/views/pages/systemPerson.vue'),
    meta: {
      progressOption
    }
  }
]

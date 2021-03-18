import Home from '@/components/Home.vue'

const routes = [{
    path: '/',
    name: 'Index',
    redirect: '/dashboard/index',
    hidden: true,
    meta: {
      title: "首页",
      // icon: 'ant-design:home-outlined',
      icon: 'fa fa-home'
    }
  },
  // 登录
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
    hidden: true
  },

  // 首页
  {
    path: '/dashboard',
    name: 'Dashboard',
    redirect: '/dashboard/index',
    component: Home,
    children: [{
      path: "/dashboard/index",
      name: 'DashboardIndex',
      component: () => import('../views/dashboard/index.vue'),
      meta: {
        title: "首页",
        icon: 'fa fa-home'
      }
    }]
  },

  // 账户管理
  {
    path: '/users',
    name: 'Users',
    redirect: '/users/index',
    component: Home,
    meta: {
      roles: ['sysAdmin'],
    },
    children: [{
      path: "/users/index",
      name: 'UsersIndex',
      component: () => import('../views/users/index.vue'),
      meta: {
        title: "账户管理",
        icon: 'fa fa-user'
      },
    }],
  },

  // 加解密服务
  {
    path: '/encryption',
    name: 'Encryption',
    redirect: '/encryption/keys',
    component: Home,
    meta: {
      title: "加解密服务",
      icon: 'fa fa-lock'
    },
    children: [{
      path: "/encryption/keys",
      name: 'EncryptionKeys',
      component: () => import('../views/encryption/keys/index.vue'),
      meta: {
        title: "密钥管理",
        roles: ['keyAdmin', 'keyAudit', 'keyUser'],
      },
    }, {
      path: "/encryption/algorithm",
      name: 'EncryptionAlgo',
      component: () => import('../views/encryption/algorithm/index.vue'),
      meta: {
        title: "算法管理",
        roles: ['sysAdmin'],
      },
    }, {
      path: "/encryption/operation",
      name: 'EncryptionOperation',
      component: () => import('../views/encryption/operation/index.vue'),
      meta: {
        title: "操作使用",
        roles: ['keyUser'],
      },
    }],
  },

  // 操作日志
  {
    path: '/operaLog',
    name: 'OperaLog',
    redirect: '/operaLog/index',
    component: Home,
    meta: {
      roles: ['sysAdmin'],
    },
    children: [{
      path: "/operaLog/index",
      name: 'OperaLog',
      component: () => import('../views/operaLog/index.vue'),
      meta: {
        title: "操作日志",
        icon: 'fa fa-list',
      }
    }]
  },
]

export default routes;
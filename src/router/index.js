import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Cookies from "js-cookie";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/video/:vid',
    name: 'Video',
    component: () =>
      import('../views/Video.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () =>
      import('../views/Register.vue')
  },
  {
    path: '/search/:keywords',
    name: 'Search',
    component: () =>
        import('../views/Search.vue')
  },
  {
    path: '/message',
    name: 'Message',
    meta: { auth: true },
    component: () =>
        import('../views/message/Message.vue'),
  },
  {
    path: '/message/announce',
    name: 'Announce',
    meta: { auth: true },
    component: () =>
        import('../views/message/Announce.vue'),
  },
  {
    path: '/message/user/:fid',
    name: 'UserMsg',
    meta: { auth: true },
    component: () =>
        import('../views/message/UserMessage.vue'),
  },
  {
    path: '/space',
    name: 'Space',
    meta: { auth: true },
    component: () =>
        import('../views/space/Space.vue'),
  },
  {
    path: '/space/edit',
    name: 'Edit',
    meta: { auth: true },
    component: () =>
        import('../views/space/Edit.vue'),
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next) => {
  //是否需要登录
  if(to.meta.auth){
    //是否存在token
    if(Cookies.get("token")){
      next()
    }else{
      router.push({name:'Login'})
    }
  }else{
    next()
  }
})

export default router

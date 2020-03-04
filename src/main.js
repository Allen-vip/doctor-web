import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
//import Mock from './mock'
//Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'
import VueCropper from 'vue-cropper'
import db from './common/js/global.js'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import axios from 'axios'
import Home from './views/Home.vue'
import Account from '@/views/account/Account.vue'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueCropper)
Vue.use(VueVideoPlayer)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //NProgress.start();
    console.log("router.beforeEach from.path=" + JSON.stringify(from.path) + " to.path=" + JSON.stringify(to.path))
  if (to.path == '/login') {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("isAdmin");
  }
  store.state.token = sessionStorage.getItem('token')
  let token = store.state.token
  if (!token && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

const UPDATE_TOKEN = 'UPDATE_TOKEN'; // 用常量代替事件类型，使得代码更清晰
const REMOVE_TOKEN = 'REMOVE_TOKEN';
const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';
const REMOVE_ACCOUNT = 'REMOVE_ACCOUNT';
//注册状态管理全局参数
var store = new Vuex.Store({
  state:{
    token:'',
    account:{}
  },
  mutations: {
    //写法与getters相类似
    //组件想要对于vuex 中的数据进行的处理
    //组件中采用this.$store.commit('方法名') 的方式调用，实现充分解耦
    //内部操作必须在此刻完成(同步)
    [UPDATE_TOKEN] (state, token) { // 第一个参数为 state 用于变更状态 登录
      sessionStorage.setItem("token", token);
      state.token = token;
    },
    [REMOVE_TOKEN] (state, token) {
      sessionStorage.removeItem("token");
      state.token = null;
    },
    [UPDATE_ACCOUNT] (state, account) { // 第一个参数为 state 用于变更状态 登录
      sessionStorage.setItem("account", JSON.stringify(account));
      state.account = account;
    },
    [REMOVE_ACCOUNT] (state, account) {
      sessionStorage.removeItem("account");
      state.account = null;
    },

  }
});

//给所有请求头部加上token
axios.interceptors.request.use(
    config => {
      //在所有请求头部添加token值
      const token = store.state.token;

      if (token) {
        config.headers.Authorization = token;
      } else {
        config.headers.Authorization = "token";
      }
      return config
    },
    error => {
      return Promise.reject(error)
    }
);
//返回参数时的拦截
axios.interceptors.response.use(
    response => {
      if(response.data.state !== 200 && response.data.state !== 0){
        console.log("response.data=" + JSON.stringify(response.data))
        router.replace({ //跳转到登录页面
          path: '/login',
          query: { redirect: router.currentRoute.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
        });
      }
      return response;
    },
    error => {
      if (error.response) {
        return Promise.reject(error.response.data) //返回接口返回的错误信息
      }
    }
);

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')


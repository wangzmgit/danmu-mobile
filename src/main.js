import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import infiniteScroll from 'vue-infinite-scroll';



Vue.use(Antd);
Vue.use(infiniteScroll);
Vue.config.productionTip = false;
Vue.directive('title', {
  inserted: function (el) {
      document.title = el.dataset.title
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

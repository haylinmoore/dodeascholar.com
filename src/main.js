import Vue from "vue";
import App from "./App.vue";
import store from "./store";

import VueRouter from "vue-router";

import router from "./router.js";

Vue.use(VueRouter);

var vue = new Vue({
	store,
	router,
	render: h => h(App)
}).$mount("#app");

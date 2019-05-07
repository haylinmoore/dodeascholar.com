import store from "./store.js";
import login from "./pages/login/index.vue";
import overview from "./pages/overview/index.vue";
import tos from "./pages/tos/index.vue";
import classbreakdown from "./pages/classbreakdown/index.vue";
import VueRouter from "vue-router";

const routes = [
	{
		path: "/",
		component: login,
		meta: {
			requiresAuth: false
		}
	},
	{
		path: "/tos",
		component: tos,
		meta: {
			requiresAuth: false
		}
	},
	{
		path: "/overview",
		component: overview,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: "/break",
		component: classbreakdown,
		meta: {
			requiresAuth: true
		}
	}
];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
let router = new VueRouter({
	routes // short for `routes: routes`
});

router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth)) {
		if (store.getters.loggedIn) {
			next();
		} else {
			next({
				path: "/"
			});
		}
	} else {
		next();
	}
});

export default router;

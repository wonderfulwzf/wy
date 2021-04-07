import Vue from "vue"
import Router from "vue-router"
import Admin from "./views/Admin.vue"
import Login from "./views/Login.vue"
import Welcome from "./views/admin/Welcome.vue"
import User from "./views/admin/User.vue"
import Video from "./views/admin/Video.vue"
import Actor from "./views/admin/Actor.vue"

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [{
        path: "*",
        component: Login,
    }, {
        path: "/",
        component: Admin,
        children: [{
            name: "welcome",
            path: "welcome",
            component: Welcome,
        },{
            name: "user",
            path: "user",
            component: User,
        },{
            name: "video",
            path: "video",
            component: Video,
        },{
            name: "actor",
            path: "actor",
            component: Actor,
        }]
    }, {
        path: "/login",
        component: Login,
    }]
})

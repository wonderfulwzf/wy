import Vue from "vue"
import Router from "vue-router"
import Admin from "./views/Admin.vue"
import Login from "./views/Login.vue"
import Welcome from "./views/admin/Welcome.vue"
import User from "./views/admin/User.vue"
import Video from "./views/admin/Video.vue"
import Actor from "./views/admin/Actor.vue"
import Summary from "./views/admin/Summary.vue"
import Category from "./views/admin/Category.vue"
import File from "./views/admin/File.vue"

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
        },{
            name: "summary",
            path: "summary",
            component: Summary,
        },{
            name: "category",
            path: "category",
            component: Category,
        },{
            name: "file",
            path: "file",
            component: File,
        }]
    }, {
        path: "/login",
        component: Login,
    }]
})

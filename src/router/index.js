import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/login/Login";
import Home from '../components/home/Home';
import NotFound from "../components/404/NotFound";
import ResetPassword from "@/components/forgot_password/ResetPassword";
import ForgottenPassword from "@/components/forgot_password/ForgottenPassword";

import api from "../api/api";
import storage_util from "../common/storage_util";


Vue.use(VueRouter)

const routes = [
    { name: "login", path: '/login', component: Login },
    { name: 'resetPassword', path: '/reset-password', component: ResetPassword },
    { name: "forgottenPassword", path: '/forgotten-password', component: ForgottenPassword },

    { name: "allLessons", path:'/home/all-lessons', component: Home, meta: {requiresLogin: true}, props: {page: 'allLessons'}},
    { name: "myLessons", path:'/home/my-lessons', component: Home, meta: {requiresLogin: true}, props: {page: 'myLessons'}},
    { name: "lessonAllocations", path:'/home/lesson-allocations', component: Home, meta: {requiresAdmin: true}, props: {page: 'lessonAllocations'}},
    { name: "manageUsers", path:'/home/manage-users', component: Home, meta: {requiresAdmin: true}, props: {page: 'manageUsers'}},
    { name: "trainingProgram", path:'/home/training-program', component: Home, props: {page: 'trainingProgram'}},

    { name: "home", path: '/home', redirect: { name: 'myLessons'} },
    { name: "default", path: '/', redirect: { name: 'myLessons'} },

    { name: "notFound", path: '/not-found', component: NotFound },


    // Keep at end
    { path: "*", redirect: { name: 'notFound' } },


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

/**
 * Before each route, check if the route requires authentication, if it does
 * it will check if the user is logged in, if that fails, redirect to /login
 */
router.beforeEach((to, from, next) => {
    if (to.name === "login" || to.name === "register" || to.name === "forgottenPassword" || to.name === "resetPassword") {
        api.loginRegister.isLoggedIn()
            .then(() => {
                next({name: "home"});
            })
        next();
    } else {
        // First check if the page is not allowed to be accessed
        api.loginRegister.isLoggedIn()
            .then(() => {
                // Then check route requires admin AND user is admin
                if (to.meta.requiresAdmin && !storage_util.isAdmin()) {
                    next({name: "home"});
                }
                next();
            })
            .catch(() => {
                console.error('User not logged in!');
                if (to.meta.requiresLogin === true || to.meta.requiresAdmin === true) {
                    next({name: "login"});
                } else {
                    next();
                }
            })
     }

})

export default router

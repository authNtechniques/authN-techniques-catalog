import Vue from 'vue';
import Router from 'vue-router';
import Techniques from './views/Techniques.vue';
import Authenticators from './views/Authenticators.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'techniques',
            component: Techniques,
        },
        {
            path: '/authenticators',
            name: 'authenticators',
            component: Authenticators,
        },
    ],
});

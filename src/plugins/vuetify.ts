import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify, {
    theme: {
        primary: { base: '#0072BB', darken1: '#004774' },
        secondary: '#FFA500',
        accent: '#7DA7D9',
        info: '#7DA7D9',
        success: '#FFFFFF',
        warning: '#FFC107',
        error: '#FF5252',
    },
    iconfont: 'md',
});

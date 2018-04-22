import Vue from 'vue';
import App from './exam';

const app = new Vue(App);
app.$mount();

export default {
    config: {
        disableScroll: false,
    },
};

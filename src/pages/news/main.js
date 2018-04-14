import Vue from 'vue';
import App from './news';

const app = new Vue(App);
app.$mount();

export default {
    config: {
        disableScroll: true,
    },
};

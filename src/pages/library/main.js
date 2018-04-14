import Vue from 'vue';
import App from './library';

const app = new Vue(App);
app.$mount();

export default {
    config: {
        disableScroll: true,
    },
};

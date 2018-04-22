import Vue from 'vue';
import App from './store';

const app = new Vue(App);
app.$mount();

export default {
    config: {
        disableScroll: true,
    },
};

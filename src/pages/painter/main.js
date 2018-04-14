import Vue from 'vue';
import App from './painter';

const app = new Vue(App);
app.$mount();

export default {
    config: {
        disableScroll: true,
    },
};

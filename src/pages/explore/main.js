import Vue from 'vue';
import App from './explore';

const app = new Vue(App);
app.$mount();

export default {
    config: {
        disableScroll: true,
    },
};

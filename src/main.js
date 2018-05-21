import Vue from 'vue';
import App from './App';

Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue(App);
app.$mount();

export default {
    config: {
        pages: [
            '^pages/course/course',
            'pages/wall/wall',
            'pages/explore/explore',
            'pages/login/login',
            'pages/about/about',
            'pages/news/news',
            'pages/origami/origami',
            'pages/painter/painter',
            'pages/morning/morning',
            'pages/grade/grade',
            'pages/score/score',
            'pages/exam/exam',
            'pages/library/library',
            'pages/store/store',
        ],
        window: {
            backgroundColor: '#ECEDF1',
            backgroundTextStyle: 'white',
            navigationBarBackgroundColor: '#41AE8E',
            navigationBarTitleText: 'WeGDUT',
            navigationBarTextStyle: 'white',
        },
        tabBar: {
            color: '#353535',
            selectedColor: '#41AE8E',
            backgroundColor: '#FFFFFF',
            borderStyle: 'white',
            list: [{
                pagePath: 'pages/course/course',
                text: '课程表',
                iconPath: 'static/icon/course1.png',
                selectedIconPath: 'static/icon/course2.png',
            }, {
                pagePath: 'pages/wall/wall',
                text: '工大墙',
                iconPath: 'static/icon/wall1.png',
                selectedIconPath: 'static/icon/wall2.png',
            }, {
                pagePath: 'pages/explore/explore',
                text: '发现',
                iconPath: 'static/icon/explore1.png',
                selectedIconPath: 'static/icon/explore2.png',
            }],
        },
    },
};

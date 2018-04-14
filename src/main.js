import Vue from 'vue';
import App from './App';

Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue(App);
app.$mount();

export default {
    config: {
        pages: [
            'pages/course/course',
            'pages/wall/wall',
            '^pages/explore/explore',
            'pages/login/login',
            'pages/about/about',
            'pages/news/news',
            'pages/origami/origami',
            'pages/painter/painter',
            'pages/morning/morning',
            'pages/grade/grade',
            'pages/score/score',
            'pages/calendar/calendar',
        ],
        window: {
            backgroundColor: '#ECEDF1',
            backgroundTextStyle: 'white',
            navigationBarBackgroundColor: '#29BB73',
            navigationBarTitleText: 'WeGDUT',
            navigationBarTextStyle: 'white',
        },
        tabBar: {
            color: '#353535',
            selectedColor: '#29BB73',
            backgroundColor: '#FFFFFF',
            borderStyle: 'white',
            list: [{
                pagePath: 'pages/course/course',
                text: '课程表',
                iconPath: 'static/icon/课程表1.png',
                selectedIconPath: 'static/icon/课程表2.png',
            }, {
                pagePath: 'pages/wall/wall',
                text: '工大墙',
                iconPath: 'static/icon/工大墙1.png',
                selectedIconPath: 'static/icon/工大墙2.png',
            }, {
                pagePath: 'pages/explore/explore',
                text: '发现',
                iconPath: 'static/icon/发现1.png',
                selectedIconPath: 'static/icon/发现2.png',
            }],
        },
    },
};

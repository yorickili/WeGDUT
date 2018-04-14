<template>
    <movable-area class="container course-container">
        <div class="header">
            <div class="blank" />
            <div class="week-wrapper" v-for="item in week" :key="item.index">
                <div class="week">
                    <div>{{item.day}}</div>
                    <div>{{item.date}}</div>
                </div>
            </div>
        </div>
        <div class="body">
            <div class="lesson-time-wrapper">
                <div class="lesson-time" v-for="item in lessonTime" :key="item.index">
                    <div>{{index + 1}}</div>
                    <div>{{item}}</div>
                </div>
            </div>
            <div class="course-wrapper">
                <div class="lesson-wrapper">
                    <div class="lesson"
                        v-for="item in lessons"
                        :key="item.index"
                        :style="{ background: item.color, flex: item.flex }"
                        @click="changeLesson">
                        <span>{{item.name}}</span>
                        <span>{{item.site}}</span>
                    </div>
                </div>
            </div>
        </div>
        <Mover actions="刷新课程&添加课程&更换周数" @handler="moverHandler" />
        <Lessoner v-if="visible.Lessoner" @submit="changeLesson" @close="closeLessoner" />
    </movable-area>
</template>

<script>
    import Mover from '@/components/Mover';
    import Lessoner from '@/components/Lessoner';
    import Button from '@/components/Button';
    import { lessonTime } from '@/config';
    import { promiser, jointer } from '@/lib';

    export default {
        components: { Mover, Lessoner, Button },
        data() {
            return {
                week: [{
                    day: '周一',
                    date: '03-05',
                }, {
                    day: '周二',
                    date: '03-06',
                }, {
                    day: '周三',
                    date: '03-07',
                }, {
                    day: '周四',
                    date: '03-08',
                }, {
                    day: '周五',
                    date: '03-09',
                }, {
                    day: '周六',
                    date: '03-10',
                }, {
                    day: '周日',
                    date: '03-11',
                }],
                lessonTime,
                lessons: [
                    { flex: 4, color: '', name: '', site: '' },
                    { flex: 2, color: 'lightblue', name: '高等数学', site: '@教二-323' },
                    { flex: 6, color: '', name: '', site: '' },
                ],
                visible: { Lessoner: false },
            };
        },
        async created() {
            const calendar = await jointer.getCalendar();
            console.log(calendar);
        },
        onShow() {
            this.getCourse();
        },
        methods: {
            async getCourse() {
                const res = await jointer.getCourse();
                switch (res.code) {
                    case 200: break;
                    default: {
                        const { confirm } = await promiser.showModal({ title: '提示', content: '您未登录，点击确定去登录！' });
                        if (confirm) { this.go2login(); }
                        break;
                    }
                }
            },
            go2login() {
                wx.navigateTo({ url: '/pages/login/login' });
            },
            moverHandler(index) {
                switch (index) {
                    case 0: this.getCourse(); break;
                    case 1: this.visible.Lessoner = true; break;
                    default: break;
                }
            },
            changeLesson() {
                this.visible.Lessoner = true;
            },
            closeLessoner() {
                this.visible.Lessoner = false;
            },
        },
    };
</script>

<style lang="scss">
    .lesson-wrapper {
        width: 50px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .lesson {
            width: 100%;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }
    }
</style>

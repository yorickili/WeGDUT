<template>
    <movable-area class="container course-container">
        <div class="header">
            <div class="blank" />
            <div class="week-wrapper" v-for="item in week" :key="item.id">
                <div class="week">
                    <div>{{item.day}}</div>
                    <div>{{item.date}}</div>
                </div>
            </div>
        </div>
        <div class="body">
            <div class="lesson-time-wrapper">
                <div class="lesson-time" v-for="(item, index) in lessonTime" :key="item.id">
                    <div>{{index + 1}}</div>
                    <div>{{item}}</div>
                </div>
            </div>
            <div class="course-wrapper">
                <div class="lesson-wrapper" v-for="(day, index) in course" :key="index">
                    <div class="lesson"
                        v-for="(item, index1) in day"
                        :key="index1"
                        :style="{ background: item.color, flex: item.flex }"
                        @click="changeLesson">
                        <span>{{item.name}}</span>
                        <span>{{item.site}}</span>
                    </div>
                </div>
            </div>
        </div>
        <Mover actions="刷新课程&添加课程&更换周数" @handler="moverHandler" />
        <picker v-if="visible.picker" :range="weeks" :value="weekNow" @change="changeWeek">
            <div></div>
        </picker>
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
                course: [],
                visible: { Lessoner: false, picker: true },
                weeks: (() => {
                    const arr = [];
                    for (let i = 1; i <= 22; i += 1) {
                        arr.push(i);
                    }
                    return arr;
                })(),
                weekNow: 0,
            };
        },
        async created() {
            // const calendar = await jointer.getCalendar();
            // console.log(calendar);
        },
        onShow() {
            if (!wx.getStorageSync('course')) this.getCourse();
            else this.course = this.parse(wx.getStorageSync('course'), 1);
        },
        methods: {
            async getCourse() {
                const res = await jointer.getCourse();
                const next = () => {
                    wx.setStorageSync('course', res.data.rows);
                    this.course = this.parse(res.data.rows, 1);
                };
                switch (res.code) {
                    case 200: next(); break;
                    default: {
                        const { confirm } = await promiser.showModal({ title: '提示', content: '您未登录，点击确定去登录！' });
                        if (confirm) { this.go2login(); }
                        break;
                    }
                }
            },
            parse($rows, week) {
                const course = [];
                const getColor = () => {
                    const colors = ['#feacaf', '#93d4e7', '#fae497', '#a1dd9f', '#f98cb1', '#93c0f7', '#dae489', '#89b2e4', '#88d5da', '#88da9f', '#dacb88', '#e8c39c', '#eebbb4', '#eeb4e8', '#d6b1f2', '#fddc5'];
                    const random = Math.floor(Math.random() * colors.length);
                    return colors[random];
                };
                for (let i = 0; i < 7; i += 1) { course.push([]); }
                $rows.forEach((item) => {
                    if (item.startWeek <= week && week <= item.endWeek) {
                        course[item.day - 1].push(item);
                    }
                });
                course.forEach(($day, index) => {
                    const day = [...$day.sort((a, b) => a.startSection - b.startSection)];
                    const getBlank = (flex) => {
                        return { name: '', site: '', teacher: '', color: 'rgba(0, 0, 0, 0)', flex: flex || 12 };
                    };
                    if ($day.length === 0) day.push(getBlank());
                    $day.forEach(($item, index1) => {
                        const item = $item;
                        item.color = getColor();
                        item.flex = (item.endSection - item.startSection) + 1;
                        const pre = $day[index1 - 1];
                        const next = $day[index1 + 1];
                        if (next) {
                            day.splice(index1 + 1, 0,
                                getBlank(next.startSection - item.endSection - 1));
                        }
                        if (!pre && item.startSection > 1) {
                            day.splice(0, 0,
                                getBlank(item.startSection - 1));
                        }
                        if (!next && item.endSection < 12) {
                            day.push(getBlank(12 - item.endSection));
                        }
                    });
                    course[index] = day;
                });
                return course;
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
            changeWeek() {
                console.log(1);
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

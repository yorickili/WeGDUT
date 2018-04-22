<template>
    <movable-area class="container course-container">
        <div class="header">
            <div class="blank" />
            <div class="week-wrapper" v-for="item in week" :key="item.id">
                <div class="week">
                    <div>{{item.day}}</div>
                    <!-- <div>{{item.date}}</div> -->
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
                    >
                        <span>{{item.name}} {{item.site}}</span>
                    </div>
                </div>
            </div>
        </div>
        <Mover actions="刷新课程&切换周数" @handler="moverHandler" />
        <Picker
            ref="picker"
            :list="weekList"
            @change="changeWeek"
        />
    </movable-area>
</template>

<script>
    import Mover from '@/components/Mover';
    import Picker from '@/components/Picker';
    import Button from '@/components/Button';
    import { lessonTime } from '@/config';
    import { promiser, jointer } from '@/lib';

    export default {
        components: { Mover, Picker, Button },
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
                course: [],
                weekList: (() => {
                    const arr = [];
                    for (let i = 0; i <= 21; i += 1) {
                        arr.push(`第${i + 1}周`);
                    }
                    return arr;
                })(),
            };
        },
        created() {},
        onShow() {
            if (!wx.getStorageSync('course')) this.getCourse();
            else this.course = this.parseCourse(wx.getStorageSync('course'), 1);
        },
        methods: {
            async getCourse() {
                const res = await jointer.getCourse();
                const next = () => {
                    wx.setStorageSync('course', res.data.rows);
                    wx.setStorageSync('firstDay', res.data.firstDay);
                    wx.setStorageSync('term', res.data.term);
                    wx.setStorageSync('lessonCount', res.data.total);
                    this.course = this.parseCourse(res.data.rows, 1);
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
            parseCourse($rows, week) {
                const course = [];
                const getColor = () => {
                    const colors = ['#F7D94C', '#DC9FB4', '#E16B8C', '#F4A7B9', '#DB4D6D',
                        '#D05A6E', '#BF6766', '#EB6766', '#EB7A77', '#F17C67', '#B9887D',
                        '#E83015', '#FB966E', '#F05E1C', '#FC9F4D', '#FFBA84', '#FFB11B',
                        '#BEC23F', '#90B44B', '#5DAC81', '#A8D8B9', '#00AA90', '#66BAB7',
                        '#A5DEE4', '#58B2DC', '#7DB9DE', '#9B90C2', '#B28FCE', '#986DB2',
                        '#E03C8A', '#DDD23B'];
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
                        item.site = `@${item.site}`;
                        const pre = $day[index1 - 1];
                        const next = $day[index1 + 1];
                        if (next && next.name) {
                            if (next.startSection - item.endSection > 1) {
                                day.splice(index1 + 1, 0,
                                    getBlank(next.startSection - item.endSection - 1));
                            }
                        }
                        if (!pre && item.startSection > 1) {
                            day.unshift(getBlank(item.startSection - 1));
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
                    case 1: this.$refs.picker.show(); break;
                    default: break;
                }
            },
            changeWeek(value) {
                this.course = this.parseCourse(wx.getStorageSync('course'), value[0]);
            },
        },
    };
</script>

<style lang="scss">
    
</style>

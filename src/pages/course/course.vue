<template>
    <movable-area class="container course-container">
        <div class="header">
            <div class="blank">{{nowWeek + 1}}</div>
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
                    >
                        <span>{{item.name}}<br/>{{item.site}}</span>
                    </div>
                </div>
            </div>
        </div>
        <Mover actions="刷新&切换" @handler="moverHandler" />
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
    import { promiser, jointer, tool } from '@/lib';

    export default {
        components: { Mover, Picker, Button },
        data() {
            return {
                week: [{
                    day: '周一',
                }, {
                    day: '周二',
                }, {
                    day: '周三',
                }, {
                    day: '周四',
                }, {
                    day: '周五',
                }, {
                    day: '周六',
                }, {
                    day: '周日',
                }],
                lessonTime,
                course: [],
                nowWeek: (() => {
                    if (wx.getStorageSync('firstDay')) {
                        const time = Date.now() - new Date(wx.getStorageSync('firstDay')).getTime();
                        return Math.floor(time / (7 * 86400000));
                    }
                    return 0;
                })(),
                weekList: (() => {
                    const arr = [];
                    const length = wx.getStorageSync('weekNum') || 20;
                    for (let i = 0; i < length; i += 1) {
                        arr.push(`第${i + 1}周`);
                    }
                    return arr;
                })(),
            };
        },
        onShow() {
            if (!wx.getStorageSync('course')) {
                this.getCourse();
            } else {
                this.course = this.parseCourse(wx.getStorageSync('course'), this.nowWeek + 1);
            }
            this.setWeekDate();
        },
        methods: {
            async getCourse() {
                try {
                    this.course = this.parseCourse(await jointer.getCourse(), this.nowWeek + 1);
                } catch (e) {
                    const { confirm } = await promiser.showModal({
                        title: '提示',
                        content: '您未登录，点击确定去登录！',
                    });
                    if (confirm) { this.go2login(); }
                }
            },
            parseCourse($rows, week) {
                const course = [];
                let colorIndex = 0;
                const getRandomColor = () => {
                    // const colors = ['#F7D94C', '#DC9FB4', '#E16B8C', '#F4A7B9', '#DB4D6D',
                    //     '#D05A6E', '#BF6766', '#EB6766', '#EB7A77', '#F17C67', '#B9887D',
                    //     '#E83015', '#FB966E', '#F05E1C', '#FC9F4D', '#FFBA84', '#FFB11B',
                    //     '#BEC23F', '#90B44B', '#5DAC81', '#A8D8B9', '#00AA90', '#66BAB7',
                    //     '#A5DEE4', '#58B2DC', '#7DB9DE', '#9B90C2', '#B28FCE', '#986DB2',
                    //     '#E03C8A', '#DDD23B'];
                    const colors = ['#FEACAF', '#A2C6F2', '#9FDDC5', '#93D4E7', '#DDBEF4', '#93D4E7',
                        '#EEB4E8', '#A1C5F1', '#F4B3C9'];
                    // const random = Math.floor(Math.random() * colors.length);
                    if ((colorIndex + 1) > colors.length) colorIndex = 0;
                    const color = colors[colorIndex];
                    colorIndex += 1;
                    return color;
                };
                const map = {};
                const getColor = (name) => {
                    if (map[name]) return map[name];
                    const color = getRandomColor();
                    map[name] = color;
                    return color;
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
                        item.name = $item.name.length > 6 ? `${$item.name.slice(0, 5)}...` : $item.name;
                        item.color = getColor(item.name);
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
                this.course = this.parseCourse(wx.getStorageSync('course'), value[0] + 1);
                this.nowWeek = value[0];
                this.setWeekDate();
            },
            setWeekDate() {
                if (wx.getStorageSync('firstDay')) {
                    const date = tool.getCalendar(wx.getStorageSync('firstDay'), 21)[this.nowWeek];
                    date.forEach((item, i) => {
                        this.week[i].date = item;
                    });
                }
            },
        },
        onShareAppMessage() {
            const count = wx.getStorageSync('lessonCount');
            const price = Math.floor(2850 / count);
            return {
                title: `我这学期共${count}节课,每节课${price}元,来看看你的课吧！`,
                path: '/pages/course/course',
            };
        },
    };
</script>

<style lang="less">

</style>

<template>
    <movable-area class="container grade-container">
        <div class="cover">
            <div class="text">{{range[term]}}</div>
            <div class="gpa">{{gpa}}</div>
            <div class="tip">注：此绩点仅供参考（不含选修）</div>
        </div>
        <div class="chart">
            <canvas canvas-id="pie" style="width: 100px; height: 100px;"></canvas>
            <div class="labels">
                <div class="label" v-for="item in labels" :key="item.index">
                    <div class="circle" :style="{ background: item.color }"></div>
                    <div class="text">{{item.text}}</div>
                </div>
            </div>
        </div>
        <scroll-view class="list" scroll-y="true">
            <div class="zan-cell" v-for="item in grade[range[term]]" :key="item.index">
                <div class="zan-cell__bd">{{item.name}}</div>
                <div class="zan-cell__ft">{{item.score}}</div>
            </div>
        </scroll-view>
        <picker :range="range" :value="term" @change="changeTerm">
            <Mover />
        </picker>
    </movable-area>
</template>

<script>
    import Mover from '@/components/Mover';
    import { jointer } from '@/lib';

    export default {
        components: { Mover },
        data() {
            return {
                grade: {},
                term: 0,
                range: ['全部', '大一上', '大一下', '大二上', '大二下', '大三上', '大三下', '大四上', '大四下'],
                labels: [
                    { color: '#F75C2F', text: '90 - 100' },
                    { color: '#A0D8EF', text: '80 - 89' },
                    { color: '#EFCD9A', text: '70 - 79' },
                    { color: '#38B48B', text: '60 - 69' },
                    { color: '#84A2D4', text: '0 - 59' },
                ],
            };
        },
        computed: {
            gpa() {
                const list = this.grade[this.range[this.term]];
                let gpa = 0;
                let num = 0;
                if (list) {
                    list.forEach((item) => {
                        if (!item.isElective) {
                            gpa += item.gpa;
                            num += 1;
                        }
                    });
                }
                return num > 0 ? (gpa / num).toFixed(3) : '暂无成绩';
            },
            percent() {
                const list = this.grade[this.range[this.term]];
                let percent = [0, 0, 0, 0, 0];
                if (list) {
                    list.forEach(($item) => {
                        const item = { ...$item };
                        switch (item.score) {
                            case '优秀': item.score = '90'; break;
                            case '良好': item.score = '80'; break;
                            case '中等': item.score = '70'; break;
                            case '及格': item.score = '60'; break;
                            case '不及格': item.score = '50'; break;
                            default: break;
                        }
                        if (item.score >= 90) percent[0] += 1;
                        else if (item.score >= 80) percent[1] += 1;
                        else if (item.score >= 70) percent[2] += 1;
                        else if (item.score >= 60) percent[3] += 1;
                        else percent[4] += 1;
                    });
                    percent = percent.map(item => Number((item / list.length).toFixed(3)));
                    percent.forEach((item, index) => {
                        if (index === 4) {
                            percent[index] = 1;
                        } else if (index > 0) {
                            percent[index] = item + percent[index - 1] > 1 ?
                                1 : item + percent[index - 1];
                        }
                    });
                }
                const pie = wx.createCanvasContext('pie');
                this.drawPie(pie, percent);
                return percent;
            },
        },
        async beforeMount() {
            const res = await jointer.getGrade();
            this.grade = res;
        },
        methods: {
            changeTerm(e) {
                this.term = e.target.value;
            },
            drawPie(pencil, percent) {
                const drawSector = (start, end, color) => {
                    pencil.beginPath();
                    pencil.moveTo(50, 50);
                    pencil.arc(50, 50, 40, start * Math.PI * 2, end * Math.PI * 2);
                    pencil.setFillStyle(color);
                    pencil.closePath();
                    pencil.fill();
                };
                drawSector(0, percent[0], '#F75C2F');
                drawSector(percent[0], percent[1], '#A0D8EF');
                drawSector(percent[1], percent[2], '#EFCD9A');
                drawSector(percent[2], percent[3], '#38B48B');
                drawSector(percent[3], 1, '#84A2D4');
                pencil.draw();
            },
        },
    };
</script>

<style lang="scss">
    
</style>

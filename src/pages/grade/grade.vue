<template>
    <movable-area class="container grade-container">
        <div class="cover">
            <div class="text">{{range[term]}}</div>
            <div class="gpa">{{gpa}}</div>
            <div class="tip">注：此绩点仅供参考（不含选修）</div>
        </div>
        <div class="chart">
            <canvas canvas-id="pie" style="width: 120px; height: 120px;"></canvas>
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
        },
        async beforeMount() {
            const res = await jointer.getGrade();
            this.grade = res;
        },
        mounted() {
            const pie = wx.createCanvasContext('pie');
            this.drawPie(pie, [0.2, 0.5, 0.8, 0.9]);
        },
        methods: {
            changeTerm(e) {
                this.term = e.target.value;
            },
            drawPie(pencil, percent) {
                const drawSector = (start, end, color) => {
                    pencil.beginPath();
                    pencil.moveTo(50, 50);
                    pencil.arc(50, 50, 50, start * Math.PI * 2, end * Math.PI * 2);
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

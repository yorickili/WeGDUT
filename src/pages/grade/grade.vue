<template>
    <movable-area class="container grade-container">
        <div class="cover">
            <div class="text">{{range[term]}}</div>
            <div class="gpa">{{gpa}}</div>
            <div class="tip">注：此绩点仅供参考（不含选修）</div>
        </div>
        <div class="chart"></div>
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
        async beforeMount() {
            const res = await jointer.getGrade();
            this.grade = res;
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
        methods: {
            changeTerm(e) {
                this.term = e.target.value;
            },
        },
    };
</script>

<style lang="scss">
    
</style>

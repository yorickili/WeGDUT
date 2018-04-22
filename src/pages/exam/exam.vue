<template>
    <div class="container exam-container">
        <div class="panel">
            <div class="card" v-for="(item, index) in list" :key="index">
                <div class="name">
                    <div class="label" :style="{ background: item.color }" />
                    {{item.name}}
                </div>
                <div class="time">
                    时间：{{item.time}}
                </div>
                <div class="site">
                    地点：{{item.site}}
                    <div class="surplus" :style="{ color: item.color }">
                        <span>{{item.surplus}}</span>天
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { jointer } from '@/lib';

    export default {
        data() {
            const item = { name: '高等数学', site: '教二-222', surplus: 7, color: '#FFD92B', time: '2018-05-31  周四  14:40:00' };
            return {
                list: [item, item, item],
            };
        },
        async beforeMount() {
            const exam = await jointer.getExam();
            console.log(exam);
        },
    };
</script>

<style lang="scss">

</style>

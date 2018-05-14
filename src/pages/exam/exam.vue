<template>
    <movable-area class="container exam-container">
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
        <Mover actions="刷新" @handler="moverHandler" />
    </movable-area>
</template>

<script>
    import Mover from '@/components/Mover';
    import { jointer } from '@/lib';

    export default {
        components: { Mover },
        data() {
            return {
                list: [],
            };
        },
        async beforeMount() {
            this.list = await jointer.getExam(false);
        },
        methods: {
            async moverHandler($index) {
                switch ($index) {
                    case 0: this.list = await jointer.getExam(true); break;
                    default: break;
                }
            },
        },
    };
</script>

<style lang="scss">

</style>

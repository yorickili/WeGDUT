<template>
    <div class="container news-container">
        <div class="panel">
            <div class="card" v-for="(item, index) in list" :key="index">
                <div class="name">
                    <div class="label" />
                    {{item.name}}
                </div>
                <div class="info">
                    <div class="unit">{{item.unit}}</div>
                    <div class="time">{{item.time}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { jointer } from '@/lib';

    export default {
        data() {
            return {
                list: [],
            };
        },
        beforeMount() {
            this.setList();
        },
        methods: {
            async setList() {
                this.list = await jointer.getNews();
            },
        },
    };
</script>

<style lang="scss">
    
</style>

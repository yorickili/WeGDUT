<template>
    <div class="container news-container">
        <div class="panel">
            <div
                class="card"
                v-for="(item, index) in list"
                :key="index"
                @click="lookNotice(item)"
            >
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
        async beforeMount() {
            this.list = await jointer.getNews();
        },
        methods: {
            lookNotice(item) {
                wx.navigateTo({ url: `/pages/notice/notice?rd=${item.rd}&name=${item.name}&type=${item.type}` });
            },
        },
    };
</script>

<style lang="less">

</style>

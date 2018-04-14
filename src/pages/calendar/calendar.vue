<template>
    <div class="container calendar-container">
        <div class="zan-cell" v-for="item in list" :key="item.index">
            <div class="icon zan-cell__icon zan-icon zan-icon-underway" />
            <div class="zan-cell__bd">
                <div class="zan-cell__text">{{item.name}}</div>
                <div class="zan-cell__desc">{{item.site}}</div>
            </div>
            <div class="zan-cell__ft">{{item.time}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            const item = { name: '高等数学', site: '教二-222', time: '2018-05-31 14:40:00' };
            return {
                list: [item, item, item, item, item, item],
            };
        },
    };
</script>

<style lang="scss">
    
</style>

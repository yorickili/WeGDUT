<template>
    <movable-area class="container library-container">
        <div class="weui-search-bar">
            <div class="weui-search-bar__form">
                <div class="weui-search-bar__box">
                    <icon class="weui-icon-search_in-box" type="search" size="14" />
                    <input type="text" class="weui-search-bar__input" placeholder="搜索" v-model="word" @confirm="search" />
                    <div class="weui-icon-clear" @click="word = ''"><icon type="clear" size="14" /></div>
                </div>
            </div>
        </div>
        <div class="panel">
            <div class="card" v-for="item in list" :key="item.index">
                <div class="icon">
                    <div class="zan-icon zan-icon-goods-collect" />
                </div>
                <div class="info">
                    <div class="name">{{item.name}}</div>
                    <div class="author">{{item.author}}</div>
                </div>
                <div class="arrow">
                    <div class="zan-icon zan-icon-arrow" />
                </div>
            </div>
        </div>
        <Mover actions="我的借阅" @handler="moverHandler" />
    </movable-area>
</template>

<script>
    import Mover from '@/components/Mover';
    import { jointer } from '@/lib';

    export default {
        components: { Mover },
        data() {
            return {
                word: '',
                list: [],
            };
        },
        methods: {
            async search() {
                this.list = await jointer.searchBook(this.word);
            },
            moverHandler(index) {
                switch (index) {
                    case 0: wx.navigateTo({ url: '/pages/store/store' }); break;
                    default: break;
                }
            },
        },
    };
</script>

<style lang="scss">
    
</style>

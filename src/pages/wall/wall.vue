<template>
    <movable-area class="container wall-container">
        <div class="cover">
            <swiper :circular="true" :autoplay="true">
                <swiper-item v-for="cover in covers" :key="cover.index">
                    <img :src="cover" />
                </swiper-item>
            </swiper>
            <div class="user">
                <span>{{nickname}}</span>
                <img :src="avatar" />
            </div>
        </div>
        <div class="cards">
            <Card
                v-for="card in cards"
                :key="card.index"
                type="wall"
                :id="card.id"
                :avatar="card.avatar"
                :nickname="card.nickname"
                :device="card.device"
                :time = "card.time"
                :text="card.text"
                :img="card.img"
                :likes="card.likes"
                :comments="card.comments" />
        </div>
        <Mover :actions="actions" @handler="moverHandler" />
    </movable-area>
</template>

<script>
    import Card from '@/components/Card';
    import Mover from '@/components/Mover';
    import { jointer } from '@/lib';

    export default {
        components: { Card, Mover },
        data() {
            return {
                covers: [
                    'http://minigame.qq.com/common_manage/381/big_image_ba04e5557bdc42bf5f3e3af3379843df.jpg',
                    'http://minigame.qq.com/common_manage/381/big_image_df699c4fa854d9245bd0f7c1662be5ca.jpg',
                ],
                avatar: '',
                nickname: '',
                cards: [],
                isMy: false,
            };
        },
        computed: {
            actions() {
                return `贴卡片&${this.isMy ? '全部' : '我的'}卡片`;
            },
        },
        beforeMount() {
            this.getCards();
        },
        methods: {
            getCards(isMy) {
                this.isMy = isMy;
                return new Promise(async (resolve) => {
                    this.cards = await jointer.getCards(isMy);
                    resolve();
                });
            },
            moverHandler(index) {
                switch (index) {
                    case 0: wx.navigateTo({ url: '/pages/painter/painter' }); break;
                    case 1: this.getCards(!this.isMy); break;
                    default: break;
                }
            },
        },
        async onPullDownRefresh() {
            await this.getCards(this.isMy);
            wx.stopPullDownRefresh();
        },
    };
</script>

<style lang="scss">
    
</style>

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
                :avatar="card.avatar"
                :nickname="card.nickname"
                :device="card.device"
                :text="card.text"
                :img="card.img"
                :likeCount="card.likeCount"
                :commentsCount="card.commentsCount" />
        </div>
        <Mover actions="贴卡片&我的卡片" @handler="moverHandler" />
    </movable-area>
</template>

<script>
    import Card from '@/components/Card';
    import Mover from '@/components/Mover';
    import { promiser, jointer } from '@/lib';

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
            };
        },
        async created() {
            console.log(await jointer.getCards());
            await promiser.getGlobalData();
            this.avatar = global.data.avatarUrl;
            this.nickname = global.data.nickName;
            const card = {
                avatar: this.avatar,
                nickname: this.nickname,
                device: 'iPhone X',
                text: '测试内容',
                img: 'https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/home/img/qrcode/zbios_x2_9d645d9.png',
                likeCount: 20,
                commentsCount: 20,
            };
            const card1 = {
                avatar: this.avatar,
                nickname: this.nickname,
                device: 'iPhone X',
                text: '测试内容',
                img: '',
                likeCount: 20,
                commentsCount: 20,
            };
            this.cards = [card, card, card1, card1, card];
        },
        methods: {
            moverHandler(index) {
                switch (index) {
                    case 0: promiser.navigateTo({ url: '/pages/painter/painter' }); break;
                    default: break;
                }
            },
        },
    };
</script>

<style lang="scss">
    
</style>

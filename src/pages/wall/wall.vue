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
                v-for="(card, index) in cards"
                :key="index"
                type="wall"
                :index="index"
                :id="card.id"
                :avatar="card.avatar"
                :nickname="card.nickname"
                :device="card.device"
                :time = "card.time"
                :text="card.text"
                :img="card.img"
                :likes="card.likes"
                :isLike="card.isLike"
                :comments="card.comments"
                :isComment="card.isComment"
                :isShowDel="isMy"
                @delete="deleteCard"
            />
        </div>
        <Mover :actions="actions" @handler="moverHandler" />
    </movable-area>
</template>

<script>
    import Card from '@/components/Card';
    import Mover from '@/components/Mover';
    import { jointer, tool } from '@/lib';

    export default {
        components: { Card, Mover },
        data() {
            return {
                covers: [
                    'http://oox3shbsf.bkt.clouddn.com/tmp/wx45380ff8bc1c2e10.o6zAJsyFJyypE_zOyMM45R8FzfGA.L3sGYHWHzCHs42cba9d1d3ac823c23874d1e224c5ecb.png',
                    'http://oox3shbsf.bkt.clouddn.com/tmp/wx45380ff8bc1c2e10.o6zAJsyFJyypE_zOyMM45R8FzfGA.htI4eZyMlcQR693c3e450d6ba44982cd89dbd77e07cd.png',
                ],
                avatar: '',
                nickname: '',
                cards: [],
                stamp: Date.now(),
                isAll: false,
                isMy: false,
            };
        },
        computed: {
            actions() {
                return `贴卡片&${this.isMy ? '全部' : '我的'}卡片`;
            },
        },
        watch: {
            cards(now) {
                if (now.length > 0) this.stamp = now[now.length - 1].stamp * 1000;
            },
        },
        beforeMount() {
            this.getCards(tool.formatTime(Date.now()), false);
        },
        methods: {
            getCards(time, isMy, isRefresh = false) {
                this.isMy = isMy;
                return new Promise(async (resolve) => {
                    const cards = await jointer.getCards(time, isMy);
                    if (cards.length < 20) this.isAll = true;
                    this.cards = isRefresh ? cards : this.cards.concat(cards);
                    resolve();
                });
            },
            moverHandler(index) {
                switch (index) {
                    case 0: wx.navigateTo({ url: '/pages/painter/painter' }); break;
                    case 1: this.getCards(tool.formatTime(Date.now()), !this.isMy, true); break;
                    default: break;
                }
            },
            deleteCard(index) {
                this.cards.splice(index, 1);
            },
        },
        async onPullDownRefresh() {
            await this.getCards(tool.formatTime(Date.now()), this.isMy, true);
            this.isAll = false;
            wx.stopPullDownRefresh();
        },
        onReachBottom() {
            if (!this.isAll) {
                this.getCards(tool.formatTime(this.stamp), this.isMy);
            }
        },
        onShareAppMessage() {
            return {
                title: '来这里认识更多有趣的灵魂~',
                path: '/pages/wall/wall',
            };
        },
    };
</script>

<style lang="less">

</style>

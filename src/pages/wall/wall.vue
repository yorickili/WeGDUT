<template>
    <movable-area class="container wall-container">
        <div class="cover">
            <swiper :circular="true" :autoplay="true">
                <swiper-item v-for="(item, index) in covers" :key="index">
                    <img :src="item" />
                </swiper-item>
            </swiper>
            <div class="user">
                <span>{{nickname}}</span>
                <img :src="avatar" />
            </div>
        </div>
        <div class="cards">
            <Card
                v-for="(item, index) in cards"
                :key="index"
                :type="type"
                :index="index"
            />
        </div>
        <Mover :actions="actions" @handler="moverHandler" />
    </movable-area>
</template>

<script>
    import Card from '@/components/Card';
    import Mover from '@/components/Mover';
    import { jointer, tool, store } from '@/lib';

    export default {
        store,
        components: { Card, Mover },
        data() {
            return {
                covers: [
                    'http://oox3shbsf.bkt.clouddn.com/tmp/wx45380ff8bc1c2e10.o6zAJsyFJyypE_zOyMM45R8FzfGA.L3sGYHWHzCHs42cba9d1d3ac823c23874d1e224c5ecb.png',
                    'http://oox3shbsf.bkt.clouddn.com/tmp/wx45380ff8bc1c2e10.o6zAJsyFJyypE_zOyMM45R8FzfGA.htI4eZyMlcQR693c3e450d6ba44982cd89dbd77e07cd.png',
                ],
                avatar: '',
                nickname: '',
                type: 0,
            };
        },
        computed: {
            actions() {
                return `贴卡片&${this.type === 0 ? '我的' : '全部'}卡片`;
            },
            cards() {
                return this.$store.state.cards || [];
            },
        },
        beforeMount() {
            this.initCards();
        },
        methods: {
            async initCards() {
                global.cardsIsAll = false;
                const cards = await jointer.getCards(tool.formatTime(Date.now()), this.type === -1);
                if (cards.length < 20) global.cardsIsAll = true;
                this.$store.commit('setCards', cards);
                wx.stopPullDownRefresh();
            },
            async addCards() {
                if (!global.cardsIsAll) {
                    const stamp = this.cards[this.cards.length - 1].stamp * 1000;
                    const cards = await jointer.getCards(tool.formatTime(stamp), this.type === -1);
                    if (cards.length < 20) global.cardsIsAll = true;
                    this.$store.commit('setCards', [...this.cards].concat(cards));
                }
            },
            moverHandler(index) {
                switch (index) {
                    case 0: wx.navigateTo({ url: '/pages/painter/painter' }); break;
                    case 1: this.type = (this.type === 0 ? -1 : 0); this.initCards(); break;
                    default: break;
                }
            },
            deleteCard(index) {
                this.$store.commit('deleteCard', index);
            },
        },
        onPullDownRefresh() {
            this.initCards();
        },
        onReachBottom() {
            this.addCards();
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

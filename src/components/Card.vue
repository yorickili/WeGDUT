<template>
    <div class="card-container">
        <div v-if="type === -1" class="close zan-icon zan-icon-close" @click.stop="deleteCard"></div>
        <div class="main"  @click="go2Origami">
            <div class="header">
                <img :src="card.avatar" />
                <div>
                    <span>{{card.nickname}}</span>
                    <span class="device">{{card.time}} &nbsp;&nbsp;&nbsp; 来自 {{card.device}}</span>
                </div>
            </div>
            <div class="body">
                <div>{{card.text}}</div>
                <img v-if="card.img" :src="card.img" mode="aspectFit" @click.stop="previewImage" />
            </div>
        </div>
        <div class="footer">
            <div @click="comment">
                <img :src="icon.comment" />
                <span>{{card.comments.length}}</span>
            </div>
            <div @click="like">
                <img :src="icon.like" />
                <span>{{card.likes}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import { jointer, promiser, store } from '@/lib';

    export default {
        store,
        props: {
            type: Number, // -1: 显示删除按钮,点击可进入详情页, 0: 不显示删除按钮,点击可进入详情页, 1: 详情页，整体点击无效,
            index: Number,
            commentHandler: Function,
        },
        computed: {
            card() {
                return this.$store.state.cards[this.index] || { comments: [] };
            },
            icon() {
                return {
                    comment: `/static/icon/comment${this.card.isComment ? 2 : 1}.png`,
                    like: `/static/icon/like${this.card.isLike ? 2 : 1}.png`,
                };
            },
        },
        methods: {
            previewImage() {
                wx.previewImage({ urls: [this.card.img] });
            },
            comment() {
                if (this.type <= 0) this.go2Origami();
                else this.$emit('commentHandler');
            },
            async like() {
                const code = await jointer.like({ id: this.card.id });
                switch (code) {
                    case 200: this.$store.commit('setLike', this.index); break;
                    case 201: this.$store.commit('setLike', this.index); break;
                    default: break;
                }
            },
            go2Origami() {
                if (this.type <= 0) {
                    wx.navigateTo({
                        url: `/pages/origami/origami?index=${this.index}`,
                    });
                }
            },
            async deleteCard() {
                const { confirm } = await promiser.showModal({
                    title: '提示',
                    content: '确定删除这张卡片吗？',
                });
                if (confirm) {
                    await jointer.deleteCard(this.card.id);
                    await promiser.showModal({
                        title: '提示',
                        content: '删除成功!',
                        showCancel: false,
                    });
                    this.$store.commit('deleteCard', this.index);
                }
            },
        },
    };
</script>

<style lang="less">

</style>

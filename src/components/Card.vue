<template>
    <div class="card-container">
        <div v-if="isShowDel" class="close zan-icon zan-icon-close" @click.stop="deleteCard"></div>
        <div class="main"  @click="go2Origami">
            <div class="header">
                <img :src="avatar" />
                <div>
                    <span>{{nickname}}</span>
                    <span class="device">{{time}} &nbsp;&nbsp;&nbsp; 来自 {{device}}</span>
                </div>
            </div>
            <div class="body">
                <div>{{text}}</div>
                <img v-if="img" :src="img"  mode="aspectFit" @click.stop="previewImage" />
            </div>
        </div>
        <div class="footer">
            <div @click="comment">
                <img :src="commentIcon" />
                <span>{{comments.length}}</span>
            </div>
            <div @click="like">
                <img :src="likeIcon" />
                <span>{{likes}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import { jointer, promiser } from '@/lib';

    export default {
        props: {
            type: String,
            index: String,
            id: String,
            avatar: String,
            nickname: String,
            time: String,
            device: String,
            text: String,
            img: String,
            likes: Number,
            isLike: Boolean,
            comments: Array,
            isComment: Boolean,
            isShowDel: Boolean,
            commentHandler: Function,
            delete: Function,
        },
        data() {
            return {};
        },
        computed: {
            commentIcon() {
                return `/static/icon/comment${this.isComment ? 2 : 1}.png`;
            },
            likeIcon() {
                return `/static/icon/like${this.isLike ? 2 : 1}.png`;
            },
        },
        methods: {
            previewImage() {
                wx.previewImage({ urls: [this.img] });
            },
            comment() {
                if (this.type === 'wall') this.go2Origami();
                else this.$emit('commentHandler');
            },
            async like() {
                const code = await jointer.like({ id: this.id });
                switch (code) {
                    case 200: this.isLike = true; this.likes += 1; break;
                    case 201: this.isLike = false; this.likes -= 1; break;
                    default: break;
                }
            },
            go2Origami() {
                if (this.type === 'wall') {
                    wx.navigateTo({ url: `/pages/origami/origami?detail=${JSON.stringify(this.$props)}` });
                }
            },
            async deleteCard() {
                const { confirm } = await promiser.showModal({
                    title: '提示',
                    content: '确定删除这张卡片吗？',
                });
                if (confirm) {
                    await jointer.deleteCard(this.id);
                    await promiser.showModal({
                        title: '提示',
                        content: '删除成功!',
                        showCancel: false,
                    });
                    this.$emit('delete', this.index);
                }
            },
        },
    };
</script>

<style lang="less">

</style>

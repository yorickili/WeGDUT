<template>
    <div class="card-container">
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
                <img v-if="img" :src="img"  mode="aspectFit" @click.stop="previewImage()" />
            </div>
        </div>
        <div class="footer">
            <div @click="comment">
                <img :src="icon.comment" />
                <span>{{comments.length}}</span>
            </div>
            <div @click="like">
                <img :src="icon.like" />
                <span>{{likes.length}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import { jointer } from '@/lib';

    export default {
        props: {
            type: String,
            id: String,
            avatar: String,
            nickname: String,
            time: String,
            device: String,
            text: String,
            img: String,
            likes: Array,
            comments: Array,
            commentHandler: Function,
        },
        data() {
            return {
                icon: {
                    comment: '/static/icon/评论1.png',
                    like: '/static/icon/点赞1.png',
                },
            };
        },
        methods: {
            previewImage() {
                wx.previewImage({ urls: [this.img] });
            },
            comment() {
                if (this.type === 'wall') this.go2Origami();
                else this.$emit('commentHandler');
                // this.icon.comment = '/static/icon/评论2.png';
            },
            async like() {
                const code = await jointer.like({ id: this.id });
                switch (code) {
                    case 200: this.icon.like = '/static/icon/点赞2.png'; break;
                    case 500: this.icon.like = '/static/icon/点赞1.png'; break;
                    default: break;
                }
            },
            go2Origami() {
                if (this.type === 'wall') {
                    wx.navigateTo({ url: `/pages/origami/origami?detail=${JSON.stringify(this.$props)}` });
                }
            },
        },
    };
</script>

<style lang="scss">

</style>
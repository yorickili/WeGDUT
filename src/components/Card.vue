<template>
    <div class="card-container" :style="{ scaleStyle }">
        <div class="main"  @click="shrink">
            <div class="header">
                <img :src="avatar" />
                <div>
                    <span>{{nickname}}</span>
                    <span class="device">{{time}}  来自{{device}}</span>
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
                <span>{{commentsCount}}</span>
            </div>
            <div @click="like">
                <img :src="icon.like" />
                <span>{{likeCount}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import { promiser } from '@/lib';

    export default {
        props: {
            type: String,
            avatar: String,
            nickname: String,
            time: String,
            device: String,
            text: String,
            img: String,
            likeCount: Number,
            commentsCount: Number,
        },
        data() {
            return {
                icon: {
                    comment: '/static/icon/评论1.png',
                    like: '/static/icon/点赞1.png',
                },
                scale: 1,
            };
        },
        computed: {
            scaleStyle() {
                return `transform: scale(${this.scale}, ${this.scale})`;
            },
        },
        methods: {
            previewImage() {
                wx.previewImage({ urls: [this.img] });
            },
            comment() {
                this.icon.comment = '/static/icon/评论2.png';
                this.commentsCount += 1;
            },
            like() {
                this.icon.like = '/static/icon/点赞2.png';
                this.likeCount += 1;
            },
            shrink() {
                if (this.type === 'origami') return null;
                const timer = setInterval(async () => {
                    if (this.scale > 0.92) {
                        this.scale -= 0.008;
                    } else {
                        clearInterval(timer);
                        await promiser.navigateTo({ url: `/pages/origami/origami?detail=${JSON.stringify(this.$props)}` });
                        this.scale = 1;
                    }
                }, 10);
                return '';
            },
        },
    };
</script>

<style lang="scss">

</style>
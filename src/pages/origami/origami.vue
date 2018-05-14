<template>
    <div class="container origami-container">
        <Card
            type="origami"
            :avatar="avatar"
            :nickname="nickname"
            :time="time"
            :device="device"
            :text="text"
            :img="img"
            :likes="likes"
            :isLike="isLike"
            :comments="comments"
            :isComment="isComment"
            @commentHandler="visible.commentHandler = !visible.commentHandler"
        />
        <div class="comments">
            <div class="comment-container" v-for="(item, index) in comments" :key="index">
                <img class="avatar" :src="item.avatar" />
                <div class="comment">
                    <span>{{item.nickname}}</span>
                    <div class="text">{{item.text}}</div>
                </div>
            </div>
        </div>
        <div class="comment-handler" v-show="visible.commentHandler">
            <input
                type="text"
                placeholder="写评论…"
                v-model="comment"
                @confirm="sendComment"
            />
            <div class="anon">
                <div>是否匿名</div>
                <switch @change="anon = !anon" />
            </div>      
        </div>
    </div>
</template>

<script>
    import Card from '@/components/Card';
    import { promiser, jointer } from '@/lib';

    export default {
        components: { Card },
        data() {
            return {
                id: '',
                avatar: '',
                nickname: '',
                time: '',
                device: '',
                text: '',
                img: '',
                likes: 0,
                isLike: false,
                comments: [],
                isComment: false,
                visible: {
                    commentHandler: false,
                },
                comment: '',
                anon: false,
            };
        },
        beforeMount() {
            if (this.$root.$mp.query.detail) {
                const detail = JSON.parse(this.$root.$mp.query.detail);
                ['id', 'avatar', 'nickname', 'time', 'device', 'text', 'img', 'likes', 'isLike', 'comments', 'isComment'].forEach((attr) => {
                    this[attr] = detail[attr];
                });
                this.visible.commentHandler = false;
                this.comment = '';
                this.anon = false;
            }
        },
        methods: {
            async sendComment() {
                const { avatar, nickname } = await promiser.getGlobalData();
                this.comments.push({ avatar, nickname, text: this.comment });
                jointer.sendComment({ content: this.comment, post_id: this.id, to_id: '5a698425869d0060e7f76db2' });
            },
        },
    };
</script>

<style lang="scss">

</style>

<template>
    <div class="container origami-container">
        <Card
            type="origami"
            :id="id"
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
                placeholder="想说......"
                v-model="comment"
                cursor-spacing="50"
                @confirm="sendComment"
            />
            <div class="anon">
                <Button
                    text="匿名发送"
                    size="small"
                    stylus="width: 30%; height: 32px; margin: 10px 10%; padding: 0; border-radius: 5px;"
                    @click="sendComment()"
                />
                <Button
                    text="发送"
                    size="small"
                    stylus="width: 30%; height: 32px; margin: 10px 10%; padding: 0; border-radius: 5px;"
                    openType="getUserInfo"
                    @getUserInfo="getUserInfo"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import Card from '@/components/Card';
    import Button from '@/components/Button';
    import { jointer } from '@/lib';

    export default {
        components: { Card, Button },
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
            }
        },
        methods: {
            async sendComment($avatar = 'http://oox3shbsf.bkt.clouddn.com/tmp/wx45380ff8bc1c2e10.o6zAJsyFJyypE_zOyMM45R8FzfGA.vyTbWxZnOxIu3f6051380cd24c57ba5aba91693340ba.png', $nickname = '匿名用户') {
                this.comments.push({ avatar: $avatar, nickname: $nickname, text: this.comment });
                jointer.sendComment({ content: this.comment, post_id: this.id, to_id: '5a698425869d0060e7f76db2' });
            },
            getUserInfo(e) {
                const { errMsg, userInfo } = e.mp.detail;
                if (errMsg === 'getUserInfo:ok') this.sendComment(userInfo.avatarUrl, userInfo.nickname);
                else wx.showToast({ title: '允许WeGDUT获取您的信息后才能发送评论~', icon: 'none' });
            },
        },
    };
</script>

<style lang="less">

</style>

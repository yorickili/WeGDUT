<template>
    <div class="container origami-container">
        <Card
            :type="1"
            :index="index"
            @commentHandler="visible.commentHandler = !visible.commentHandler"
        />
        <div class="comments">
            <div class="comment-container" v-for="(item, index) in card.comments" :key="index">
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
                maxlength="50"
                placeholder="想说......"
                v-model="comment"
                cursor-spacing="50"
                @confirm="sendComment"
            />
            <div class="anon">
                <Button
                    text="匿名发送"
                    size="small"
                    stylus="width: 30%; height: 32px; line-height: 30px; margin: 10px 10%; padding: 0; border-radius: 10px;"
                    @click="sendComment(true)"
                />
                <Button
                    text="发送"
                    size="small"
                    stylus="width: 30%; height: 32px; line-height: 30px; margin: 10px 10%; padding: 0; border-radius: 10px;"
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
    import { anon } from '@/config';
    import { jointer, store } from '@/lib';

    export default {
        store,
        components: { Card, Button },
        data() {
            return {
                index: 0,
                comment: '',
                visible: { commentHandler: false },
            };
        },
        computed: {
            card() {
                return this.$store.state.cards[this.index] || {};
            },
        },
        onShow() {
            this.index = this.$root.$mp.query.index || 0;
        },
        onHide() {
            this.card = {};
            this.visible.commentHandler = false;
            this.comment = '';
        },
        methods: {
            async sendComment($isAnon = true, userInfo) {
                await jointer.sendComment({
                    content: this.comment,
                    post_id: this.card.id,
                    to_id: '5a698425869d0060e7f76db2',
                    isAnon: $isAnon,
                });
                this.visible.commentHandler = false;
                this.$store.commit('addComment', {
                    index: this.index,
                    comment: {
                        text: this.comment,
                        avatar: $isAnon ? anon.avatar : userInfo.avatarUrl,
                        nickname: $isAnon ? anon.nickname : userInfo.nickName,
                    },
                });
            },
            getUserInfo(e) {
                const { errMsg, userInfo } = e.mp.detail;
                if (errMsg === 'getUserInfo:ok') {
                    jointer.updateUserInfo({
                        avatarUrl: userInfo.avatarUrl,
                        nickName: userInfo.nickName,
                    });
                    this.sendComment(false, userInfo);
                } else {
                    wx.showToast({
                        title: '允许WeGDUT获取您的信息后才能发送评论~',
                        icon: 'none',
                    });
                }
            },
        },
    };
</script>

<style lang="less">

</style>

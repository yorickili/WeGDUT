<template>
    <div class="container origami-container">
        <Card
            :type="type"
            :avatar="avatar"
            :nickname="nickname"
            :device="device"
            :text="text"
            :img="img"
            :likeCount="likeCount"
            :commentsCount="commentsCount" />
        <div class="comments">
            <Comment
                v-for="comment in comments"
                :key="comment.index"
                :avatar="comment.avatar"
                :nickname="comment.nickname"
                :text="comment.text" />
        </div>
    </div>
</template>

<script>
    import Card from '@/components/Card';
    import Comment from '@/components/Comment';

    export default {
        components: { Card, Comment },
        data() {
            const comment = {
                avatar: 'https://wx.qlogo.cn/mmopen/vi_32/T3L9co6vFq8hnljV9YJXaKfViaa2eOy70y7o4TRle5Dxw1wa6ib6en3KOD06VZQrKnGcwH8Jsficib5xIWFV50NlNA/0',
                nickname: 'test',
                text: '123',
            };
            return {
                type: 'origami',
                avatar: '',
                nickname: '',
                device: '',
                text: '',
                img: '',
                likeCount: '',
                commentsCount: '',
                comments: [comment, comment, comment, comment, comment, comment,
                    comment, comment, comment, comment, comment, comment],
            };
        },
        beforeMount() {
            if (this.$root.$mp.query.detail) {
                const detail = JSON.parse(this.$root.$mp.query.detail);
                ['avatar', 'nickname', 'device', 'text', 'img', 'likeCount', 'commentsCount'].forEach((attr) => {
                    this[attr] = detail[attr];
                });
            }
        },
    };
</script>

<style lang="scss">

</style>

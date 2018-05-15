<template>
    <div class="comment-wrapper">
        <input type="text" placeholder="写评论…"/>
        <div class="anon">
            <div>是否匿名</div>
            <switch checked="{{anonValue}}"/>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            avatar: String,
            nickname: String,
            text: String,
        },
    };
</script>

<style lang="less">
    .comment-wrapper{
        position: fixed;
        bottom: 0;
        width: 750rpx;
        color: #353535;
        font-size: 25rpx;
        background: #FFFFFF;
        border-top: 1rpx solid #CCCCCC;
        input{
            padding: 0 15rpx;
            border-bottom: 1rpx solid #F1F1F1;
            height: 80rpx;
        }
        .anon{
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 15rpx;
            switch {
                margin-left: 20rpx;
            }
        }
    }
</style>

<template>
    <div class="container about-container">
        <img src="/static/icon/logo.png" />
        <div class="about zan-panel">
            <div class="zan-cell">
                <div class="zan-cell__bd">制作团队</div>
                <div class="zan-cell__ft">维生数工作室</div>
            </div>
            <div class="zan-cell zan-cell--access" @click="previewQRCode()">
                <div class="zan-cell__bd">公众号</div>
                <div class="zan-cell__ft">vtmers</div>
            </div>
            <div class="zan-cell zan-cell--access" @click="previewQRCode()">
                <div class="zan-cell__bd">请我们吃糖果~</div>
                <div class="zan-cell__ft"></div>
            </div>
            <div class="zan-cell zan-cell--access" @click="visible.opinion = !visible.opinion">
                <div class="zan-cell__bd">意见反馈</div>
                <div class="zan-cell__ft"></div>
            </div>
        </div>
        <div v-show="visible.opinion">
            <textarea
                class="opinion"
                v-model="opinion"
                placeholder="请留下您的宝贵意见~"
                placeholder-style="font-size: 15px;"
            />
            <Button @click="sendOpinion()" />
        </div>
    </div>
</template>

<script>
    import Button from '@/components/Button';
    import { promiser } from '@/lib';

    export default {
        components: { Button },
        data() {
            return {
                opinion: '',
                visible: {
                    opinion: false,
                },
            };
        },
        methods: {
            previewQRCode() {
                wx.previewImage({
                    urls: ['https://mp.weixin.qq.com/debug/wxadoc/dev/image/demo.jpg?t=2018314'],
                });
            },
            async sendOpinion() {
                if (this.opinion.length > 4) {
                    await promiser.showModal({
                        title: '提示',
                        content: '感谢您的反馈~',
                        showCancel: false,
                    });
                    this.opinion = '';
                    this.visible.opinion = false;
                } else {
                    await promiser.showModal({
                        title: '提示',
                        content: '我们需要您的真实反馈~',
                        showCancel: false,
                    });
                }
            },
        },
    };
</script>

<style lang="less">

</style>

<template>
    <div class="container about-container">
        <img src="/static/icon/logo.png" />
        <div class="about zan-panel">
            <div class="zan-cell">
                <div class="zan-cell__bd">制作团队</div>
                <div class="zan-cell__ft">维生数工作室</div>
            </div>
            <div class="zan-cell">
                <div class="zan-cell__bd">公众号</div>
                <div class="zan-cell__ft">vtmers</div>
            </div>
            <div class="zan-cell zan-cell--access" @click="previewQRCode('admire')">
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
    import { promiser, jointer } from '@/lib';

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
            previewQRCode(type) {
                const code = {
                    qr: 'http://oox3shbsf.bkt.clouddn.com/tmp_88d913cde1d6243e40508487cfdb4fb3.jpg',
                    admire: 'http://oox3shbsf.bkt.clouddn.com/tmp_190d92cd5ba488ee0edcd38c77493e51.jpg',
                };
                wx.previewImage({
                    urls: [code[type]],
                });
            },
            async sendOpinion() {
                if (this.opinion.length > 4) {
                    await jointer.sendSuggestion(this.opinion);
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

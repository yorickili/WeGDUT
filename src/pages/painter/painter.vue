<template>
    <div class="container painter-container">
        <div class="painter">
            <textarea v-model="text" placeholder="请输入卡片内容~" maxlength="200" />
            <div v-if="!img" @click="chooseImg">+</div>
            <img v-else :src="img" mode="aspectFit" @click="chooseImg" />
        </div>
        <div class="handler">
            <Button
                text="匿名发送"
                stylus="width: 30%; margin: 20px 10%; border-radius: 5px;"
                :disabled="!this.text"
                @click="sendCard"
            />
            <Button
                text="发送"
                stylus="width: 30%; margin: 20px 10%; border-radius: 5px;"
                :disabled="!this.text"
                openType="getUserInfo"
                @getUserInfo="getUserInfo"
            />
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
                img: '',
                text: '',
            };
        },
        methods: {
            async chooseImg() {
                const res = await promiser.chooseImage({ count: 1 });
                this.img = res.tempFilePaths[0];
            },
            previewImg() {
                wx.previewImage({ urls: this.img });
            },
            async sendCard() {
                const { model } = await promiser.getSystemInfo();
                await jointer.sendCard({
                    content: this.text,
                    imgUrl: this.img,
                    phone: model,
                });
                await promiser.showModal({
                    title: '提示',
                    content: '贴卡片成功~',
                    showCancel: false,
                });
                wx.switchTab({ url: '/pages/wall/wall' });
            },
            getUserInfo(e) {
                const { errMsg, userInfo } = e.mp.detail;
                if (errMsg === 'getUserInfo:ok') {
                    jointer.updateUserInfo({
                        avatarUrl: userInfo.avatarUrl,
                        nickName: userInfo.nickName,
                    });
                    this.sendCard();
                } else {
                    wx.showToast({
                        title: '允许WeGDUT获取您的信息后才能贴卡片~',
                        icon: 'none',
                    });
                }
            },
        },
    };
</script>

<style lang="less">

</style>

<template>
    <div class="container painter-container">
        <div class="painter">
            <textarea v-model="text" placeholder="请输入卡片内容~" maxlength="200" />
            <div v-if="!img" @click="chooseImg">+</div>
            <img v-else :src="img" mode="aspectFit" @click="chooseImg" />
        </div>
        <Button
            :disabled="!this.text"
            stylus="width: 80%; margin: 20px 10%;"
            @click="sendCard"
        >确定</Button>
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
                this.img = res.tempFilePaths;
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
            },
        },
    };
</script>

<style lang="scss">

</style>

<template>
    <div class="container login-container">
        <img class="logo" src="/static/icon/logo.png" />
        <div class="zan-panel">
            <div class="zan-cell zan-field">
                <div class="zan-cell__hd zan-field__title">学号</div>
                <input class="zan-field__input zan-cell__bd" type="number" placeholder="请输入学号" v-model="id" />
                <div class="zan-cell__ft" />
            </div>
            <div class="zan-cell zan-field">
                <div class="zan-cell__hd zan-field__title">密码</div>
                <input class="zan-field__input zan-cell__bd" type="password" placeholder="请输入密码" v-model="password" />
                <div class="zan-cell__ft" />
            </div>
            <div class="zan-cell zan-field">
                <div class="zan-cell__hd zan-field__title">验证码</div>
                <input class="zan-field__input zan-cell__bd" type="text" placeholder="请输入验证码" v-model="proof" />
                <img class="proof" :src="proofUrl" @click="refreshProofUrl" />
                <div class="zan-cell__ft" />
            </div>
        </div>
        <Button stylus="position: relative; top: 100px;" :disabled="!(id && password && proof)" @click="login()" />
        <img class="bg" src="/static/icon/bg.png">
    </div>
</template>

<script>
    import Button from '@/components/Button';
    import { promiser, jointer } from '@/lib';

    export default {
        components: { Button },
        data() {
            return {
                id: wx.getStorageSync('id') || '',
                password: wx.getStorageSync('password') || '',
                proof: '',
                proofUrl: '',
            };
        },
        async beforeMount() {
            this.refreshProofUrl();
        },
        methods: {
            async refreshProofUrl() {
                this.proofUrl = await jointer.getProofUrl();
            },
            async login() {
                wx.setStorageSync('id', this.id);
                wx.setStorageSync('password', this.password);
                const code = await jointer.login({
                    username: this.id,
                    password: this.password,
                    yzm: this.proof,
                });
                switch (code) {
                    case 200: {
                        await promiser.showModal({
                            title: '提示',
                            content: '登录成功',
                            showCancel: false,
                        });
                        wx.navigateBack();
                        break;
                    }
                    default: break;
                }
            },
        },
    };
</script>

<style lang="less">

</style>

<script>
    import { promiser, jointer } from '@/lib';

    import '@/assets/style/main.less';
    import '@/assets/style/zanui.less';

    export default {
        async created() {
            if (!wx.getStorageSync('mark180531')) {
                wx.clearStorageSync();
                wx.setStorageSync('mark180531', true);
            }
            const { code } = await promiser.login();
            jointer.getToken(code);
        },
    };
</script>

<style lang="less">
</style>

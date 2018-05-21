<script>
    import { promiser, jointer } from '@/lib';

    import '@/assets/style/main.less';
    import '@/assets/style/zanui.less';

    export default {
        async created() {
            if (!wx.getStorageSync('courseMark')) {
                wx.clearStorageSync();
                wx.setStorageSync('courseMark', true);
            }
            const { code } = await promiser.login();
            jointer.getToken(code);
        },
    };
</script>

<style lang="less">
</style>

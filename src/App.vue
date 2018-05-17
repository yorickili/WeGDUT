<script>
    import { promiser, jointer } from '@/lib';

    import '@/assets/style/main.less';
    import '@/assets/style/zanui.less';

    export default {
        async created() {
            const { code } = await promiser.login();
            jointer.getToken(code);
            // , nickName: '匿名用户', avatarUrl: 'http://oox3shbsf.bkt.clouddn.com/tmp/wx45380ff8bc1c2e10.o6zAJsyFJyypE_zOyMM45R8FzfGA.vyTbWxZnOxIu3f6051380cd24c57ba5aba91693340ba.png' });
        },
    };
</script>

<style lang="less">
</style>

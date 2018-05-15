<script>
    import { promiser, jointer } from '@/lib';
    import '@/assets/style/main.less';
    import '@/assets/style/zanui.less';

    export default {
        async created() {
            try {
                const { code } = await promiser.login();
                const { nickName, avatarUrl } = (await promiser.getUserInfo()).userInfo;
                global.data = {
                    nickname: nickName || '',
                    avatar: avatarUrl || '',
                };
                jointer.getToken({ code, nickName, avatarUrl });
            } catch (e) {
                console.error(e);
            }
        },
    };
</script>

<style lang="less">
</style>

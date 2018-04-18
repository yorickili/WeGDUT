<script>
    import { promiser, jointer } from '@/lib';
    import '@/assets/style/main.scss';
    
    export default {
        async created() {
            try {
                const { code } = await promiser.login();
                const { nickName, avatarUrl } = (await promiser.getUserInfo()).userInfo;
                global.data = {};
                global.data.nickName = nickName;
                global.data.avatarUrl = avatarUrl;
                jointer.getToken({ code, nickName, avatarUrl });
            } catch (e) {
                console.error(e);
            }
        },
    };
</script>

<style lang="scss">
</style>

<script>
    import { promiser, jointer } from '@/lib';
    import '@/assets/style/main.scss';
    
    export default {
        async created() {
            try {
                const { code } = await promiser.login();
                const { nickName, avatarUrl } = (await promiser.getUserInfo()).userInfo;
                jointer.getToken({ code, nickName, avatarUrl });
            } catch (e) {
                console.error(e);
            }
        },
    };
</script>

<style lang="scss">
</style>

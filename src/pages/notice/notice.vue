<template>
    <div class="container notice-container">
        <div v-html="article"></div>
    </div>
</template>

<script>
    import { jointer } from '@/lib';

    export default {
        data() {
            return {
                article: '',
            };
        },
        async beforeMount() {
            this.article = (await jointer.getNotice(this.$mp.query.rd)).replace(/<a.*?<\/a>/g, '');
            console.log(this.article);
        },
    };
</script>

<style lang="scss">
    .notice-container {
        width: 94%;
        margin: 0 3%;
        div {
            width: 100%;
            height: 100%;
        }
    }
</style>

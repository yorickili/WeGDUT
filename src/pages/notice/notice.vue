<template>
    <rich-text class="container notice-container" :nodes="article" />
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
            this.article = await jointer.getNotice(this.$mp.query.rd);
        },
    };
</script>

<style lang="scss">
    .notice-container {
        width: 300px;
        height: 400px;
    }
</style>

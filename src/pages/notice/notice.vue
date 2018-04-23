<template>
    <div class="container notice-container" v-html="article" />
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
    
</style>

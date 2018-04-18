<template>
    <movable-view class="mover-container" direction="all" inertia="true" @click="showActions">
        +
    </movable-view>
</template>

<script>
    import { promiser } from '@/lib';

    export default {
        props: {
            actions: String,
        },
        methods: {
            async showActions() {
                if (this.actions) {
                    const { tapIndex } = await promiser.showActionSheet({ itemList: this.actions.split('&') });
                    this.$emit('handler', tapIndex);
                }
            },
        },
    };
</script>

<style lang="scss">
    
</style>
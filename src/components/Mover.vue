<template>
    <movable-view
        class="mover-container"
        direction="all"
        inertia="true"
        :x="x"
        :y="y"
        @click="showActions"
    >
        <div>...</div>
    </movable-view>
</template>

<script>
    import { promiser } from '@/lib';

    export default {
        props: {
            actions: String,
        },
        data() {
            return {
                x: 0,
                y: 0,
            };
        },
        async created() {
            const { screenHeight, screenWidth } = await promiser.getSystemInfo();
            this.x = screenWidth - 70;
            this.y = screenHeight - 180;
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
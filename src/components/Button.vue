<template>
    <button class="button-container" :class="className" :style="stylus" @click="$emit('click')">
        {{text || '确定'}}
    </button>
</template>

<script>
    export default {
        props: {
            stylus: String,
            text: String,
            type: { type: String, default: 'primary' },
            size: { type: String, default: 'large' },
            disabled: { type: Boolean, default: false },
            isPlain: { type: Boolean, default: false },
            isLoading: { type: Boolean, default: false },
        },
        computed: {
            className() {
                const prefix = 'zan-btn--';
                const className = ['zan-btn', prefix + this.type, prefix + this.size].concat(
                    this.disabled ? [`${prefix}disabled`] : [],
                    this.isPlain ? [`${prefix}plain`] : [],
                    this.isLoading ? [`${prefix}loading`] : [],
                );
                return className.join(' ');
            },
        },
    };
</script>

<style lang="less">

</style>

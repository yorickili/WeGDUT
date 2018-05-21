<template>
    <button
        :class="className"
        :style="'background: #41AE8E; border-radius: 10px;' + stylus"
        :open-type="openType"
        @getuserinfo="(e) => disabled ? null : $emit('getUserInfo', e)"
        @click="disabled ? null : $emit('click')"
    >
        {{text || '确定'}}
    </button>
</template>

<script>
    export default {
        props: {
            stylus: String,
            text: String,
            openType: String,
            type: { type: String, default: 'primary' },
            size: { type: String, default: 'large' },
            disabled: { type: Boolean, default: false },
            isPlain: { type: Boolean, default: false },
            isLoading: { type: Boolean, default: false },
        },
        computed: {
            className() {
                const prefix = 'zan-btn--';
                const className = ['button-container', 'zan-btn', prefix + this.type, prefix + this.size].concat(
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
    .zan-btn {
        color: #FFFFFF;
        border-radius: 10px;
    }
</style>

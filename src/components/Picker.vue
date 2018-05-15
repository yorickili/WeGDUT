<template>
    <div class="picker-container" v-show="visible">
        <div class="handler">
            <div class="cancel" @click="hidden">取消</div>
            <div class="confirm" @click="emitValue">确定</div>
        </div>
        <picker-view
            class="picker"
            indicator-class="indicator"
            :value="value"
            @change="changeValue"
        >
            <picker-view-column>
                <div
                    class="item"
                    v-for="(item, index) in list"
                    :key="index"
                >
                    {{item}}
                </div>
            </picker-view-column>
        </picker-view>
    </div>
</template>
<script>
    export default {
        props: {
            list: Array,
        },
        data() {
            return {
                visible: false,
                value: [0],
            };
        },
        methods: {
            show() {
                this.visible = true;
            },
            hidden() {
                this.visible = false;
            },
            changeValue(e) {
                if (this.visible) this.value = e.target.value;
            },
            emitValue() {
                this.$emit('change', this.value);
                this.hidden();
            },
        },
    };
</script>

<style lang="less">

</style>

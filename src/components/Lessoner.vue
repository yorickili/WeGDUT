<template>
    <div class="lessoner-container zan-panel">
        <div class="zan-icon zan-icon-clear cancel" @click="close" />
        <div class="zan-cell zan-field">
            <div class="zan-cell__hd zan-field__title">课程</div>
            <input class="zan-field__input zan-cell__bd" type="text" v-model="name" placeholder="请输入课程名" />
            <div class="zan-cell__ft" />
        </div>
        <div class="zan-cell zan-field">
            <div class="zan-cell__hd zan-field__title">教室</div>
            <input class="zan-field__input zan-cell__bd" type="number" v-model="site" placeholder="请输入教室" />
            <div class="zan-cell__ft" />
        </div>
        <div class="zan-cell zan-field">
            <div class="zan-cell__hd zan-field__title">起始周</div>
            <slider show-value min="1" :max="maximum" :value="startWeek" @change="changeValue($event, 'startWeek')" />
            <div class="zan-cell__ft" />
        </div>
        <div class="zan-cell zan-field">
            <div class="zan-cell__hd zan-field__title">结束周</div>
            <slider show-value :min="startWeek" :max="maximum" :value="endWeek" @change="changeValue($event, 'endWeek')" />
            <div class="zan-cell__ft" />
        </div>
        <div class="zan-cell zan-field">
            <div class="zan-cell__hd zan-field__title">起始节</div>
            <slider show-value min="1" max="12" :value="startSection" @change="changeValue($event, 'startSection')" />
            <div class="zan-cell__ft" />
        </div>
        <div class="zan-cell zan-field">
            <div class="zan-cell__hd zan-field__title">结束节</div>
            <slider show-value :min="startSection" max="12" :value="endSection" @change="changeValue($event, 'endSection')" />
            <div class="zan-cell__ft" />
        </div>
        <Button @click="submit" />
    </div>
</template>

<script>
    import Button from '@/components/Button';

    export default {
        components: { Button },
        props: {
            name: { type: String, default: '' },
            site: { type: String, default: '' },
            startWeek: { type: Number, default: 1 },
            endWeek: { type: Number, default: 1 },
            startSection: { type: Number, default: 1 },
            endSection: { type: Number, default: 1 },
        },
        data() {
            return {
                maximum: 22,
            };
        },
        methods: {
            submit() {
                const judges = [
                    this.name.length >= 2,
                    this.site.length >= 2,
                    this.startWeek <= this.endWeek,
                    this.startSection <= this.endSection,
                ];
                let mark = true;
                judges.forEach((judge) => { if (!judge) mark = false; });
                if (mark) console.log(true);
            },
            changeValue(e, key) {
                this[key] = e.target.value;
                if (key.search('start') >= 0) this[key.replace('start', 'end')] = this[key];
            },
            close() {
                this.$emit('close');
            },
        },
    };
</script>

<style lang="scss">
    
</style>

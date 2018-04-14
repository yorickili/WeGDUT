<template>
    <div class="container morning-container">
        <div class="cover">
            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522954774238&di=7c1a44fc465b7ed6606ba8e28437bb47&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fb219ebc4b74543a9b0580de914178a82b9011457.jpg" />
            <div @click="setVisible('popup', true)">打卡</div>
        </div>
        <div class="rank">
            <div class="zan-cell" v-for="(item, index) in rank" :key="index">
                <div class="index">{{index + 1}}</div>
                <img class="icon" src="https://wx.qlogo.cn/mmopen/vi_32/T3L9co6vFq8hnljV9YJXaKfViaa2eOy70y7o4TRle5Dxw1wa6ib6en3KOD06VZQrKnGcwH8Jsficib5xIWFV50NlNA/0" />
                <div class="zan-cell__bd">
                    <div class="zan-cell__text">{{item.name}}</div>
                    <div class="zan-cell__desc">{{item.time}}</div>
                </div>
                <div class="zan-cell__ft">{{item.slogan}}</div>
            </div>
        </div>
        <div v-if="visible.popup" class="zan-popup zan-popup--show">
            <div class="zan-popup__mask" @click="setVisible('popup', false)"></div>
            <div class="zan-popup__container popup-container">
                <div class="zan-panel">
                    <div class="zan-cell zan-field">
                        <input class="zan-field__input zan-cell__bd" type="text" placeholder="说句话" />
                    </div>
                    <Button @click="sign">确定</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Button from '@/components/Button';

    export default {
        components: { Button },
        data() {
            return {
                visible: { popup: false },
                rank: [{ name: '李洋echo', time: '06:30', slogan: '早起一天精神好！' }, { name: '李洋echo', time: '06:30', slogan: '早起一天精神好！' }],
            };
        },
        methods: {
            setVisible(key, value) {
                this.visible[key] = value;
            },
            sign() {
                this.setVisible('popup', false);
            },
        },
    };
</script>

<style lang="scss">
    .morning-container {
        .cover {
            width: 100%;
            height: 400rpx;
            img {
                width: 100%;
                height: 100%;
            }
            div {
                width: 200rpx;
                height: 200rpx;
                color: #FFFFFF;
                background: #29BB73;
                border-radius: 100rpx;
                line-height: 200rpx;
                position: absolute;
                top: 100rpx;
                left: 275rpx;
                z-index: 2;
                align-items: center;
                justify-content: center;
                display: flex,
            }
        }
        .zan-cell {
            position: relative;
            top: 20px;
            height: 30px;
            background: #FFFFFF;
            .index {
                margin-right: 20px;
            }
            .icon {
                width: 45px;
                height: 45px;
                border-radius: 45px;
                overflow: hidden;
                margin-right: 20px;
            }
        }
        .popup-container {
            width: 90%;
            height: 50px;
            top: 30%;
            .zan-panel {
                margin: 10px 0;
                .zan-cell {
                    top: 10px;
                }
                .zan-btn {
                    margin-bottom: 10px;
                }
            }
        }
    }
</style>

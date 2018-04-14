<template>
    <div class="container library-container">
        <div class="weui-search-bar">
            <div class="weui-search-bar__form">
                <div class="weui-search-bar__box">
                    <icon class="weui-icon-search_in-box" type="search" size="14" />
                    <input type="text" class="weui-search-bar__input" placeholder="搜索" v-model="word" @confirm="search" />
                    <div class="weui-icon-clear" @click="word = ''"><icon type="clear" size="14" /></div>
                </div>
            </div>
        </div>
        <div class="zan-panel"  v-for="item in list" :key="item.index">
            <div class="zan-card">
                <div class="zan-card__thumb">
                    <div class="zan-icon zan-icon-goods-collect icon" />
                </div>
                <div class="zan-card__detail">
                    <div class="zan-card__detail-row name">
                        <div class="zan-card__left-col zan-ellipsis--l2">
                            {{item.name}}
                        </div>
                    </div>
                    <div class="zan-card__detail-row author">
                        <div class="zan-card__left-col">{{item.author}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                word: '',
                list: [{
                    name: '书名哈哈哈',
                    author: '作者是谁？',
                }, {
                    name: '书名哈哈哈',
                    author: '作者是谁？',
                }],
            };
        },
        methods: {
            search() {
                console.log('search ', this.word);
            },
        },
    };
</script>

<style lang="scss">
    .library-container {
        .zan-card {
            .icon {
                width: 180rpx;
                height: 180rpx;
                padding: 25rpx;
                font-size: 90rpx;
                color: #29BB73;
            }
            .zan-card__detail{
                height: 180rpx;
                display: flex;
                align-items: flex-start;
                justify-content: flex-end;
                flex-direction: column;
                .name {
                    flex: 2;
                }
                .author {
                    flex: 1;
                }
            }
        }
    }
</style>

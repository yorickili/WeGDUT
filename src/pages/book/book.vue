<template>
    <div class="container book-container">
        <Tab
            scroll="true"
            fixed="true"
            height="50"
            :list="tabs"
            :selectedId="current"
            @change="switchTab"
        />
        <swiper circular="true" :current="current" @change="switchTab">
            <swiper-item class="info-wrapper">
                <div class="img">
                    <img :src="img" mode="aspectFit" />
                </div>
                <div class="info">
                    <div class="title"> {{name}} </div>
                    <div>作　者：{{author}}</div>
                    <div>价　格：{{price}}元</div>
                    <div>出版社：{{press}}</div>
                    <div>I S B N：{{isbn}}</div>
                </div>
            </swiper-item>
            <swiper-item>
                <scroll-view class="intro scroller" scroll-y="true" >
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{intro}}
                </scroll-view>
            </swiper-item>
            <swiper-item>
                <scroll-view class="catalog scroller" scroll-y="true">
                    <div v-html="catalog"></div>
                </scroll-view>
            </swiper-item>
            <swiper-item>
                <div class="map scroller">
                    <div class="card" v-for="(item, index) in map" :key="index">
                        <div class="lib">{{item.lib}}</div>
                        <div class="info">
                            <div class="site">{{item.site}}</div>
                            <div class="status">{{item.status}}</div>
                        </div>
                    </div>
                </div>
            </swiper-item>
        </swiper>
    </div>
</template>

<script>
    import Tab from 'mpvue-zanui/src/components/zan/tab';
    import { jointer } from '@/lib';

    export default {
        components: { Tab },
        data() {
            return {
                tabs: [
                    {
                        id: 0, title: '书目',
                    }, {
                        id: 1, title: '简介',
                    }, {
                        id: 2, title: '目录',
                    }, {
                        id: 3, title: '馆藏',
                    },
                ],
                current: 0,
                name: '',
                author: '',
                img: '',
                price: '',
                press: '',
                isbn: '',
                intro: '',
                catalog: '',
                map: [],
            };
        },
        async beforeMount() {
            if (this.$root.$mp.query.book) {
                const $book = JSON.parse(this.$root.$mp.query.book);
                this.name = $book.name;
                this.author = $book.author;
                const book = Object.assign($book, await jointer.getBook({
                    CtrlRd: $book.rd,
                    CtrlNo: $book.no,
                }));
                Object.keys(book).forEach((key) => {
                    this[key] = book[key];
                });
            }
        },
        methods: {
            switchTab(e) {
                if (e.selectedId >= 0) this.current = e.selectedId;
                else if (e.mp) this.current = e.mp.detail.current;
            },
        },
    };
</script>

<style lang="less">

</style>

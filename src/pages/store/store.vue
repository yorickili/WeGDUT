<template>
    <div class="container store-container">
        <div class="panel">
            <div class="card" v-for="(item, index) in list" :key="index">
                <div class="info">
                    <div class="name">{{item.name}}</div>
                    <div class="date">
                        <span class="borrow">借入: {{item.borrowDate}}</span>
                        <span class="return">应还: {{item.returnDate}}</span>
                    </div>
                </div>
                <div class="status" :style="{ background: item.color }">
                    {{item.status}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                list: [
                    {
                        name: 'Java从入门到放弃大大所大所多大大所大大所多',
                        borrowDate: '2018-04-22',
                        returnDate: '2018-07-22',
                        status: '逾期',
                        color: '#F56262',
                    }, {
                        name: 'Java从入门到放弃大大所大所多大大所大大所多',
                        borrowDate: '2018-04-22',
                        returnDate: '2018-07-22',
                        status: '即期',
                        color: '#FFD92B',
                    }, {
                        name: 'Java从入门到放弃大大所大所多大大所大大所多',
                        borrowDate: '2018-04-22',
                        returnDate: '2018-07-22',
                        status: '正常',
                        color: '#28D9A5',
                    },
                ],
            };
        },
    };
</script>

<style lang="less">

</style>

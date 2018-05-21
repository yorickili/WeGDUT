<template>
    <div class="container explore-container">
        <div class="zan-panel" style="margin-top: 0;">
            <div class="zan-cell zan-cell--access" @click="jump('/pages/exam/exam')">
                <img class="icon" src="/static/icon/exam.png"/>
                <div class="zan-cell__bd">考试时间</div>
                <div class="zan-cell__ft"></div>
            </div>
            <div class="zan-cell zan-cell--access" @click="jump('/pages/grade/grade')">
                <img class="icon" src="/static/icon/grade.png" />
                <div class="zan-cell__bd">课程成绩</div>
                <div class="zan-cell__ft"></div>
            </div>
            <div class="zan-cell zan-cell--access" @click="jump('/pages/score/score')">
                <img class="icon" src="/static/icon/score.png" />
                <div class="zan-cell__bd">四六级成绩</div>
                <div class="zan-cell__ft"></div>
            </div>
        </div>
        <div class="zan-panel">
            <!-- <div class="zan-cell zan-cell--access" @click="jump('/pages/morning/morning')">
                <img class="icon" src="/static/icon/morning.png" />
                <div class="zan-cell__bd">早起打卡</div>
                <div class="zan-cell__ft"></div>
            </div> -->
            <div class="zan-cell zan-cell--access" @click="jump('/pages/library/library')">
                <img class="icon" src="/static/icon/library.png" />
                <div class="zan-cell__bd">图书馆藏</div>
                <div class="zan-cell__ft"></div>
            </div>
            <div class="zan-cell zan-cell--access" @click="jump('/pages/news/news')">
                <img class="icon" src="/static/icon/news.png" />
                <div class="zan-cell__bd">校内新闻</div>
                <div class="zan-cell__ft"></div>
            </div>
        </div>
        <div class="zan-panel">
            <div class="zan-cell zan-cell--access" @click="jump('/pages/login/login')">
                <img class="icon" src="/static/icon/login.png" />
                <div class="zan-cell__bd">登录</div>
                <div class="zan-cell__ft"></div>
            </div>
            <div class="zan-cell zan-cell--access" @click="jump('/pages/about/about')">
                <img class="icon" src="/static/icon/about.png" />
                <div class="zan-cell__bd">关于WeGDUT</div>
                <div class="zan-cell__ft"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            jump: url => wx.navigateTo({ url }),
        },
    };
</script>

<style lang="less">

</style>

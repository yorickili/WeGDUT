<template>
    <div class="comment-container">
        <img class="avatar" :src="avatar" />
        <div class="comment">
            <span>{{nickname}}</span>
            <div class="text">{{text}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            avatar: String,
            nickname: String,
            text: String,
        },
    };
</script>

<style>
    
</style>
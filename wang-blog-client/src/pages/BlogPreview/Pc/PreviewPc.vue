<template>
    <div class="box">
        <div class="box-left">
            <el-input v-model="currVal" placeholder="请输入标题搜索" allow-clear @input="handleInput" @clear="handleClear" />
            <div class="blog-list">
                <div :class="getClassName(blog)" class="blog-item" v-for="blog in blogList" :key="blog.id"
                    @click="handleBlogDetail(blog)">
                    <div class="item-text" :title="getCombinedTitle(blog)">
                        {{ getCombinedTitle(blog) }}
                    </div>


                </div>
            </div>

        </div>
        <div class="box-right">
            <router-view :index="index"></router-view>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue';
import { FormRules } from '@/utils/ComponentUtils'
import { Api } from '@/api/login';
import { ElMessage } from 'el-cool';
import { useRouter, useRoute } from 'vue-router'
import { ArticleManageApi } from '@/api/ArticleManageApi'
import { Utils } from '@/utils/Utils'


const router = useRouter()
const route = useRoute()

interface Blog {
    id: string, title: string, createTime: string
}
const blogList = ref<Array<Blog>>()
onMounted(() => {

    getList()
})

// 获取当前左侧侧边栏 每一项的class 用于设置选中背景色
const getClassName = computed(() => {
    return (blog: Blog) => {
        return blog.id === route.params.id ? 'blog-selected' : ''
    }
})
const getCombinedTitle = computed(() => {
    return (blog: Blog) => {
        return `${blog.title} - ${Utils.formatDate(blog.createTime)}`
    }
})


let originBlogList: Array<any> = []
const index = ref<number>(1)
const getList = () => {
    ArticleManageApi.queryBlogListExceptContent().then(res => {
        blogList.value = res
        blogList.value = blogList.value.sort((a, b) => {
            if (!a.createTime || !b.createTime) {
                return 1
            }
            return parseInt(b.createTime) - parseInt(a.createTime)
        })
        originBlogList = res
        
    }).catch(err => {
        ElMessage.error(err?.message || '查询博客列表失败!')
    })
}

const currVal = ref('')
const handleInput = (val: string) => {
    if (val === '') {
        blogList.value = originBlogList
    } else {
        blogList.value = originBlogList.filter((blog: Blog) => {
            return blog.title.toLowerCase().indexOf(val.toLowerCase()) > -1
        })
    }
}
const handleClear = () => {
    blogList.value = originBlogList
}
const handleBlogDetail = (blog: { id: string, title: string, createTime: string }) => {

    router.push(`/PreviewPc/PreviewBlog/${blog.id}`)
    index.value += 1
}
</script>

<style lang="scss" scoped>
@import "@/styles/var.scss";

.box {
    width: 100%;
    display: flex;
    height: 100vh;
    overflow-y: auto;

    .box-right {
        flex-grow: 1;
    }

    .box-left {

        width: 250px;
        position: relative;
        padding: 20px 0 20px 0;
        background-color: $--gray-2;

        .el-input {
            margin: 0 8px;
            width: calc(100% - 20px);
        }

        .blog-list {
            height: calc(100vh - 55px);
            overflow-x: hidden;
            overflow-y: auto;
            width: 250px;

            .blog-item {

                margin-top: 8px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding: 8px 0;
                cursor: pointer;

                .item-text {
                    margin: 0 8px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 14px;
                }
            }

            .blog-selected {
                background-color: $--gray-4;

            }
        }

    }
}
</style>
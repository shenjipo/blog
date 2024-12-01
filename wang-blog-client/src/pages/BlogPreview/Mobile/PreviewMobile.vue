<template>
    <div class="mobile">
        <el-select class="blog-select" popper-class="blog-select-option" style="margin: 16px 16px 0 16px;"
            v-model="currVal" @change="handleChange">
            <el-option v-for="blog in blogList" :key="blog.id" :value="blog.id" :label="getCombinedTitle(blog)">
            </el-option>
        </el-select>

        <div class="box-right">
            <router-view :index="index"></router-view>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

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
    currVal.value = route.params.id as string
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

    }).catch(err => {
        ElMessage.error(err?.message || '查询博客列表失败!')
    })
}

const currVal = ref('')

const handleChange = (blogId: string) => {
    const blog = blogList.value.find(blog => blog.id === blogId)
    if (!blog) {
        return ElMessage.error('blog 不存在！')
    }
    router.push(`/PreviewMobile/PreviewBlog/${blog.id}`)
    index.value += 1
}
</script>
<style lang="scss">
.blog-select-option {
    width: 80%;
}
</style>

<style lang="scss" scoped>
@import "@/styles/var.scss";

.mobile {
    background-color: $--blue-2;

    .blog-select {
        width: 80%;
    }
}
</style>
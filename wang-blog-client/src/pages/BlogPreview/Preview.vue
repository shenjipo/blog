<template>
    <div class="preview">
        <el-link type="primary">加载中......</el-link>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import CommonUtils from '@/utils/CommonUtils';
import { ArticleManageApi } from '@/api/ArticleManageApi';
import { ElMessage } from 'el-cool';

const router = useRouter()
const route = useRoute()
interface Blog {
    id: string, title: string, createTime: string
}

onMounted(() => {
    getList()
})

const blogList = ref<Array<Blog>>()
const getList = () => {
    ArticleManageApi.queryBlogListExceptContent().then(res => {
        blogList.value = res
        blogList.value = blogList.value.sort((a, b) => {
            if (!a.createTime || !b.createTime) {
                return 1
            }
            return parseInt(b.createTime) - parseInt(a.createTime)
        })
      
        if (CommonUtils.IsMobile()) {
            router.push(`/PreviewMobile/PreviewBlog/${blogList.value[0].id}`)
        } else {
            router.push(`/PreviewPc/PreviewBlog/${blogList.value[0].id}`)
        }

    }).catch(err => {
        ElMessage.error(err?.message || '查询博客列表失败!')
    })
}

</script>

<style lang="scss" scoped>
@import "@/styles/var.scss";

.preview {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>
<template>
    <div class="box-button">
        <div class="button-left">
            <el-input v-model="searchText" placeholder="请输入标题搜索" @input="handleSearch">

            </el-input>
        </div>
        <div class="button-right">
            <el-button @click="handleCreateBlog()" type="primary" style="margin-right: 10px;">添加文章</el-button>
        </div>

    </div>
    <div class="box-list">
        <el-table :data="page.data" :height="'calc(100vh - 200px)'">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="标题" property="title" show-overflow-tooltip>

            </el-table-column>
            <el-table-column label="创建时间" width="180">
                <template #default="{ row }">
                    <el-tag color="arcoblue">{{ Utils.formatDate(row.createTime) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="更新时间" width="180">
                <template #default="{ row }">
                    <el-tag color="arcoblue">{{ Utils.formatDate(row.updateTime) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="作者" property="author" width="80"></el-table-column>

            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button @click="handleEditBlog(row)" type="primary">编辑</el-button>
                    <el-popconfirm title="确定要删除吗？" position="top" @confirm="handleDeleteBlog(row)">
                        <template #reference>
                            <el-button type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                    <el-button type="info" @click="handlePreviewBlog(row)"
                        v-if="row.isPreviewShow === '1'">查看详情</el-button>
                    <el-switch style="margin-left: 5px;" v-model="row.isPreviewShow" active-value="1" inactive-value="2"
                        @change="handleShowChange(row)" active-text="显示" inactive-text="关闭">
                    </el-switch>

                </template>
            </el-table-column>

            <el-table-column label="id" property="id" width="250" show-overflow-tooltip>

            </el-table-column>
        </el-table>
    </div>
    <div class="box-bottom">
        <el-pagination background layout="sizes,prev, pager, next,total," :page-sizes="[10, 20, 30, 50]"
            :total="page.total" @change="handlePageChange" @page-size-change="handlePageSizeChange"
            v-model:page-size="page.size" v-model:current-page="page.current" :size="page.size" />
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ArticleManageApi } from '../../api/ArticleManageApi'
import { useRouter } from 'vue-router'
import { Blog } from '@/model/Blog'
import { ElMessage } from 'element-plus'
import { Utils } from '../../utils/Utils'
import { Page } from '@/model/Common'
import { useStore } from '@/store/index'


const router = useRouter()
const store = useStore()
onMounted(() => {
    getBlogList()
})

const searchText = ref('')
const page = ref<Page>(new Page())

const getBlogList = () => {

    ArticleManageApi.queryBlogList({
        current: page.value.current,
        size: page.value.size,
        query: searchText.value
    }).then(res => {
        if (Array.isArray(res.data)) {
            page.value.total = res.total
            page.value.data = res.data
        } else {
            page.value.current = 1
            page.value.total = 0
            page.value.data = []
        }
    }).catch(err => {

        ElMessage.error(err?.message || '查询失败！')
    })
}
// 新建博客
const handleCreateBlog = (id?: any) => {
    router.push('/MainPage/BlogUpdate/0')
}
// 编辑博客
const handleEditBlog = (params: Blog) => {
    router.push(`/MainPage/BlogUpdate/${params.id}`)
}
// 预览博客
const handlePreviewBlog = (blog: Blog) => {
    window.open(`http://${location.host}/Blog/#/Preview/PreviewBlog/${blog.id}`)
}
// 删除博客
const handleDeleteBlog = (params: Blog) => {
    ArticleManageApi.deleteBlogById(params.id).then(res => {
        ElMessage.success('删除成功!!!')
        getBlogList()
    }).catch(err => {
        ElMessage.error(err.message || '删除失败!!!')
    })
}
// 设置博客是否对外显示
const handleShowChange = (params: Blog) => {
    ArticleManageApi.updateBlogShowById({
        id: params.id,
        isPreviewShow: params.isPreviewShow
    }).then(res => {
        ElMessage.success('更新成功!')
    }).catch(err => {
        ElMessage.error(err.message || '更新失败!')
    })
}
const handleSearch = () => {
    getBlogList()
}
const handlePageChange = (current: number) => {
    page.value.current = current
    getBlogList()

}
const handlePageSizeChange = (pageSize: number) => {
    page.value.current = 1
    page.value.size = pageSize
    getBlogList()
}
</script>

<style lang="scss" scoped>
.box-button {
    width: 100%;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;

    .button-left {
        display: flex;
        margin-left: 16px;
        width: 300px;
    }

    .button-right {
        display: flex;
    }
}

.box-list {
    padding: 0 16px;
    margin-top: 16px;


}

.box-bottom {
    position: absolute;
    bottom: 20px;
    right: 20px;
}
</style>
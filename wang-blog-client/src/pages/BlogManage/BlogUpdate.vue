<template>
    <div class="box">
        <div class="box-tool">
            <div class="box-left">
                <el-input class="box-title" placeholder="请输入标题" style="width: 500px;" v-model="blog.title" />
                <el-switch style="margin-left: 16px;" v-model="blog.isPreviewShow" active-value="1" inactive-value="2"
                    active-text="显示" inactive-text="关闭">
                </el-switch>
                <el-tag v-if="blog.id === '0'" type="success" size="large" style="margin-left: 16px;">新建博客</el-tag>
                <el-tag v-else size="large" style="margin-left: 16px;">更新博客</el-tag>
            </div>


            <div class="box-right">
                <el-button type="primary" style="margin-right: 16px;" @click="handleSave">修改保存</el-button>
                <el-button type="info" style="margin-right: 16px;" @click="handleExportMd">导出为md</el-button>
                <el-button type="info" style="margin-right: 16px;" @click="handleExportImage">导出为图片</el-button>
                <el-popconfirm position="bottom" title="确定退出吗? 内容可能未保存！" @confirm="handleReturn">
                    <template #reference>
                        <el-button>返回</el-button>
                    </template>
                </el-popconfirm>

            </div>
        </div>
        <div class="vditor-wrapper">
            <div id="vditor">

            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ArticleManageApi } from '../../api/ArticleManageApi'
import { ref, onMounted, onUnmounted } from 'vue'
import { Blog } from '@/model/Blog'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from "vue-router"
import { Utils } from '../../utils/Utils'
import Vditor from 'vditor'

const route = useRoute(); // 第一步
const router = useRouter()
let vditor: Nullable<Vditor>;

const mdRef = ref<any>(null)
const blog = ref<Blog>({
    content: '',
    title: '',
    author: '',
    id: '',
    updateTime: '',
    isPreviewShow: '1',
})
const title = ref('')


onMounted(() => {

    blog.value.id = route.params.id as string
    if (blog.value.id !== '0') {
        ArticleManageApi.queryBlogById(blog.value.id).then(res => {
            blog.value = res
            blog.value.content = blog.value.content.replaceAll('8.130.116.190', '101.133.143.249')
            initVditor(RenderMode.ir, blog.value.content)
        }).catch(err => {
            ElMessage.error(err.message || '查询失败！')
        })
    } else {
        initVditor(RenderMode.ir, blog.value.content)
    }
    document.addEventListener('keydown', keyDownEvent)
})

onUnmounted(() => {
    document.removeEventListener('keydown', keyDownEvent)
})

const keyDownEvent = (event: KeyboardEvent) => {
    if (!vditor) {
        return
    }
    if (event.ctrlKey && event.key === '/') {
        const value = vditor.getValue()
        if (vditor.getCurrentMode() === 'ir') {
            vditor.destroy()
            initVditor(RenderMode.sv, value)
        } else {
            vditor.destroy()
            initVditor(RenderMode.ir, value)
        }


    }
}

enum RenderMode {
    ir = 'ir',
    sv = 'sv',
    wysiwyg = 'wysiwyg'
}

const initVditor = (mode: RenderMode, value: string) => {
    vditor = new Vditor('vditor', {
        // 如果不设置，无法实现点击大纲跳转
        height: 500,
        width: '100%',
        lang: 'zh_CN',
        mode: mode,
        toolbar: [
            'table',
            'code',
            'link',
            'upload'
        ],
        preview: {
            mode: "editor"
        },
        toolbarConfig: {
            pin: false,
        },
        cache: {
            enable: false,
        },
        after: () => {
            vditor.setValue(value)
        },
        upload: {
            accept: "image/*",
            url: import.meta.env.VITE_APP_BASE_API + '/uploadImg',
            success: (editor, msg) => {
                const url = JSON.parse(msg)
                if (!url && !url.data && !url.data.url) {
                    return ElMessage.warning('图片上传失败!')
                }
                vditor.insertValue(`![${url.data.url}](${import.meta.env.VITE_APP_BASE_API}/getImage/${url.data.url})`)
            }
        },
        input(value) {
            blog.value.content = value

        },
        outline: {
            enable: true,
            position: 'right'
        }
    })
}

const handleSave = () => {
    if (blog.value.id === '0') {
        handleAdd()
    } else {
        handleUpdate()
    }
}

// 新建博客
const handleAdd = () => {
    if (!blog.value.title) {
        ElMessage.error('标题不能为空!')
        return
    }
    if (!blog.value.content) {
        ElMessage.error('内容不能为空!')
        return
    }
    const params = {
        content: blog.value.content,
        title: blog.value.title,
        author: 'wangxing',
        createTime: new Date().getTime().toString(),
        isPreviewShow: blog.value.isPreviewShow
    }
    ArticleManageApi.saveBlog(params).then(res => {
        ElMessage.success('保存文章成功')
        blog.value.id = res.id
        router.push(`/MainPage/BlogUpdate/${res.id}`)
    }).catch(err => {
        ElMessage.error(err?.message || '保存失败！')
    })
}

// 修改博客
const handleUpdate = () => {
    if (!blog.value.title) {
        ElMessage.error('标题不能为空!')
        return
    }
    if (!blog.value.content) {
        ElMessage.error('内容不能为空!')
        return
    }
    const params = {
        id: blog.value.id,
        title: blog.value.title,
        content: blog.value.content,
        isPreviewShow: blog.value.isPreviewShow
    }

    ArticleManageApi.updateBlogById(params).then(res => {
        ElMessage.success('更新成功!')
    }).catch(err => {
        ElMessage.error(err?.message || '更新失败!')
    })
}

const handleReturn = () => {
    router.push('/MainPage/BlogManage')
}
const handleExportImage = () => {
    const targetDom = document.querySelector('.vditor-ir .vditor-reset')
    Utils.exportImage(targetDom, blog.value.title)
}
const handleExportMd = () => {
    Utils.exportMd(blog.value.content, blog.value.title)
}
</script>

<style lang="scss" scoped>
.box {
    display: flex;
    flex-direction: column;
    align-items: center;

    .box-tool {
        width: calc(100vw - 360px);
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 16px;


        .box-right {
            display: flex;
        }
    }

    .vditor-wrapper {
        max-height: calc(100vh - 160px);
        overflow: auto;
        width: calc(100vw - 360px);
        overflow-x: hidden;
        margin-top: 16px;

        #vditor {
            height: calc(100vh - 160px) !important;

            :deep(.vditor-reset) {
                padding: 0 100px !important;
            }
        }
    }

}
</style>
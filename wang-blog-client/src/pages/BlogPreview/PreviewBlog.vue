<template>
    <div class="preview-blog">
        <div class="box-head">
            <div class="head-left">
                <span class="title">
                    {{ blog.title }}
                </span>


            </div>
            <div class="head-right">
                <el-button type="secondary" @click="handleExportMd">导出为md</el-button>
                <el-button type="secondary" @click="handleExportImage">导出为图片</el-button>
            </div>



        </div>

        <div id="vditor">

        </div>

    </div>
</template>

<script setup lang="ts">
import { ArticleManageApi } from '@/api/ArticleManageApi'
import { Blog } from '@/model/Blog';
import { onMounted, ref, watch } from 'vue';
import { Utils } from '@/utils/Utils'
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router'
import Vditor from 'vditor'
import { RenderMode } from '@/model/Vditor';

const isShowNav = ref<boolean>(true)
const route = useRoute()
const blog = ref<Blog>({
    content: '',
    title: '',
    author: '',
    id: '',
    updateTime: '',
    isPreviewShow: '1'
})

onMounted(() => {
    getBlogDetail()
})

const getBlogDetail = () => {
    blog.value.id = route.params.id as string
    ArticleManageApi.queryBlogByIdNoToken(blog.value.id).then(res => {
        blog.value = res
        // 101.133.143.249
        blog.value.content = blog.value.content.replaceAll('8.130.116.190', 'localhost')
        initVditor(RenderMode.ir, blog.value.content)
    }).catch(err => {
        ElMessage.error(err.message || '查询失败！')
    })
}

let vditor: Nullable<Vditor>;
const initVditor = (mode: RenderMode, value: string) => {
    vditor = new Vditor('vditor', {
        // 如果不设置，无法实现点击大纲跳转
        height: 700,
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
            hide: true,
        },
        cache: {
            enable: false,
        },
        after: () => {
            vditor.setValue(value)
            vditor.disabled()
        },
        outline: {
            enable: true,
            position: 'right'
        }
    })
}

watch(() => route.params.id, (nVal, oVal) => {
    getBlogDetail()
})

const handleNavToggle = (isShow: boolean, value: string) => {
    isShowNav.value = isShow
}
const handleExportImage = () => {
    const targetDom: any = document.getElementsByClassName('v-show-content')[0]
    Utils.exportImage(targetDom, blog.value.title)
}
const handleExportMd = () => {
    Utils.exportMd(blog.value.content, blog.value.title)
}
</script>

<style lang="scss" scoped>
@import "@/styles/var.scss";

.preview-blog {

    margin-top: 8px;
    overflow-y: auto;

    .box-head {
        display: flex;
        justify-content: space-between;
        align-items: center;


        .head-left {
            .title {
                font-size: 20px;
                margin-left: 16px;
                font-weight: 600;
            }
        }

        .head-right {
            display: flex;
            justify-content: flex-end;
            padding: 0 16px 0 0;
        }



    }

    #vditor {
        margin-top: 8px;
        height: calc(100vh - 32px - 16px) !important;

        :deep(.vditor-toolbar) {
            display: none;
        }

        :deep(.vditor-ir) {
            pre.vditor-reset {
                cursor: unset !important;
                opacity: 1 !important;
            }
        }


        :deep(.vditor-reset) {
            padding: 0 100px !important;
        }
    }

}
</style>
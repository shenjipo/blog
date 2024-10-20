import { http } from "./axios"
import { useStore } from '@/store/index'
import { Page } from "@/model/Common"
import { Blog } from "@/model/Blog"
const store = useStore()


interface UploadImg {
    url: string
}


export class ArticleManageApi {
    // 查询所有文章
    static queryBlogList(val: { current: number, size: number, query?: string }) {

        return http.post('/queryBlogList', {
            uuid: store.userStore.user.uuid,
            ...val
        }).then((res: Page<Blog>) => {

            return res
        }).catch((err: any) => {
            return Promise.reject(err)
        })
    }

    // 查询所有文章，不包含内容
    static queryBlogListExceptContent(): Promise<Array<{ id: string, title: string, createTime: string }>> {
        return http.post('/queryBlogListExceptContent').then(res => {
            return res
        }).catch((err: any) => {
            return Promise.reject(err)
        })
    }

    // 根据id查询文章  需要token
    static queryBlogById(id: string): Promise<Blog> {
        return http.post('/queryBlogById', { id }).then(res => {
            return res
        }).catch((err: any) => {
            return Promise.reject(err)
        })
    }

    // 根据id查询文章 不需要token
    static queryBlogByIdNoToken(id: string): Promise<Blog> {
        return http.post('/queryBlogByIdNoToken', { id }).then(res => {
            return res
        }).catch((err: any) => {
            return Promise.reject(err)
        })
    }

    // 根据id删除文章
    static deleteBlogById(id: string): Promise<any> {
        return http.post('/deleteBlogById', { id }).then(res => {
            return res
        }).catch((err: any) => {
            return Promise.reject(err)
        })
    }


    // 根据id更新文章
    static updateBlogById(params: { id: string, title: string, content: string, updateTime?: string, isPreviewShow: string }): Promise<any> {
        params.updateTime = new Date().getTime().toString()
        return http.post('/updateBlogById', params).then(res => {
            return res
        }).catch((err: any) => {
            return Promise.reject(err)
        })
    }
    // 上传图片接口
    static uploadImg(file: { miniurl: string, name: string, lastModified: number, lastModifiedDate: any, size: number, type: string }): Promise<UploadImg> {
        var formData = new FormData();     //新建一个表单数据,用于提交文件
        formData.append("img", file as any);     //添加文件,参数分别是表单参数的名字和值.
        return http.post('/uploadImg', formData, {
            headers: {
                "Content-Type": "multipart/form-data"    //设置请求头,更换内容类型为表单数据
            }
        }).then(res => {
            return res
        }).catch((err: any) => {
            return Promise.reject(err)
        })
    }
    // 新建博客
    static saveBlog(params: { content: string, title: string, author: string, createTime: string, isPreviewShow: string, uuid?: string }): Promise<{ id: string }> {
        params.uuid = store.userStore.user.uuid
        return http.post('/saveBlog', params).then(res => {
            return res
        }).catch((err: any) => {
            return Promise.reject(err)
        })
    }

    //根据id更新博客是否对外显示
    static updateBlogShowById(params: { isPreviewShow: string, id: string, updateTime?: string }): Promise<any> {
        params.updateTime = new Date().getTime().toString()
        return http.post('/updateBlogShowById', params).then(res => {
            return res
        }).catch((err: any) => {
            return Promise.reject(err)
        })
    }
}
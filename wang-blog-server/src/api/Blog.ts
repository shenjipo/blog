import { Request, Response } from 'express';
import { Mysql } from '../db/MySqlUtils';
import { Express } from "express"
import { PrefixPath } from '../constant/Constant';
import { v4 as uuidv4 } from 'uuid';

import type { Blog } from 'wang-blog-client/src/model/Blog'

// 新建博客 /saveBlog
const SaveBlog = async (req: Request, res: Response) => {
    const { title, content, author, createTime, isPreviewShow, uuid } = req.body;
    const id = uuidv4()
    const insert_sql = "INSERT INTO `article`(`id`,`title`,`content`,`author`, `createTime`, `updateTime`, `isPreviewShow`, `author_uuid`) VALUES (?,?,?,?,?,?,?,?)"
    const params = [id, title, content, author, createTime, createTime, isPreviewShow, uuid]

    const { err, rows } = await Mysql(insert_sql, params)

    if (err == null) {
        res.send({
            code: 200,
            data: {
                id: id
            },
            msg: "添加成功"
        })
    } else {
        res.send({
            code: 500,
            msg: "添加失败",
            data: {}
        })
    }

}


// 查询博客列表
const QueryBlogList = async (req: Request, res: Response) => {
    let { uuid, current, size, query }: { uuid: string, current: number, size: number, query?: string } = req.body;
    const sql = "select `id`, `title`, `createTime`, `isPreviewShow`, `updateTime` from `article` where `author_uuid` = ? AND `title` like CONCAT(\'%\', ?, \'%\')"

    const { err, rows }: { err: any, rows: Array<Blog> } = await Mysql(sql, [uuid, query ? query : ''])

    const sortedBlog = rows.sort((a, b) => {
        if (!a.updateTime) return 1;
        if (!b.updateTime) return -1;
        // 如果都存在 updateTime，按时间倒序排序
        return parseInt(b.updateTime) - parseInt(a.updateTime)
    })

    if (err == null) {
        res.send({
            code: 200,
            msg: "查询成功",
            data: {
                data: sortedBlog.slice((current - 1) * size, (current - 1) * size + size),
                total: sortedBlog.length
            }
        })
    } else {
        res.send({
            code: 500,
            msg: "查询失败"
        })
    }
}


// 查询所有博客,但是不包含content数据 /queryBlogListExceptContent
const QueryBlogListExceptContent = async (req: Request, res: Response) => {
    let { err, rows } = await Mysql("select `id`, `title`, `createTime`, `isPreviewShow` from `article` where `isPreviewShow` =?", ['1'])

    if (err == null && rows.length > 0) {
        res.send({
            code: 200,
            msg: "查询成功",
            data: rows
        })
    } else {
        res.send({
            code: 500,
            msg: "查询失败"
        })
    }

}

// 根据id查询博客 需要token /queryBlogById
const QueryBlogById = async (req: Request, res: Response) => {
    const { id } = req.body;
    let { err, rows } = await Mysql("select * from `article` where `id` = ?", [id])

    if (err == null && rows.length > 0) {
        res.send({
            code: 200,
            msg: "查询成功",
            data: rows[0]
        })
    } else {
        res.send({
            code: 500,
            msg: "查询失败"
        })
    }

}


// 根据id查询博客  不需要token /queryBlogByIdNoToken
const QueryBlogByIdNoToken = async (req: Request, res: Response) => {
    const { id } = req.body;
    const { err, rows } = await Mysql("select * from `article` where `id` = ?", [id])
    if (err == null && rows.length > 0) {
        res.send({
            code: 200,
            msg: "查询成功",
            data: rows[0]
        })
    } else {
        res.send({
            code: 500,
            msg: "查询失败"
        })
    }

}


// 根据id删除博客 /DeleteBlogById
const DeleteBlogById = async (req: Request, res: Response) => {
    const { id } = req.body;
    let { err, rows } = await Mysql("delete from `article` where `id` = ?", [id])
    if (err === null) {
        res.send({
            code: 200,
            msg: "删除成功",
            data: null
        })
    } else {
        res.send({
            code: 500,
            msg: "删除失败"
        })
    }

}

// 根据id更新博客
const UpdateBlogById = async (req: Request, res: Response) => {
    const { title, content, id, updateTime, isPreviewShow } = req.body;


    const { err, rows } = await Mysql("update `article` set `title` = ?, `content` = ?, `updateTime` = ?, `isPreviewShow` = ?  where `id` = ?",
        [title, content, updateTime, isPreviewShow, id])
    if (err === null) {
        res.send({
            code: 200,
            msg: "更新成功",
            data: null
        })
    } else {
        res.send({
            code: 500,
            msg: "更新失败"
        })
    }

}

// 根据id更新博客是否对外显示
const UpdateBlogShowById = async (req: Request, res: Response) => {
    const { id, updateTime, isPreviewShow } = req.body;
    const { err, rows } = await Mysql("update `article` set `updateTime` = ?, `isPreviewShow` = ?  where `id` = ?",
        [updateTime, isPreviewShow, id])

    if (err === null) {
        res.send({
            code: 200,
            msg: "更新成功",
            data: null
        })
    } else {
        res.send({
            code: 500,
            msg: "更新失败"
        })
    }

}

const InitBlogApi = (app: Express) => {
    app.use(PrefixPath + '/queryBlogList', QueryBlogList)
    app.use(PrefixPath + '/saveBlog', SaveBlog)
    app.use(PrefixPath + '/queryBlogListExceptContent', QueryBlogListExceptContent)
    app.use(PrefixPath + '/queryBlogById', QueryBlogById)
    app.use(PrefixPath + '/queryBlogByIdNoToken', QueryBlogByIdNoToken)
    app.use(PrefixPath + '/deleteBlogById', DeleteBlogById)
    app.use(PrefixPath + '/updateBlogById', UpdateBlogById)
    app.use(PrefixPath + '/updateBlogShowById', UpdateBlogShowById)
}
export default InitBlogApi

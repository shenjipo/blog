import { http } from "./axios"
import { Response } from './login'
import { Account } from "@/model/Account"
/* 登录接口参数类型 */

interface AddAccount {
    username: string,
    password: string,
    createTime?: string
}

export class AccountManageApi {
    // 查询所有账号
    static queryAccountList(): Promise<Array<Account>> {
        return http.post('/queryAccount').then(res => {
            if (Array.isArray(res) && res.length) {
                res.forEach((item) => {
                    item.username = item.account
                    delete item.account
                })
            }
            return res
        }).catch((err: any) => {
            return Promise.reject(err)
        })
    }

    // 新建账号
    static addAccount(params: AddAccount): Promise<{ id: number }> {
        params.createTime = new Date().getTime().toString()

        return http.post('/addAccount', params).then(res => {

            return res
        }).catch((err: any) => {
            return Promise.reject(err)
        })
    }

    // 删除账号
    static deleteAccount(params: { uuid: string }): Promise<null> {
        return http.post('/deleteAccount', params).then(res => {
            return res
        }).catch((err: any) => {
            return Promise.reject(err)
        })
    }

    // 修改账号
    static editAccount(params: { uuid: string, password: string, updateTime?: string }): Promise<null> {
        params.updateTime = new Date().getTime().toString()

        return http.post('/editAccount', params).then(res => {
            return res
        }).catch((err: any) => {
            return Promise.reject(err)
        })
    }
}
export class Page<T = any> {
    current: number = 1
    size: number = 20
    total: number = 0
    data: Array<T> = []
}

export interface Response<T> {
    code: number
    msg: string,
    data: T
} 
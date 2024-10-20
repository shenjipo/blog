import { Request, Response, Express } from 'express';
import { PrefixPath } from '../constant/Constant';
import fs from 'fs'


const UploadImg = async (req: Request, res: Response) => {

    if (!req.file) {
        res.send({
            "code": 9999, // 只要不等于 0 就行
            "message": "没有图片"
        })
        return;
    }


    const file = req.file;
    const fileType = file.originalname.substring(file.originalname.lastIndexOf(".") + 1)
    //随机文件名字
    const fileName = file.originalname.split('.')[0] + '_' + file.filename + '.' + fileType

    //修改名字加移动文件
    fs.renameSync(
        process.cwd() + "/assets/upload/temp/" + file.filename,
        process.cwd() + "/assets/upload/img/" + fileName
    )


    res.send({
        "code": 200, // 注意：值是数字，不能是字符串
        "data": {
            "url": fileName, // 图片 src ，必须
        },
        "message": "上传图片成功"
    })

}



// /getImage/:key
const GetImage = async (req: Request, res: Response) => {

    res.sendFile(`/assets/upload/img/${req.params.key}`, {
        root: __dirname + '../../../',
        headers: {
            'Content-Type': 'image/jpge',
        }
    }, (error) => {
        error && console.log(error)
    })

}

const InitFileApi = (app: Express) => {
    app.use(PrefixPath + '/uploadImg', UploadImg)
    app.use(PrefixPath + '/getImage/:key', GetImage)

}
export default InitFileApi